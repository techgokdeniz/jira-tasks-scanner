import { environment } from 'config/environment';
import { jiraApiService } from 'services/api';
import { formatTask, displayTasks } from 'utils/taskFormatter';
import { TaskComparer, displayNewTasks } from 'utils/taskComparer';
import { StorageService } from 'services/storage';
import type { FormattedTask } from 'types/config';
import chalk from 'chalk';


const CHECK_INTERVAL = 5 * 60 * 1000;
const taskComparer = new TaskComparer();
const storageService = StorageService.getInstance();

async function fetchUnassignedTasks(): Promise<FormattedTask[]> {
  let startAt = 0;
  const allTasks: FormattedTask[] = [];
  let hasMore = true;

  while (hasMore) {
    const response = await jiraApiService.getBoardIssues(environment.boardId, {
      startAt,
      orderBy: "created",
      sortOrder: "desc",
    });

    const formattedTasks = response.issues.map(formatTask);
    allTasks.push(...formattedTasks);

    if (response.total > startAt + response.maxResults) {
      startAt += response.maxResults;
    } else {
      hasMore = false;
    }
  }

  return allTasks;
}

async function checkForNewTasks(): Promise<void> {
  try {
    const timestamp = new Date().toLocaleTimeString();
    console.log(
      chalk.blue(`\n[${timestamp}] Checking for new unassigned tasks...`)
    );

    const currentTasks = await fetchUnassignedTasks();

    if (currentTasks.length === 0) {
      console.log(
        chalk.yellow("\nNo unassigned tasks found in the specified statuses.")
      );
      return;
    }

    const newTasks = await taskComparer.findNewTasks(currentTasks);
    displayNewTasks(newTasks);
  } catch (error) {
    console.error(
      chalk.red(
        "Error:",
        error instanceof Error ? error.message : "An unknown error occurred"
      )
    );
  }
}

async function startPeriodicChecks(): Promise<void> {
  try {
    await storageService.initialize();
    const lastCheck = await storageService.getLastCheckTime();

    console.log(chalk.blue("Starting Jira task monitor..."));
    console.log(chalk.gray(`Last check: ${lastCheck.toLocaleString()}`));
    console.log(chalk.gray(`Will check for new tasks every 5 minutes.\n`));

    await checkForNewTasks();

    setInterval(checkForNewTasks, CHECK_INTERVAL);
  } catch (error) {
    console.error(
      chalk.red(
        "Failed to start task monitor:",
        error instanceof Error ? error.message : "Unknown error"
      )
    );
    process.exit(1);
  }
}

startPeriodicChecks();

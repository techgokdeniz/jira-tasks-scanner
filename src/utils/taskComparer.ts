import type { FormattedTask } from 'types/config';
import chalk from 'chalk';
import { StorageService } from 'services/storage';

export class TaskComparer {
  private storageService: StorageService;

  constructor() {
    this.storageService = StorageService.getInstance();
  }

  async findNewTasks(currentTasks: FormattedTask[]): Promise<FormattedTask[]> {
    const previousTasks = await this.storageService.getStoredTasks();

    const newTasks = currentTasks.filter(
      (current) => !previousTasks.some((prev) => prev.key === current.key)
    );

    await this.storageService.updateTasks(currentTasks);
    return newTasks;
  }
}

export function displayNewTasks(tasks: FormattedTask[]): void {
  if (tasks.length === 0) {
    console.log(chalk.yellow("\nNo new tasks found in this check."));
    return;
  }

  const tableData = tasks.map((task) => {
    const summary =
      task.summary.length > 50
        ? `${task.summary.substring(0, 47)}...`
        : task.summary;

    return {
      Key: task.key,
      Summary: summary,
      Status: task.status,
      Priority: task.priority,
    };
  });

  console.log(chalk.green(`\nFound ${tasks.length} new tasks:`));
  console.table(tableData);
}

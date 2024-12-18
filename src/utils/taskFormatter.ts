import type { JiraIssue } from "types/jira";
import type { FormattedTask } from "types/config";
import { environment } from "../config/environment";
import chalk from "chalk";

export function formatTask(issue: JiraIssue): FormattedTask {
  return {
    key: issue.key,
    summary: issue.fields.summary,
    status: issue.fields.status.name,
    priority: issue.fields.priority?.name ?? "No Priority",
    assignee: issue.fields.assignee?.displayName ?? "Unassigned",
    type: issue.fields.issuetype.name,
    url: `https://${environment.domain}/browse/${issue.key}`
  };
}

export function displayTasks(tasks: FormattedTask[]): void {
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

  console.log("\n" + chalk.bold("Unassigned Tasks:"));
  console.table(tableData);
  console.log(chalk.gray(`Total: ${tasks.length} tasks\n`));
}

export interface Config {
  email: string;
  apiToken: string;
  domain: string;
  boardId: string;
}

export interface FormattedTask {
  key: string;
  summary: string;
  status: string;
  priority: string;
  assignee: string;
  type: string;
}
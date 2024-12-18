export interface Environment {
  email: string;
  apiToken: string;
  domain: string;
  boardId: string;
  telegramBotToken: string;
  telegramChannelId: string;
}

export interface FormattedTask {
  key: string;
  summary: string;
  status: string;
  priority: string;
  assignee: string;
  type: string;
  url: string;
}
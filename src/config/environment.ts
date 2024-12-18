import dotenv from "dotenv";
import { fileURLToPath } from "url";
import { dirname, join } from "path";
import type { Environment } from '../types/config';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

dotenv.config({ path: join(__dirname, "../../.env") });

function validateConfig(config: Partial<Environment>): config is Environment {
  const requiredKeys: (keyof Environment)[] = [
    "email",
    "apiToken",
    "domain",
    "boardId",
    "telegramBotToken",
    "telegramChannelId",
  ];

  for (const key of requiredKeys) {
    if (!config[key]) {
      throw new Error(
        `Missing required environment variable: ${key.toUpperCase()}`
      );
    }
  }

  return true;
}

const config: Partial<Environment> = {
  email: process.env.JIRA_EMAIL || '',
  apiToken: process.env.JIRA_API_TOKEN || '',
  domain: process.env.JIRA_DOMAIN || '',
  boardId: process.env.JIRA_BOARD_ID || '',
  telegramBotToken: process.env.TELEGRAM_BOT_TOKEN || '',
  telegramChannelId: process.env.TELEGRAM_CHANNEL_ID || ''
};

if (!validateConfig(config)) {
  throw new Error("Invalid configuration");
}

export const environment: Environment = config;

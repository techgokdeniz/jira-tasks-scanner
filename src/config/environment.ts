import dotenv from "dotenv";
import { fileURLToPath } from "url";
import { dirname, join } from "path";
import type { Config } from 'types/config';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

dotenv.config({ path: join(__dirname, "../../.env") });

function validateConfig(config: Partial<Config>): config is Config {
  const requiredKeys: (keyof Config)[] = [
    "email",
    "apiToken",
    "domain",
    "boardId",
  ];

  for (const key of requiredKeys) {
    if (!config[key]) {
      throw new Error(
        `Missing required environment variable: JIRA_${key.toUpperCase()}`
      );
    }
  }

  return true;
}

const config: Partial<Config> = {
  email: process.env.JIRA_EMAIL,
  apiToken: process.env.JIRA_API_TOKEN,
  domain: process.env.JIRA_DOMAIN,
  boardId: process.env.JIRA_BOARD_ID,
};

if (!validateConfig(config)) {
  throw new Error("Invalid configuration");
}

export const environment: Config = config;

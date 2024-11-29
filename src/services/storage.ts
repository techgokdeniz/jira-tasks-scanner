import fs from 'fs-extra';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';
import type { FormattedTask } from 'types/config';


const __dirname = dirname(fileURLToPath(import.meta.url));
const STORAGE_FILE = join(__dirname, '../../data/tasks.json');

interface StorageData {
  lastCheck: string;
  tasks: FormattedTask[];
}

export class StorageService {
  private static instance: StorageService;
  private initialized: boolean = false;

  private constructor() {}

  static getInstance(): StorageService {
    if (!StorageService.instance) {
      StorageService.instance = new StorageService();
    }
    return StorageService.instance;
  }

  async initialize(): Promise<void> {
    if (this.initialized) return;

    try {
      await fs.ensureDir(dirname(STORAGE_FILE));
      
      let data: StorageData | null = null;
      
      try {
        data = await fs.readJSON(STORAGE_FILE);
      } catch (error) {
        // File doesn't exist or is invalid JSON
        data = null;
      }
      
      if (!data) {
        const initialData: StorageData = {
          lastCheck: new Date().toISOString(),
          tasks: []
        };
        await fs.writeJSON(STORAGE_FILE, initialData, { spaces: 2 });
      }
      
      this.initialized = true;
    } catch (error) {
      throw new Error(`Failed to initialize storage: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  private async readStorage(): Promise<StorageData> {
    try {
      return await fs.readJSON(STORAGE_FILE);
    } catch (error) {
      throw new Error(`Failed to read storage file: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  private async writeStorage(data: StorageData): Promise<void> {
    try {
      await fs.writeJSON(STORAGE_FILE, data, { spaces: 2 });
    } catch (error) {
      throw new Error(`Failed to write storage file: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  async getStoredTasks(): Promise<FormattedTask[]> {
    await this.initialize();
    const data = await this.readStorage();
    return data.tasks;
  }

  async updateTasks(tasks: FormattedTask[]): Promise<void> {
    await this.initialize();
    await this.writeStorage({
      lastCheck: new Date().toISOString(),
      tasks
    });
  }

  async getLastCheckTime(): Promise<Date> {
    await this.initialize();
    const data = await this.readStorage();
    return new Date(data.lastCheck);
  }
}
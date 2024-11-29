import axios, { AxiosInstance } from 'axios';
import { environment } from 'config/environment';
import type { JiraResponse, GetBoardIssuesOptions } from 'types/jira';

class JiraApiService {
  private api: AxiosInstance;

  constructor() {
    const baseURL = `https://${environment.domain}/rest/agile/1.0`;

    this.api = axios.create({
      baseURL,
      auth: {
        username: environment.email,
        password: environment.apiToken
      },
      headers: {
        'Accept': 'application/json'
      }
    });
  }

  async getBoardIssues(boardId: string, options: GetBoardIssuesOptions = {}): Promise<JiraResponse> {
    try {
      const {
        startAt = 0,
        maxResults = 50,
        orderBy = 'created',
        sortOrder = 'desc',
        jqlFilter = ''
      } = options;

      const baseJql = 'assignee is EMPTY AND status in ("To Do", "Selected for Development")';
      const orderByClause = `order by ${orderBy} ${sortOrder}`;
      const jql = jqlFilter ? `${baseJql} AND ${jqlFilter} ${orderByClause}` : `${baseJql} ${orderByClause}`;

      const response = await this.api.get<JiraResponse>(`/board/${boardId}/issue`, {
        params: {
          startAt,
          maxResults,
          jql
        }
      });
      return response.data;
    } catch (error) {
      if (error instanceof Error) {
        throw new Error(`Failed to fetch board issues: ${error.message}`);
      }
      throw new Error('An unknown error occurred while fetching board issues');
    }
  }
}

export const jiraApiService = new JiraApiService();
export interface JiraUser {
  displayName: string;
  emailAddress: string;
  accountId: string;
}

export interface JiraPriority {
  name: string;
  id: string;
}

export interface JiraStatus {
  name: string;
  id: string;
  statusCategory: {
    name: string;
    key: string;
  };
}

export interface JiraIssueType {
  name: string;
  id: string;
  iconUrl: string;
}

export interface JiraIssueFields {
  summary: string;
  status: JiraStatus;
  priority?: JiraPriority;
  assignee?: JiraUser;
  issuetype: JiraIssueType;
  created: string;
}

export interface JiraIssue {
  id: string;
  key: string;
  fields: JiraIssueFields;
}

export interface JiraResponse {
  issues: JiraIssue[];
  maxResults: number;
  startAt: number;
  total: number;
}

export interface GetBoardIssuesOptions {
  startAt?: number;
  maxResults?: number;
  orderBy?: 'created' | 'updated';
  sortOrder?: 'asc' | 'desc';
  jqlFilter?: string;
}
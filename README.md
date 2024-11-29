# Jira Board Tasks Fetcher

A TypeScript application that fetches and displays tasks from a Jira board with real-time updates and beautiful console output.

## Features

- 🔄 Fetch all tasks from a specified Jira board
- 🎨 Beautiful console output with color coding
- ✨ Type-safe implementation using TypeScript
- 🔐 Secure authentication using Jira API tokens
- 🚀 Modern ES Modules and async/await patterns

## Prerequisites

- Node.js (version specified in `.nvmrc`)
- A Jira account with API access
- Jira API token ([How to get an API token](https://support.atlassian.com/atlassian-account/docs/manage-api-tokens-for-your-atlassian-account/))

## Installation

1. Clone the repository
2. Use the correct Node.js version:
   ```bash
   nvm use
   ```
3. Install dependencies:
   ```bash
   npm install
   ```
4. Copy the environment example file:
   ```bash
   cp .env.example .env
   ```
5. Update the `.env` file with your Jira credentials:
   ```env
   JIRA_EMAIL=your-email@company.com
   JIRA_API_TOKEN=your-generated-api-token
   JIRA_DOMAIN=your-company.atlassian.net
   JIRA_BOARD_ID=123
   ```

## Usage

Start the application:

```bash
npm run dev
```

The application will:
1. Connect to your Jira instance
2. Fetch all tasks from the specified board
3. Display them in a beautifully formatted console output

## Available Scripts

- `npm run dev` - Start the application in development mode
- `npm start` - Start the application
- `npm run build` - Build the TypeScript code
- `npm run lint` - Run ESLint for code quality
- `npm run type-check` - Run TypeScript type checking

## Project Structure

```
src/
├── config/           # Configuration and environment setup
├── services/         # API and core services
├── types/           # TypeScript type definitions
├── utils/           # Utility functions
└── index.ts         # Application entry point
```

## Environment Variables

| Variable | Description |
|----------|-------------|
| JIRA_EMAIL | Your Jira account email |
| JIRA_API_TOKEN | Your Jira API token |
| JIRA_DOMAIN | Your Jira domain (e.g., company.atlassian.net) |
| JIRA_BOARD_ID | The ID of your Jira board |

## Contributing

1. Fork the repository
2. Create your feature branch
3. Commit your changes
4. Push to the branch
5. Create a new Pull Request

## License

MIT License - feel free to use this project as you wish.

## Support

If you encounter any problems or have suggestions, please open an issue in the repository.
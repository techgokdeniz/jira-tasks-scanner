import TelegramBot from 'node-telegram-bot-api';
import { environment } from '../config/environment';
import type { FormattedTask } from '../types/config';
import chalk from 'chalk';

export class TelegramService {
    private static instance: TelegramService;
    private bot: TelegramBot;

    private constructor() {
        if (!environment.telegramBotToken) {
            throw new Error('Telegram bot token is not configured');
        }
        this.bot = new TelegramBot(environment.telegramBotToken, { polling: false });
    }

    public static getInstance(): TelegramService {
        if (!TelegramService.instance) {
            TelegramService.instance = new TelegramService();
        }
        return TelegramService.instance;
    }

    public async sendNewTaskNotification(task: FormattedTask): Promise<void> {
        try {
            if (!environment.telegramChannelId) {
                throw new Error('Telegram channel ID is not configured');
            }

            const channelId = this.formatChannelId(environment.telegramChannelId);
            const message = this.formatTaskMessage(task);
            
            await this.bot.sendMessage(channelId, message, { 
                parse_mode: 'HTML',
                disable_web_page_preview: false
            });
            console.log(chalk.green(`✓ Sent Telegram notification for task ${task.key}`));
        } catch (error) {
            console.error(chalk.red('Failed to send Telegram notification:'), 
                error instanceof Error ? error.message : 'Unknown error');
            if (process.env.NODE_ENV !== 'production') {
                console.error('Error details:', error);
            }
        }
    }

    private formatChannelId(channelId: string): string {
        if (/^\d+$/.test(channelId)) {
            return `-100${channelId}`;
        }
        if (channelId.startsWith('-100') || channelId.startsWith('@')) {
            return channelId;
        }
        return `@${channelId}`;
    }

    private formatTaskMessage(task: FormattedTask): string {
        const escapedSummary = this.escapeHtml(task.summary);
        const escapedStatus = this.escapeHtml(task.status);
        const escapedType = this.escapeHtml(task.type);

        return `🆕 <b>New Jira Task</b>\n\n` +
            `📌 <b>Key:</b> ${task.key}\n` +
            `📝 <b>Summary:</b> ${escapedSummary}\n` +
            `📊 <b>Status:</b> ${escapedStatus}\n` +
            `📎 <b>Type:</b> ${escapedType}\n` +
            `🔗 <a href="${task.url}">View in Jira</a>`;
    }

    private escapeHtml(text: string): string {
        return text
            .replace(/&/g, '&amp;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;')
            .replace(/"/g, '&quot;')
            .replace(/'/g, '&#039;');
    }
}

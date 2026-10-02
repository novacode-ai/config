import fs from 'fs';
import path from 'path';
import os from 'os';
import { UserSettings } from '@novacode-ai/types';

const CONFIG_PATH = path.join(os.homedir(), '.novacode.json');

export class ConfigManager {
    /**
     * Reads the configuration from ~/.novacode.json
     * Automatically creates it with secure defaults if it does not exist.
     */
    static getSettings(): UserSettings {
        if (!fs.existsSync(CONFIG_PATH)) {
            const defaultSettings: UserSettings = { defaultModel: 'gpt-4o', theme: 'dark' };
            fs.writeFileSync(CONFIG_PATH, JSON.stringify(defaultSettings, null, 2), { mode: 0o600 });
            return defaultSettings;
        }
        try {
            return JSON.parse(fs.readFileSync(CONFIG_PATH, 'utf-8'));
        } catch (e) {
            return { defaultModel: 'gpt-4o', theme: 'dark' };
        }
    }

    /**
     * Partially updates the configuration and safely saves it.
     */
    static updateSettings(newSettings: Partial<UserSettings>) {
        const current = this.getSettings();
        const merged = { ...current, ...newSettings };
        fs.writeFileSync(CONFIG_PATH, JSON.stringify(merged, null, 2), { mode: 0o600 });
    }
}

import { ExplanationTypes } from "../utils/Types/ExplanationTypes";


interface SavedExplanation {
    text: string;
    explanation: string;
    level: ExplanationTypes;
    timestamp: number;
}

export class LocalStorageService {
    static async getSavedExplanations(): Promise<SavedExplanation[]> {
        const result = await chrome.storage.local.get(['savedExplanations']);
        return result.savedExplanations || [];
    }

    static async saveExplanation(newExplanation: SavedExplanation): Promise<void> {
        const savedExplanations = await this.getSavedExplanations();
        const updatedExplanations = [...savedExplanations, newExplanation];
        await chrome.storage.local.set({ savedExplanations: updatedExplanations });
    }

    static async deleteExplanation(timestamp: number): Promise<SavedExplanation[]> {
        const savedExplanations = await this.getSavedExplanations();
        const updatedExplanations = savedExplanations.filter(exp => exp.timestamp !== timestamp);
        await chrome.storage.local.set({ savedExplanations: updatedExplanations });
        return updatedExplanations;
    }

    static async getSelectedText(): Promise<string | undefined> {
        const result = await chrome.storage.local.get(['selectedText']);
        return result.selectedText;
    }

    static async setSelectedText(text: string): Promise<void> {
        await chrome.storage.local.set({ selectedText: text });
    }

    static async removeSelectedText(): Promise<void> {
        await chrome.storage.local.remove('selectedText');
    }

    static async getSelectedLevel(): Promise<ExplanationTypes | undefined> {
        const result = await chrome.storage.local.get(['selectedLevel']);
        return result.selectedLevel as ExplanationTypes;
    }

    static async setSelectedLevel(level: ExplanationTypes): Promise<void> {
        await chrome.storage.local.set({ selectedLevel: level });
    }
}

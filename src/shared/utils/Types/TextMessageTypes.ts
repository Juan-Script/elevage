export interface TextMessage {
    type: 'TEXT_SELECTED' | 'UPDATE_SELECTED_TEXT';
    text: string;
}
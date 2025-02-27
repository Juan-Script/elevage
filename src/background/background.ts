import { TextMessage } from "../shared/utils/Types/TextMessageTypes";
import { LocalStorageService } from '../shared/services/localStorage.service';


chrome.runtime.onInstalled.addListener(() => {
    chrome.contextMenus.create({
        id: 'explain-with-elevage',
        title: 'Explicar con Elevage',
        contexts: ['selection']
    });
});

chrome.contextMenus.onClicked.addListener((info) => {
    if (info.menuItemId === 'explain-with-elevage' && info.selectionText) {
        LocalStorageService.setSelectedText(info.selectionText).then(() => {
            chrome.action.openPopup();
        });
    }
});

chrome.runtime.onMessage.addListener((message: TextMessage, _sender, _sendResponse) => {
    console.log('Mensaje recibido en background:', message);

    if (message.type === 'TEXT_SELECTED') {
        chrome.runtime.sendMessage({
            type: 'UPDATE_SELECTED_TEXT',
            text: message.text
        }, (response) => {
            console.log('Respuesta del popup:', response);
        });
    }

    return true;
});

chrome.runtime.onMessage.addListener((
    message: { text: string },
    _sender: chrome.runtime.MessageSender,
    sendResponse: (response: { explanation: string }) => void
) => {
    if (message.text) {
        fetchLangChainExplanation(message.text)
            .then((explanation) => sendResponse({ explanation }))
            .catch((error) => console.error(error));
    }
    return true;
});

async function fetchLangChainExplanation(text: string) {
    return `Explicación generada para: ${text}`;
}
  
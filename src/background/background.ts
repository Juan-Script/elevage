interface TextMessage {
    type: 'TEXT_SELECTED' | 'UPDATE_SELECTED_TEXT';
    text: string;
}

// Crear el menú contextual
chrome.runtime.onInstalled.addListener(() => {
    chrome.contextMenus.create({
        id: 'explain-with-elevage',
        title: 'Explicar con Elevage',
        contexts: ['selection']
    });
});

// Manejar el clic en el menú contextual
chrome.contextMenus.onClicked.addListener((info) => {
    if (info.menuItemId === 'explain-with-elevage' && info.selectionText) {
        // Guardar el texto seleccionado
        chrome.storage.local.set({ selectedText: info.selectionText }, () => {
            // Abrir el popup
            chrome.action.openPopup();
        });
    }
});

// Escuchamos los mensajes del content script
chrome.runtime.onMessage.addListener((message: TextMessage, _sender, _sendResponse) => {
    console.log('Mensaje recibido en background:', message);

    if (message.type === 'TEXT_SELECTED') {
        // Reenviamos el mensaje a todos los listeners
        chrome.runtime.sendMessage({
            type: 'UPDATE_SELECTED_TEXT',
            text: message.text
        }, (response) => {
            console.log('Respuesta del popup:', response);
        });
    }

    // Importante: retornar true si vamos a usar sendResponse de forma asíncrona
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
  
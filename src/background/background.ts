

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
  
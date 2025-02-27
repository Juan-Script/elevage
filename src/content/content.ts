let iframe: HTMLIFrameElement | null = null;
let isDragging = false;
let startX = 0;
let startY = 0;
let initialX = 0;
let initialY = 0;

function createIframe() {
    if (iframe) return;

    iframe = document.createElement('iframe');
    iframe.id = 'elevage-extension-container';
    iframe.src = chrome.runtime.getURL('src/popup/popup.html');
    document.body.appendChild(iframe);

    // Hacer el iframe arrastrable
    iframe.addEventListener('mousedown', startDragging);
    document.addEventListener('mousemove', drag);
    document.addEventListener('mouseup', stopDragging);
}

function startDragging(e: MouseEvent) {
    if (!iframe || !(e.target as HTMLElement).closest('.titlebar')) return;

    isDragging = true;
    startX = e.clientX;
    startY = e.clientY;
    initialX = iframe.offsetLeft;
    initialY = iframe.offsetTop;

    iframe.style.transition = 'none';
}

function drag(e: MouseEvent) {
    if (!isDragging || !iframe) return;

    e.preventDefault();
    const dx = e.clientX - startX;
    const dy = e.clientY - startY;

    iframe.style.left = `${initialX + dx}px`;
    iframe.style.top = `${initialY + dy}px`;
}

function stopDragging() {
    if (!iframe) return;
    
    isDragging = false;
    iframe.style.transition = 'all 0.3s ease';
}

// Escuchar el clic en el icono de la extensión
chrome.runtime.onMessage.addListener((message) => {
    if (message.type === 'TOGGLE_IFRAME') {
        if (!iframe) {
            createIframe();
        } else {
            iframe.classList.toggle('hidden');
        }
    }
});

// Manejar la selección de texto
function handleTextSelection() {
    const selectedText = window.getSelection()?.toString().trim();
    
    if (selectedText) {
        console.log('Texto seleccionado:', selectedText);
        
        chrome.runtime.sendMessage({
            type: 'TEXT_SELECTED',
            text: selectedText
        });
    }
}

document.addEventListener('mouseup', handleTextSelection);
document.addEventListener('keyup', (e) => {
    if (e.shiftKey || e.key === 'Shift') {
        handleTextSelection();
    }
});
  
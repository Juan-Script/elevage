import { useEffect, useState, useCallback } from 'react';
import { PulseLoader } from 'react-spinners';
import { getWordExplanation } from '../services/wordExplanation';
import Bottom from './Bottom';
import LevelSelector from './LevelSelector';

interface TextMessage {
  type: 'TEXT_SELECTED' | 'UPDATE_SELECTED_TEXT';
  text: string;
}

interface MessageResponse {
  success: boolean;
  error?: Error;
}

export default function Content() {
  const [selectedText, setSelectedText] = useState<string>('');
  const [explanation, setExplanation] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [selectedLevel, setSelectedLevel] = useState<string>('Básico');

  const generateExplanation = useCallback(async (text: string) => {
    setIsLoading(true);
    try {
      const wordExplanation = await getWordExplanation(text, selectedLevel);
      setExplanation(wordExplanation);
      return { success: true };
    } catch (error) {
      console.error('Error al obtener la explicación:', error);
      setExplanation('Lo siento, hubo un error al obtener la explicación.');
      return { success: false, error: error as Error };
    } finally {
      setIsLoading(false);
    }
  }, [selectedLevel]);

  const handleRegenerateExplanation = useCallback(async () => {
    if (selectedText && !isLoading) {
      await generateExplanation(selectedText);
    }
  }, [selectedText, isLoading, generateExplanation]);

  useEffect(() => {
    chrome.storage.local.get(['selectedText', 'selectedLevel'], async (result) => {
      if (result.selectedLevel) {
        setSelectedLevel(result.selectedLevel);
      }
      if (result.selectedText) {
        setSelectedText(result.selectedText);
        await generateExplanation(result.selectedText);
        chrome.storage.local.remove('selectedText');
      }
    });

    const handleMessage = async (message: TextMessage, _sender: chrome.runtime.MessageSender, sendResponse: (response: MessageResponse) => void) => {
      console.log('Mensaje recibido en Content:', message);

      if (message.type === 'UPDATE_SELECTED_TEXT') {
        setSelectedText(message.text);
        console.log('Texto seleccionado en el popup:', message.text);

        if (message.text) {
          const result = await generateExplanation(message.text);
          sendResponse(result);
        }
      }

      return true;
    };

    chrome.runtime.onMessage.addListener(handleMessage);

    return () => {
      chrome.runtime.onMessage.removeListener(handleMessage);
    };
  }, [generateExplanation]);

  return (
    <div className="flex flex-col h-full">
      <div className="flex-1 flex flex-col py-[10px] overflow-hidden">
        <LevelSelector 
          selectedLevel={selectedLevel}
          onLevelChange={async (level) => {
            setSelectedLevel(level);
            chrome.storage.local.set({ selectedLevel: level });
            if (selectedText) {
              setIsLoading(true);
              try {
                const wordExplanation = await getWordExplanation(selectedText, level);
                setExplanation(wordExplanation);
              } catch (error) {
                console.error('Error al obtener la explicación:', error);
                setExplanation('Lo siento, hubo un error al obtener la explicación.');
              } finally {
                setIsLoading(false);
              }
            }
          }}
        />
        <div className="flex-1 mt-4 overflow-hidden">
          {selectedText ? (
            <div className="h-full flex flex-col p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
              <div
                className="flex w-fit gap-[5px] p-[10px] border-[1px] border-solid border-[#F0F0F0] rounded-[8px] py-[10px] mx-auto"
              >
                <p className="mt-2 text-[14px] text-gray-700 dark:text-gray-300 font-bold mx-auto">{selectedText}</p>
              </div>

              {isLoading ? (
                <div className="flex flex-col justify-center items-center mt-4 bg-gradient-to-b from-blue-100 to-blue-300 rounded-lg p-8 py-[70px]">
                  <PulseLoader
                    color="#266966"
                    size={15}
                    margin={5}
                    speedMultiplier={0.8}
                  />
                  <p className="mt-6 text-center text-gray-700 dark:text-gray-300">
                    Preparando explicación... Esto llevará solo unos segundos
                  </p>
                </div>
              ) : explanation && (
                <div className="flex-1 mt-4 p-4 bg-white dark:bg-gray-700 rounded-lg shadow">
                  <h3 className="text-lg font-semibold mb-2 text-[#266966]">Explicación:</h3>
                  <div className="max-h-[365px] overflow-y-auto text-gray-700 dark:text-gray-300 mt-[10px]
                    scrollbar-thin scrollbar-thumb-[#266966] scrollbar-track-gray-200 
                    scrollbar-thumb-rounded-full scrollbar-track-rounded-full 
                    hover:scrollbar-thumb-[#1a4b49] scroll-smooth
                    [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
                    {explanation}
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="text-center text-gray-500 dark:text-gray-400 py-8">
              Seleccione un párrafo o palabra
            </div>
          )}
        </div>
      </div>

      <div className="sticky bottom-0 bg-white dark:bg-gray-900 pt-2">
        <Bottom
          selectedText={selectedText}
          onRegenerateExplanation={handleRegenerateExplanation}
          isLoading={isLoading}
          explanation={explanation}
        />
      </div>
    </div>
  );
}

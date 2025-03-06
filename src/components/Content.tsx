import { useEffect, useState, useCallback } from 'react';
import { PulseLoader } from 'react-spinners';
import Bottom from './Bottom';
import LevelSelector from './LevelSelector';
import TopBar from './TopBar';
import SavedExplanations from './SavedExplanations';
import { motion, AnimatePresence } from 'framer-motion';
import { TextMessage } from '../shared/utils/Types/TextMessageTypes';
import { LocalStorageService } from '../shared/services/localStorage.service';
import { ExplanationTypes } from '../shared/utils/Types/ExplanationTypes';
import { getWordExplanation } from '../shared/services/langChain.service';
import ReactMarkdown from 'react-markdown';

interface MessageResponse {
  success: boolean;
  error?: Error;
}

export default function Content() {
  const [selectedText, setSelectedText] = useState<string>('');
  const [explanation, setExplanation] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [selectedLevel, setSelectedLevel] = useState<ExplanationTypes>(ExplanationTypes.BASIC);
  const [showSaved, setShowSaved] = useState<boolean>(false);

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
    const initializeContent = async () => {
      const [storedText, storedLevel] = await Promise.all([
        LocalStorageService.getSelectedText(),
        LocalStorageService.getSelectedLevel()
      ]);

      if (storedLevel) {
        setSelectedLevel(storedLevel);
      }
      if (storedText) {
        setSelectedText(storedText);
        await generateExplanation(storedText);
        await LocalStorageService.removeSelectedText();
      }
    };

    initializeContent();

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
    <div
      className="flex flex-col h-full relative"
    >
      <TopBar
        selectedText={selectedText}
        explanation={explanation}
        level={selectedLevel}
        onShowSaved={() => setShowSaved(true)}
      />

      <AnimatePresence>
        {showSaved ? (
          <SavedExplanations onClose={() => setShowSaved(false)} />
        ) : (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="flex-1 flex flex-col py-[10px] overflow-hidden"
          >
            <LevelSelector
              selectedLevel={selectedLevel}
              onLevelChange={async (level) => {
                setSelectedLevel(level);
                await LocalStorageService.setSelectedLevel(level);
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
            <div
              className="flex-1 mt-4 overflow-hidden"
            >
              {selectedText ? (
                <div
                  className="h-full flex flex-col p-4 bg-gray-50 dark:bg-gray-800 rounded-lg transition-colors duration-300"
                >
                  <div
                    className="flex w-fit px-[8px] py-[4px] border-[1px] border-solid border-[#F0F0F0] rounded-[8px] mx-auto shadow-md my-[5px]"
                  >
                    <p
                      className="mt-2 text-[14px] text-gray-700 dark:text-gray-300 font-[600]"
                    >
                      {selectedText}
                    </p>
                  </div>

                  {isLoading ? (
                    <div
                      className="flex flex-col justify-center items-center mt-4 bg-gradient-to-b from-blue-100 to-blue-300 dark:from-blue-800 dark:to-blue-600 rounded-lg p-8 py-[70px]"
                    >
                      <PulseLoader
                        color="#266966" size={15} margin={5} speedMultiplier={0.8}
                      />
                      <p
                        className="mt-6 text-center text-gray-700 dark:text-gray-300"
                      >
                        Preparando explicación... <br />Esto llevará solo unos segundos
                      </p>
                    </div>
                  ) : (
                    <AnimatePresence
                      mode="wait"
                    >
                      {explanation && (
                        <motion.div
                          key="explanation"
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -20 }}
                          transition={{ duration: 0.5, ease: "easeOut" }}
                          className="flex-1 mt-4 p-4 px-[15px] bg-white dark:bg-gray-700 rounded-lg shadow"
                        >
                          <motion.h3
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 0.2 }}
                            className="text-lg font-semibold mb-2 text-[#266966] mx-auto"
                          >
                            Explicación:
                          </motion.h3>
                          <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 0.3 }}
                            className="max-h-[360px] overflow-y-auto text-gray-700 dark:text-gray-300 mt-[10px]
                              scrollbar-thin scrollbar-thumb-[#266966] scrollbar-track-gray-200 
                              scrollbar-thumb-rounded-full scrollbar-track-rounded-full 
                              hover:scrollbar-thumb-[#1a4b49] scroll-smooth
                              [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]
                              prose prose-sm dark:prose-invert max-w-none"
                          >
                            <ReactMarkdown>
                              {explanation?.replace(/\n/g, '\n\n')}
                            </ReactMarkdown>
                          </motion.div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  )}
                </div>
              ) : (
                <div
                  className="text-center text-gray-500 dark:text-gray-400 py-8"
                >
                  Seleccione un párrafo o palabra
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div
        className="sticky bottom-0 bg-white dark:bg-gray-900 pt-2"
      >
        <Bottom
          selectedText={selectedText}
          onRegenerateExplanation={handleRegenerateExplanation}
          isLoading={isLoading}
          explanation={explanation}
          level={selectedLevel}
        />
      </div>
    </div>
  );
}

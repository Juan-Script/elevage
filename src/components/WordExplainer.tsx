import { useState, useEffect } from 'react';
import { getWordExplanation } from '../services/wordExplanation';

export const WordExplainer: React.FC = () => {
    const [explanation, setExplanation] = useState<string>('');
    const [loading, setLoading] = useState<boolean>(false);

    const handleTextSelection = async () => {
        const selectedText = window.getSelection()?.toString().trim();
        
        if (selectedText) {
            setLoading(true);
            try {
                const wordExplanation = await getWordExplanation(selectedText);
                setExplanation(wordExplanation);
            } catch (error) {
                console.error('Error al obtener la explicación:', error);
                setExplanation('Lo siento, hubo un error al obtener la explicación.');
            } finally {
                setLoading(false);
            }
        }
    };

  useEffect(() => {
        document.addEventListener('mouseup', handleTextSelection);
        return () => {
            document.removeEventListener('mouseup', handleTextSelection);
        };
    }, []);

    return (
        <div className="fixed bottom-4 right-4 max-w-md bg-white shadow-lg rounded-lg p-4">
            {loading && <div className="text-gray-600">Cargando explicación...</div>}
            {!loading && explanation && (
                <div>
                    <h3 className="text-lg font-semibold mb-2">Explicación:</h3>
                    <p className="text-gray-700">{explanation}</p>
                </div>
            )}
        </div>
    );
}; 
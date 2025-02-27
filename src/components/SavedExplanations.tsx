import { useEffect, useState } from 'react';
import { HiMiniXMark } from 'react-icons/hi2';
import { motion, AnimatePresence } from 'framer-motion';
import CardExplanation from './CardExplanation';
import toast, { Toaster } from 'react-hot-toast';

interface SavedExplanation {
    text: string;
    explanation: string;
    level: string;
    timestamp: number;
}

interface SavedExplanationsProps {
    onClose: () => void;
}

export default function SavedExplanations({ onClose }: SavedExplanationsProps) {
    const [savedExplanations, setSavedExplanations] = useState<SavedExplanation[]>([]);

    useEffect(() => {
        loadSavedExplanations();
    }, []);

    const loadSavedExplanations = async () => {
        const result = await chrome.storage.local.get(['savedExplanations']);
        setSavedExplanations(result.savedExplanations || []);
    };

    const handleDelete = async (timestamp: number) => {
        try {
            const updatedExplanations = savedExplanations.filter(exp => exp.timestamp !== timestamp);
            await chrome.storage.local.set({ savedExplanations: updatedExplanations });
            setSavedExplanations(updatedExplanations);
            
            toast.success('Explicación eliminada correctamente', {
                duration: 2000,
                position: 'bottom-center',
                style: {
                    background: '#266966',
                    color: '#fff',
                }
            });
        } catch (error: unknown) {
            toast.error('Error al eliminar la explicación', {
                duration: 2000,
                position: 'bottom-center',
            });
            console.error('Error al eliminar la explicación:', error);
        }
    };

    const formatDate = (timestamp: number) => {
        return new Date(timestamp).toLocaleDateString('es-ES', {
            day: '2-digit',
            month: '2-digit',
            year: '2-digit',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute w-[350px] inset-0 !bg-[#FFF] dark:bg-gray-900 z-50 flex flex-col"
        >
            <Toaster />
            <div className="flex justify-between items-center p-4 bg-white dark:bg-gray-900 sticky top-0 z-10">
                <h2 className="text-xl font-bold text-[#266966]">Explicaciones Guardadas</h2>
                <HiMiniXMark
                    onClick={onClose}
                    className="cursor-pointer hover:opacity-70 text-[15px]"
                />
            </div>

            <div className="p-4 mt-[10px]">
                <AnimatePresence>
                    {savedExplanations.length === 0 ? (
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            className="text-center text-gray-500 dark:text-gray-400 py-[100px]"
                        >
                            No hay explicaciones guardadas
                        </motion.div>
                    ) : (
                        <div className="flex flex-col gap-[10px] h-[540px] overflow-y-auto [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
                            {savedExplanations.map((exp) => (
                                <CardExplanation
                                    key={exp.timestamp}
                                    exp={exp}
                                    handleDelete={handleDelete}
                                    formatDate={formatDate}
                                />
                            ))}
                        </div>
                    )}
                </AnimatePresence>
            </div>
        </motion.div>
    );
} 
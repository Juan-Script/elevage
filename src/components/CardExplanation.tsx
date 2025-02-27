import { motion } from 'framer-motion'
import { HiOutlineTrash } from 'react-icons/hi'

interface CardExplanationProps {
    handleDelete: (timestamp: number) => void;
    formatDate: (timestamp: number) => string;
    exp: {
        text: string;
        explanation: string;
        timestamp: number;
    }
}

export default function CardExplanation({ exp, handleDelete, formatDate }: CardExplanationProps) {
    return (
        <motion.div
            key={exp.timestamp}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg"
        >
            <div
                className="flex justify-between items-start gap-4"
            >
                <div
                    className="font-bold text-[#266966] text-sm flex-1"
                >
                    {exp.text}
                </div>
                <div
                    className="flex items-center gap-[7px] shrink-0"
                >
                    <span
                        className="text-xs text-gray-500 dark:text-gray-400 whitespace-nowrap"
                    >
                        {formatDate(exp.timestamp)}
                    </span>

                    <HiOutlineTrash
                        onClick={() => handleDelete(exp.timestamp)}
                        className="cursor-pointer hover:opacity-70 text-[18px]"
                    />
                </div>
            </div>
            <div
                className="text-sm mt-[10px] text-gray-700 dark:text-gray-300 leading-relaxed"
            >
                {exp.explanation}
            </div>
        </motion.div>
    )
}

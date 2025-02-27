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
            className="bg-gray-50 dark:bg-gray-800 p-[10px] rounded-[5px] border-[#EBEBEB] border-[1px] border-solid"
        >
            <div
                className="flex justify-between items-start gap-4"
            >
                <div
                    className="text-[#266966] text-[16px] font-[700] flex-1"
                >
                    {exp.text}
                </div>

                <HiOutlineTrash
                    onClick={() => handleDelete(exp.timestamp)}
                    className="cursor-pointer hover:opacity-70 text-[16px] text-[#6F6F6F] dark:text-gray-400"
                />
            </div>
            <div
                className="text-sm mt-[10px] text-gray-700 dark:text-gray-300 leading-relaxed"
            >
                {exp.explanation}
            </div>

            <span
                className="text-xs text-[#6F6F6F] dark:text-gray-400 whitespace-nowrap pt-[20px]"
            >
                {formatDate(exp.timestamp)}
            </span>
        </motion.div>
    )
}

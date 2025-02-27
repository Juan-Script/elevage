import { BsStars } from "react-icons/bs";
import { HiOutlineDuplicate } from "react-icons/hi";
import { useState } from "react";

interface BottomProps {
  selectedText: string;
  onRegenerateExplanation: () => void;
  isLoading: boolean;
  explanation?: string;
}

export default function Bottom({ selectedText, onRegenerateExplanation, isLoading, explanation }: BottomProps) {
  const [copyFeedback, setCopyFeedback] = useState(false);

  const handleCopy = async () => {
    if (explanation) {
      try {
        await navigator.clipboard.writeText(explanation);
        setCopyFeedback(true);
        setTimeout(() => setCopyFeedback(false), 2000);
      } catch (err) {
        console.error('Error al copiar:', err);
      }
    }
  };

  return (
    <div
      className="flex w-full justify-between items-center mt-[10px]"
    >
      <div
        onClick={selectedText && !isLoading ? onRegenerateExplanation : undefined}
        className={`flex py-[5px] px-[10px] gap-[3px] rounded-full border-[1px] border-solid border-[#266966] ${selectedText && !isLoading ? 'cursor-pointer hover:shadow-md group' : 'opacity-50 cursor-not-allowed'}`}
      >
        <BsStars
          className="text-[16px] text-[#266966]"
        />
        <div
          className="text-[14px] text-[#266966]"
        >
          Otra explicación
        </div>
      </div>

      <div
        onClick={explanation ? handleCopy : undefined}
        className={`flex py-[5px] px-[10px] gap-[3px] rounded-full text-[#FFF] bg-[#266966] relative ${explanation ? 'cursor-pointer hover:shadow-md' : 'opacity-50 cursor-not-allowed'}`}
      >
        <HiOutlineDuplicate
          className="text-[16px]"
        />
        <div
          className="text-[14px]"
        >
          {copyFeedback ? '¡Copiado!' : 'Copiar'}
        </div>
      </div>
    </div>
  )
}
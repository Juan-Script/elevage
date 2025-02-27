import { BsStars } from "react-icons/bs";
import { HiOutlineDuplicate, HiOutlineBookmark } from "react-icons/hi";
import { useState } from "react";
import toast, { Toaster } from "react-hot-toast";

interface BottomProps {
  selectedText?: string;
  explanation?: string;
  level?: string;
  onRegenerateExplanation: () => void;
  isLoading: boolean;
}

interface SavedExplanation {
  text: string;
  explanation: string;
  level: string;
  timestamp: number;
}

export default function Bottom({ selectedText, explanation, level, onRegenerateExplanation, isLoading }: BottomProps) {
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

  const handleSaveExplanation = async () => {
    if (!selectedText || !explanation || !level) return;

    const newExplanation: SavedExplanation = {
      text: selectedText,
      explanation,
      level,
      timestamp: Date.now()
    };

    try {
      const result = await chrome.storage.local.get(['savedExplanations']);
      const savedExplanations: SavedExplanation[] = result.savedExplanations || [];

      const updatedExplanations = [...savedExplanations, newExplanation];

      await chrome.storage.local.set({ savedExplanations: updatedExplanations });

      toast.success('¡Explicación guardada con éxito!', {
        duration: 2000,
        position: 'bottom-center',
        style: {
          background: '#266966',
          color: '#fff',
        }
      });
    } catch (error: unknown) {
      toast.error('Error al guardar la explicación', {
        duration: 2000,
        position: 'bottom-center',
      });
      console.error('Error al guardar la explicación:', error);
    }
  };

  return (
    <div
      className="flex w-full justify-between items-center mt-[10px]"
    >
      <Toaster />
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
        className="flex gap-[6px] items-center"
      >
        <HiOutlineBookmark
          title="Guardar explicación"
          className="text-[16px] text-[#266966] cursor-pointer hover:opacity-70"
          onClick={explanation ? handleSaveExplanation : undefined}
        />

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
    </div>
  )
}
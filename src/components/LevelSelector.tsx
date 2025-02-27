import { ExplanationTypes } from '../shared/utils/Types/ExplanationTypes';

interface LevelSelectorProps {
  selectedLevel: ExplanationTypes;
  onLevelChange: (level: ExplanationTypes) => void;
}

export default function LevelSelector({ selectedLevel, onLevelChange }: LevelSelectorProps) {
  const handleSelect = (level: ExplanationTypes) => {
    onLevelChange(level);
  };

  return (
    <div
      className="flex w-fit rounded-full bg-[#F2F3F3] p-[4px] gap-[10px] text-[14px] text-[#000] mx-auto font-medium mb-[10px]"
    >
      <div
        onClick={() => handleSelect(ExplanationTypes.BASIC)}
        className={`cursor-pointer rounded-full py-[4px] px-[7px] transition-all duration-300 ${selectedLevel === ExplanationTypes.BASIC ? 'bg-[#FFF] text-[#266966] shadow-[0px_4px_4px_0px_rgba(0,0,0,0.10)]' : ''}`}
      >
        {ExplanationTypes.BASIC}
      </div>
      <div
        onClick={() => handleSelect(ExplanationTypes.MODERATE)}
        className={`cursor-pointer rounded-full py-[4px] px-[7px] transition-all duration-300 ${selectedLevel === ExplanationTypes.MODERATE ? 'bg-[#FFF] text-[#266966] shadow-[0px_4px_4px_0px_rgba(0,0,0,0.10)]' : ''}`}
      >
        {ExplanationTypes.MODERATE}
      </div>
      <div
        onClick={() => handleSelect(ExplanationTypes.EXTENSIVE)}
        className={`cursor-pointer rounded-full py-[4px] px-[7px] transition-all duration-300 ${selectedLevel === ExplanationTypes.EXTENSIVE ? 'bg-[#FFF] text-[#266966] shadow-[0px_4px_4px_0px_rgba(0,0,0,0.10)]' : ''}`}
      >
        {ExplanationTypes.EXTENSIVE}
      </div>
    </div>
  );
}

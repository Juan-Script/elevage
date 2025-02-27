interface LevelSelectorProps {
  selectedLevel: string;
  onLevelChange: (level: string) => void;
}

export default function LevelSelector({ selectedLevel, onLevelChange }: LevelSelectorProps) {
  const handleSelect = (level: string) => {
    onLevelChange(level);
  };

  return (
    <div
      className="flex w-fit rounded-full bg-[#F2F3F3] p-[4px] gap-[10px] text-[14px] text-[#000] mx-auto font-medium mb-[10px]"
    >
      <div
        onClick={() => handleSelect('Básico')}
        className={`cursor-pointer rounded-full py-[4px] px-[7px] transition-all duration-300 ${selectedLevel === 'Básico' ? 'bg-[#FFF] text-[#266966] shadow-[0px_4px_4px_0px_rgba(0,0,0,0.10)]' : ''}`}
      >
        Básico
      </div>
      <div
        onClick={() => handleSelect('Moderado')}
        className={`cursor-pointer rounded-full py-[4px] px-[7px] transition-all duration-300 ${selectedLevel === 'Moderado' ? 'bg-[#FFF] text-[#266966] shadow-[0px_4px_4px_0px_rgba(0,0,0,0.10)]' : ''}`}
      >
        Moderado
      </div>
      <div
        onClick={() => handleSelect('Extenso')}
        className={`cursor-pointer rounded-full py-[4px] px-[7px] transition-all duration-300 ${selectedLevel === 'Extenso' ? 'bg-[#FFF] text-[#266966] shadow-[0px_4px_4px_0px_rgba(0,0,0,0.10)]' : ''}`}
      >
        Extenso
      </div>
    </div>
  );
}

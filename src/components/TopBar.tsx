import { HiOutlineSun, HiOutlineMoon, HiOutlineViewGrid } from "react-icons/hi";
import { HiMiniXMark } from "react-icons/hi2";
import { useState } from "react";

interface TopBarProps {
    selectedText?: string;
    explanation?: string;
    level?: string;
    onShowSaved: () => void;
}

export default function TopBar({ onShowSaved }: TopBarProps) {
    const [isLightMode, setIsLightMode] = useState(true);

    const handleClose = () => {
        window.close();
    };

    const toggleColorMode = () => {
        setIsLightMode(!isLightMode);
    };

    return (
        <>
            <div
                className="flex justify-between items-center titlebar"
            >
                <div
                    className="flex items-center gap-[5px]"
                >
                    <img
                        src="/logo.png"
                        className="w-[24px] h-[24px]"
                    />
                    <div
                        className="text-[13px] font-bold"
                    >
                        Elevage
                    </div>
                </div>

                <div
                    className="flex items-center gap-[10px] text-[16px]"
                >
                    <HiOutlineViewGrid
                        className="cursor-pointer hover:opacity-70"
                        onClick={onShowSaved}
                        title="Ver explicaciones guardadas"
                    />

                    {isLightMode ? (
                        <HiOutlineSun
                            className="cursor-pointer hover:opacity-70"
                            onClick={toggleColorMode}
                        />
                    ) : (
                        <HiOutlineMoon
                            className="cursor-pointer hover:opacity-70"
                            onClick={toggleColorMode}
                        />
                    )}

                    <HiMiniXMark
                        className="cursor-pointer hover:opacity-70"
                        onClick={handleClose}
                    />
                </div>
            </div>
        </>
    )
}

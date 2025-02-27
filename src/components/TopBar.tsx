import { HiOutlineViewGrid } from "react-icons/hi";
import { HiMiniXMark } from "react-icons/hi2";

interface TopBarProps {
    selectedText?: string;
    explanation?: string;
    level?: string;
    onShowSaved: () => void;
}

export default function TopBar({ onShowSaved }: TopBarProps) {

    const handleClose = () => {
        window.close();
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

                    <HiMiniXMark
                        className="cursor-pointer hover:opacity-70"
                        onClick={handleClose}
                    />
                </div>
            </div>
        </>
    )
}

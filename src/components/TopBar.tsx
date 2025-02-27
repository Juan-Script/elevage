import { HiOutlineBookmark, HiOutlineSun, HiOutlineViewGrid, HiOutlineMoon } from "react-icons/hi";
import { HiMiniXMark } from "react-icons/hi2";
import { useState } from "react";

export default function TopBar() {
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
                    className="flex items-center gap-[10px] text-[15px]"
                >
                    <HiOutlineBookmark
                        className="cursor-pointer hover:opacity-70"
                    />

                    <HiOutlineViewGrid
                        className="cursor-pointer hover:opacity-70"
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

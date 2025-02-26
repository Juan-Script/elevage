import { HiOutlineBookmark, HiOutlineViewGrid } from "react-icons/hi";
import { HiMiniXMark } from "react-icons/hi2";
import { LuSettings } from "react-icons/lu";
import { MdDragIndicator } from "react-icons/md";


export default function TopBar() {
    return (
        <div
            className="flex justify-between items-center"
        >
            <div
                className="flex items-center gap-2"
            >
                <MdDragIndicator
                    className="text-2xl"
                />
                <div
                    className="text-2xl font-bold"
                >
                    Elevage
                </div>
            </div>

            <div
                className="flex items-center gap-2"
            >
                <HiOutlineBookmark
                    className="text-2xl"
                />

                <HiOutlineViewGrid
                    className="text-2xl"
                />

                <LuSettings
                    className="text-2xl"
                />

                <HiMiniXMark
                    className="text-2xl"
                />
            </div>
        </div>
    )
}

import Content from "../components/Content";
import TopBar from "../components/TopBar";

export default function Popup() {
    return (
        <div
            className="h-[600px] p-[10px] w-[370px] bg-white flex flex-col dark:bg-gray-900"
        >
            <TopBar />
            <Content />
        </div>
    )
}

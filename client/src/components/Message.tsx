import { useEffect, useRef, } from "react"
import { Message as MessageType } from "../redux/features/chat-slice"
import { useTypedSelector } from "../redux/store"
import { fixImageUrl } from "../utils/misc"
import type { MenuProps } from 'antd';
import { Dropdown, } from 'antd';


type stylingData = {
    nextMsgSenderId: string,
    nextMsgTime: string
}

type Props = Partial<MessageType> & stylingData



export default function Message({ createdAt, content, sender, nextMsgSenderId, nextMsgTime }: Props) {

    const LoggedInUser = useTypedSelector(selector => selector.userReducer)

    const isSentByLoggedInUser = (sender?._id == LoggedInUser._id)
    const marginBottom = sender?._id == nextMsgSenderId ? "mb-[0.8rem]" : "mb-[2.5rem]"
    const willShowTime = sender?._id !== nextMsgSenderId

    const messageRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (messageRef.current) {
            messageRef.current.scrollIntoView({ behavior: "smooth" });
        }
    }, []);


    const items: MenuProps['items'] = [
        {
            label: <p>Delete for me</p>,
            key: '0',
        },
        {
            type: 'divider',
        },
        {
            label: <p>Delete for everyone</p>,
            key: '1',
        },
    ];




    return (
        <main className="relative">
            <section ref={messageRef} className={`flex items-center gap-2 ${isSentByLoggedInUser ? "justify-end" : "justify-start"} ${marginBottom}`}>
                {!isSentByLoggedInUser && (
                    <div className="h-10 w-10 flex-shrink-0">
                        <img src={fixImageUrl(sender?.image!)} alt="sender_image" className="h-full w-full rounded-full" />
                    </div>
                )}
                <div className="flex flex-col relative">
                    <Dropdown menu={{ items }} trigger={["contextMenu"]}>
                        <p className={`${isSentByLoggedInUser ? "bg-pink-red text-white" : "bg-grayish text-blueish"} px-4 py-2 border-bottom-left max-w-[100%] cursor-default`}>{content}</p>
                    </Dropdown>
                    {willShowTime && <small className="text-more-grayish text-right">{createdAt}</small>}
                </div>
            </section>
        </main>
    )
}

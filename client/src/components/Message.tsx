import { useEffect, useRef } from "react"
import { Message as MessageType } from "../redux/features/chat-slice"
import { useTypedSelector } from "../redux/store"


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

    return (
        <main>
            <section ref={!nextMsgTime ? messageRef : null} className={`flex items-center gap-2 ${isSentByLoggedInUser ? "justify-end" : "justify-start"} ${marginBottom}`}>
                {!isSentByLoggedInUser && (
                    <div className="h-10 w-10 flex-shrink-0">
                        <img src={sender?.image.startsWith("storage") ? `http://localhost:3000/${sender.image}` : sender?.image} alt="sender_image" className="h-full w-full rounded-full" />
                    </div>
                )}
                <div className="flex flex-col">
                    <p className={`${isSentByLoggedInUser ? "bg-pink-red text-white" : "bg-grayish text-blueish"} px-4 py-2 border-bottom-left max-w-[100%]`}>{content}</p>
                    {willShowTime && <small className="text-more-grayish text-right">{createdAt}</small>}
                </div>
            </section>
        </main>
    )
}

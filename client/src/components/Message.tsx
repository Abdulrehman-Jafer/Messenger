import { useEffect, useRef, } from "react"
import { Message as MessageType } from "../redux/features/chat-slice"
import { useAppDispatch, useTypedSelector } from "../redux/store"
import { fixImageUrl } from "../utils/misc"
import type { MenuProps } from 'antd';
import { Dropdown, message, } from 'antd';
import { useDeleteForMeMutation, useDeleteForEveyoneMutation } from "../redux/service/api";
import { deleteMessage } from "../redux/features/messages-slice";
import socket from "../socket-io/socket";


type stylingData = {
    nextMsgSenderId: string,
    nextMsgTime: string,
    receiverSocketId: string | undefined
}

type Props = Partial<MessageType> & stylingData



export default function Message({ _id, createdAt, belongsTo, content, sender, nextMsgSenderId, nextMsgTime, deletedForEveryone, status, receiverSocketId }: Props) {

    const LoggedInUser = useTypedSelector(selector => selector.userReducer)
    const dispatch = useAppDispatch()
    const isSentByLoggedInUser = (sender?._id == LoggedInUser._id)
    const marginBottom = sender?._id == nextMsgSenderId ? "mb-[0.8rem]" : "mb-[2.5rem]"
    const willShowTime = sender?._id !== nextMsgSenderId

    const messageRef = useRef<HTMLDivElement>(null);

    const [deleteForMe, { isLoading }] = useDeleteForMeMutation()
    const [deleteForEveryone, { isLoading: deleteEveryoneLoading }] = useDeleteForEveyoneMutation()

    useEffect(() => {
        if (messageRef.current) {
            messageRef.current.scrollIntoView({ behavior: "smooth" });
        }
    }, []);


    const deleteFoMeHandler = async () => {
        dispatch(deleteMessage({ chatspace_id: belongsTo, message_id: _id }))
        await deleteForMe({ message_id: _id, user_id: sender?._id })
    }

    const deleteForEveyoneHandler = async () => {
        dispatch(deleteMessage({ chatspace_id: belongsTo, message_id: _id, deletedForEveryone: true }))
        await deleteForEveryone({ message_id: _id }).then(() => {
            socket.emit("deleteMessageForEveryone", { receiverSocketId, chatspace_id: belongsTo, message_id: _id, deletedForEveryone: true })
        })

    }


    const items: MenuProps['items'] = isSentByLoggedInUser ? [
        {
            label: <button onClick={deleteFoMeHandler}>Delete for me</button>,
            key: '0',
        },
        {
            type: 'divider',
        },
        {
            label: <button onClick={deleteForEveyoneHandler}>Delete for everyone</button>,
            key: '1',
        },
    ] : [
        {
            label: <button onClick={deleteFoMeHandler}>Delete for me</button>,
            key: '0',
        },
    ]




    return (
        <main className="relative">
            <section ref={messageRef} className={`flex items-center gap-2 ${isSentByLoggedInUser ? "justify-end" : "justify-start"} ${marginBottom}`}>
                {!isSentByLoggedInUser && (
                    <div className="h-10 w-10 flex-shrink-0">
                        <img src={fixImageUrl(sender?.image!)} alt="sender_image" className="h-full w-full rounded-full" />
                    </div>
                )}
                <div className="flex flex-col relative">
                    <Dropdown menu={{ items }} trigger={deletedForEveryone ? [] : ["contextMenu"]}>
                        <p className={`${deletedForEveryone ?
                            "text-gray-500 italic bg-gray-300" :
                            isSentByLoggedInUser ? "bg-pink-red text-white" :
                                "bg-grayish text-blueish"} px-4 py-2 border-bottom-left max-w-[100%] cursor-default`
                        }>
                            {deletedForEveryone ? "This message was deleted" : content}
                        </p>
                    </Dropdown>
                    {willShowTime && <small className="text-more-grayish text-right">{createdAt}</small>}
                </div>
            </section>
        </main>
    )
}

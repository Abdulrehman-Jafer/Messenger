import { useEffect, useRef, useState } from "react"
import { Message as MessageType } from "../redux/features/chat-slice"
import { useAppDispatch, useTypedSelector } from "../redux/store"
import { fixImageUrl } from "../utils/misc"
import type { MenuProps } from 'antd';
import { Dropdown, message, } from 'antd';
import { useDeleteForMeMutation, useDeleteForEveyoneMutation } from "../redux/service/api";
import { deleteMessage } from "../redux/features/messages-slice";
import socket from "../socket-io/socket";
import loadingImage from "../assets/loading_video.jpg"


type stylingData = {
    nextMsgSenderId: string,
    nextMsgTime: string,
    receiverSocketId: string | undefined,
    contentType: string
}

type Props = Partial<MessageType> & stylingData



export default function Message({ _id, createdAt, belongsTo, content, sender, nextMsgSenderId, nextMsgTime, contentType, deletedForEveryone, status, receiverSocketId }: Props) {

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
            messageRef.current.scrollIntoView();
        }
        // Why can't just use scroll to bottom in parent Chatspace
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

    const render = () => {
        let toBeRender = <p className="italic">"could not load content"</p>
        if (contentType == "text") {
            toBeRender = (
                <p className={`${deletedForEveryone ?
                    "text-gray-500 italic bg-gray-300" :
                    isSentByLoggedInUser ? "bg-pink-red text-white" :
                        "bg-grayish text-blueish"} px-4 py-2 border-bottom-left max-w-[100%] cursor-default`
                }>
                    {deletedForEveryone ? "This message was deleted" : content}
                </p>)
        }

        if (contentType == "video") {
            toBeRender = (
                <div>
                    <video preload="none" poster={loadingImage} className={`chatVideoAspectRatio rounded-lg ${isSentByLoggedInUser && "float-right"}`} controls>
                        <source src={`http://localhost:3000${content}`} type="video/mp4" />
                    </video>
                </div>)
        }

        if (contentType == "image") {
            toBeRender = <img src={`http://localhost:3000${content}`} alt="contentImage" className={`chatMediaWidth rounded-lg ${isSentByLoggedInUser && "self-end"}`} />
        }

        if (contentType == "uploading") {
            toBeRender = <p className="italic">{content}</p>
        }
        return (
            <Dropdown menu={{ items }} trigger={deletedForEveryone ? [] : ["contextMenu"]}>
                {toBeRender}
            </Dropdown>
        )
    }

    return (
        <section ref={messageRef} className={`flex items-center gap-2 ${isSentByLoggedInUser ? "justify-end" : "justify-start"} ${marginBottom}`}>
            {!isSentByLoggedInUser && (
                <div className="h-10 w-10 flex-shrink-0">
                    <img src={fixImageUrl(sender?.image!)} alt="sender_image" className="h-full w-full rounded-full" />
                </div>
            )}
            <div className="flex flex-col">
                {render()}
                {willShowTime && <small className={`text-more-grayish ${isSentByLoggedInUser ? "!text-right pr-1" : "!text-left pl-1"} `}>{createdAt}</small>}
            </div>
        </section>
    )
}

import { IoIosArrowBack } from "react-icons/io"
import Message from "../components/Message"
import { useNavigate, useParams } from "react-router-dom"
import { useState } from "react"
// import { useGetSpecificChatQuery } from "../redux/service/api"
import { useAppDispatch, useTypedSelector } from "../redux/store"
import { getTimeWithAMPMFromDate } from "../utils/time"
import { AiOutlineSend } from "react-icons/ai"
import socket from "../socket-io/socket"
import { addMessagesInChatspace } from "../redux/features/messages-slice"


export default function Chat_space() {
    const navigate = useNavigate()
    const { chatspace_id } = useParams()
    const chatspaceMessages = useTypedSelector(selector => selector.messageReducer)
    const indexOfCurrent = chatspaceMessages.findIndex(m => m.chatspace_id == chatspace_id)
    const chatspace = useTypedSelector(selector => selector.chatReducer).find(c => c._id == chatspace_id)
    const User = useTypedSelector(selector => selector.userReducer)
    const [message, setMessage] = useState("")
    const dispatch = useAppDispatch()

    const messages = chatspaceMessages[indexOfCurrent]?.messages || []

    const sendMessage = (e: React.FormEvent) => {
        e.preventDefault()
        const randomId = crypto.randomUUID()

        const data = {
            belongsTo: chatspace?._id,
            content: message,
            sender: User,
            receiver: chatspace?.receiver.connected_to,
            createdAt: new Date().toString(),
            status: -1,
            deletedFor: [],
            _id: randomId
        }
        if (data.content) {
            console.log({ connected: socket.connected })
            socket.emit("send-message", data)
            dispatch(addMessagesInChatspace({ chatspace_id, newMessage: data }))
            setMessage("")
        } else {
            alert("No message")
        }
    }

    if (!chatspace) {
        return <h1>Not Exist</h1>
    }

    const image_src = chatspace?.receiver.connected_to.image?.startsWith("storage") ?
        `http://localhost:3000/${chatspace?.receiver.connected_to.image}`
        :
        chatspace?.receiver.connected_to.image
    return (
        <main className="flex flex-col">
            <section className="flex p-[1rem] justify-between items-center sticky top-0 z-10 backdrop-blur-3xl">
                <i className="text-[1.3rem] cursor-pointer" onClick={() => navigate("/chats")}><IoIosArrowBack /></i>
                <h2 className="text-[1.3rem]">{chatspace?.receiver.isSaved ? chatspace.receiver.contact.saved_as : chatspace?.receiver.connected_to._id}</h2>
                <div className="flex-shrink-0">
                    <img src={image_src} alt="contact_image" className="h-10 w-10 rounded-full" />
                </div>
            </section>
            <section className="flex flex-col p-[1rem] last-child-border-bottom-white chatspace-min-height">
                {messages.length > 0 ?
                    messages.map((m, i) => {
                        const currentMessageTime = getTimeWithAMPMFromDate(m.createdAt)
                        const nextMessageTime = messages[i + 1]?.createdAt
                        const stylingData = {
                            nextMsgSender: messages[i + 1]?.sender,
                            nextMsgTime: getTimeWithAMPMFromDate(nextMessageTime)
                        }
                        return (
                            <Message
                                createdAt={currentMessageTime}
                                content={m?.content}
                                sender={m?.sender}
                                receiver={m?.receiver}
                                status={m.status}
                                nextMsgSenderId={stylingData?.nextMsgSender?._id}
                                nextMsgTime={stylingData?.nextMsgTime}
                                _id={m._id}
                                belongsTo={m.belongsTo}
                                deletedForEveryone={m.deletedForEveryone}
                                receiverSocketId={chatspace.receiver.connected_to.socketId}
                                key={m?._id} />)
                    }) :
                    <h1 className="text-center text-grayish">No Messages to show</h1>
                }
            </section>
            <section className="sticky bottom-0">
                <div className="relative">
                    <form onSubmit={e => sendMessage(e)}>
                        <input type="text" className="border border-gray-400 outline-none w-full p-[1rem] bg-light-gray" placeholder="Type your message" value={message} onChange={e => setMessage(e.target.value)} />
                        <button type="submit" className="absolute text-3xl text-grayish hover:text-light-pink bottom-3 right-2" onClick={e => sendMessage(e)}><AiOutlineSend /></button>
                    </form>
                </div>
            </section>
        </main>
    )
}

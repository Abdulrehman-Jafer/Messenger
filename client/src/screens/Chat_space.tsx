import { IoIosArrowBack } from "react-icons/io"
import Message from "../components/Message"
import { useNavigate, useParams } from "react-router-dom"
import { useState, useRef, useEffect, ChangeEvent } from "react"
import { AiOutlinePicture } from "react-icons/ai"
import { useAppDispatch, useTypedSelector } from "../redux/store"
import { getTimeWithAMPMFromDate } from "../utils/time"
import { AiOutlineSend } from "react-icons/ai"
import socket from "../socket-io/socket"
import { addMessagesInChatspace } from "../redux/features/messages-slice"
import { Modal } from "antd"
import { fixImageUrl } from "../utils/misc"


export default function Chat_space() {
    const navigate = useNavigate()
    const { chatspace_id } = useParams()
    const chatspaceMessages = useTypedSelector(selector => selector.messageReducer)
    const indexOfCurrent = chatspaceMessages.findIndex(m => m.chatspace_id == chatspace_id)
    const chatspace = useTypedSelector(selector => selector.chatReducer).find(c => c._id == chatspace_id)
    const User = useTypedSelector(selector => selector.userReducer)
    const [message, setMessage] = useState("")
    const [selectedFile, setSelectedFile] = useState<File>()
    const [imagePreview, setImagePreview] = useState<any>("")
    const [videoPreview, setVideoPreview] = useState<any>("")
    const [showPreview, setShowPreview] = useState(false)
    const dispatch = useAppDispatch()
    const messages = chatspaceMessages[indexOfCurrent]?.messages || []
    const fileInputRef = useRef<HTMLInputElement>(null)


    useEffect(() => {
        const reader = new FileReader();
        if (!selectedFile) return;
        reader.readAsDataURL(selectedFile)
        reader.onload = (readerEvent) => {
            if (selectedFile?.type.includes("image")) {
                setImagePreview(readerEvent.target?.result)
                setShowPreview(true)
            }
            else if (selectedFile.type.includes("video")) {
                setVideoPreview(readerEvent.target?.result)
                setShowPreview(true)
            }
        }
    }, [selectedFile])

    const sendMessage = (e: React.FormEvent) => {
        e.preventDefault()
        const data = {
            belongsTo: chatspace?._id,
            content: message,
            sender: User,
            receiver: chatspace?.receiver.connected_to,
            createdAt: new Date().toString(),
            status: -1,
            deletedFor: [],
            _id: crypto.randomUUID()
        }
        if (!data.content) return;
        socket.emit("send-message", data)
        dispatch(addMessagesInChatspace({ chatspace_id, newMessage: data }))
        setMessage("")
    }

    const onSelectFileHandler = (e: ChangeEvent) => {
        const files = (e.target as HTMLInputElement).files
        if (!files) return;
        setSelectedFile(files[0])
    }

    const handleCancel = () => {
        setShowPreview(false)
        setImagePreview("")
        setVideoPreview("")
    }

    const handleOk = async () => {
        const newMessage = {
            belongsTo: chatspace?._id,
            contentType: imagePreview ? "image" : "video",
            content: "uploading",
            sender: User,
            receiver: chatspace?.receiver.connected_to,
            createdAt: new Date().toString(),
            status: -1,
            deletedFor: [],
            _id: crypto.randomUUID()
        }
        dispatch(addMessagesInChatspace({ chatspace_id, newMessage: { ...newMessage, contentType: "uploading", content: imagePreview ? "uploading image" : "uploading video" } }))
        socket.emit("sendFile", { chatspace_id, filename: selectedFile?.name, file: selectedFile, newMessage })
        handleCancel()
    }

    if (!chatspace) return <h1>404</h1>
    return (
        <main className="flex flex-col">
            <section className="flex p-[1rem] justify-between items-center sticky top-0 z-10 backdrop-blur-3xl">
                <i className="text-[1.3rem] cursor-pointer" onClick={() => navigate("/chats")}><IoIosArrowBack /></i>
                <div className="flex flex-col items-center">
                    <h2 className="text-[1.3rem]">{chatspace?.receiver.isSaved ? chatspace.receiver.contact.saved_as : chatspace?.receiver.connected_to.public_number}</h2>
                    <small className="text-pink-red">{chatspace.receiver.connected_to.lastLogin == 0 ? "online" : "offline"}</small>
                </div>
                <div className="flex-shrink-0">
                    <img src={fixImageUrl(chatspace.receiver.connected_to.image)} alt="contact_image" className="h-10 w-10 rounded-full" />
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
                                contentType={m.contentType}
                                key={m?._id} />)
                    }) :
                    <h1 className="text-center text-grayish">No Messages to show</h1>
                }
            </section>
            <section className="sticky bottom-0">
                <div className="relative">
                    <form onSubmit={e => sendMessage(e)}>
                        <input type="text" className="border border-gray-400 outline-none w-full p-[1rem] bg-light-gray" placeholder="Type your message" value={message} onChange={e => setMessage(e.target.value)} />
                        <input key={Math.random()} ref={fileInputRef} type="file" accept="image/*,video/*" className="hidden" onChange={(e) => onSelectFileHandler(e)} />
                        <i className="absolute text-3xl text-grayish hover:text-light-pink bottom-3 right-12" onClick={() => fileInputRef.current?.click()}><AiOutlinePicture /></i>
                        <button type="submit" className="absolute text-3xl text-grayish hover:text-light-pink bottom-3 right-2" onClick={e => sendMessage(e)}><AiOutlineSend /></button>
                    </form>
                </div>
            </section>
            <Modal title="Preview" open={showPreview} onOk={handleOk} onCancel={handleCancel} okButtonProps={{ style: { "background": "red" } }}>
                {imagePreview && <img src={imagePreview} alt="selectedImage" />}
                {videoPreview && (
                    <video muted={videoPreview!} width="750" height="500" controls >
                        <source src={videoPreview} type="video/mp4" />
                    </video>)}
            </Modal>
        </main>
    )
}

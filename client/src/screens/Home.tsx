import { BsSearch, BsChatSquareDots } from "react-icons/bs"
import { AiOutlinePlus } from "react-icons/ai"
import { CiSettings } from "react-icons/ci"
import { FiUsers } from "react-icons/fi"
import Recent_Chat from "../components/Recent_Chat"
import { useState } from "react"
import { useGetAllChatSpaceMessagesQuery, useGetChatsQuery, useGetContactsQuery } from "../redux/service/api"
import { useTypedSelector, useAppDispatch } from "../redux/store"
import { useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { setGlobalContacts } from "../redux/features/contact-slice"
import { toast } from "react-hot-toast"
import RecentContact from "../components/RecentContact"
import Create_Chat from "../modals/Create_Chat"
import { updateLastMessage, updateUserOfflineStatusInChatspace, updateUserOnlineStatusInChatspace } from "../redux/features/chat-slice"
import { initializeChatSpace } from "../redux/features/chat-slice"
import socket from "../socket-io/socket"
import { setUserSocketId } from "../redux/features/user-slice"
// import LogOut from "../components/LogOut"
import { getTimeWithAMPMFromDate } from "../utils/time"
import { BsThreeDotsVertical } from 'react-icons/bs';
import { addMessagesInChatspace, updateChatspaceMessage, setAllChatSpaceMessage } from "../redux/features/messages-slice"


export default function Home() {
    const [isModalOpen, setIsModalOpen] = useState(false)
    // const [isLogOutModalOpen, setIsLogOutModalOpen] = useState(false)
    const navigate = useNavigate()
    const User = useTypedSelector((selector) => selector.userReducer)
    const { isError, isFetching, isSuccess, isLoading, data } = useGetContactsQuery({ user_id: User._id, Authorization: User.userToken })
    const { isError: chatError, isLoading: chatLoading, data: chatData, isSuccess: chatSuccess } = useGetChatsQuery({ user_id: User._id, Authorization: User.userToken })
    const { isError: messageError, isLoading: messageLoading, data: messageData, isSuccess: messageSuccess } = useGetAllChatSpaceMessagesQuery({ user_id: User._id })
    const chats = useTypedSelector(selector => selector.chatReducer)
    const contacts = useTypedSelector(selector => selector.contactReducer)
    const dispatch = useAppDispatch()
    const [chatFilter, setChatFilter] = useState("")

    const filterChat = (e: React.ChangeEvent) => {
        setChatFilter((e.target as HTMLInputElement).value)
    }

    useEffect(() => {
        if (isSuccess && (!isLoading && !isFetching)) {
            dispatch(setGlobalContacts(data.contacts))
        }
        isError && toast.error("Failed to Load Contacts")
    }, [isLoading, isFetching])

    useEffect(() => {
        let toastId = "";
        if (chatSuccess && !chatLoading) {
            toastId = toast.success("Loaded Chat Successfully")
            console.log({ chatData })
            dispatch(initializeChatSpace(chatData.result.chatspaces))
        }
        if (!chatLoading && chatError) {
            toastId = toast.error("Failed to Fetch Chat")
        }
        return () => {
            toast.dismiss(toastId)
        }
    }, [chatLoading])

    useEffect(() => {
        let toastId: any;
        if (messageLoading) {
            toastId = toast.loading("Fetching Messages")
        }
        if (!messageLoading && (messageSuccess || messageError)) {
            toast.dismiss(toastId)
            if (isSuccess) {
                toast.success("Fetched all messages")
                dispatch(setAllChatSpaceMessage((messageData as any).result.allChatspaceMessages))
            }
        }

        return () => {
            toast.dismiss(toastId)
        }
    }, [messageLoading])

    useEffect(() => {
        socket.emit("set-socketId", User)
        dispatch(setUserSocketId(socket.id))
    }, [])



    const create_new_chat = () => {
        setIsModalOpen(true)
    }

    const filteredChat = chats.filter(c => {
        if (c?.receiver.isSaved) {
            return c?.receiver.contact.saved_as.toLocaleLowerCase().startsWith(chatFilter.toLocaleLowerCase())
        } else {
            return c?.receiver.connected_to._id.toLocaleLowerCase.toString().startsWith(chatFilter.toLocaleLowerCase())
        }
    })

    return (
        <>
            <main className="bg-pink-red">
                <div className="bg-white bottom-boder-radius">
                    <article className="bg-light-gray p-[0.5rem] pb-[2rem] flex flex-col gap-[1.5rem] bottom-boder-radius sticky top-0">
                        <section className="flex justify-between items-center">
                            <h3 className="text-pink-red text-2xl font-semibold">
                                Messages
                            </h3>
                            <div>
                                <i className="text-2xl"><BsThreeDotsVertical /></i>
                            </div>
                        </section>
                        <section className="flex gap-8 overflow-x-auto">
                            <i className=" text-pink-red text-2xl bg-blue-gray-100 hover:bg-blue-gray-200 rounded-full p-2 cursor-pointer" onClick={create_new_chat}>
                                <AiOutlinePlus />
                            </i>
                            {isLoading ? <p>Loading Contact...</p> : <div className="flex gap-6 min-w-[200px]  flex-shrink-0">
                                {contacts.map(c => {
                                    return (
                                        <RecentContact id={c.contact._id!} key={c.contact._id!} img={c.contact.image || "ass"} name={c.saved_as} />
                                    )
                                })}
                            </div>
                            }
                        </section>
                        <section>
                            <div className="relative">
                                <i className="absolute left-2 top-[1.1rem] text-gray-400 "><BsSearch /></i>
                                <input type="text" name="contact_search" placeholder="Search" value={chatFilter} onChange={e => filterChat(e)} className="border pinkBorder indent-[0.75rem] w-full p-[0.9rem] rounded-[0.75rem] outline-none" />
                            </div>
                        </section>
                    </article>
                    <article className="flex flex-col chatList-min-height">
                        {chatLoading ?
                            <p>Loading Chats</p> : filteredChat.length > 0 ? filteredChat.map(c => {
                                // console.log({ c })
                                return (
                                    <Recent_Chat
                                        lastLogin={c.receiver.connected_to.lastLogin}
                                        active_status={c.lastMessage && getTimeWithAMPMFromDate(c?.lastMessage.createdAt) || ""}
                                        last_message={c.lastMessage && c?.lastMessage?.content || "No recent Message"}
                                        name={c.receiver.isSaved ? c.receiver.contact.saved_as : c.receiver.connected_to._id}
                                        user_image={c.receiver.connected_to.image}
                                        chatspace_id={c._id}
                                        key={c._id}
                                    />
                                )
                            }) :
                                <div className="flex flex-col items-center justify-center mt-[2rem]">
                                    {chatFilter ?
                                        <p>No Chat Found</p> :
                                        <>
                                            <p>You dont have any chats</p>
                                            <i className=" text-pink-red text-2xl bg-blue-gray-100 hover:bg-blue-gray-200 rounded-full p-2 cursor-pointer" onClick={create_new_chat}>
                                                <AiOutlinePlus />
                                            </i>
                                        </>
                                    }
                                </div>
                        }
                    </article>
                </div>
                <article className="flex justify-between bg-pink-red p-[1rem] sticky bottom-0">
                    <i className="text-2xl font-extrabold text-white " onClick={() => navigate("/chats")}> <BsChatSquareDots /> </i>
                    <i className="text-2xl font-extrabold text-more-grayish " onClick={() => navigate("/contacts")}> <FiUsers /> </i>
                    <i className="text-2xl font-extrabold text-more-grayish "> <CiSettings /> </i>
                </article>
            </main>
            <Create_Chat isModalOpen={isModalOpen} setIsModalOpen={setIsModalOpen} />
        </>
    )
}

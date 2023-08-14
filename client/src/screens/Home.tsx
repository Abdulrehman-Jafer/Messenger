import { BsSearch } from "react-icons/bs"
import { AiOutlinePlus } from "react-icons/ai"
import Recent_Chat from "../components/Recent_Chat"
import { useState } from "react"
import { useGetAllChatSpaceMessagesQuery, useGetChatspacesQuery, useGetContactsQuery } from "../redux/service/api"
import { useTypedSelector, useAppDispatch } from "../redux/store"
import { useEffect } from "react"
import { setGlobalContacts } from "../redux/features/contact-slice"
import { toast } from "react-hot-toast"
import RecentContact from "../components/RecentContact"
import Create_Chat from "../modals/Create_Chat"
import { initializeChatSpace } from "../redux/features/chat-slice"
import socket from "../socket-io/socket"
import { setUserSocketId } from "../redux/features/user-slice"
import { getTimeWithAMPMFromDate } from "../utils/time"
import { BsThreeDotsVertical } from 'react-icons/bs';
import { setAllChatSpaceMessage } from "../redux/features/messages-slice"
import Navbar from "../components/Navbar"


export default function Home() {
    const [isChatModalOpen, setIsChatModalOpen] = useState(false)
    const User = useTypedSelector((selector) => selector.userReducer)
    const { isError, isSuccess, isLoading, data } = useGetContactsQuery({ user_id: User._id, Authorization: User.userToken })
    const { isLoading: chatLoading, data: chatData, isSuccess: chatSuccess } = useGetChatspacesQuery({ user_id: User._id, Authorization: User.userToken })
    const { isLoading: messageLoading, data: messageData, isSuccess: messageSuccess } = useGetAllChatSpaceMessagesQuery({ user_id: User._id })
    const chats = useTypedSelector(selector => selector.chatReducer)
    const contacts = useTypedSelector(selector => selector.contactReducer)
    const chatspaceMessages = useTypedSelector(selector => selector.messageReducer)
    const dispatch = useAppDispatch()
    const [chatFilter, setChatFilter] = useState("")

    const filterChat = (e: React.ChangeEvent) => {
        setChatFilter((e.target as HTMLInputElement).value)
    }


    useEffect(() => {
        socket.emit("set-socketId", User)
    }, [])


    useEffect(() => {
        if (isSuccess && !isLoading) {
            dispatch(setGlobalContacts(data.contacts))
        }
        isError && toast.error("Failed to Load Contacts")
    }, [isLoading])

    useEffect(() => {
        if (chatSuccess && !chatLoading) {
            dispatch(initializeChatSpace(chatData.result.chatspaces))
        }
    }, [chatLoading])

    useEffect(() => {
        if (!messageLoading && messageSuccess) {
            toast.success("Fetched all messages")
            dispatch(setAllChatSpaceMessage((messageData as any).result.allChatspaceMessages))
        }
    }, [messageLoading])


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
                            <i className=" text-pink-red text-2xl bg-blue-gray-100 hover:bg-blue-gray-200 rounded-full p-2 cursor-pointer" onClick={() => setIsChatModalOpen(true)}>
                                <AiOutlinePlus />
                            </i>
                            {isLoading ? <p>Loading Contact...</p> : <div className="flex gap-6 min-w-[200px] flex-shrink-0 items-center">
                                {contacts.map(c => {
                                    return (
                                        <RecentContact id={c.contact._id!} key={c.contact._id!} img={c.contact.image || "ass"} name={c.saved_as} lastLogin={c.contact.lastLogin} />
                                    )
                                })}
                                {contacts.length == 0 && <p className="text-grayish">No saved contact found!</p>}
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
                                const indexOfCurrent = chatspaceMessages.findIndex(m => m.chatspace_id == c._id)
                                const currentChat = chatspaceMessages[indexOfCurrent]
                                const lastMessage = currentChat?.messages[currentChat.messages.length - 1]
                                return (
                                    <Recent_Chat
                                        lastLogin={c.receiver.connected_to.lastLogin}
                                        active_status={getTimeWithAMPMFromDate(lastMessage?.createdAt)}
                                        last_message={lastMessage?.deletedForEveryone ? "This message was deleted" : (lastMessage?.content || "No recent Message")}
                                        name={c.receiver.isSaved ? c.receiver.contact.saved_as : c.receiver.connected_to.public_number}
                                        user_image={c.receiver.connected_to.image}
                                        chatspace_id={c._id}
                                        key={c._id}
                                        isSaved={c.receiver.isSaved}
                                    />
                                )
                            }) :
                                <div className="flex flex-col items-center justify-center mt-[2rem]">
                                    {chatFilter ?
                                        <p>No Chat Found</p> :
                                        <>
                                            <p>You dont have any chats</p>
                                            <i className=" text-pink-red text-2xl bg-blue-gray-100 hover:bg-blue-gray-200 rounded-full p-2 cursor-pointer" onClick={() => setIsChatModalOpen(true)}>
                                                <AiOutlinePlus />
                                            </i>
                                        </>
                                    }
                                </div>
                        }
                    </article>
                </div>
                <Navbar />
            </main>
            <Create_Chat isModalOpen={isChatModalOpen} setIsModalOpen={setIsChatModalOpen} />
        </>
    )
}

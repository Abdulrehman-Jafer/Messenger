import { BsSearch } from "react-icons/bs"
import { AiOutlinePlus } from "react-icons/ai"
import Recent_Chat from "../components/Recent_Chat"
import { useState } from "react"
import { useGetAllChatSpaceMessagesQuery, useGetChatspacesQuery, useGetContactsQuery } from "../redux/service/api"
import { useTypedSelector, useAppDispatch } from "../redux/store"
import { useEffect } from "react"
import { initializeContacts } from "../redux/features/contact-slice"
import RecentContact from "../components/RecentContact"
import Create_Chat from "../modals/Create_Chat"
import { initializeChatSpace } from "../redux/features/chat-slice"
import socket from "../socket-io/socket"
import { getTimeWithAMPMFromDate } from "../utils/time"
import { BsThreeDotsVertical } from 'react-icons/bs';
import { initializeChatspaceMessages } from "../redux/features/messages-slice"
import Navbar from "../components/Navbar"
import no_data_found_image from "../assets/no_data_found.png"
import LoadingAnimation from "../animations/LoadingAnimation"
import { Checkbox } from "antd"
import useDispatchOnLoad from "../hooks/useDispatchOnLoad"


export default function Home() {
    const [isChatModalOpen, setIsChatModalOpen] = useState(false)
    const User = useTypedSelector((selector) => selector.userReducer)
    const contactReducer = useTypedSelector(selector => selector.contactReducer)
    const chatReducer = useTypedSelector(selector => selector.chatReducer)
    const messageReducer = useTypedSelector(selector => selector.messageReducer)
    const [chatFilter, setChatFilter] = useState("")
    const [showArchive, setShowArchive] = useState(false)

    useEffect(() => {
        socket.emit("set-socketId", User)
    }, [])

    const [contactsLoading] = useDispatchOnLoad(useGetContactsQuery, contactReducer.isInitialized, { user_id: User._id, Authorization: User.userToken }, initializeContacts, "")
    const [chatLoading] = useDispatchOnLoad(useGetChatspacesQuery, chatReducer.isInitialized, { user_id: User._id, Authorization: User.userToken }, initializeChatSpace, "")
    const [messageLoading] = useDispatchOnLoad(useGetAllChatSpaceMessagesQuery, messageReducer.isInitialized, { user_id: User._id }, initializeChatspaceMessages, "Fetched message successfully")


    const filteredChat = chatReducer.chats.filter(c => {
        if (c.isArchived && !showArchive) return;
        const indexOfCurrent = messageReducer.chatspacesMessages.findIndex(m => m.chatspace_id == c._id)
        const currentChat = messageReducer.chatspacesMessages[indexOfCurrent]
        if (currentChat?.messages?.length == 0) return;
        if (c?.receiver.isSaved) {
            return c?.receiver.contact.saved_as.toLocaleLowerCase().startsWith(chatFilter.toLocaleLowerCase())
        } else {
            return c?.receiver.connected_to._id.toLocaleLowerCase.toString().startsWith(chatFilter.toLocaleLowerCase())
        }
    })

    return (
        <>
            <section className="bg-pink-red">
                <div className="bg-white bottom-boder-radius">
                    <section className="bg-light-gray p-[0.5rem] pb-[2rem] flex flex-col gap-[1.5rem] bottom-boder-radius sticky top-0">
                        <div className="flex justify-between items-center">
                            <h3 className="text-pink-red text-2xl font-semibold">
                                Messages
                            </h3>
                            <i className="text-2xl flex-shrink-0"><BsThreeDotsVertical /></i>
                        </div>
                        <div className="flex gap-8 overflow-x-auto">
                            <i className=" text-pink-red text-2xl bg-blue-gray-100 hover:bg-blue-gray-200 rounded-full p-2 cursor-pointer" onClick={() => setIsChatModalOpen(true)} tabIndex={0}>
                                <AiOutlinePlus />
                            </i>
                            {contactsLoading ? <p>Loading Contact...</p> : <div className="flex gap-6 min-w-[200px] flex-shrink-0 items-center">
                                {contactReducer.contacts.map(c => {
                                    return (
                                        <RecentContact id={c.contact._id!} key={c.contact._id!} img={c.contact.image || "ass"} name={c.saved_as} lastLogin={c.contact.lastLogin} />
                                    )
                                })}
                                {contactReducer.contacts.length == 0 && <p className="text-grayish">No saved contact found!</p>}
                            </div>
                            }
                        </div>
                        <div>
                            <div className="relative">
                                <i className="absolute left-2 top-[1.1rem] text-gray-400 "><BsSearch /></i>
                                <input tabIndex={0} type="text" name="contact_search" placeholder="Search" value={chatFilter} onChange={e => setChatFilter((e.target as HTMLInputElement).value)} className="border inputBorder indent-[0.75rem] w-full p-[0.9rem] rounded-md outline-none" />
                            </div>
                        </div>
                        <Checkbox tabIndex={0} onChange={(e) => setShowArchive(e.target.checked)} className="font-[500]">Show archived chats</Checkbox>
                    </section>
                    <section className="flex flex-col chatList-min-height">
                        {(chatLoading || messageLoading) ?
                            <div className="chatList-min-height flex flex-col justify-center items-center">
                                <LoadingAnimation />
                                <small>Initializing chats</small>
                            </div>
                            :
                            filteredChat.length > 0 ? filteredChat.map(c => {
                                const indexOfCurrent = messageReducer.chatspacesMessages.findIndex(m => m.chatspace_id == c._id)
                                const currentChat = messageReducer.chatspacesMessages[indexOfCurrent]
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
                                        isTyping={c.receiver.connected_to.isTyping}
                                        isSaved={c.receiver.isSaved}
                                        isArchived={c.isArchived}
                                        connected_to_public_number={c.receiver.connected_to.public_number}
                                        user_id={User._id} />)
                            }) :
                                <div className="flex flex-col items-center justify-center chatList-min-height">
                                    {chatFilter ?
                                        <p className="text-3xl font-sans ADLaMFont">No Chat Found!</p>
                                        :
                                        <img src={no_data_found_image} alt={no_data_found_image} className="min-w-[250px] flex-shrink-0" />
                                    }
                                </div>
                        }
                    </section>
                </div>
                <Navbar />
            </section>
            <Create_Chat isModalOpen={isChatModalOpen} setIsModalOpen={setIsChatModalOpen} />
        </>
    )
}
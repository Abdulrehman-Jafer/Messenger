import { BsThreeDotsVertical, BsSearch, BsChatSquareDots } from "react-icons/bs"
import { AiOutlinePlus } from "react-icons/ai"
import { CiSettings } from "react-icons/ci"
import { FiUsers } from "react-icons/fi"
import Recent_Chat from "../components/Recent_Chat"
import { useState } from "react"
import { useGetChatsQuery, useGetContactsQuery } from "../redux/service/api"
import { useTypedSelector, useAppDispatch } from "../redux/store"
import { useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { setGlobalContacts } from "../redux/features/contact-slice"
import { toast } from "react-hot-toast"
import RecentContact from "../components/RecentContact"
import Create_Chat from "../modals/Create_Chat"
import { getLastItem } from "../utils/misc"
import { ChatSpace } from "../redux/features/chat-slice"
import { initializeChatSpace } from "../redux/features/chat-slice"

export default function Home() {
    const [isModalOpen, setIsModalOpen] = useState(false)
    const navigate = useNavigate()
    const User = useTypedSelector((selector) => selector.userReducer)
    const { isError, isFetching, isSuccess, isLoading, data } = useGetContactsQuery({ user_id: User._id, Authorization: User.userToken })
    const { isError: chatError, isLoading: chatLoading, data: chatData, isSuccess: chatSuccess } = useGetChatsQuery({ user_id: User._id, Authorization: User.userToken })
    const [chats, setChats] = useState<ChatSpace[]>([])
    const contacts = useTypedSelector(selector => selector.contactReducer)
    const dispatch = useAppDispatch()

    useEffect(() => {
        if (isSuccess && !isLoading && !isFetching) {
            dispatch(setGlobalContacts(data.contacts))
        }
        isError && toast.error("Failed to Load Contacts")
    }, [isLoading || isFetching])


    useEffect(() => {
        if (chatSuccess && !isLoading) {
            toast.success("Loaded Chat Successfully")
            setChats(chatData.result.chatspaces)
            dispatch(initializeChatSpace(chatData.result.chatspaces))
        }
        if (!isLoading && chatError) {
            toast.error("Failed to Fetch Chat")
        }
    }, [chatLoading])

    const create_new_chat = () => {
        setIsModalOpen(true)
    }
    return (
        <>
            <main className="bg-pink-red">
                <div className="bg-white bottom-boder-radius">
                    <article className="bg-light-gray p-[0.5rem] pb-[2rem] flex flex-col gap-[1.5rem] bottom-boder-radius sticky top-0">
                        <section className="flex justify-between">
                            <h3 className="text-pink-red text-2xl">
                                Messages
                            </h3>
                            <i className="text-pink-red text-2xl">
                                <BsThreeDotsVertical />
                            </i>
                        </section>
                        <section className="flex gap-8 overflow-x-scroll">
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
                                <input type="text" name="contact_search" placeholder="Search" className="border pinkBorder indent-[0.75rem] w-full p-[0.9rem] rounded-[0.75rem] outline-none" />
                            </div>
                        </section>
                    </article>
                    <article className="flex flex-col last-child-border-bottom-white chatList-min-height">
                        {(chats && chats.length) > 0 ? chats.map(c => {
                            return <Recent_Chat
                                active_status={"2:34pm"}
                                last_message={getLastItem(c.messages) || "No recent Message"}
                                name={c.receiver.isSaved ? c.receiver.contact.saved_as : c.receiver.connected_to._id}
                                user_image={c.receiver.connected_to.image}
                                chatspace_id={c._id}
                                key={c._id}
                            />
                        }) :
                            <div className="flex flex-col items-center justify-center mt-[2rem]">
                                <p>You dont have any chats</p>
                                <i className=" text-pink-red text-2xl bg-blue-gray-100 hover:bg-blue-gray-200 rounded-full p-2 cursor-pointer" onClick={create_new_chat}>
                                    <AiOutlinePlus />
                                </i>
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

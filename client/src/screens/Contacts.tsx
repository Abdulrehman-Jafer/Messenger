import { useTypedSelector, useAppDispatch } from "../redux/store"
import { useEffect } from "react"
import { setGlobalContacts } from "../redux/features/contact-slice"
import { toast } from "react-hot-toast"
// import { AiOutlineSearch } from "react-icons/ai"
import { CiSettings } from "react-icons/ci"
import { BsChatSquareDots, BsSearch } from "react-icons/bs"
import { FiUsers } from "react-icons/fi"
import { useNavigate } from "react-router-dom"
import { useGetContactsQuery } from "../redux/service/api"
import Contact from "../components/Contact"
import { AiOutlinePlus } from "react-icons/ai"
import Add_Contact from "../modals/Add_Contact"
import { useState } from "react"
export default function Contacts() {
    const [isModalOpen, setIsModalOpen] = useState(false)
    const User = useTypedSelector((selector) => selector.userReducer)
    const navigate = useNavigate()
    const { isError, isFetching, isSuccess, isLoading, data } = useGetContactsQuery({ user_id: User._id, Authorization: User.userToken })
    const contacts = useTypedSelector(selector => selector.contactReducer)
    const dispatch = useAppDispatch()
    const add_new_Contact = () => {
        setIsModalOpen(true)
    }
    useEffect(() => {
        if (isSuccess && !isLoading && !isFetching) {
            dispatch(setGlobalContacts(data.contacts))
        }
        isError && toast.error("Failed to Load Contacts")
    }, [isLoading || isFetching])
    return (
        <>
            <section className="flex flex-col gap-2">
                <div className="sticky top-0 z-10 backdrop-blur-3xl">
                    <h3 className="text-pink-red text-2xl font-semibold p-2">
                        Contacts
                    </h3>
                    <div className="flex justify-between p-[1rem] items-center">
                        <p>Add new Contact</p>
                        <i className=" text-pink-red text-2xl bg-blue-gray-100 hover:bg-blue-gray-200 rounded-full p-2 cursor-pointer" onClick={add_new_Contact}>
                            <AiOutlinePlus />
                        </i>
                    </div>
                    <div className="relative">
                        <i className="absolute left-2 top-[1.1rem] text-gray-400 "><BsSearch /></i>
                        <input type="text" name="contact_search" placeholder="Search" className="border pinkBorder indent-[0.75rem] w-full p-[0.9rem] rounded-[0.75rem] outline-none" />
                    </div>
                    <h1 className="p-3 text-center">List of the all Contacts</h1>
                </div>
                <div className=" flex flex-col gap-4 contacts-min-height">
                    {contacts.map((c) => {
                        return <Contact contact={c.contact} saved_as={c.saved_as} key={c._id} _id={c._id} />
                    })}
                </div>
                <div className="flex justify-between bg-pink-red p-[1rem] sticky bottom-0">
                    <i className="text-2xl font-extrabold text-more-grayish  " onClick={() => navigate("/chats")}> <BsChatSquareDots /> </i>
                    <i className="text-2xl font-extrabold text-white  " onClick={() => navigate("/contacts")}> <FiUsers /> </i>
                    <i className="text-2xl font-extrabold text-more-grayish "> <CiSettings /> </i>
                </div>
            </section>
            <Add_Contact isModalOpen={isModalOpen} setIsModalOpen={setIsModalOpen} user_id={User._id} />
        </>
    )
}

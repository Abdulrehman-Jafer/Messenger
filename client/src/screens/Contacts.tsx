import { useTypedSelector } from "../redux/store"
import { initializeContacts } from "../redux/features/contact-slice"
import { BsSearch } from "react-icons/bs"
import { useGetContactsQuery } from "../redux/service/api"
import Contact from "../components/Contact"
import { AiOutlinePlus } from "react-icons/ai"
import Add_Contact from "../modals/Add_Contact"
import { useState } from "react"
import Navbar from "../components/Navbar"
import useDispatchOnLoad from "../hooks/useDispatchOnLoad"

export default function Contacts() {
    const [isModalOpen, setIsModalOpen] = useState(false)
    const User = useTypedSelector((selector) => selector.userReducer)
    const contactReducer = useTypedSelector(selector => selector.contactReducer)
    const [contactsLoading] = useDispatchOnLoad(useGetContactsQuery, contactReducer.isInitialized, { user_id: User._id, Authorization: User.userToken }, initializeContacts, "")
    return (
        <>
            <section className="flex flex-col gap-2">
                <div className="sticky top-0 z-10 backdrop-blur-3xl">
                    <h3 className="text-pink-red text-2xl font-semibold p-2">
                        Contacts
                    </h3>
                    <div className="flex justify-between p-[1rem] items-center">
                        <p>Add new Contact</p>
                        <i className=" text-pink-red text-2xl bg-blue-gray-100 hover:bg-blue-gray-200 rounded-full p-2 cursor-pointer" onClick={() => setIsModalOpen(true)}>
                            <AiOutlinePlus />
                        </i>
                    </div>
                    <div className="relative">
                        <i className="absolute left-2 top-[1.1rem] text-gray-400 "><BsSearch /></i>
                        <input type="text" name="contact_search" placeholder="Search" className="border inputBorder indent-[0.75rem] w-full p-[0.9rem] rounded-md outline-none" />
                    </div>
                    <h1 className="p-3 text-center">List of the all Contacts</h1>
                </div>
                <div className=" flex flex-col gap-4 contacts-min-height">
                    {contactReducer.contacts.map((c) => {
                        return <Contact contact={c.contact} saved_as={c.saved_as} key={c._id} _id={c._id} />
                    })}
                </div>
                <Navbar />
            </section>
            <Add_Contact isModalOpen={isModalOpen} setIsModalOpen={setIsModalOpen} user_id={User._id} />
        </>
    )
}

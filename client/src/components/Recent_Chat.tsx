import { useNavigate } from "react-router-dom"
import { GoDotFill } from "react-icons/go"
import { fixImageUrl } from "../utils/misc"
import { useState } from "react"
import Add_Contact from "../modals/Add_Contact"
import { useTypedSelector } from "../redux/store"
import { Dropdown, MenuProps } from "antd"

type Recent_Chat_Props = {
    name: string,
    last_message: string,
    active_status: string,
    user_image: string,
    chatspace_id: string,
    lastLogin: number,
    isSaved: boolean
}

export default function Recent_Chat(props: Recent_Chat_Props) {
    const navigate = useNavigate()
    const [showContactModal, setShowContactModal] = useState(false)
    const [isDropDownOpen, setIsDropDownOpen] = useState(false)
    const User = useTypedSelector(selector => selector.userReducer)

    const items: MenuProps['items'] = [
        {
            label: <button >Add to archive</button>,
            key: '0',
        },
        {
            label: <button >Delete the chatspace</button>,
            key: '1',
        },
        {
            label: <button >Blacklist the user</button>,
            key: '2',
        },
    ]
    return (
        <>
            <Dropdown menu={{ items }} trigger={["contextMenu"]} onOpenChange={(isopen) => setIsDropDownOpen(isopen)}>
                <section className={`flex justify-between items-center gap-4 p-[1rem] hover:bg-pink-red cursor-default ${isDropDownOpen && "bg-pink-red"}`} onClick={() => navigate(`/chats/${props.chatspace_id}`)}>
                    <div className="relative">
                        <img src={fixImageUrl(props.user_image)} alt="contact_image" className="h-10 w-10 rounded-full" />
                        {props.lastLogin == 0 && (
                            <i className="text-pink-red absolute right-[0rem] bottom-[0rem] backdrop-blur-sm rounded-full">
                                <GoDotFill />
                            </i>
                        )}
                    </div>
                    <div className="flex justify-between flex-1">
                        <div className="flex flex-col">
                            <h3 className="text-[1.2rem] maxCharacter text-gray-800">{props.name}</h3>
                            <small className="text-grayish text-style">{props.last_message}</small>
                        </div>
                        <div className="flex flex-col">
                            {!props.isSaved && <button className="text-gray-400 underline italic pb-1" onClick={(e) => { e.stopPropagation(); setShowContactModal(true) }}>Add to the contacts</button>}
                            {props.isSaved && <p className="invisible pb-1">Dom</p>}
                            <small className={`text-grayish`}>{props.active_status}</small>
                        </div>
                    </div>
                </section>
            </Dropdown>
            <Add_Contact isModalOpen={showContactModal} setIsModalOpen={setShowContactModal} user_id={User._id} providedPublicNumber={props.name} />
        </>
    )
}

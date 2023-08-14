import { useNavigate } from "react-router-dom"
import { GoDotFill } from "react-icons/go"
import { fixImageUrl } from "../utils/misc"
import { useState } from "react"
import Add_Contact from "../modals/Add_Contact"
import { useTypedSelector } from "../redux/store"
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
    const image_src = fixImageUrl(props.user_image)
    const [showContactModal, setShowContactModal] = useState(false)
    const User = useTypedSelector(selector => selector.userReducer)
    return (
        <>
            <main>
                <article className="flex justify-between items-center gap-4 p-[1rem] hover:bg-pink-red cursor-default" onClick={() => navigate(`/chats/${props.chatspace_id}`)}>
                    <section className="relative">
                        <img src={image_src} alt="contact_image" className="h-10 w-10 rounded-full" />
                        {props.lastLogin == 0 && (
                            <i className="text-pink-red absolute right-[0rem] bottom-[0rem] backdrop-blur-sm rounded-full">
                                <GoDotFill />
                            </i>
                        )}
                    </section>
                    <section className="flex justify-between flex-1">
                        <div className="flex flex-col">
                            <h3 className="text-[1.2rem] maxCharacter text-gray-800">{props.name}</h3>
                            <small className="text-grayish text-style">{props.last_message}</small>
                        </div>
                        <div className="flex flex-col">
                            {!props.isSaved && <button className="text-gray-400 underline italic pb-1" onClick={(e) => { e.stopPropagation(); setShowContactModal(true) }}>Add to the contacts</button>}
                            {props.isSaved && <p className="invisible pb-1">Dom</p>}
                            <small className={`text-grayish`}>{props.active_status}</small>
                        </div>
                    </section>
                </article>
            </main>
            <Add_Contact isModalOpen={showContactModal} setIsModalOpen={setShowContactModal} user_id={User._id} providedPublicNumber={props.name} />
        </>
    )
}

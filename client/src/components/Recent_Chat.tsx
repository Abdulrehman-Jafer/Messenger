import { useNavigate } from "react-router-dom"
import { GoDotFill } from "react-icons/go"
import { fixImageUrl } from "../utils/misc"
type Recent_Chat_Props = {
    name: string,
    last_message: string,
    active_status: string,
    user_image: string,
    chatspace_id: string,
    lastLogin: number
}

export default function Recent_Chat(props: Recent_Chat_Props) {
    const navigate = useNavigate()
    const image_src = fixImageUrl(props.user_image)
    return (
        <main>
            <article className="flex justify-between items-center gap-4 p-[1rem] hover:bg-pink-red cursor-pointer" onClick={() => navigate(`/chats/${props.chatspace_id}`)}>
                <section className="relative">
                    <img src={image_src} alt="contact_image" className="h-10 w-10 rounded-full" />
                    {props.lastLogin == 0 && (
                        <i className="text-pink-red absolute right-[0rem] bottom-[0rem] backdrop-blur-sm rounded-full">
                            <GoDotFill />
                        </i>
                    )}
                </section>
                <section className="flex flex-col flex-1">
                    <div className="flex items-center justify-between">
                        <h3 className="text-[1.2rem] maxCharacter">{props.name}</h3>
                        <small className="text-grayish">{props.active_status}</small>
                    </div>
                    <small className="text-grayish text-style">{props.last_message}</small>
                </section>
            </article>
        </main>
    )
}

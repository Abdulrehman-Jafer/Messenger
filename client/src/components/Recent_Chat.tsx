import { useNavigate } from "react-router-dom"

type Recent_Chat_Props = {
    name: string,
    last_message: string,
    active_status: string,
    user_image: string
}

export default function Recent_Chat(props: Recent_Chat_Props) {
    const navigate = useNavigate()
    return (
        <main>
            <article className="flex justify-between items-center gap-4 p-[1rem] hover:bg-pink-red cursor-pointer" onClick={() => navigate(`/chats/${props.name}`)}>
                <section>
                    <img src={props.user_image} alt="contact_image" className="h-10 w-10 rounded-full" />
                </section>
                <section className="flex flex-col flex-1">
                    <div className="flex items-center justify-between">
                        <h3 className="text-[1.2rem]">{props.name}</h3>
                        <small className="text-grayish">{props.active_status}</small>
                    </div>
                    <small className="text-grayish text-style">{props.last_message}</small>
                </section>
            </article>
        </main>
    )
}

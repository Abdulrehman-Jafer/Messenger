import { useNavigate } from "react-router-dom"
import { User } from "../redux/features/user-slice"
type contactProps = {
    _id: string,
    contact: Partial<User>,
    saved_as: string,
}

export default function Contact({ contact, saved_as, _id }: contactProps) {
    const image_src = (contact.image)!.startsWith("storage") ? `http://localhost:3000/${(contact.image)!}` : contact.image
    const navigate = useNavigate()


    return (
        <section onClick={() => navigate(`/contacts/${_id}`)} className="cursor-pointer hover:bg-pink-red hover:text-white">
            <div className="flex gap-5 items-center p-2 border">
                <img src={image_src} alt="cotact_image" className="flex-shrink-0 h-10 w-10 rounded-full " />
                <p className="flex-1">{saved_as}</p>
            </div>
        </section>
    )
}

import { GoDotFill } from "react-icons/go"
import { fixImageUrl } from "../utils/misc"
import dummyUserImage from "../assets/blocked_user.png"

type contactProps = {
    name: string,
    img: string | undefined,
    id: string,
    lastLogin: number | undefined
}

export default function RecentContact({ name, img, id, lastLogin }: contactProps) {
    return (
        <section className="relative">
            <img src={img ? fixImageUrl(img) : dummyUserImage} alt="contact_image" className="h-10 w-10 rounded-full flex-shrink-0" />
            {lastLogin == 0 && (
                <i className="text-pink-red absolute right-[0rem] bottom-[0rem] backdrop-blur-sm rounded-full">
                    <GoDotFill />
                </i>
            )}
        </section>
    )
}

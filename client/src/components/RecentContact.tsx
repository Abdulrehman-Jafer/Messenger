import { GoDotFill } from "react-icons/go"
import { fixImageUrl } from "../utils/misc"
import dummyUserImage from "../assets/dummy-profile.jpg"

type contactProps = {
    name: string,
    img: string,
    id: string,
    lastLogin: number | undefined,
    isBlockedByReceiver: boolean;
}

export default function RecentContact({ name, img, id, lastLogin, isBlockedByReceiver }: contactProps) {
    return (
        <section className="relative">
            <img src={isBlockedByReceiver ? dummyUserImage : fixImageUrl(img)} alt="contact_image" className="h-10 w-10 rounded-full flex-shrink-0" />
            {!isBlockedByReceiver && lastLogin == 0 && (
                <i className="text-pink-red absolute right-[0rem] bottom-[0rem] backdrop-blur-sm rounded-full">
                    <GoDotFill />
                </i>
            )}
        </section>
    )
}

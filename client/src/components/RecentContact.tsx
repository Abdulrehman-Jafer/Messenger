import { GoDotFill } from "react-icons/go"

type contactProps = {
    name: string,
    img: string,
    id: string,
    lastLogin: number | undefined
}

export default function RecentContact(props: contactProps) {
    const image_src = props.img.startsWith("storage") ? `http://localhost:3000/${props.img}` : props.img
    return (
        <section className="relative">
            <img src={image_src} alt="contact_image" className="h-10 w-10 rounded-full flex-shrink-0" />
            {props.lastLogin == 0 && (
                <i className="text-pink-red absolute right-[0rem] bottom-[0rem] backdrop-blur-sm rounded-full">
                    <GoDotFill />
                </i>
            )}
        </section>
    )
}

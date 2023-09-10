import { useState } from "react"
import { fixImageUrl } from "../utils/misc"
import dummy_user_image from "../assets/blocked_user.png"
export default function LazyImage({ src }: { src: string }) {
    const [isLoaded, setIsLoaded] = useState(false)

    const onLoad = () => {
        setIsLoaded(true)
    }
    return (
        <img src={src ? fixImageUrl(src) : dummy_user_image} alt="user_image" className="h-10 w-10 rounded-full" />
    )
}

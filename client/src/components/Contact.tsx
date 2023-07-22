
type contactProps = {
    name: string,
    img: string,
    id: string
}

export default function Contact(props: contactProps) {
    const image_src = props.img.startsWith("storage") ? `http://localhost:3000/${props.img}` : props.img
    return (
        <main>
            <img src={image_src} alt="contact_image" className="h-10 w-10 rounded-full" />
        </main>
    )
}

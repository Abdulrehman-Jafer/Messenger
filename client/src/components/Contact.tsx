
type contactProps = {
    name: string,
    img: string,
    id: number
}

export default function Contact(props: contactProps) {
    return (
        <main>
            <img src={props.img} alt="contact_image" className="h-10 w-10 rounded-full" />
        </main>
    )
}

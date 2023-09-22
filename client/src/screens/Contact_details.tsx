import { useTypedSelector } from "../redux/store"
// import { useAppDispatch } from "../redux/store"
import { useParams } from "react-router-dom"

export default function Contact_details() {
  const contactReducer = useTypedSelector(selector => selector.contactReducer)
  const { contact_id } = useParams()
  const currentContact = contactReducer.contacts.find(c => {
    return c._id === contact_id
  })
  /*
Top Navigation and Header and may be an Icon
Contact Details
Edit info Button
Message btn
Delete Contact btn
Block btn
 */
  return (
    <section className="h-screen w-screen bg-black flex items-center justify-center">
      {/* <p className="text-red-500">{currentContact?.saved_as}</p> */}
      <h1 className="text-4xl bg-pink-red">Contacts Detail Page yet to design and implement</h1>
    </section>
  )
}

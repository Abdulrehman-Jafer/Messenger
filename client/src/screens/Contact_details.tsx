import { useTypedSelector } from "../redux/store"
// import { useAppDispatch } from "../redux/store"
import { useParams } from "react-router-dom"

export default function Contact_details() {
  const contacts = useTypedSelector(selector => selector.contactReducer)
  const { contact_id } = useParams()
  const currentContact = contacts.find(c => {
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
    <section>
      <p className="text-red-500">{currentContact?.saved_as}</p>
    </section>
  )
}

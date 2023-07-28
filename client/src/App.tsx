import Home from "./screens/Home"
import Chat_space from "./screens/Chat_space"
import Auth from "./screens/Auth"
import { Route, Routes } from "react-router-dom"
import SignUp from "./screens/SignUp"
import SignIn from "./screens/SignIn"
import { Toaster } from "react-hot-toast"
import { useEffect } from "react"
import { getSessionStorage } from "./utils/sessionSorage"
// import { toast } from "react-hot-toast/headless"
import { useNavigate } from "react-router-dom"
// import { useValidateQuery } from "./redux/service/api"
import { useTypedSelector, useAppDispatch } from "./redux/store"
import { User, initializeUser } from "./redux/features/user-slice"
// import PageNotFound from "./screens/404"
import Contacts from "./screens/Contacts"
import Contact_details from "./screens/Contact_details"




export default function App() {
  const navigate = useNavigate()
  const Authorization = getSessionStorage("authorization")
  const user: Omit<User, "lastLogin"> = getSessionStorage("user")
  const userData = useTypedSelector((state) => state.userReducer)
  const dispatch = useAppDispatch()

  useEffect(() => {
    if (userData?._id) {
      return navigate("/chats")
    } else if (!userData?._id && (Authorization && user?._id)) {
      dispatch(initializeUser({ ...user, userToken: Authorization, lastLogin: 0 }))
      return navigate("/chats")
    } else {
      return navigate("/auth")
    }
  }, [userData])


  return (
    <main>
      <Toaster />
      <Routes>
        <Route path="/auth" element={<Auth />} />
        <Route path="/auth/signup" element={<SignUp />} />
        <Route path="/auth/signin" element={<SignIn />} />
        {(userData?._id && (Authorization && user?._id)) && (
          <>
            <Route path="/chats" element={<Home />} />
            <Route path="/chats/:chat_space_id" element={<Chat_space />} />
            <Route path="/contacts" element={<Contacts />} />
            <Route path="/contacts/:contact_id" element={<Contact_details />} />

          </>
        )}
        {/* <Route path="*" element={<PageNotFound />} /> */}
      </Routes>
    </main>
  )
}

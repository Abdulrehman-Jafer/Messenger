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




export default function App() {
  const navigate = useNavigate()
  const Authorization = getSessionStorage("authorization")
  const user: Omit<User, "lastLogin"> = getSessionStorage("user")
  const userData = useTypedSelector((state) => state.userReducer)
  const dispatch = useAppDispatch()

  useEffect(() => {
    if (userData?._id) {
      navigate("/chats")
    } else if (!userData?._id && (Authorization && user?._id)) {
      dispatch(initializeUser({ ...user, userToken: Authorization, lastLogin: 0 }))
      navigate("/chats")
    } else {
      navigate("/auth")
    }
  }, [])

  return (
    <main>
      <Toaster />
      <Routes>
        <Route path="/auth" element={<Auth />} />
        <Route path="/auth/signup" element={<SignUp />} />
        <Route path="/auth/signin" element={<SignIn />} />
        <Route path="/chats" element={<Home />} />
        <Route path="/chats/:chat_space_id" element={<Chat_space />} />
      </Routes>
    </main>
  )
}

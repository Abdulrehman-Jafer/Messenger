import Home from "./screens/Home"
import Chat_space from "./screens/Chat_space"
import Auth from "./screens/Auth"
import { Route, Routes } from "react-router-dom"
import SignUp from "./screens/SignUp"
import SignIn from "./screens/SignIn"
import { Toaster, toast } from "react-hot-toast"
import { useEffect } from "react"
import { getSessionStorage } from "./utils/sessionSorage"
// import { toast } from "react-hot-toast/headless"
import { useNavigate } from "react-router-dom"
// import { useValidateQuery } from "./redux/service/api"
import { useTypedSelector, useAppDispatch } from "./redux/store"
import { User, initializeUser, setUserSocketId } from "./redux/features/user-slice"
// import PageNotFound from "./screens/404"
import Contacts from "./screens/Contacts"
import Contact_details from "./screens/Contact_details"
import socket from "./socket-io/socket"
import { addNewChat, updateTypingStaus, updateUserOfflineStatusInChatspace, updateUserOnlineStatusInChatspace } from "./redux/features/chat-slice"
import { addMessagesInChatspace, deleteMessage, updateChatspaceMessage } from "./redux/features/messages-slice"
import Settings from "./screens/Settings"
import notificatioSound from "./assets/whatssapp_web.mp3";
import { updateContactOfflineStatus, updateContactOnlineStatus } from "./redux/features/contact-slice"
import notficationSound from "./assets/whatssapp_web.mp3"




export default function App() {
  const navigate = useNavigate()
  const Authorization = getSessionStorage("authorization")
  const user: Omit<User, "lastLogin"> = getSessionStorage("user")
  const userReducer = useTypedSelector((state) => state.userReducer)
  const chatReducer = useTypedSelector(state => state.chatReducer)
  const dispatch = useAppDispatch()

  useEffect(() => {
    if (userReducer?._id) {
      return navigate("/chats")
    } else if (!userReducer?._id && (Authorization && user?._id)) {
      dispatch(initializeUser({ ...user, userToken: Authorization, lastLogin: 0 }))
      return navigate("/chats")
    } else {
      return navigate("/auth")
    }
  }, [])

  useEffect(() => {

    if (userReducer._id && chatReducer.isInitialized) {

      function user_online_Handler(data: any) {
        dispatch(updateUserOnlineStatusInChatspace({ onlineUser_id: data._id, socketId: data.socketId }))
        dispatch(updateContactOnlineStatus(data))
      }

      function socketIdHandler() {
        dispatch(setUserSocketId(socket.id))
      }

      function receiveMessageHandler(data: any) {
        const message = data.message;
        const chatspace_id = message.belongsTo;
        const chatIndex = chatReducer.chats.findIndex(c => c._id == chatspace_id)
        console.log({ chat: chatReducer.chats[chatIndex], isInitialized: chatReducer.isInitialized })
        const isArchived = chatReducer.chats[chatIndex].isArchived
        if (!isArchived) {
          const ringTone = new Audio(notficationSound)
          ringTone.play()
          toast(`${data.messageFrom}: ${data.message.content}`)
        }
        dispatch(addMessagesInChatspace({ chatspace_id, newMessage: message, isReceivedMessage: true }))
      }

      function saveMessageHandler(data: any) {
        dispatch(updateChatspaceMessage({ chatspace_id: data.chatspace_id, tempId: data.tempId, modifiedMessage: data.modifiedMessage }))
      }

      function deleteMessageForEveryoneHandler(data: any) {
        dispatch(deleteMessage({ message_id: data.message_id, chatspace_id: data.chatspace_id, deletedForEveryone: true }))
      }

      function user_offline_Handler(socketId: string) {
        console.log("Offline User Socket Id", socket.id)
        console.log({ socketId })
        dispatch(updateUserOfflineStatusInChatspace(socketId))
        dispatch(updateContactOfflineStatus(socketId))
      }

      function updateTypingStatus_handler(payload: any) {
        dispatch(updateTypingStaus(payload))
      }

      function newMessagerHandler(data: any) {
        const audio = new Audio(notificatioSound);
        audio.play().then(() => {
          dispatch(addNewChat(data.chatspace))
          dispatch(addMessagesInChatspace({ creatingNewChatspace: true, chatspace_id: data.message.belongsTo, newMessage: data.message }))
        }).catch(err => {
          console.log("Could not play notification sound", err)
          dispatch(addNewChat(data.chatspace))
          dispatch(addMessagesInChatspace({ creatingNewChatspace: true, chatspace_id: data.message.belongsTo, newMessage: data.message }))
        })
      }
      socket.on("user-online", user_online_Handler)
      socket.on("set-socketId", socketIdHandler)
      socket.on("receive-message", receiveMessageHandler)
      socket.on("message-saved", saveMessageHandler) // Being used for media files
      socket.on("messageDeletedForEveryone", deleteMessageForEveryoneHandler)
      socket.on("updateTypingStatus", updateTypingStatus_handler)
      socket.on("new-messager", newMessagerHandler)
      socket.on("user-offline", user_offline_Handler)
      return () => {
        // socket.disconnect()
        socket.off("set-socketId", socketIdHandler)
        socket.off("user-online", user_online_Handler)
        socket.off("receive-message", receiveMessageHandler)
        socket.off("message-saved", saveMessageHandler)
        socket.off("messageDeletedForEveryone", deleteMessageForEveryoneHandler)
        socket.off("updateTypingStatus", updateTypingStatus_handler)
        socket.off("user-offline", user_offline_Handler)
        socket.off("new-messager", newMessagerHandler)
      }
    }
  }, [socket, userReducer, chatReducer])



  return (
    <main>
      <Toaster />
      <Routes>
        <Route path="/auth" element={<Auth />} />
        <Route path="/auth/signup" element={<SignUp />} />
        <Route path="/auth/signin" element={<SignIn />} />
        {((userReducer?._id) && (Authorization && user?._id)) && (
          <>
            <Route path="/chats" element={<Home />} />
            <Route path="/chats/:chatspace_id" element={<Chat_space />} />
            <Route path="/contacts" element={<Contacts />} />
            <Route path="/contacts/:contact_id" element={<Contact_details />} />
            <Route path="/settings" element={<Settings />} />
          </>
        )}
        {/* <Route path="*" element={<PageNotFound />} /> */}
      </Routes>
    </main>
  )
}

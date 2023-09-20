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
import { add_to_blocked_By, initializeUser, remove_from_blocked_By, setUserSocketId } from "./redux/features/user-slice"
// import PageNotFound from "./screens/404"
import Contacts from "./screens/Contacts"
import Contact_details from "./screens/Contact_details"
import socket from "./socket-io/socket"
import { addNewChat, chatBlockedHandler, chatUnblockedHandler, updateTypingStaus, updateUserOfflineStatusInChatspace, updateUserOnlineStatusInChatspace } from "./redux/features/chat-slice"
import { addMessagesInChatspace, deleteMessage, updateChatspaceMessage } from "./redux/features/messages-slice"
import Settings from "./screens/Settings"
import notificatioSound from "./assets/whatssapp_web.mp3";
import { contactBlockHandler, contactUnblockHandler, updateContactOfflineStatus, updateContactOnlineStatus } from "./redux/features/contact-slice"
import notficationSound from "./assets/whatssapp_web.mp3"
import { useValidateTokenQuery } from "./redux/service/api"
import useDispatchOnLoad from "./hooks/useDispatchOnLoad"
import LoadingAnimation from "./animations/LoadingAnimation"


export default function App() {
  const navigate = useNavigate()
  const authorization = getSessionStorage("authorization")
  const user_id: string = getSessionStorage("user_id")
  const userReducer = useTypedSelector((state) => state.userReducer)
  const chatReducer = useTypedSelector(state => state.chatReducer)
  const dispatch = useAppDispatch()
  const [isLoading] = useDispatchOnLoad(useValidateTokenQuery, userReducer.isInitiailized, (user_id && authorization) ? { authorization, user_id } : undefined, initializeUser, "")

  useEffect(() => {
    if (userReducer?._id) {
      console.log("Naviagting from App.tsx to /chats")
      return navigate("/chats")
    } else {
      return navigate("/auth")
    }
  }, [userReducer._id])

  useEffect(() => {
    if (userReducer._id && chatReducer.isInitialized) {
      function user_online_Handler(user: any) {
        dispatch(updateUserOnlineStatusInChatspace({ onlineUser_id: user._id, socketId: user.socketId }))
        dispatch(updateContactOnlineStatus(user))
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
        console.log("Offline User Socket Id", socketId)
        dispatch(updateUserOfflineStatusInChatspace(socketId))
        dispatch(updateContactOfflineStatus(socketId))
      }

      function updateTypingStatus_handler(data: any) {
        dispatch(updateTypingStaus(data))
      }

      function onBlockHandler(public_number: string) {
        console.log("User blocked", public_number)
        dispatch(add_to_blocked_By(public_number))
        dispatch(chatBlockedHandler(public_number))
        dispatch(contactBlockHandler(public_number))
      }

      function onUnblockHandler(public_number: string) {
        console.log("User unblocked", public_number)
        dispatch(remove_from_blocked_By(public_number))
        dispatch(chatUnblockedHandler(public_number))
        dispatch(contactUnblockHandler(public_number))
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

      function windowOfflineHandler() {
        socket.disconnect()
      }

      socket.on("user-online", user_online_Handler)
      socket.on("set-socketId", socketIdHandler)
      socket.on("receive-message", receiveMessageHandler)
      socket.on("message-saved", saveMessageHandler) // Being used for media files
      socket.on("messageDeletedForEveryone", deleteMessageForEveryoneHandler)
      socket.on("updateTypingStatus", updateTypingStatus_handler)
      socket.on("new-messager", newMessagerHandler)
      socket.on("user-offline", user_offline_Handler)
      socket.on("user_blocked", onBlockHandler)
      socket.on("user_unblocked", onUnblockHandler)
      window.addEventListener("offline", windowOfflineHandler)
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
        socket.off("user_blocked", onBlockHandler)
        socket.off("user_unblocked", onUnblockHandler)
        window.removeEventListener("offline", windowOfflineHandler)
      }
    }
  }, [socket, userReducer, chatReducer])



  return (
    isLoading ? <div className="h-screen w-screen flex justify-center items-center">
      <LoadingAnimation />
    </div> :
      <main>
        <Toaster />
        <Routes>
          <Route path="/auth" element={<Auth />} />
          <Route path="/auth/signup" element={<SignUp />} />
          <Route path="/auth/signin" element={<SignIn />} />
          {((userReducer?._id) && (authorization && user_id)) && (
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

// addEventListener("online", function() { console. log("I am connected to the internet") })
// window. addEventListener("offline", function() { console. log("Disconnected...so sad!!!") })

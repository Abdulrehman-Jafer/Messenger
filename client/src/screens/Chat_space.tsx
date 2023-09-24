import { IoIosArrowBack } from "react-icons/io";
import Message from "../components/Message";
import { useNavigate, useParams } from "react-router-dom";
import { useState, useRef, useEffect, ChangeEvent } from "react";
import { AiOutlinePicture } from "react-icons/ai";
import { useAppDispatch, useTypedSelector } from "../redux/store";
import { getTimeWithAMPMFromDate } from "../utils/time";
import { AiOutlineSend } from "react-icons/ai";
import socket from "../socket-io/socket";
import {
  addMessagesInChatspace,
  updateChatspaceMessage,
} from "../redux/features/messages-slice";
import { Modal } from "antd";
import { fixImageUrl } from "../utils/misc";
import {
  useSendMessageMutation,
  useSendAttachmentMessageMutation,
  useUnBlockUserMutation,
} from "../redux/service/api";
import TypingAnimation from "../animations/TypingAnimation";
import dummy_user_image from "../assets/dummy-profile.jpg";
import WarningModal from "../modals/Warning";
import toast from "react-hot-toast";
import { remove_from_blocked_User } from "../redux/features/user-slice";
import LoadingAnimation from "../animations/LoadingAnimation";
import ChatEmoji from "../components/ChatEmoji";

export default function Chat_space() {
  const [message, setMessage] = useState("");
  const [selectedFile, setSelectedFile] = useState<File>();
  const [imagePreview, setImagePreview] = useState<any>("");
  const [videoPreview, setVideoPreview] = useState<any>("");
  const [showPreview, setShowPreview] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const userReducer = useTypedSelector((selector) => selector.userReducer);
  const { chatspace_id } = useParams();
  const chatReducer = useTypedSelector((selector) => selector.messageReducer);
  const indexOfCurrent = chatReducer.chatspacesMessages.findIndex(
    (m) => m.chatspace_id == chatspace_id
  );
  const chatspace = useTypedSelector(
    (selector) => selector.chatReducer
  ).chats.find((c) => c._id == chatspace_id);
  const messages =
    chatReducer.chatspacesMessages[indexOfCurrent]?.messages || [];
  const [sendMessageApi] = useSendMessageMutation();
  // const [sendAttachmentApi] = useSendAttachmentMessageMutation();
  const [isTyping, setIsTyping] = useState(false);
  const [showUnblockModal, setShowUnblockModal] = useState(false);
  const [isPreviewLoading, setIsPreviewLoading] = useState(false);
  const [showEmojiSelector, setShowEmojiSelector] = useState(false);

  const [
    unBlockUser,
    {
      isLoading: unblockLoading,
      isSuccess: unblockSuccess,
      isError: unblockError,
    },
  ] = useUnBlockUserMutation();

  const messageFrom = chatspace?.receiver.isSaved
    ? chatspace.receiver.contact.saved_as
    : chatspace?.receiver.connected_to.public_number;

  useEffect(() => {
    if (
      userReducer.blocked_user.includes(
        chatspace?.receiver.connected_to.public_number!
      ) ||
      chatspace?.isBlockedByReceiver
    )
      return;
    socket.emit("typingStatus", {
      chatspace_id,
      typingStatus: isTyping && message.length > 0 ? true : false,
      typer_public_number: chatspace?.sender.public_number,
      receiverSocketId: chatspace?.receiver.connected_to.socketId,
    });
  }, [isTyping, message]);

  useEffect(() => {
    const reader = new FileReader();
    if (!selectedFile) return;
    setShowPreview(true);
    setIsPreviewLoading(true);
    reader.readAsDataURL(selectedFile);
    reader.onload = (readerEvent) => {
      if (selectedFile?.type.includes("image")) {
        setImagePreview(readerEvent.target?.result);
      } else if (selectedFile.type.includes("video")) {
        setVideoPreview(readerEvent.target?.result);
      }
    };
    reader.onloadend = (e) => {
      setIsPreviewLoading(false);
    };
  }, [selectedFile]);

  const sendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    setShowEmojiSelector(false);
    if (
      userReducer.blocked_user.includes(
        chatspace?.receiver.connected_to.public_number!
      )
    ) {
      return setShowUnblockModal(true);
    }
    const tempId = crypto.randomUUID();
    const data = {
      belongsTo: chatspace?._id,
      content: message,
      contentType: "text",
      sender: userReducer,
      receiver: chatspace?.receiver.connected_to,
      createdAt: new Date().toString(),
      status: -1,
      deletedFor: [],
      _id: tempId,
    };
    if (!data.content) return;
    dispatch(
      addMessagesInChatspace({ chatspace_id: chatspace?._id, newMessage: data })
    );
    setMessage("");
    sendMessageApi({ data, messageFrom })
      .then((res: any) => {
        dispatch(
          updateChatspaceMessage({
            chatspace_id: chatspace?._id,
            tempId,
            modifiedMessage: res.data.result.sentMessage,
          })
        );
      })
      .catch((err) => {
        console.log("Message send Error", err);
      });
  };

  const onSelectFileHandler = (e: ChangeEvent) => {
    if (
      userReducer.blocked_by.includes(
        chatspace?.receiver.connected_to.public_number!
      )
    ) {
      return setShowUnblockModal(true);
    }
    const files = (e.target as HTMLInputElement).files;
    if (!files) return;
    setSelectedFile(files[0]);
  };

  const handleCancel = () => {
    setShowPreview(false);
    setImagePreview("");
    setVideoPreview("");
  };

  const handleOk = async () => {
    const newMessage = {
      belongsTo: chatspace?._id,
      contentType: imagePreview ? "image" : "video",
      content: "uploading",
      sender: userReducer,
      receiver: chatspace?.receiver.connected_to,
      createdAt: new Date().toString(),
      status: -1,
      deletedFor: [],
      _id: `${Math.random()}`,
    };
    dispatch(
      addMessagesInChatspace({
        chatspace_id,
        newMessage: {
          ...newMessage,
          contentType: "uploading",
          content: imagePreview ? "uploading image" : "uploading video",
        },
      })
    );
    socket.emit("sendFile", {
      chatspace_id,
      filename: selectedFile?.name,
      file: selectedFile,
      newMessage,
    });
    // const formData = new FormData()
    // formData.append("attachment", selectedFile!)
    // formData.append("chatspace_id", chatspace_id!)
    // formData.append("filename", selectedFile?.name!)
    // formData.append("newMessage", JSON.stringify(selectedFile?.name))
    // formData.append("isChatFile", "true")
    // await sendAttachmentApi(formData).then((res) => {
    //     console.log({ res })
    // })
    handleCancel();
  };

  const typingAnimationRef = useRef<HTMLElement>(null);

  useEffect(() => {
    if (!unblockLoading && unblockSuccess) {
      toast.success("user unblocked");
      dispatch(
        remove_from_blocked_User(
          chatspace?.receiver.connected_to.public_number!
        )
      );
      return setShowUnblockModal(false);
    }
    unblockError && toast.error("Error while unblocking");
  }, [unblockLoading]);

  const unBlockUserHandler = () => {
    unBlockUser({
      public_number: chatspace?.receiver.connected_to.public_number,
      user_id: userReducer._id,
      user_public_number: userReducer.public_number,
    });
  };

  const onEmojiClick = (e: any) => {
    setMessage((prev) => prev + e.emoji);
  };

  useEffect(() => {
    window.scrollTo(0, document.body.scrollHeight);
  }, [chatspace?.receiver.connected_to.isTyping]);

  if (!chatspace) return <h1>404</h1>;
  return (
    <>
      <main className="flex flex-col">
        <section className="flex p-[1rem] justify-between items-center sticky top-0 z-10 backdrop-blur-3xl border-b-2">
          <i
            className="text-[1.3rem] cursor-pointer"
            onClick={() => navigate("/chats")}
          >
            <IoIosArrowBack />
          </i>
          <div className="flex flex-col items-center">
            <h2 className="text-[1.3rem]">{messageFrom}</h2>
            <small
              className={`${
                !chatspace.isBlockedByReceiver &&
                chatspace.receiver.connected_to.lastLogin == 0
                  ? "text-pink-red"
                  : "text-gray-500"
              }`}
            >
              {!chatspace.isBlockedByReceiver &&
              chatspace.receiver.connected_to.lastLogin == 0
                ? "online"
                : "offline"}
            </small>
          </div>
          <div className="flex-shrink-0">
            <img
              src={
                chatspace.isBlockedByReceiver
                  ? dummy_user_image
                  : fixImageUrl(chatspace.receiver.connected_to.image)
              }
              alt="contact_image"
              className="h-10 w-10 rounded-full"
            />
          </div>
        </section>
        <section className="flex flex-col p-[1rem] last-child-border-bottom-white chatspace-min-height">
          {messages.length > 0 ? (
            <>
              {messages.map((m, i) => {
                const currentMessageTime = getTimeWithAMPMFromDate(m.createdAt);
                const nextMessageTime = messages[i + 1]?.createdAt;
                const stylingData = {
                  nextMsgSender: messages[i + 1]?.sender,
                  nextMsgTime: getTimeWithAMPMFromDate(nextMessageTime),
                };
                return (
                  <Message
                    createdAt={currentMessageTime}
                    content={m?.content}
                    sender={m?.sender}
                    receiver={m?.receiver}
                    status={m.status}
                    nextMsgSenderId={stylingData?.nextMsgSender?._id}
                    nextMsgTime={stylingData?.nextMsgTime}
                    _id={m._id}
                    belongsTo={m.belongsTo}
                    deletedForEveryone={m.deletedForEveryone}
                    receiverSocketId={chatspace.receiver.connected_to.socketId}
                    contentType={m.contentType}
                    key={m?._id}
                  />
                );
              })}
              {chatspace.receiver.connected_to.isTyping && (
                <section
                  ref={typingAnimationRef}
                  className={`flex items-center gap-2`}
                >
                  <div className="h-10 w-10 flex-shrink-0">
                    <img
                      src={fixImageUrl(chatspace.sender?.image!)}
                      alt="sender_image"
                      className="h-full w-full rounded-full"
                    />
                  </div>
                  <div>
                    <TypingAnimation />
                  </div>
                </section>
              )}
            </>
          ) : (
            <h1 className="text-center text-grayish">No Messages to show</h1>
          )}
        </section>
        <section className="sticky bottom-0">
          <div className="relative">
            <form
              onSubmit={(e) => sendMessage(e)}
              encType="multipart/form-data"
            >
              <textarea
                onFocus={() => setIsTyping(true)}
                onBlur={() => setIsTyping(false)}
                // type="text"
                className="border border-gray-400 outline-none w-full p-[1rem] bg-light-gray indent-8"
                placeholder="Type your message"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
              />
              <input
                key={Math.random()}
                ref={fileInputRef}
                type="file"
                accept="image/*,video/*"
                className="hidden"
                onChange={(e) => onSelectFileHandler(e)}
              />
              <div className="absolute bottom-[5px] left-1">
                <ChatEmoji
                  onEmojiClick={onEmojiClick}
                  showEmojiSelector={showEmojiSelector}
                  setShowEmojiSelector={setShowEmojiSelector}
                />
              </div>
              <i
                className="absolute text-3xl text-grayish hover:text-light-pink bottom-3 right-12"
                onClick={() => fileInputRef.current?.click()}
              >
                <AiOutlinePicture />
              </i>
              <button
                type="submit"
                className="absolute text-3xl text-grayish hover:text-light-pink bottom-3 right-2"
                onClick={(e) => sendMessage(e)}
              >
                <AiOutlineSend />
              </button>
            </form>
          </div>
        </section>
        <Modal
          title="Preview"
          open={showPreview}
          onOk={handleOk}
          onCancel={handleCancel}
          okText="Send"
          okButtonProps={{ className: "custom-ok-button" }}
        >
          {isPreviewLoading ? (
            <div className="flex items-center justify-center">
              <LoadingAnimation />
            </div>
          ) : (
            <>
              {imagePreview && <img src={imagePreview} alt="selectedImage" />}
              {videoPreview && (
                <video muted={videoPreview!} width="750" height="500" controls>
                  <source src={videoPreview} type="video/mp4" />
                </video>
              )}
            </>
          )}
        </Modal>
      </main>
      <WarningModal
        title={"User is Blocked"}
        okText={unblockLoading ? "Unblocking.." : "Unblock"}
        handleOk={unBlockUserHandler}
        isModalOpen={showUnblockModal}
        setIsModalOpen={setShowUnblockModal}
        warningText="Please unblock the user to send message!"
      />
    </>
  );
}

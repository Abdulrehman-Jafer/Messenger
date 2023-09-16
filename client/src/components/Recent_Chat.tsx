import { useNavigate } from "react-router-dom"
import { GoDotFill } from "react-icons/go"
import { fixImageUrl } from "../utils/misc"
import { useState, useEffect } from "react"
import Add_Contact from "../modals/Add_Contact"
import { useAppDispatch, useTypedSelector } from "../redux/store"
import { Dropdown, MenuProps } from "antd"
import { useDeleteChatspaceMutation, useAddToArchiveMutation, useRemoveFromArchiveMutation, useBlockUserMutation, useUnBlockUserMutation } from "../redux/service/api"
import { toast } from "react-hot-toast"
import { removeChatspaceMessages } from "../redux/features/messages-slice"
import { updateArchiveStatus, updateUserOnlineStatusInChatspace } from "../redux/features/chat-slice"
import dummy_user_image from "../assets/dummy-profile.jpg"
import { contactBlockHandler } from "../redux/features/contact-slice"
import { add_to_blocked_User, remove_from_blocked_By, remove_from_blocked_User } from "../redux/features/user-slice"
import WarningModal from "../modals/Warning"

type Recent_Chat_Props = {
    name: string,
    last_message: string,
    active_status: string,
    user_image: string,
    chatspace_id: string,
    lastLogin: number,
    isSaved: boolean,
    user_id: string,
    isTyping?: boolean,
    isArchived: boolean,
    connected_to_public_number: string,
    isBlockedByReceiver: boolean
}

export default function Recent_Chat({ active_status, chatspace_id, isArchived, isSaved, lastLogin, last_message, name, user_id, user_image, isTyping, connected_to_public_number, isBlockedByReceiver }: Recent_Chat_Props) {
    const navigate = useNavigate()
    const [showContactModal, setShowContactModal] = useState(false)
    const [isDropDownOpen, setIsDropDownOpen] = useState(false)
    const user_Reducer = useTypedSelector(selector => selector.userReducer)
    const [deleteChatspace, { isLoading: deleteChatLoading, isError: deleteChatError }] = useDeleteChatspaceMutation()
    const [addToArchive, { isLoading: archiveLoading, isError: archiveError }] = useAddToArchiveMutation()
    const [removeFromArchive, { isLoading: removeArchiveLoading, isError: removeArchiveError }] = useRemoveFromArchiveMutation()
    const [blockUser, { isLoading: blockLoading, isError: blockError, isSuccess: blockSuccess }] = useBlockUserMutation()
    const [unBlockUser, { isLoading: unblockLoading, isSuccess: unblockSuccess, isError: unblockError }] = useUnBlockUserMutation()
    const [showUnblockModal, setShowUnblockModal] = useState(false)
    const [showBlockModal, setShowBlockModal] = useState(false)
    const dispatch = useAppDispatch()


    useEffect(() => {
        if (!deleteChatLoading && deleteChatError) toast.error("Chatspace delete was not successfull")
        if (!archiveLoading && archiveError) toast.error("Archiving failed!")
        if (!removeArchiveLoading && removeArchiveError) toast.error("Unarchiving failed!")
        if (!blockLoading && blockError) toast.error("Blocking user failed!")
        if (!unblockLoading && unblockError) toast.error("Unblocking user failed!")
    }, [deleteChatLoading, archiveLoading, removeArchiveLoading])

    useEffect(() => {
        if (blockSuccess && !blockLoading) {
            setShowBlockModal(false)
            toast.success(`Blocked ${name} successfully!`)
            dispatch(add_to_blocked_User(connected_to_public_number))
        }
    }, [blockLoading])

    useEffect(() => {
        if (unblockSuccess && !unblockLoading) {
            setShowUnblockModal(false)
            toast.success(`${name} is unblocked!`)
            dispatch(remove_from_blocked_User(connected_to_public_number))
        }
    }, [unblockLoading])

    const addArchiveHandler = () => {
        addToArchive({ chatspace_id, user_id })
        dispatch(updateArchiveStatus({ chatspace_id, archive_status: true }))
        setIsDropDownOpen(false)
    }

    const removeArchiveHandler = () => {
        removeFromArchive({ chatspace_id, user_id }).then((res) => {
            console.log({ res })
        }).catch((err) => {
            console.log(err)
        })
        dispatch(updateArchiveStatus({ chatspace_id, archive_status: false }))
        setIsDropDownOpen(false)
    }

    const deleteChatHandler = () => {
        deleteChatspace({ chatspace_id, user_id })
        dispatch(removeChatspaceMessages(chatspace_id))
        setIsDropDownOpen(false)
    }

    const blockUserHandler = () => {
        blockUser({ public_number: connected_to_public_number, user_id: user_Reducer._id, user_public_number: user_Reducer.public_number })
    }

    const unBlockUserHandler = () => {
        unBlockUser({ public_number: connected_to_public_number, user_id: user_Reducer._id, user_public_number: user_Reducer.public_number })
    }


    const items: MenuProps['items'] = [
        (isArchived ? {
            label: <button onClick={removeArchiveHandler}>Remove from archive</button>,
            key: '0',
        } : {
            label: <button onClick={addArchiveHandler}>Add to archive</button>,
            key: '0',
        }),
        {
            label: <button onClick={deleteChatHandler} >Delete the chatspace</button>,
            key: '1',
        },
        {
            label: user_Reducer.blocked_user.includes(connected_to_public_number) ? <button onClick={() => { setIsDropDownOpen(false); setShowUnblockModal(true) }}>Remove from blacklist</button> : <button onClick={() => { setIsDropDownOpen(false); setShowBlockModal(true) }}>Add to blackList</button>,
            key: '2',
        },
    ]

    return (
        <>
            <Dropdown menu={{ items }} trigger={["contextMenu"]} onOpenChange={(isopen) => setIsDropDownOpen(isopen)} open={isDropDownOpen}>
                <section tabIndex={0} className={`group flex justify-between items-center gap-4 p-[1rem] border-cyan-400 hover:bg-pink-red cursor-default ${isDropDownOpen && "bg-pink-red"} `} onClick={() => navigate(`/chats/${chatspace_id}`)}>
                    <div className="relative">
                        <img src={isBlockedByReceiver ? dummy_user_image : fixImageUrl(user_image)} alt="contact_image" className="h-10 w-10 rounded-full" />
                        {(!isBlockedByReceiver && lastLogin == 0) && (
                            <i className="text-pink-red absolute right-[0rem] bottom-[0rem] backdrop-blur-sm rounded-full">
                                <GoDotFill />
                            </i>
                        )}
                    </div>
                    <div className="flex justify-between flex-1">
                        <div className="flex flex-col">
                            {!isSaved && <p className="invisible">DOM</p>}
                            <h3 className="text-[1.2rem] maxCharacter text-gray-800">{name}</h3>
                            {!isBlockedByReceiver && isTyping ?
                                <small className="text-green-500 ADLaMFont">Typing....</small>
                                :
                                <small className="text-grayish text-style">{last_message}</small>
                            }
                        </div>
                        <div className="flex flex-col items-end">
                            {!isSaved && <button className="text-more-grayish underline pb-1 ADLaMFont" onClick={(e) => { e.stopPropagation(); setShowContactModal(true) }}>Save contact</button>}
                            {isArchived && <small className={`text-light-pink border border-pink-red group-hover:border-green-500 group-hover:text-green-400 rounded-sm p-[2px] ${isDropDownOpen && "border-green-500 text-green-400"}`}>archived</small>}
                            <small className={`text-grayish text-end px-1 mt-1`}>{active_status}</small>
                        </div>
                    </div>
                </section>
            </Dropdown>
            <Add_Contact isModalOpen={showContactModal} setIsModalOpen={setShowContactModal} user_id={user_Reducer._id} providedPublicNumber={name} />
            <WarningModal title={"Confirmation"} okText={blockLoading ? "Blocking..." : "Block"} handleOk={blockUserHandler} isModalOpen={showBlockModal} setIsModalOpen={setShowBlockModal} warningText={`Are you sure you want to block ${name}!`} />
            <WarningModal title={"User is Blocked"} okText={unblockLoading ? "Unblocking..." : "Unblock"} handleOk={unBlockUserHandler} isModalOpen={showUnblockModal} setIsModalOpen={setShowUnblockModal} warningText={`Please unblock ${name} to send message!`} />
        </>
    )
}
import Navbar from '../components/Navbar'
import { useAppDispatch, useTypedSelector } from '../redux/store'
import { fixImageUrl } from '../utils/misc'
import { MdOutlineAccountCircle, MdOutlinePrivacyTip } from "react-icons/md"
import { GoBlocked } from "react-icons/go"
import { LiaDesktopSolid } from "react-icons/lia"
import { AiOutlineLogout } from "react-icons/ai"
import { getItem, MenuItem } from '../utils/antd'
import { Menu, Switch } from 'antd'
import { useNavigate } from 'react-router-dom'
import { setSessionStorage } from '../utils/sessionSorage'
import { UninitializeUser } from '../redux/features/user-slice'
import { useState } from 'react'
import Update_Profile_Modal from '../modals/Update_Profile'
import Warning from '../modals/Warning'

export default function Settings() {
    const User = useTypedSelector(selector => selector.userReducer)
    const navigate = useNavigate()
    const dispatch = useAppDispatch()

    const [showUpdateProfile, setShowUpdateProfile] = useState(false)
    const [showDeleteAccount, setShowDeleteAccount] = useState(false)
    const [onlineStatus, setOnlineStatus] = useState(false)

    const LogOut = () => {
        setSessionStorage("user_id", "")
        setSessionStorage("authorization", "")
        dispatch(UninitializeUser())
        navigate("/auth")
    }

    const items: MenuItem[] = [
        getItem(<h3>Account settings</h3>, 'sub1', <MdOutlineAccountCircle />, [
            getItem(<p onClick={() => setShowUpdateProfile(prev => !prev)}>Update your profile</p>, '1'),
            getItem(<p >Change your account password</p>, '2'),
            getItem(<p className='text-red-700' onClick={() => setShowDeleteAccount(true)}>Delete account</p>, '3'),
        ]),
        getItem(<h3>Privacy Settings</h3>, 'sub2', <MdOutlinePrivacyTip />, [
            getItem(<div className='flex justify-between items-center'><p>Show Online Status</p><Switch size='small' onClick={() => setOnlineStatus(prev => !prev)} style={onlineStatus ? {} : { background: "gray" }} checked={onlineStatus} /></div>, '4'), //Switch -antd to toggle
        ]),
        getItem(<h3>Theme Settings</h3>, 'sub3', <LiaDesktopSolid />, [
            getItem(<div className='flex justify-between items-center'><p>Enale dark mode</p><Switch size='small' onClick={() => { }} style={{ background: "gray" }} checked={false} /></div>, '5'),
            getItem(<p>Custom chatspace background</p>, '6'),
            //Modal to select a pic or a custom pic or a solid color
        ]),
        getItem(<h3>Manage Blacklist</h3>, 'blacklist', <GoBlocked />), // Will Open a modal
        getItem(<p onClick={LogOut}>Log Out</p>, 'link', <AiOutlineLogout />,),
    ];

    return (
        <>
            <section className='flex flex-col gap-4'>
                <h3 className="text-pink-red text-2xl font-semibold">
                    Settings
                </h3>
                <div className='border'>
                    <small className='text-gray-800 p-2'>Your public number is {User.public_number}</small>
                    <div className='flex items-center sm:gap-8 gap-2 p-4'>
                        <img src={fixImageUrl(User.image)} alt="user_image" className='w-12 h-12 rounded-full flex-shrink-0' />
                        <div>
                            <h3 className='text-2xl text-gray-800'>{User.name}</h3>
                            <small className='text-grayish'>{User.email}</small>
                        </div>
                    </div>
                </div>
                <div className='setting-min-height'>
                    <Menu
                        style={{ width: "100%" }}
                        className='onHover'
                        // defaultSelectedKeys={['sub1']}
                        defaultOpenKeys={['sub1']}
                        mode='inline'
                        items={items}
                    />
                </div>
                <Navbar />
            </section>
            <Update_Profile_Modal isModalOpen={showUpdateProfile} setIsModalOpen={setShowUpdateProfile} />
            <Warning okText='Delete' title='Warning' handleOk={() => { }} isModalOpen={showDeleteAccount} setIsModalOpen={setShowDeleteAccount} warningText='Your account will be deleted parmanently' />
        </>
    )
}

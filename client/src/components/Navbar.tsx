import { BsChatSquareDots } from 'react-icons/bs'
import { CiSettings } from 'react-icons/ci'
import { FiUsers } from 'react-icons/fi'
import { useNavigate, useLocation } from 'react-router-dom'

export default function Navbar() {
    const navigate = useNavigate()
    const { pathname } = useLocation()
    return (
        <div className="flex justify-between bg-pink-red p-[1rem] sticky bottom-0">
            <i className={`text-3xl font-extrabold ${pathname == '/chats' ? 'text-white' : 'text-more-grayish'}`} onClick={() => navigate("/chats")}> <BsChatSquareDots /> </i>
            <i className={`text-3xl font-extrabold ${pathname == '/contacts' ? 'text-white' : 'text-more-grayish'}`} onClick={() => navigate("/contacts")}> <FiUsers /> </i>
            <i className={`text-3xl font-extrabold ${pathname == '/settings' ? 'text-white' : 'text-more-grayish'}`} onClick={() => navigate("/settings")}> <CiSettings /> </i>
        </div>
    )
}

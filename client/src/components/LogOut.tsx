import { Dispatch, SetStateAction } from 'react';
import { Button, Popover, Space } from 'antd';
import { useAppDispatch } from '../redux/store';
import { setSessionStorage } from '../utils/sessionSorage';
import { uninitializeUser } from '../redux/features/user-slice';
import { useNavigate } from 'react-router-dom';

// const onClic



const LogOut = ({ isOpen, setIsLogOutModalOpen }: { isOpen: boolean, setIsLogOutModalOpen: Dispatch<SetStateAction<boolean>> }) => {
    const navigate = useNavigate()
    const dispatch = useAppDispatch()

    const LogOut = () => {
        setSessionStorage("user", "")
        setSessionStorage("authorization", "")
        dispatch(uninitializeUser())
        navigate("/auth/")
    }
    return (
        <ul>
            {isOpen && (
                <>
                    <li>Log Out</li>
                    <li>Cancel</li>
                </>
            )}
        </ul>
    )
}

export default LogOut;
import { googleAuth } from "../utils/googleAuth";
import { FcGoogle } from "react-icons/fc"
import { useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast"
import { setSessionStorage } from "../utils/sessionSorage";
import { useContinueWithGoogleMutation } from "../redux/service/api";
import { useEffect } from "react"
import { initializeUser } from "../redux/features/user-slice";
import { useAppDispatch } from "../redux/store";

export default function Auth() {
    const navigate = useNavigate()
    const [googleSign, { isLoading, isSuccess, error, isError, data }] = useContinueWithGoogleMutation()
    const dispatch = useAppDispatch()


    useEffect(() => {
        let loadToast;
        if (isLoading) {
            loadToast = toast.loading("Processing your request")
            return
        }
        if (!isLoading && (isSuccess || isError)) {
            toast.dismiss(loadToast)
            if (isSuccess) {
                toast.success("Log In Successful")
                setSessionStorage("authorization", data.token)
                setSessionStorage("user_id", data.user._id)
                dispatch(initializeUser({ ...data.user, userToken: data.token, lastLogin: 0 }))
                navigate("/chats")
            } else {
                console.log(error)
                toast.error((error as Error)?.message || "Could not Sign In")
            }
        }
    }, [isLoading])



    const continueWithGoogle = async () => {
        const googleData = await googleAuth();
        const user_data = {
            name: googleData?.displayName,
            email: googleData?.email,
            image: googleData?.photoURL,
            google_uid: googleData?.uid
        }
        await googleSign({ ...user_data, provider: "Google" })
    }

    return (
        <main className="flex justify-center items-center h-screen flex-col gap-[1rem]">
            <div className="flex items-center gap-2 bg-blue-500 p-[1rem] text-white rounded-md">
                <i><FcGoogle /></i>
                <button onClick={continueWithGoogle} >Continue with Google</button>
            </div>
            <div>
                <button onClick={() => navigate("/auth/signup")} className="text-center bg-blue-500 p-[1rem] text-white rounded-md">Create a new Account</button>
            </div>
            <div>
                <button onClick={() => navigate("/auth/signin")} className="text-center bg-blue-500 p-[1rem] text-white rounded-md">Log In to your account</button>
            </div>
        </main>
    );
}
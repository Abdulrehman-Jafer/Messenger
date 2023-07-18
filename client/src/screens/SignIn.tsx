import { Card, Input, Button, Typography, } from "@material-tailwind/react";
import { useNavigate } from "react-router-dom";
import { onChangeHandler } from "../utils/misc";
import { useState, FormEvent } from "react"
import { setSessionStorage } from "../utils/sessionSorage";
import { useSingInMutation } from "../redux/service/api";
import { toast } from "react-hot-toast"
import { useEffect } from "react"
import { useAppDispatch } from "../redux/store";
import { initializeUser } from "../redux/features/user-slice";
export default function SignIn() {
    const navigate = useNavigate()
    const [fields, setFields] = useState({ email: "", password: "" })
    const [singIn, { isLoading, isError, isSuccess, error, data }] = useSingInMutation()
    const dispatch = useAppDispatch()

    useEffect(() => {
        let loaderId;
        if (isLoading) {
            loaderId = toast.loading("Processing your request")
        }
        if (!isLoading && (isSuccess || isError)) {
            toast.dismiss(loaderId)
            isSuccess ? toast.success("Logged In Successfully") : toast.error((error as Error)?.message || "Failed to Log In")
            if (isSuccess) {
                setSessionStorage("authorization", data.token)
                setSessionStorage("user", data.user)
                dispatch(initializeUser({ ...data.user, lastLogin: 0, userToken: data.token }))
                navigate("/chats")
            }
        }
    }, [isLoading])

    const signInHandler = async (e: FormEvent) => {
        e.preventDefault()
        try {
            await singIn({ ...fields, provider: "Custom" })
        } catch (error) {
            console.log(error)
        }
    }

    return (
        <main className="px-[2rem] flex justify-center items-center min-h-screen">
            <Card color="transparent" shadow={false}>
                <Typography variant="h4" color="blue-gray" className="text-center" >
                    Sign In
                </Typography>
                <Typography color="gray" className="mt-1 font-normal text-center">
                    Enter your Log in details.
                </Typography>
                <form className="mt-8 mb-2 w-80 max-w-screen-lg sm:w-96" onSubmit={(e) => signInHandler(e)}>
                    <div className="mb-4 flex flex-col gap-6">
                        <Input name="email" type="email" size="lg" label="Email" required value={fields.email} onChange={(e) => onChangeHandler(e, setFields)} />
                        <Input name="password" type="password" size="lg" label="Password" required minLength={6} value={fields.password} onChange={(e) => onChangeHandler(e, setFields)} />
                    </div>
                    <Button className="mt-6" fullWidth type="submit" disabled={!fields.email || !fields.password}>
                        Log In
                    </Button>
                    <Typography color="gray" className="mt-4 text-center font-normal">
                        Don't have an account?{" "}
                        <span
                            className="font-medium text-blue-500 transition-colors hover:text-blue-700"
                            onClick={() => navigate("/auth/signup")}
                        >
                            Sign Up
                        </span>
                    </Typography>
                </form>
            </Card>
        </main>
    );
}   
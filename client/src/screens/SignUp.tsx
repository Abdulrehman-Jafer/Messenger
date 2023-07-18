import { Card, Input, Checkbox, Button, Typography, } from "@material-tailwind/react";
import { useNavigate } from "react-router-dom";
import { onChangeHandler } from "../utils/misc";
import { useState, FormEvent, useEffect, ChangeEvent } from "react"
import { useCreateUserMutation } from "../redux/service/api";
import { toast } from "react-hot-toast";

export default function SignUp() {
    const navigate = useNavigate()
    const [fields, setFields] = useState({ name: "", email: "", password: "" })
    const [agreed, setAgreed] = useState(false)
    const [selectedFile, setSelectedFile] = useState<File>()
    const [imageAsUrl, setImageAsUrl] = useState("")
    const [createUser, { isLoading, isSuccess, error }] = useCreateUserMutation()
    useEffect(() => {
        let toastId;
        if (isLoading) {
            toastId = toast.loading("Processing your request")
        }
        if (!isLoading && isSuccess) {
            toast.dismiss(toastId)
            isSuccess ? toast.success("Successfully registered") : toast.error((error as Error).message || "Could not register")
        }

        if (!selectedFile) return setImageAsUrl("")

        const objectUrl = URL.createObjectURL(selectedFile)
        setImageAsUrl(objectUrl)

        // free memory when ever this component is unmounted
        return () => URL.revokeObjectURL(objectUrl)
    }, [selectedFile, isLoading])

    const onSelectFile = (e: ChangeEvent) => {
        const Files = (e.target as HTMLInputElement).files
        if (!Files) {
            setSelectedFile(undefined)
            return
        }
        setSelectedFile(Files[0])
    }

    const signUpHandler = async (e: FormEvent) => {
        e.preventDefault()
        const formData = new FormData();
        formData.append("name", fields.name);
        formData.append("email", fields.email);
        formData.append("password", fields.password);
        formData.append("image", selectedFile!);
        formData.append("provider", "Custom")
        await createUser(formData)
    }
    return (
        <main className="px-[2rem] flex justify-center items-center min-h-screen">
            <Card color="transparent" shadow={false}>
                <Typography variant="h4" color="blue-gray" className="text-center" >
                    Sign Up
                </Typography>
                <Typography color="gray" className="mt-1 font-normal text-center">
                    Enter your details to register.
                </Typography>
                <form className="mt-8 mb-2 w-80 max-w-screen-lg sm:w-96" onSubmit={(e) => signUpHandler(e)} method="POST" encType="multipart/form-data">
                    <div className="mb-4 flex flex-col gap-6">
                        <Input name="name" type="text" size="lg" label="Name" required minLength={6} value={fields.name} onChange={(e) => onChangeHandler(e, setFields)} />
                        <Input name="email" type="email" size="lg" label="Email" required value={fields.email} onChange={(e) => onChangeHandler(e, setFields)} />
                        <Input name="password" type="password" size="lg" label="Password" required minLength={6} value={fields.password} onChange={(e) => onChangeHandler(e, setFields)} />
                        <input name="image" type="file" onChange={onSelectFile} accept="image/*" />
                        {selectedFile && <img src={imageAsUrl} alt="selected_image" />}
                    </div>
                    <Checkbox checked={agreed} onChange={(e) => setAgreed(e.target.checked)}
                        label={
                            (
                                <Typography
                                    variant="small"
                                    color="gray"
                                    className="flex items-center font-normal"
                                >
                                    I agree the
                                    <a
                                        href="#"
                                        className="font-medium transition-colors hover:text-blue-500"
                                    >
                                        &nbsp;Terms and Conditions
                                    </a>
                                </Typography>
                            )
                        }
                        containerProps={{ className: "-ml-2.5" }}
                    />
                    <Button className="mt-6" fullWidth type="submit" disabled={!agreed || !fields.name || !fields.email || !fields.password || !selectedFile}>
                        Register
                    </Button>
                    <Typography color="gray" className="mt-4 text-center font-normal">
                        Already have an account?{" "}
                        <span
                            className="font-medium text-blue-500 transition-colors hover:text-blue-700"
                            onClick={() => navigate("/auth/signin")}
                        >
                            Sign In
                        </span>
                    </Typography>
                </form>
            </Card>
        </main>
    );
}   
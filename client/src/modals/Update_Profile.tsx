import { ChangeEvent, Dispatch, SetStateAction, useEffect, useRef, useState } from 'react';
import { Modal } from 'antd';
import { Input } from '@material-tailwind/react';
import { fixImageUrl, onChangeHandler } from '../utils/misc';
import { useTypedSelector } from '../redux/store';
import { PlusOutlined } from '@ant-design/icons';
// import { useNavigate } from 'react-router-dom';

const Update_Profile = ({ isModalOpen, setIsModalOpen }: { isModalOpen: boolean, setIsModalOpen: Dispatch<SetStateAction<boolean>>, }) => {
    const User = useTypedSelector(selector => selector.userReducer)
    const [fields, setFields] = useState({ name: User.name, email: User.email })
    const [selectedFile, setSelectedFile] = useState<File>()
    const [imageAsUrl, setImageAsUrl] = useState(fixImageUrl(User.image))
    const [isHovering, setIsHovering] = useState(false)
    // const navigate = useNavigate()


    useEffect(() => {
        if (!selectedFile) return;
        const url = URL.createObjectURL(selectedFile)
        setImageAsUrl(url)
        return () => {
            URL.revokeObjectURL(url)
        }
    }, [selectedFile])


    const handleOk = async () => {
        console.log({ fields, USERID: User._id })
    };

    const handleCancel = () => {
        setIsModalOpen(false);
    };

    const onSelectFile = (e: ChangeEvent) => {
        const Files = (e.target as HTMLInputElement).files
        if (!Files) {
            setSelectedFile(undefined)
            return
        }
        setSelectedFile(Files[0])
    }

    const fileInputRef = useRef<HTMLInputElement>(null)

    return (

        <Modal title="Update your profile" centered open={isModalOpen} onOk={handleOk} onCancel={handleCancel} okText={"Update"} okButtonProps={{ className: 'custom-ok-button', }}>
            <section className='flex flex-col gap-6'>
                <Input name="name" type="text" size="lg" label="Name" required minLength={6} value={fields.name} onChange={(e) => onChangeHandler(e, setFields)} />
                <Input name="email" type="email" size="lg" label="Email" required value={fields.email} onChange={(e) => onChangeHandler(e, setFields)} />
                <input ref={fileInputRef} name="image" type="file" onChange={onSelectFile} accept="image/*" hidden={true} />
                {(imageAsUrl || selectedFile) && (
                    <main onMouseEnter={() => setIsHovering(true)} onMouseLeave={() => setIsHovering(false)} className="relative">
                        <section>
                            <img src={imageAsUrl} alt="postImage" className={`rounded-lg transition-all w-full border border-pickedColor ${isHovering ? "myBlur" : ""}`} />
                        </section>
                        {isHovering &&
                            <section className='absoluteCenter flex items-center'>
                                <div
                                    className='flex flex-col items-center cursor-pointer border-black border-2 p-10 border-dashed hover:border-blue-700 hover:text-blue-700 rounded-lg'
                                    onClick={() => fileInputRef.current?.click()}
                                >
                                    <i className='text-6xl'>
                                        <PlusOutlined />
                                    </i>
                                </div>
                            </section>
                        }
                    </main>
                )
                }
            </section>
        </Modal>
    );
};

export default Update_Profile;
import { Dispatch, SetStateAction, useState, useEffect } from 'react';
import { Modal } from 'antd';
import { Input } from '@material-tailwind/react';
import { onChangeHandler } from '../utils/misc';
import { useCreateChatMutation, useCreateContactMutation } from '../redux/service/api';
import { toast } from 'react-hot-toast';
import { useTypedSelector } from '../redux/store';

const Create_Chat = ({ isModalOpen, setIsModalOpen }: { isModalOpen: boolean, setIsModalOpen: Dispatch<SetStateAction<boolean>>, }) => {
    const [fields, setFields] = useState<Record<string, any>>({
        isNameOrId: "contact_name",
        contact_id: "",
        contact_name: "",
        contact: ""
    })
    const contacts = useTypedSelector(selector => selector.contactReducer)
    const User = useTypedSelector(selector => selector.userReducer)
    const [createContact, { isError, isLoading, isSuccess, error, data }] = useCreateChatMutation()
    useEffect(() => {
        let loaderId;
        if (isLoading) {
            loaderId = toast.loading("Processing your request")
        }
        if (!isLoading && (isSuccess || isError)) {
            toast.dismiss(loaderId)
            console.log({ data })
            isSuccess ? toast.success(`${fields.contact_name} added to the contacts`) : toast.error((error as any)?.data?.message || "Failed to Complete")
            if (isSuccess) {
                setIsModalOpen(false)
            }
        }
    }, [isLoading])

    const handleOk = async () => {
        await createContact({ between: [User._id, fields.contact._id] })
    };

    const handleCancel = () => {
        setIsModalOpen(false);
    };


    return (

        <Modal title="Create new chat" centered open={isModalOpen} onOk={handleOk} onCancel={handleCancel} okText={"Create new Chat"} okButtonProps={{ className: 'custom-ok-button', loading: isLoading, }}>
            <div className='flex flex-col gap-6'>
                <select name="isNameOrId" onChange={(e) => onChangeHandler(e, setFields)} className='border-2 text-red-800 border-gray-300 outline-none p-2'>
                    <option value="contact_name">Use Contact name</option>
                    <option value="contact_id">Use Contact id</option>
                </select>
                {
                    fields.isNameOrId == "contact_name" || fields.isNameorId == "" ?
                        <div>
                            <Input name="contact_name" type="text" size="lg" label="Name" required value={fields.contact_name} onChange={(e) => onChangeHandler(e, setFields)} />
                            <div className='mt-[1rem]'>
                                <h1 className='text-center font-bold'>Filtered Contacts</h1>
                                {contacts.filter((c) => c.saved_as.startsWith(fields.contact_name)).splice(0, 5).map((c) => {
                                    return <p key={c._id} onClick={() => setFields(prev => ({ ...prev, contact_name: c.saved_as, contact: c.contact }))} className='hover:bg-pink-red p-[1rem] border-b-2'>{c.saved_as}</p>
                                })}
                            </div>
                        </div>
                        :
                        <Input name="contact_id" type="text" size="lg" label="Contact_id" required value={fields.contact_id} onChange={(e) => onChangeHandler(e, setFields)} />
                }
            </div>
        </Modal>
    );
};

export default Create_Chat;
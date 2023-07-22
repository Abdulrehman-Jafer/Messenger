import { Dispatch, SetStateAction, useState, useEffect } from 'react';
import { Modal } from 'antd';
import { Input } from '@material-tailwind/react';
import { onChangeHandler } from '../utils/misc';
import { useCreateContactMutation } from '../redux/service/api';
import { toast } from 'react-hot-toast';

const Add_Contact = ({ isModalOpen, setIsModalOpen, user_id }: { isModalOpen: boolean, setIsModalOpen: Dispatch<SetStateAction<boolean>>, user_id: string }) => {
    const [fields, setFields] = useState<Record<string, any>>({
        saved_as: "",
        contact_id: ""
    })
    const [createContact, { isError, isLoading, isSuccess, error }] = useCreateContactMutation()
    useEffect(() => {
        let loaderId;
        if (isLoading) {
            loaderId = toast.loading("Processing your request")
        }
        if (!isLoading && (isSuccess || isError)) {
            toast.dismiss(loaderId)
            isSuccess ? toast.success(`${fields.saved_as} added to the contacts`) : toast.error((error as any)?.data?.message || "Failed to Complete")
            if (isSuccess) {
                setIsModalOpen(false)
            }
        }
    }, [isLoading])

    const handleOk = async () => {
        await createContact({ ...fields, saved_by: user_id })
    };

    const handleCancel = () => {
        setIsModalOpen(false);
    };


    return (

        <Modal title="Create new contact" centered open={isModalOpen} onOk={handleOk} onCancel={handleCancel} okText={"Create"} okButtonProps={{ className: 'custom-ok-button', loading: isLoading, }}>
            <div className='flex flex-col gap-6'>
                <Input name="saved_as" type="text" size="lg" label="Name" required value={fields.saved_as} onChange={(e) => onChangeHandler(e, setFields)} />
                <Input name="contact_id" type="text" size="lg" label="User Id:" required value={fields.contact_id} onChange={(e) => onChangeHandler(e, setFields)} />
            </div>
        </Modal>
    );
};

export default Add_Contact;
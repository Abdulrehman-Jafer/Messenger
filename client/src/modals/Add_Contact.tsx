import { Dispatch, SetStateAction, useState, useEffect } from 'react';
import { Modal } from 'antd';
import { Input } from '@material-tailwind/react';
import { onChangeHandler } from '../utils/misc';
import api, { useCreateContactMutation } from '../redux/service/api';
import { toast } from 'react-hot-toast';
import { useAppDispatch } from '../redux/store';
import { addToContacts } from '../redux/features/contact-slice';
import { updateContactInfo } from '../redux/features/chat-slice';

const Add_Contact = ({ isModalOpen, setIsModalOpen, user_id, providedPublicNumber }: { isModalOpen: boolean, setIsModalOpen: Dispatch<SetStateAction<boolean>>, user_id: string, providedPublicNumber?: string }) => {
    const [fields, setFields] = useState<Record<string, any>>({
        saved_as: "",
        public_number: ""
    })

    const dispatch = useAppDispatch()

    useEffect(() => {
        setFields(prev => ({ ...prev, public_number: providedPublicNumber }))
    }, [])

    const [createContact, { isError, isLoading, isSuccess, error, data }] = useCreateContactMutation()

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
                dispatch(addToContacts(data.result))
                dispatch(updateContactInfo(data.result))
            }
        }
    }, [isLoading])

    const handleOk = async () => {
        await createContact({ ...fields, saved_by: user_id })
    };

    const handleCancel = () => {
        setIsModalOpen(false);
        setFields({
            saved_as: "",
            public_number: ""
        })
    };


    return (

        <Modal title="Create new contact" centered open={isModalOpen} onOk={handleOk} onCancel={handleCancel} okText={"Create"} okButtonProps={{ className: 'custom-ok-button', loading: isLoading, }}>
            <div className='flex flex-col gap-6'>
                <Input name="saved_as" type="text" size="lg" label="Name" required value={fields.saved_as} onChange={(e) => onChangeHandler(e, setFields)} />
                <Input name="public_number" type="text" size="lg" label="Contact's public number" required value={fields.public_number} onChange={(e) => onChangeHandler(e, setFields)} />
            </div>
        </Modal>
    );
};

export default Add_Contact;
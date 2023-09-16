import { Modal } from "antd";
import { Dispatch, SetStateAction } from "react";

export default function WarningModal({ isModalOpen, setIsModalOpen, warningText, handleOk, okText, title }: { isModalOpen: boolean, setIsModalOpen: Dispatch<SetStateAction<boolean>>, warningText: string, handleOk: () => void, okText: string, title: string }) {
    const handleCancel = () => {
        setIsModalOpen(false);
    };
    return (
        <Modal open={isModalOpen} title={title} okText={okText} onCancel={handleCancel} onOk={handleOk} okButtonProps={{ className: 'custom-ok-button', }}>
            <p>{warningText}</p>
        </Modal>
    )
}

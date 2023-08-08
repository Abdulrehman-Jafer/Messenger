import { Modal } from "antd";
import { Dispatch, SetStateAction } from "react";

export default function Warning({ isModalOpen, setIsModalOpen, warningText, handleOk }: { isModalOpen: boolean, setIsModalOpen: Dispatch<SetStateAction<boolean>>, warningText: string, handleOk: () => void }) {
    const handleCancel = () => {
        setIsModalOpen(false);
    };
    return (
        <Modal open={isModalOpen} title="Warning" okText={"Ok"} onCancel={handleCancel} onOk={handleOk} okButtonProps={{ className: 'custom-ok-button', }}>
            <p>{warningText}</p>
        </Modal>
    )
}

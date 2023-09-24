import { Dispatch, SetStateAction, useState, useEffect } from "react";
import { Modal } from "antd";
import { Input } from "@material-tailwind/react";
import { onChangeHandler } from "../utils/misc";
import { useCreateChatMutation } from "../redux/service/api";
import { toast } from "react-hot-toast";
import { useAppDispatch, useTypedSelector } from "../redux/store";
import { useNavigate } from "react-router-dom";
import { addNewChat } from "../redux/features/chat-slice";
import { addMessagesInChatspace } from "../redux/features/messages-slice";

const Create_Chat = ({
  isModalOpen,
  setIsModalOpen,
}: {
  isModalOpen: boolean;
  setIsModalOpen: Dispatch<SetStateAction<boolean>>;
}) => {
  const [fields, setFields] = useState<Record<string, any>>({
    isNameOrNumber: "contact_name",
    public_number: "",
    contact_name: "",
    contact: "",
  });
  const contactReducer = useTypedSelector(
    (selector) => selector.contactReducer
  );
  const User = useTypedSelector((selector) => selector.userReducer);
  const [createNewChatspace, { isError, isLoading, isSuccess, error, data }] =
    useCreateChatMutation();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const [message, setMessage] = useState("");

  useEffect(() => {
    let loaderId;
    if (isLoading) {
      loaderId = toast.loading("Processing your request");
    }
    if (!isLoading && (isSuccess || isError)) {
      toast.dismiss(loaderId);
      console.log({ data });
      isSuccess
        ? toast(`Created new chatspace`)
        : toast.error((error as any)?.data?.message || "Failed to Complete");
      if (isSuccess) {
        setIsModalOpen(false);
        if (data.responseCode == 201) {
          dispatch(addNewChat(data.result.chatspace));
          dispatch(
            addMessagesInChatspace({
              creatingNewChatspace: true,
              chatspace_id: data.result.message.belongsTo,
              newMessage: data.result.message,
            })
          );
          console.log({ result: data.result });
          navigate(`/chats/${data.result.chatspace._id}`);
        } else {
          dispatch(
            addMessagesInChatspace({
              chatspace_id: data.result.message.belongsTo,
              newMessage: data.result.message,
            })
          );
          navigate(`/chats/${data.result.chatspace._id}`);
        }
      }
    }
  }, [isLoading]);

  const handleOk = async () => {
    console.log({ fields, USERID: User._id });
    if (
      message.length == 0 ||
      (fields.public_number.length < 6 && fields.contact_name.length == 0)
    ) {
      return alert("Fill the form");
    }
    if (fields.isNameOrNumber == "public_number") {
      return await createNewChatspace({
        user_id: User._id,
        public_numbers: [User.public_number, fields.public_number],
        textMessage: message,
      });
    }
    return await createNewChatspace({
      user_id: User._id,
      public_numbers: [User.public_number, fields.contact.public_number],
      textMessage: message,
    });
  };

  const handleCancel = () => {
    setIsModalOpen(false);
  };

  return (
    <Modal
      title="Create new chat"
      centered
      open={isModalOpen}
      onOk={handleOk}
      onCancel={handleCancel}
      okText={"Create new Chat"}
      okButtonProps={{ className: "custom-ok-button", loading: isLoading }}
    >
      <div className="flex flex-col gap-6">
        <select
          name="isNameOrNumber"
          onChange={(e) => onChangeHandler(e, setFields)}
          className="font-[500] text-blue-900 border-b border-b-blue-300 outline-none p-2"
        >
          <option className="p-4" value="contact_name">
            Use saved contacts
          </option>
          <option className="p-4" value="public_number">
            Use public number
          </option>
        </select>
        {fields.isNameOrNumber == "contact_name" ||
        fields.isNameOrNumber == "" ? (
          <div>
            <Input
              name="contact_name"
              type="text"
              size="lg"
              label="Name"
              required
              value={fields.contact_name}
              onChange={(e) => onChangeHandler(e, setFields)}
            />
            <div className="mt-[1rem]">
              <h1 className="text-center font-bold">Contacts list</h1>
              {contactReducer.contacts
                .filter((c) =>
                  c.saved_as
                    .toLocaleLowerCase()
                    .startsWith(fields.contact_name.toLocaleLowerCase())
                )
                .splice(0, 5)
                .map((c) => {
                  return (
                    <p
                      key={c._id}
                      onClick={() =>
                        setFields((prev) => ({
                          ...prev,
                          contact_name: c.saved_as,
                          contact: c.contact,
                        }))
                      }
                      className="hover:bg-pink-red p-[1rem] border-b-2"
                    >
                      {c.saved_as}
                    </p>
                  );
                })}
            </div>
          </div>
        ) : (
          <Input
            name="public_number"
            type="text"
            size="lg"
            label="Public_number"
            required
            value={fields.public_number}
            onChange={(e) => onChangeHandler(e, setFields)}
          />
        )}
        <Input
          name="initial_message"
          type="text"
          size="lg"
          label="Write a message"
          required
          value={message}
          onChange={(e) => setMessage(e.target.value)}
        />
      </div>
    </Modal>
  );
};

export default Create_Chat;

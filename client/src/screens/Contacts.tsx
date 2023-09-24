import { useTypedSelector } from "../redux/store";
import { initializeContacts } from "../redux/features/contact-slice";
import { BsSearch } from "react-icons/bs";
import { useGetContactsQuery } from "../redux/service/api";
import Contact from "../components/Contact";
import { AiOutlinePlus } from "react-icons/ai";
import Add_Contact from "../modals/Add_Contact";
import { useState } from "react";
import Navbar from "../components/Navbar";
import useDispatchOnLoad from "../hooks/useDispatchOnLoad";
import no_data_found from "../assets/no_data_found.png";

export default function Contacts() {
  const [isContactModalOpen, setIsContactModalOpen] = useState(false);
  const [searchContact, setSearchContact] = useState("");
  const User = useTypedSelector((selector) => selector.userReducer);
  const contactReducer = useTypedSelector(
    (selector) => selector.contactReducer
  );
  const filteredContacts = contactReducer.contacts.filter((c) => {
    return c.saved_as.startsWith(searchContact);
  });
  const [contactsLoading] = useDispatchOnLoad(
    useGetContactsQuery,
    contactReducer.isInitialized,
    { user_id: User._id, Authorization: User.userToken },
    initializeContacts,
    ""
  );
  return (
    <>
      <section className="flex flex-col gap-2">
        <div className="sticky bg-light-gray pb-[2rem] bottom-boder-radius top-0 z-10 backdrop-blur-3xl p-[0.5rem]">
          <h3 className="text-pink-red text-2xl font-semibold mb-4">
            Contacts
          </h3>
          <div
            className="flex justify-between items-center bg-blue-gray-100 hover:bg-blue-gray-200 rounded-md p-3 cursor-pointer"
            onClick={() => setIsContactModalOpen(true)}
          >
            <h4 className="text-[18px]">Create new Contact</h4>
            <i className=" text-pink-red text-2xl">
              <AiOutlinePlus />
            </i>
          </div>
          <p className="text-center font-[500] my-4 text-pink-red">
            List of saved contacts
          </p>
          <div className="relative">
            <i className="absolute left-2 top-[1.3rem] text-gray-400">
              <BsSearch />
            </i>
            <input
              type="text"
              name="contact_search"
              placeholder="Search your contacts"
              value={searchContact}
              onChange={(e) => setSearchContact(e.target.value)}
              className="border inputBorder mt-1 indent-[0.75rem] w-full p-[0.9rem] rounded-md outline-none"
            />
          </div>
        </div>
        <div className=" flex flex-col gap-4 contacts-min-height">
          {contactReducer.contacts.length == 0 && (
            <div className="flex justify-center items-center contacts-min-height">
              <img
                src={no_data_found}
                alt={no_data_found}
                className="min-w-[250px] flex-shrink-0"
              />
            </div>
          )}
          {searchContact && filteredContacts.length == 0 ? (
            <div className="flex justify-center items-center contacts-min-height">
              <p className="text-3xl font-sans ADLaMFont">No Contact Found!</p>
            </div>
          ) : (
            filteredContacts.map((c) => {
              return (
                <Contact
                  contact={c.contact}
                  saved_as={c.saved_as}
                  key={c._id}
                  _id={c._id}
                />
              );
            })
          )}
        </div>
        <Navbar />
      </section>
      <Add_Contact
        isModalOpen={isContactModalOpen}
        setIsModalOpen={setIsContactModalOpen}
        user_id={User._id}
      />
    </>
  );
}
{
  /* 
: */
}

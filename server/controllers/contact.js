import Contact from "../models/contact.js"
import User from "../models/user.js"

const getContacts = async (req,res,next) => {
    try {
        const { user_id } = req.params;
        const contacts = await Contact.find({saved_by:user_id}).populate("contact").exec()
        return res.status(200).json({
            message:"Contacts retreiving Successful",
            contacts
        })
    } catch (error) {
        error.during = "retreiving contacts"
        error.status = 500
        next(error)
    }
}

const createContact = async (req,res,next) => {
  try {
    const {contact_id,saved_by,saved_as} = req.body;
    if(!contact_id || !saved_by || !saved_as){
        return res.status(400).json({
            message:"Bad request || incomplete body",
            body: req.body
        })
    }
    const doesUserExist = await User.exists({_id: contact_id})
    if(!doesUserExist){
       return res.status(404).json({
            message:"Invalid Contact Id",
            body: req.body
        })

    }
    const doesAlreadySaved = await Contact.exists({saved_by,contact:contact_id})
    if(doesAlreadySaved){
        return res.status(409).json({
            message:"Conflict || contact already exists",
            body: req.body
        })
    }
    const doesNameTaken = await Contact.exists({saved_as,saved_by})
    if(doesNameTaken){
        return res.status(409).json({
            message:"Conflict || name already taken",
            body: req.body
        })
    }
    const contact = new Contact({contact:contact_id,saved_as,saved_by})
    await contact.save()
    res.status(201).json({
        message:"New Contact Creation Successful",
        contact
    })
  } catch (error) {
    error.during = "creating Contact"
    error.status = 500
    next(error)
  }
}



export default {
    getContacts,
    createContact
}
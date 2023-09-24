# Messenger
**Note**: This app is currently under development.

**Introducing** a powerful and feature-rich chat application built with cutting-edge technologies to facilitate seamless communication between users. This chat app combines the real-time capabilities of Socket.IO, the front-end prowess of React with TypeScript, state management via Redux Toolkit, and a robust back end powered by Node.js, Express.js, JWT for authentication, and MongoDB as the database. It also incorporates Multer for efficient file handling and Mongoose for smooth MongoDB integration.


### Home Screen
![Home_Screen](https://firebasestorage.googleapis.com/v0/b/mern-app-61a6f.appspot.com/o/Messenger%2FHome_Screen.png?alt=media&token=99a0e51c-58e0-457d-8a41-52beb10c53ce)

### Setting Screen
![Settings_Screen](https://firebasestorage.googleapis.com/v0/b/mern-app-61a6f.appspot.com/o/Messenger%2FSetting_Screen.png?alt=media&token=0d13e249-aaaf-4571-b3e8-726bc9d220b1)


**Note**: Following To-do list is understandable me.It may be possible you will not be able to intercept the meaning of someof of the todos.
## To DO List
- Message typing should be a kind of a text area which will grow in height instead of growing
- send a optional attachedText field with a message
- separate the message Typing area in a separate component component
- videos should have a thumbnail saved which will be shown as a video poster and also the meta data like video title also be saved.
- user should be able to tag a message with his new message ( Via adding Reply field in the context menu)
- check is there a way that a mongo action will be triggered if some condition is met by a document in the collection.
- disable user to create chatspace with him/her-self --maybe let him just don't broadcast to himself
- add black list functionality at top(Just manage blacklist menu which will open a modal)
- May be remove three dots on the chat screen and put the logout on setting screen at the end too.
- unlink files on deleting a file-message
- fix the chatspace styling(it looks ugly)
- Validation
- add sent, seen functionalit which will show as like notification as new message
- Check if user lastLogin is 0 before signing the user in as to avoid conflict
- Intersection observer for loading previous chat
- Split the api endpoints of rtk querry and keep the related endpoints in separate files.
- Add support for other type of attachments like pdf,docx,text etc.
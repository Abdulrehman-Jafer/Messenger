import expressSession from "express-session"
import connectMongoDBSession from "connect-mongodb-session"

const mongoStore = connectMongoDBSession(expressSession)
const store = new mongoStore({
    uri: process.env.MONGO_URI,
    collection:"sessions"
})
store.on("error",function(err){
    console.log("session-store-error",err)
    next(err)
})

export default store
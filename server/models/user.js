import { Schema,Types,model, } from "mongoose";


const schema = new Schema({
    provider: {
        type: String,
        required: true
    },
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    image: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: function () {
          return this.provider == "Custom"
        }
    },
    google_uid: {
        type: String,
        required: function(){
            return this.provider == "Google"
        }
    },
    blockedContacts: [
        {
            type: Types.ObjectId,
            required: true
        }
    ],
    lastLogin: Number,
    
},{timestamps:true})

const User = new model("User",schema)
export default User;
// {
//     "user": {
//         "uid": "e25BojyHPfQrQvQ40Y31wxzgiKM2",
//         "email": "abdulrehmanjaferworks01233@gmail.com",
//         "emailVerified": true,
//         "displayName": "Abdulrehman Jafer",
//         "isAnonymous": false,
//         "photoURL": "https://lh3.googleusercontent.com/a/AAcHTtcwJmz8qwiJOqjtZXpt8Fyf4Myod7TrpbAyVI54TIPo9A=s96-c",
//         "providerData": [
//             {
//                 "providerId": "google.com",
//                 "uid": "100323096245627655902",
//                 "displayName": "Abdulrehman Jafer",
//                 "email": "abdulrehmanjaferworks01233@gmail.com",
//                 "phoneNumber": null,
//                 "photoURL": "https://lh3.googleusercontent.com/a/AAcHTtcwJmz8qwiJOqjtZXpt8Fyf4Myod7TrpbAyVI54TIPo9A=s96-c"
//             }
//         ],
//         "stsTokenManager": {
//             "refreshToken": "APZUo0SSfSZd0OVMR9eCG4eqmluhsnx4DYeGe7eaJeiaSCH5jHihDUEmjaYvGkFGtEgiVGnlxGG1MsHZTK7cYy2nwpnlNzyEi75IO3MWvzDyjOlcJ45Gdao9BFmNwfFmo8L8KC3QDYuOJxiTYl_Ph2vjNKU5KLlxw_-ziUYqBiMpgHqiwOcksm-DyiX8OrKe4ArYfTggb_wRf2ves4wqyhSjMjCiXFz-5eyl2hEgve9aYzh2inxd24Vpx9EVF2wIgrNWqVVOsuVUxMxi99q4cO4qqFcPj7nsBACrEW4N_NM-RV4JD_MD19LXQobFJKiPsoP1Fmijb2wb-u993vcM1Z5skUA1-5nVjjnTkuRI6r0hn5QqCr8m6cbBpZTDFuD1lnqLrd2VGmwKqTQvfQY7t8Rf4QtnQNnGyU0bEthE96PzTf1pAFXgH1ZpYJ584m28EDUwQOHgom96PuPvh9ivqmka-zEltyiY3A",
//             "accessToken": "eyJhbGciOiJSUzI1NiIsImtpZCI6ImE1MWJiNGJkMWQwYzYxNDc2ZWIxYjcwYzNhNDdjMzE2ZDVmODkzMmIiLCJ0eXAiOiJKV1QifQ.eyJuYW1lIjoiQWJkdWxyZWhtYW4gSmFmZXIiLCJwaWN0dXJlIjoiaHR0cHM6Ly9saDMuZ29vZ2xldXNlcmNvbnRlbnQuY29tL2EvQUFjSFR0Y3dKbXo4cXdpSk9xanRaWHB0OEZ5ZjRNeW9kN1RycGJBeVZJNTRUSVBvOUE9czk2LWMiLCJpc3MiOiJodHRwczovL3NlY3VyZXRva2VuLmdvb2dsZS5jb20vbWVzc2VuZ2VyLWNlMWE4IiwiYXVkIjoibWVzc2VuZ2VyLWNlMWE4IiwiYXV0aF90aW1lIjoxNjg5MDc1ODI0LCJ1c2VyX2lkIjoiZTI1Qm9qeUhQZlFyUXZRNDBZMzF3eHpnaUtNMiIsInN1YiI6ImUyNUJvanlIUGZRclF2UTQwWTMxd3h6Z2lLTTIiLCJpYXQiOjE2ODkwNzU4MjQsImV4cCI6MTY4OTA3OTQyNCwiZW1haWwiOiJhYmR1bHJlaG1hbmphZmVyd29ya3MwMTIzM0BnbWFpbC5jb20iLCJlbWFpbF92ZXJpZmllZCI6dHJ1ZSwiZmlyZWJhc2UiOnsiaWRlbnRpdGllcyI6eyJnb29nbGUuY29tIjpbIjEwMDMyMzA5NjI0NTYyNzY1NTkwMiJdLCJlbWFpbCI6WyJhYmR1bHJlaG1hbmphZmVyd29ya3MwMTIzM0BnbWFpbC5jb20iXX0sInNpZ25faW5fcHJvdmlkZXIiOiJnb29nbGUuY29tIn19.rjMoqPeYkhPVWArOghpqdK1WmdyU4K-tx522LQGbMqcILzn_va_mfybQyrLmO0YN8NuU_GLGmLR3WZU6uvV0dgIGv9x5GWTLsfX9AIVhxJXVUewNFK7ZjaPjQL4wPVo50q-XVNkQYst2Jzj-f2_gOuoqcw1W00BvJMfJWwtQcJG54fbrwKVFqiRJ6CzIQkvpiEykuXastBFVvsZTsh6BQVKRyflyUEmUsougtUO2pQOcCfoVWT_U5NLHW8N2n6LD6vE5jNXXJZd7UxIEu-GSCVnGSdQOQ4oKSjyMXyCgbkJCgEJS37vc1cPR_DN-ZsRXGwwkYuCpLJPEaL02comStw",
//             "expirationTime": 1689079424694
//         },
//         "createdAt": "1689063857685",
//         "lastLoginAt": "1689075824719",
//         "apiKey": "AIzaSyCXtzqgnkuKvx-g52XzgbxTSNuOoZf_bSk",
//         "appName": "[DEFAULT]"
//     },
//     "token": "ya29.a0AbVbY6PZ93w1yGDtaVJALqynsU7eW3EjIPu5IB6ZxwEeRcVNGqjDf3cB_GxGUR7dO77ySXRJhkzEHAeyP58tQjJa8uUchCD4CTW_Hi-8-QMjVSmpiF9QBuKE6h-HnagqNOpCZqjbOpvguDOc_fNTXdX-FRe3aCgYKARQSARMSFQFWKvPlQIpha0m8JCbOzNNjxBIiJw0163"
// }




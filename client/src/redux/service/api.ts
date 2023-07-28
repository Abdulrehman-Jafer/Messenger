import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

const baseUrl = "http://localhost:3000/";

export const api = createApi({
  reducerPath: "api",
  baseQuery: fetchBaseQuery({ baseUrl }),
  tagTypes: ["Contacts", "Chats"],
  endpoints: (builder) => ({
    createUser: builder.mutation<any, any>({
      query(requestBody) {
        return {
          url: "auth/signup",
          body: requestBody,
          method: "POST",
        };
      },
    }),
    singIn: builder.mutation<any, any>({
      query(requestBody) {
        return {
          url: "auth/signin",
          body: requestBody,
          method: "POST",
        };
      },
      // transformResponse: (res) => ,
    }),
    continueWithGoogle: builder.mutation<any, any>({
      query(requestBody) {
        return {
          url: "auth/continue-with-google",
          body: requestBody,
          method: "POST",
        };
      },
    }),
    validate: builder.query<any, any>({
      query: ({ Authorization, User_id }) => {
        return {
          url: "auth/validate-token",
          headers: {
            Authorization,
            User_id,
          },
        };
      },
    }),
    getContacts: builder.query<any, any>({
      query: ({ user_id, Authorization }) => {
        console.log(user_id);
        return {
          url: `contact/${user_id}`,
          headers: {
            Authorization,
          },
        };
      },
      providesTags: ["Contacts"],
    }),
    createContact: builder.mutation<any, any>({
      query(requestBody) {
        return {
          url: "/contact/create",
          body: requestBody,
          method: "POST",
        };
      },
      invalidatesTags: ["Contacts"],
    }),
    getChats: builder.query<any, any>({
      query: ({ user_id, Authorization }) => {
        return {
          url: `/chatspace/${user_id}`, //http://localhost:3000/chatspace/64b421f9e21fede38c9084ee
          headers: {
            Authorization,
          },
        };
      },
      providesTags: ["Chats"],
    }),
    createChat: builder.mutation<any, any>({
      query: (requsetBody) => {
        return {
          url: `chatspace/create`,
          method: "POST",
          body: requsetBody,
        };
      },
      invalidatesTags: ["Chats"],
    }),
  }),
});

export const {
  useCreateUserMutation,
  useSingInMutation,
  useValidateQuery,
  useContinueWithGoogleMutation,
  useGetContactsQuery,
  useCreateContactMutation,
  useCreateChatMutation,
  useGetChatsQuery,
} = api;

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
      query: ({ authorization, User_id }) => {
        return {
          url: "auth/validate-token",
          headers: {
            authorization,
            User_id,
          },
        };
      },
    }),
    getContacts: builder.query<any, any>({
      query: ({ user_id, authorization }) => {
        console.log(user_id);
        return {
          url: `contact/${user_id}`,
          headers: {
            authorization,
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
      invalidatesTags: ["Contacts", "Chats"],
    }),
    getChats: builder.query<any, any>({
      query: ({ user_id, authorization }) => {
        return {
          url: `/chatspace/${user_id}`, //http://localhost:3000/chatspace/64b421f9e21fede38c9084ee
          headers: {
            authorization,
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
    // getSpecificChat: builder.query<any, any>({
    //   query: ({ chatspace_id, authorization }) => {
    //     return {
    //       url: `/chatspace/getchat/${chatspace_id}`,
    //       headers: {
    //         authorization,
    //       },
    //     };
    //   },
    // }),
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
  // useGetSpecificChatQuery,
} = api;

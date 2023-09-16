import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

const baseUrl = "http://localhost:3000/";

export const api = createApi({
  reducerPath: "api",
  baseQuery: fetchBaseQuery({ baseUrl }),
  tagTypes: ["Contacts", "Chats", "Messages"],
  endpoints: (builder) => ({
    createUser: builder.mutation<any, any>({
      query(requestBody) {
        return {
          url: "user/auth/signup",
          body: requestBody,
          method: "POST",
          headers: {
            isSignUpFile: "true",
          },
        };
      },
    }),

    singIn: builder.mutation<any, any>({
      query(requestBody) {
        return {
          url: "user/auth/signin",
          body: requestBody,
          method: "POST",
        };
      },
    }),

    continueWithGoogle: builder.mutation<any, any>({
      query(requestBody) {
        return {
          url: "user/auth/continue-with-google",
          body: requestBody,
          method: "PUT",
        };
      },
    }),

    blockUser: builder.mutation<any, any>({
      query: (requestBody) => {
        return {
          url: "user/block",
          method: "PUT",
          body: requestBody,
        };
      },
    }),

    unBlockUser: builder.mutation<any, any>({
      query: (requestBody) => {
        return {
          url: "user/unblock",
          method: "PUT",
          body: requestBody,
        };
      },
    }),

    validateToken: builder.query<any, any>({
      query: ({ authorization, user_id }) => {
        return {
          url: `user/auth/validate-token?user_id=${user_id}`,
          headers: {
            authorization,
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
      invalidatesTags: ["Contacts"],
    }),

    getChatspaces: builder.query<any, any>({
      query: ({ user_id, authorization }) => {
        return {
          url: `/chatspace/${user_id}`, //http://localhost:3000/chatspace/64b421f9e21fede38c9084ee
          headers: {
            authorization,
          },
        };
      },
      providesTags: ["Chats", "Messages"],
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

    getAllChatSpaceMessages: builder.query<any, any>({
      query: ({ user_id }) => {
        return {
          url: `chatspace/getchat/all/${user_id}`,
          headers: {
            user_id,
          },
        };
      },
      keepUnusedDataFor: 0.001,
    }),

    deleteForMe: builder.mutation<any, any>({
      query: (requestBody) => {
        return {
          url: "message/deleteforme",
          method: "DELETE",
          body: requestBody,
        };
      },
    }),

    sendMessage: builder.mutation<any, any>({
      query: (requestBody) => {
        return {
          url: "message/send",
          method: "POST",
          body: requestBody,
        };
      },
    }),

    sendAttachmentMessage: builder.mutation<any, any>({
      query: (requestBody) => {
        return {
          url: "message/sendattachment",
          method: "POST",
          body: requestBody,
          formData: true,
          headers: {
            isChatFile: "true",
          },
        };
      },
      invalidatesTags: ["Messages"],
    }),

    deleteForEveyone: builder.mutation<any, any>({
      query: (requestBody) => {
        return {
          url: "message/deleteforeveyone",
          method: "DELETE",
          body: requestBody,
        };
      },
      invalidatesTags: ["Messages"],
    }),

    deleteChatspace: builder.mutation<any, any>({
      query: (requestBody) => {
        return {
          url: "chatspace/delete",
          method: "DELETE",
          body: requestBody,
        };
      },
      invalidatesTags: ["Messages"],
    }),

    addToArchive: builder.mutation<any, any>({
      query: (requestBody) => {
        return {
          url: "chatspace/archive/add",
          method: "PUT",
          body: requestBody,
        };
      },
      invalidatesTags: ["Chats"],
    }),

    removeFromArchive: builder.mutation<any, any>({
      query: (requestBody) => {
        return {
          url: "chatspace/archive/remove",
          method: "PUT",
          body: requestBody,
        };
      },
      invalidatesTags: ["Chats"],
    }),
  }),
});

export const {
  useCreateUserMutation,
  useSingInMutation,
  useValidateTokenQuery,
  useContinueWithGoogleMutation,
  useGetContactsQuery,
  useCreateContactMutation,
  useCreateChatMutation,
  useGetChatspacesQuery,
  useGetAllChatSpaceMessagesQuery,
  useDeleteForMeMutation,
  useDeleteForEveyoneMutation,
  useSendMessageMutation,
  useSendAttachmentMessageMutation,
  useDeleteChatspaceMutation,
  useAddToArchiveMutation,
  useRemoveFromArchiveMutation,
  useBlockUserMutation,
  useUnBlockUserMutation,
} = api;

export default api;

export const returnResponse = (res,responseCode,responseMessage,responseData,isSuccessful) => {
const fieldName = isSuccessful ? "result" : "body";
return res.status(responseCode).json({
        responseCode,
        responseMessage,
        responseCode,
        [fieldName]: responseData
    })
}
export const checkIsProvided = (...args) => {
  for (const value of args){
    if(!value){
        return false
    }
  }
  return true;
}

export const invalidDataResponse = (res,...args) =>{
    return res.status(400).json({
        responseCode: 400,
        responseText: "Invalid Request body",
        requestBody: {
            ...args
        }
    })
}
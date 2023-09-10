export const handle404 = (req,res,next)=>{
    console.log("endpoint does not exist",{body:req.body})
    return res.status(404).json({message:"EndPoint does not exists"})
}
import { Request, Response } from "express";


export const notFoundError =( 
  _req: Request,
  res: Response)=>{
res.status(404).json({success:false,message:"Route Not Found!!"})
  }
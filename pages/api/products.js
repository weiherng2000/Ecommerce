
import {mongooseConnect} from "@/lib/mongoose";
import { Product } from "@/models/Product";
import mongoose from "mongoose";

export default async function handle(req,res)
{ 
    const {method} = req;
    //we connect to our database
    await mongooseConnect();

    if (method === 'GET') {

      if (req.query?.id) 
      {
        res.json(await mongoose.model("Product").findOne({_id:req.query.id}));
      } 
      else 
      {
        res.json(await mongoose.model("Product").find());
      }

    }
    if(method === "POST")
    {
       const {title,description,price} = req.body;
       const productDoc = await mongoose.model("Product").create({
        title,
        description,
        price,
      });
        res.json(productDoc);
    }
}
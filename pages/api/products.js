
import {mongooseConnect} from "@/lib/mongoose";
import { Product } from "@/models/Product";
import mongoose from "mongoose";

export default async function handle(req,res)
{ 
    //Extracting the HTTP method from the request:
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
       const {title,description,price,images,category} = req.body;
       const productDoc = await mongoose.model("Product").create({
        title,
        description,
        price,
        images,
        category,
      });
        res.json(productDoc);
    }

    if(method === 'PUT')
    {
      const{title,description,price,images,category,_id} = req.body;
      //The API prototype.updateOne() of the Mongoose API is used to update 
      //documents in a collection. 
      //This method can be used on mongoose documents 
      //and on that document you can update various fields in one command.
      await mongoose.model("Product").updateOne({_id},{title,description,price,images,category});
      res.json(true);
    }

    if(method === 'DELETE')
    {
      //mongoosedb is using _id
       if(req.query?.id)
       {
          await mongoose.model("Product").deleteOne({_id:req.query?.id});
          res.json(true);
       }
    }
}
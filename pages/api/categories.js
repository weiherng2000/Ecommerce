import { Category } from "@/models/Category";
import mongoose from "mongoose";
import {mongooseConnect} from "@/lib/mongoose";

export default async function handle(req,res)
{
    const {method} = req;

    await mongooseConnect();
    //populate will allows us to see the properties in the parent property 
    if(method === 'GET')
    {
        res.json( await mongoose.model("Category").find().populate('parent'));
    }


    if(method === 'POST')
    {
        const {name,parentCategory} = req.body;
        const categoryDoc = await mongoose.model("Category").create({name,parent:parentCategory});
        res.json(categoryDoc);
    }

    if(method === 'PUT')
    {
        //updateOne takes in 2 arguments: 1st one is data we want to update,2nd one is the data we going to add in 
        const {name,parentCategory,_id} = req.body;
        const categoryDoc = await mongoose.model("Category").updateOne({_id},{name,parent:parentCategory});
        res.json(categoryDoc);
    }
    
    if (method === 'DELETE') 
    {
        const {_id} = req.query;
        await Category.deleteOne({_id});
        res.json('ok');
    }

}
import mongoose from "mongoose";
import { Schema, model, models } from "mongoose";

//ref references to the Category model
const CategorySchema = new Schema({
   
    name: {type:String,required:true},
    parent: {type:mongoose.Types.ObjectId, ref: 'Category'},
    properties: [{type:[Object]}]
});

export const Category = mongoose.models?.Category || mongoose.model("Category",CategorySchema);


import { Schema, model, models } from "mongoose";
import mongoose from "mongoose";


const ProductSchema = new Schema({
    title: {type: String, required: true},
    description: String,
    price: {type: Number, required: true},

})

export default mongoose.models.Product ||
  mongoose.model("Product", ProductSchema);
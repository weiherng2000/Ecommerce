import Layout from "@/components/Layout";
import { useState } from "react";
import axios from 'axios';

export default function NewProduct()
{
    const [title,setTitle] = useState('');
    const [description,setDescription] = useState('');
    const [price,setPrice] = useState('');
    //send a post request
    //The await keyword ensures that the function waits for the POST request to complete before continuing
    //data here is an object and we use a short hand method to name it
    async function createProduct(ev){
        ev.preventDefault();
       const data = {title,description,price}
       await axios.post('/api/products', data)
    }

    return(
        <Layout>
            <form onSubmit={createProduct}>
                <h1 >New Product</h1>
                <label>Product name</label>
                <input type = "text" placeholder="product name"
                value = {title} onChange= {ev => setTitle(ev.target.value)}
                />
                <label>Description</label>
                <textarea placeholder = "description" value = {description}
                onChange = {ev => setDescription(ev.target.value)}></textarea>
                <label>Price(in USD)</label>
                <input type = "number" placeholder = "price" value = {price} 
                onChange={ev => setPrice(ev.target.value)}/>

                <button type = "submit" className = "btn-primary">Save</button>

            </form>
            
       </Layout>
    );
   
}
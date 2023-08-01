import Layout from "@/components/Layout";
import { useState } from "react";
import axios from 'axios';
import { useRouter } from "next/router";

export default function ProductForm({_id,title : existingTitle,description: existingDescription,price: existingPrice,}){
    const [title,setTitle] = useState(existingTitle || '');
    const [description,setDescription] = useState(existingDescription || '');
    const [price,setPrice] = useState(existingPrice || '');
    const [goToProducts,setGoToProducts] = useState(false);
    const router = useRouter();

    //send a post request
    //The await keyword ensures that the function waits for the POST request to complete before continuing
    //data here is an object and we use a short hand method to name it
    async function saveProduct(ev){
        ev.preventDefault();
        const data = {title,description,price};
        //if id is not undefined we will update else we create
        if(_id)
        {
            //update product
            await axios.put('/api/products',{...data,_id});
        }
        else{
            //create
            await axios.post('/api/products', data);
           
        }
        setGoToProducts(true);
      
    }
    if(goToProducts)
    {
        router.push('/products');
    }

    return(
        <Layout>
            <form onSubmit={saveProduct}>
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
import Layout from "@/components/Layout";
import { useEffect, useState } from "react";
import axios from 'axios';
import { useRouter } from "next/router";
import Spinner from "./spinner";
import { ReactSortable } from "react-sortablejs";

export default function ProductForm({_id,title : existingTitle,description: existingDescription,price: existingPrice,images:existingImages,category:assignedCategory}){
    const [title,setTitle] = useState(existingTitle || '');
    const [description,setDescription] = useState(existingDescription || '');
    const [category,setCategory] = useState(assignedCategory||'');
    const [price,setPrice] = useState(existingPrice || '');
    const [images,setImages] = useState(existingImages || []);
    const [goToProducts,setGoToProducts] = useState(false);
    const [isUploading,setIsUploading] = useState(false);
    const [categories,setCategories] = useState([]);
    const router = useRouter();
    useEffect(() =>{
        axios.get('/api/categories').then(result => {
            setCategories(result.data);
        })
    },[])

    //send a post request
    //The await keyword ensures that the function waits for the POST request to complete before continuing
    //data here is an object and we use a short hand method to name it
    //preventdefault prevents the browser fro refreshing
    async function saveProduct(ev){
        ev.preventDefault();
        const data = {title,description,price,images,category};
        //if id is not undefined we will update else we create
        //put vs post: put is best used when updating data while post is for creating new data
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

    async function uploadImages(ev)
    {
        const files = ev.target?.files;
        //we use formdata instead of json object
        if(files?.length > 0)
        {
            setIsUploading(true);
            const data = new FormData();
            for( const file of files)
            {
                data.append('file',file);
            }
            const res = await axios.post('/api/upload', data);
            setImages(oldImages =>{
                //create a new array by merging the 2 arrays with all the images and new link
                return [...oldImages, ...res.data.links];
            });
            setIsUploading(false);
            

        }
    }

    function updateImagesOrder(images)
    {
        setImages(images);
    }

    return(
        //!! before images length to convert it to boolean
        <Layout>
            <form onSubmit={saveProduct}>

                <label>Product name</label>
                <input type = "text" placeholder="product name"
                value = {title} onChange= {ev => setTitle(ev.target.value)}
                />

                <label>Category</label>
                <select value = {category} onChange={ev => setCategory(ev.target.value)}>
                    <option value = "">Uncategorized</option>
                    {categories.length > 0 && categories.map(c =>(
                        <option value = {c._id}>{c.name}</option>
                    ))}
                </select>

                <label>
                    Photos
                </label>
                <div className="mb-2 flex flex-wrap gap-1">
                    <ReactSortable 
                    className = "flex flex-wrap gap-1"
                    list = {images} setList = {updateImagesOrder}>
                    {!!images?.length && images.map(link => (
                        <div key = {link} className = "h-24">
                            <img src= {link} alt="" className = "rounded-lg"/>
                        </div>
                    ))}
                    </ReactSortable>
                    {isUploading && (
                        <div className = "h-24  flex items-center">
                            <Spinner/>
                        </div>
                    )}
                    <label className = "w-24 h-24 cursor-pointer text-center flex items-center justify-center text-sm gap-1 text-gray-500 rounded-lg bg-gray-300">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5" />
                        </svg>

                        <div>
                            Upload
                        </div>
                        <input type ="file" onChange = {uploadImages} className="hidden"/>

                    </label>
                  
                </div>
                <label>Description</label>
                <textarea placeholder = "description" value = {description}
                onChange = {ev => setDescription(ev.target.value)}></textarea>
                <label>Price(in USD)</label>
                <input type = "number" placeholder = "price" value = {price} 
                onChange={ev => setPrice(ev.target.value)}/>

                <button type = "submit" className = "btn-primary">Save</button>

            </form>
            
       </Layout>
       //when we save the image we want to send it to to the product schema in mongodb
       );
}
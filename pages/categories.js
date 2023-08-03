import Layout from "@/components/Layout";
import { useEffect, useState } from "react";
import axios from "axios";
import { withSwal } from 'react-sweetalert2';

function Categories({swal})
{
    const [editedCategory, setEditedCategory] = useState(null);
    const [name,setName] = useState('');
    const [categories,setCategories] = useState([]);
    const [parentCategory,setParentCategory] = useState('');
    
    useEffect(()=> {
        fetchCategories();
    },[]) ;

    function fetchCategories()
    {
        axios.get('/api/categories').then(result => {
            setCategories(result.data);
        });
    }

    //setName to clear the input field
    async function saveCategory(ev)
    {
        ev.preventDefault();
        const data = {name,parentCategory};
        //if we are editing only we also need to id to update
        //we will merge the data with the id : editedcatergory_id
        if(editedCategory)
        {
             data._id = editedCategory._id;
             await axios.put('/api/categories',data);
             setEditedCategory(null);
        }
        else
        {
            await axios.post('/api/categories',data);
        }

        setName('');
        fetchCategories();
    }

    function editCategory(category)
    {
       setEditedCategory(category);
       setName(category.name);
       setParentCategory(category.parent?._id);
    }

    function deleteCategory(category)
    {
            swal.fire(
            {
            title: 'Are you sure?',
            text: `Do you want to delete ${category.name}?`,
            showCancelButton: true,
            cancelButtonText: 'Cancel',
            confirmButtonText: 'Yes, Delete!',
            confirmButtonColor: '#d55',
            reverseButtons: true,
            }).then(async result => 
            {
                if (result.isConfirmed) 
                {
                    const {_id} = category;
                    await axios.delete('/api/categories?_id='+_id);
                    //after we delete we fetch again to re display the data
                    fetchCategories();
                }
            });
    }
    return(
       <Layout>
           <h1>Categories</h1>
           <label> {editedCategory
          ? `Edit category ${editedCategory.name}`
          : 'Create new category'}
          </label>

           <form onSubmit = {saveCategory}className = "flex gap-1">
              
              <input  onChange = {ev => setName(ev.target.value)} value = {name} className = "mb-0" type = "text" placeholder = {'Category name'}/>
              <select className="mb-0" value = {parentCategory} onChange={ev => setParentCategory(ev.target.value)}>
                <option value = "">No parent category</option>
                {categories.length > 0 && categories.map(
                    category =>(
                        <option value = {category._id}>{category.name}</option>
                    )
                )}
              </select>
              <button type = "submit" className = "btn-primary py-1">Save</button>
           
           </form>
           <table className = "basic mt-4">
             <thead>
                <tr>
                    <td>Category name</td>
                    <td>Parent category</td>
                    <td></td>
                </tr>
             </thead>
             <tbody>
                {categories.length > 0 && categories.map(
                    category =>(
                        <tr>
                            <td>{category.name}</td>
                            <td>{category?.parent?.name}</td>
                            <td>
                                <button onClick = {()=> editCategory(category)} className = "btn-primary mr-1">Edit</button>
                                
                                <button onClick = {() => deleteCategory(category)}className = "btn-primary">Delete</button>
                            </td>
                        </tr>
                    )
                )}
             </tbody>
           </table>
       </Layout>
    );

}

//use Categories as components inside the withSwal
export default withSwal(({swal}, ref) => (
    <Categories swal={swal} />
  ));
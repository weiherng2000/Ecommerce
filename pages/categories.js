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
    const [properties,setProperties] = useState([]);
    
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
        const data = {name,
            parentCategory,
            properties: properties.map(p=> ({name: p.name,values: p.values.split(',')}))};
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
        
        //reset the input fields
        setName('');
        setParentCategory('');
        setProperties([]);
        fetchCategories();
    }

   
    function editCategory(category){
        setEditedCategory(category);
        setName(category.name);
        setParentCategory(category.parent?._id);
        setProperties(category.properties);
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

    function addProperty(){
        setProperties(prev=>{
            return [...prev,{name:'',values:''}]
        });
    }
    //alows us to edit the input field
    function handlePropertyNameChange(index,property,newName)
    {
        //we use prev values 
        setProperties(prev => {
           const properties = [...prev];
           properties[index].name = newName;
           return properties;
        });
    }
    //allows us to edit the input field
    function handlePropertyValuesChange(index,property,newValues)
    {
        //we use prev values 
        setProperties(prev => {
           const properties = [...prev];
           properties[index].values = newValues;
           return properties;
        });
    }

    function removeProperty(indexToRemove)
    {
        setProperties(prev =>{
           return [...prev].filter((p,pIndex) =>{
              return pIndex !== indexToRemove;
           });

        });
    }

    return(
        //when we edit we remove the table below
       <Layout>
           <h1>Categories</h1>
           <label> {editedCategory
          ? `Edit category ${editedCategory.name}`
          : 'Create new category'}
          </label>

           <form onSubmit = {saveCategory}>
              <div className = "flex gap-1">
                    <input  onChange = {ev => setName(ev.target.value)} value = {name} className = "mb-0" type = "text" placeholder = {'Category name'}/>
                    <select className="mb-0" value = {parentCategory} onChange={ev => setParentCategory(ev.target.value)}>
                        <option value = "">No parent category</option>
                        {categories.length > 0 && categories.map(
                            category =>(
                                <option value = {category._id}>{category.name}</option>
                            )
                        )}
                    </select>

              </div>
              <div className = "mb-2">
                <label className = "block">Properties</label>
                <button  onClick = {addProperty} type = "button" className = "btn-default text-sm mb-2">Add new property</button>
                {properties.length > 0 && properties.map( (property,index) => (
                    <div className="flex gap-1 mb-2">
                        <input type="text"
                                value={property.name}
                                className="mb-0"
                                onChange={ev => handlePropertyNameChange(index,property,ev.target.value)}
                                placeholder="property name (example: color)"/>
                        <input type="text"
                                className="mb-0"
                                onChange={ev =>
                                handlePropertyValuesChange(
                                    index,
                                    property,ev.target.value
                                )}
                                value={property.values}
                                placeholder="values, comma separated"/>
                        <button
                            onClick={() => removeProperty(index)}
                            type="button"
                            className="btn-red">
                            Remove
                        </button>
                    </div>
                ))}
              </div>
              <div className = "flex gap-1">

                {editedCategory && (
                    <button type = "button" onClick = {() => {setEditedCategory(null); setName(''); setParentCategory(''); setProperties([]);}} className = "btn-default">Cancel</button>
                )}
                
                <button type = "submit" className = "btn-primary py-1">Save</button>

              </div>
             
           
           </form>
           {!editedCategory && (
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
           )}
         
       </Layout>
    );

}

//use Categories as components inside the withSwal
export default withSwal(({swal}, ref) => (
    <Categories swal={swal} />
  ));
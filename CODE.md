## Code Stucture 

## Frameworks used
React spinner tools - for spinning animation
multiparty - to upload img files of different type etc png,jpg
react sortable - sort pictures?
sortable js- used for sorting of pictures
mongoose
axios
mime
heroicons -used to put nice icons pictures
react-sweetalert2 -used to make alert boxes

## Ecommerce Admin Code

## (Components Section)
Nav js is the navigation bar 
Layout js is the layout of the general admin page with nav js in it
Layout js can be used like <Layout>....random code</Layout>
Spinner js contains code from the react spinner tools
ProductForm contains props from the mongoDB
ProductForm uses layout component and is the page where we try to input the product info we are trying to add or update
ProductForm useState is based on the props
saveproduct function used to save product info we type in

## lib
Mongoosejs is to connect to the MongoDatabase
Mongodb.js :In summary, clientPromise is a Promise that resolves to the connected MongoDB client object, and it is used to manage the asynchronous process of connecting to the MongoDB server in a controlled and efficient manner.

## models
Product js is a schema which is an object containing data fields.
it sets up the Mongoose model that can be used to create and interact with "Product" objects in the database.

## pages

product.js provides the UI page where we can add,delete or edit the products.
it also uses a get request to api/products to get the data to display on the UI

index.js has the ui for the dashboard and is the first page we see after logging in

## pages api 
products js here will return a repsonse object based on the method used (get/post/put)

## pages api auth
[...nextauth].js contains the auth code needed for google login

## pages product delete/edit
[...id].js is to help delete or edit any exisiting product displayed on the pages where product is.




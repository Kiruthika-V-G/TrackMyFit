import mongoose from "mongoose";

//Mongoose acts as an intermediary (or middleman) 
// between your MongoDB database and your server-client app 
// (like your trackmyfit Node.js/Express backend and React frontend) 
// to make CRUD operations (Create, Read, Update, Delete) easier and more organized.
const UserSchema = new mongoose.Schema(
    {
        name : {
            type : String,
            required : true
        },
        email : {
            type : String,
            required : true,
            unique : true
        },
        img : {
            type : String,
            default : null
        },
        password: {
            type: String,
            required: true,
          },
        age : {
            type : Number
        },

    },{timestamps : true}
)

export default mongoose.model("User", UserSchema);
//model(modelname,schema that links to collection)

/* 
In timestamps : true, Mongoose automatically adds two fields to every document in the collection:
createdAt: A Date field recording when the document was created.
updatedAt: A Date field recording when the document was last updated.
*/
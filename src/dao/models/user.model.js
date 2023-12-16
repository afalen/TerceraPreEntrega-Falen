import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
    first_name: String,
    last_name: String,
    email: String,
    age: Number,
    password: String,
    cart: {type: mongoose.Schema.Types.ObjectId, ref:"carts"},
    role: {type: String, default: "user"},
    documents:{
        type:[
            {
                name: String ,
                reference: String
            }

        ],
        default: []
    },
    last_connection: { type: Date, default: Date.now },
    hasImgProfile: {type: Boolean, default: false},
    ImgProfile: { type: String, default: ""}
})

userSchema.pre('find', function(){
    this.populate("cart")
})

export const UserModel = mongoose.model("users", userSchema)

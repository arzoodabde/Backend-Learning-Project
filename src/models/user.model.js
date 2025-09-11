import mongoose, {Schema} from "mongoose";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";

//Creating User Schema
const userSchema = new Schema({
    username : {
        type : String,
        required : true,
        unique : true,
        lowercase : true,
        trim : true,
        index : true
    },
    email : {
        type : String,
        required : true,
        unique : true,
        lowercase : true,
        trim : true
    },
    fullName : {
        type : String,
        required : true,
        trim : true,
        index : true
    },
    avatar : {
        type : String, // cloudinary url used for avatar
        required : true,
    },
    coverImage : {
        type : String, //cloudinary url used for avatar
    },
    watchHistory : [
        {
            type : Schema.Types.ObjectId,
            ref : "Video"
        }
    ],
    password : {
        type : String,
        required : [true, 'Password is required']
    },
    refreshToken : {
        type : String
    }
},
{
    timestamps : true
}
);

// Hash password before save
userSchema.pre("save", async function(next){
    if( !this.isModified("password")) return next();
    this.password = bcrypt.hash(this.password, 10)
    next()
})


//check if password is correct or not
userSchema.methods.isPasswordCorrect = async function(password){
    return await bcrypt.compare(password, this.password)
}

// Generate Access Token
userSchema.methods.generateAccessToken = function(){
    return jwt.sign(
        {
            _id : this._id,
            email : this.email,
            username : this.username,
            fullName : this.fullName
        },
        process.env.ACCESS_TOKEN_SECRET,
        {
            expiresIn : process.env.ACCESS_TOKEN_EXPIRY
        }
    )
}

// Generate Refresh Token
userSchema.methods.generateRefreshToken = function(){
    return jwt.sign(
        {
            _id : this._id,
        },
        process.env.REFRESH_TOKEN_SECRET,
        {
            expiresIn : process.env.REFRESH_TOKEN_EXPIRY
        }
    )

}



export const User = mongoose.model("User",userSchema)
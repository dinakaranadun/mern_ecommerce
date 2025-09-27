import mongoose from 'mongoose'
import validator from "validator";
import bcrypt from 'bcryptjs'


const userSchema = new mongoose.Schema({
    userName:{
        type:String,
        required:[true,'User name is required'],
        minLenght:2,
        maxLenght:50
    },
    email:{
        type:String,
        required:[true,'Email is required'],
        unique:true,
        trim:true,
        validate:{
            validator:(value)=>validator.isEmail(value),
            message:'Please enter a valid email address'
        }
    },
    password:{
        type:String,
        required:[true,'Password is required'],
        validate:{
            validator:(value)=>validator.isStrongPassword(value,{
                minLength: 8,
                minLowercase: 1,
                minUppercase: 1,
                minNumbers: 1,
                minSymbols: 1
            }),
            message:'Password must be at least 8 characters long and include 1 uppercase, 1 lowercase, 1 number and 1 symbol'
        }

     },
    tokenVersion: { type: Number, default: 0 }

},{timestamps:true});

userSchema.pre('save',async function(next) {
    if(!this.isModified('password')){
        next();
    }
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password,salt);
});

 userSchema.methods.matchPasswords = async function(enteredPassword) {
    return await bcrypt.compare(enteredPassword,this.password);
}

const User = mongoose.model('User',userSchema);
export default User;
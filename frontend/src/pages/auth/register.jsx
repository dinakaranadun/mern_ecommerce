// @ts-nocheck
import CommonForm from "@/components/common/form";
import { registerFormControls } from "@/config";
import { setUser } from "@/store/auth-slice/authSlice";
import { useSignUpMutation } from "@/store/auth-slice/authSliceAPI";
import { useState } from "react";
import { useDispatch } from "react-redux";
import { Link, Navigate, useNavigate } from "react-router";
import { toast } from "react-toastify";


const initialState ={
  userName:'',
  email:'',
  password:''
}

const AuthRegister = () => {
  const[formData,setFormData] = useState(initialState);

  const [signUp,{isLoading}] = useSignUpMutation();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const onSubmit = async (e)=>{
    e.preventDefault();

    if (!formData.userName || !formData.email || !formData.password) {
      toast.error("Please fill in all fields");
      return;
    }

    try {
      const res = await signUp(formData).unwrap();
      dispatch(setUser({...res}))
      navigate('/')

    } catch (error) {
      toast.error(error?.data?.message || error.error);
    }
    
  }


  return (
    <div className="mx-auto w-full max-w-md space-y-6">
      <div className="text-center">
        <h1 className="text-3xl font-bold tracking-tight text-foreground">Create a New Account</h1>
        <div className="my-5">
          <CommonForm registerFormControls={registerFormControls} buttonText={'Sign Up'} formData={formData} setFormData={setFormData} onSubmit={onSubmit} isLoading={isLoading}/>
        </div>
        <p className="mt-2">Already have an account? <Link className="font-medium text-primary hover:underline " to='/auth/login'>Login</Link></p>
      </div>
    </div>
  )
}

export default AuthRegister;
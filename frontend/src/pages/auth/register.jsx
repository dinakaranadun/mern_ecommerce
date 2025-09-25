import CommonForm from "@/components/common/form";
import { registerFormControls } from "@/config";
import { useState } from "react";
import { Link } from "react-router";

const initialState ={
  userName:'',
  email:'',
  password:''
}

const AuthRegister = () => {
  const[formData,setFormData] = useState(initialState);

  const onSubmit = (e)=>{e.preventDefault()}


  return (
    <div className="mx-auto w-full max-w-md space-y-6">
      <div className="text-center">
        <h1 className="text-3xl font-bold tracking-tight text-foreground">Create a New Account</h1>
        <div className="my-5">
          <CommonForm registerFormControls={registerFormControls} buttonText={'Sign Up'} formData={formData} setFormData={setFormData} onSubmit={onsubmit}/>
        </div>
        <p className="mt-2">Already have an account? <Link className="font-medium text-primary hover:underline " to='/auth/login'>Login</Link></p>
      </div>
    </div>
  )
}

export default AuthRegister;
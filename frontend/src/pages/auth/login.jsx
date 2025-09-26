import CommonForm from "@/components/common/form";
import { loginFormControls } from "@/config";
import { useState } from "react";
import { Link } from "react-router";

const initialState ={
  email:'',
  password:''
}
const AuthLogin = () => {

  const[formData,setFormData] = useState(initialState);
  
  const onSubmit = (e)=>{e.preventDefault()}

  return (
    <div className="mx-auto w-full max-w-md space-y-6">
      <div className="text-center">
        <h1 className="text-3xl font-bold tracking-tight text-foreground">SignIn to Your Account</h1>
        <div className="my-5">
          <CommonForm registerFormControls={loginFormControls} buttonText={'Login'} formData={formData} setFormData={setFormData} onSubmit={onSubmit}/>
        </div>
        <p className="mt-2">Don't have an account? <Link className="font-medium text-primary hover:underline " to='/auth/register'>SignUp</Link></p>
      </div>
    </div>
  )
}

export default AuthLogin;
import CommonForm from "@/components/common/form";
import { loginFormControls } from "@/config";
import { setUser } from "@/store/auth-slice/authSlice";
import { useLoginMutation } from "@/store/auth-slice/authSliceAPI";
import { useState } from "react";
import { useDispatch } from "react-redux";
import { Link, useNavigate } from "react-router";
import { toast } from "react-toastify";

const initialState ={
  email:'',
  password:''
}
const AuthLogin = () => {

  const[formData,setFormData] = useState(initialState);
  const [signIn,{isLoading}] = useLoginMutation();

  const dispatch = useDispatch();
  const navigate = useNavigate();


  
  const onSubmit = async(e)=>{
    e.preventDefault()
    if(!formData.email || !formData.password){
      toast.error("please fill in the all fields");
      return;
    }

    try {
      const res = await signIn(formData).unwrap();
      dispatch(setUser(res.data)); 
      navigate('/')
      
    } catch (error) {
      if (error?.status === "FETCH_ERROR" || error?.error?.includes("Failed to fetch")) {
          toast.error("Sorry..Something Went Wrong");
      } else {
        toast.error(error?.data?.message || error.error || "Something went wrong");
      }
    }

  }

  return (
    <div className="mx-auto w-full max-w-md space-y-6">
      <div className="text-center">
        <h1 className="text-3xl font-bold tracking-tight text-foreground">SignIn to Your Account</h1>
        <div className="my-5">
          <CommonForm registerFormControls={loginFormControls} buttonText={'Login'} formData={formData} setFormData={setFormData} onSubmit={onSubmit} isLoading={isLoading}/>
        </div>
        <p className="mt-2">Don't have an account? <Link className="font-medium text-primary hover:underline " to='/auth/register'>SignUp</Link></p>
      </div>
    </div>
  )
}

export default AuthLogin;
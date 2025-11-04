import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Spinner } from '@/components/ui/shadcn-io/spinner'
import { TabsContent } from '@/components/ui/tabs'
import { selectUser } from '@/store/auth-slice/authSlice'
import { useUpdateProfileMutation } from '@/store/auth-slice/authSliceAPI'
import { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import { toast } from 'react-toastify'


const initialState = {
  userName:'',
  email:''
}

const PersonalInfoTab = () => {
  const user = useSelector(selectUser)
  const [formData,setFormData] = useState(initialState);
  const [updateUser,{isLoading}] = useUpdateProfileMutation();

  useEffect(()=>{
    setFormData(user);
  },[user]);

  const handleSubmit = async()=>{
    try {
      const res = await updateUser(formData).unwrap();
      if(res.success){
              toast.success(res.message);
        }
    } catch (error) {
      if (error?.status === "FETCH_ERROR" || error?.error?.includes("Failed to fetch")) {
        toast.error("Sorry..Something Went Wrong");
      } else {
        toast.error(error?.data?.message || error.error || "Something went wrong");
      }
    } 
  }

  

  return (
    <TabsContent value="account" className="flex justify-center">
        <div className="w-full max-w-lg">
            <Card>
                <CardHeader>
                    <CardTitle>Account</CardTitle>
                    <CardDescription>
                      Update your account details below.
                    </CardDescription>
                </CardHeader>
                <CardContent className="grid gap-6">
                    <div className="grid gap-3">
                      <Label htmlFor="tabs-demo-name">Name</Label>
                      <Input id="userName"
                      type="text"
                      value={formData.userName || ""}
                      onChange={(e) => setFormData({ ...formData, userName: e.target.value })}
                      />
                    </div>
                    <div className="grid gap-3">
                      <Label htmlFor="tabs-demo-username">Email</Label>
                      <Input
                        id="email"
                        type="email"
                        value={formData.email || ""}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      />
                    </div>
                </CardContent>
                <CardFooter>
                    <Button className="w-full md:w-auto" onClick={()=>handleSubmit()}>{isLoading?<Spinner/>:'Save Changes'}</Button>
                </CardFooter>
            </Card>
        </div>
    </TabsContent>
  )
}


export default PersonalInfoTab;
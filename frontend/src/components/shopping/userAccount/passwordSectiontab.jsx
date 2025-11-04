import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Spinner } from '@/components/ui/shadcn-io/spinner'
import { TabsContent } from '@/components/ui/tabs'
import { useUpdateProfileMutation } from '@/store/auth-slice/authSliceAPI'
import { AlertCircle } from 'lucide-react'
import { useState } from 'react'
import { toast } from 'react-toastify'

const initialState = {
  currentPassword:'',
  password:'',
  confirmPassword:''
}

const PasswordSectiontab = () => {
  const [updatePassword,{isLoading}] = useUpdateProfileMutation();
  const [formData,setFormData] = useState(initialState);
  const [passwordError, setPasswordError] = useState('');


  const handleConfirmPasswordChange = (e) => {
    const confirmPass = e.target.value;
    setFormData({...formData, confirmPassword: confirmPass});
    
    if (confirmPass && formData.password && confirmPass !== formData.password) {
      setPasswordError('Passwords do not match');
    } else {
      setPasswordError('');
    }
  };


  const handlePasswordChange = (e) => {
    const newPass = e.target.value;
    setFormData({...formData, password: newPass});
    
    if (formData.confirmPassword && newPass !== formData.confirmPassword) {
      setPasswordError('Passwords do not match');
    } else {
      setPasswordError('');
    }
  };

  const handleSubmit = async() => {
    if (!formData.currentPassword || !formData.password || !formData.confirmPassword) {
      toast.error('Please fill in all fields');
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      toast.error('Passwords do not match');
      return;
    }

    try {
      const res = await updatePassword(formData).unwrap();
      if(res.success){
        toast.success(res.message);
        setFormData(initialState);
        setPasswordError(''); 
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
    <TabsContent value="password" className="flex justify-center">
      <div className="w-full max-w-lg">
        <Card>
          <CardHeader>
            <CardTitle>Password</CardTitle>
            <CardDescription>
              Change your password here.
            </CardDescription>
          </CardHeader>
          <CardContent className="grid gap-6">
            <div className="grid gap-3">
              <Label htmlFor="tabs-current">
                Current password
              </Label>
              <Input 
                id="tabs-current" 
                type="password" 
                value={formData.currentPassword}
                onChange={(e)=>setFormData({...formData,currentPassword:e.target.value})}  
              />
            </div>
            <div className="grid gap-3">
              <Label htmlFor="tabs-new">New password</Label>
              <Input 
                id="tabs-new" 
                type="password" 
                value={formData.password}
                onChange={handlePasswordChange} 
              />
            </div>
            <div className="grid gap-3">
              <Label htmlFor="tabs-confirm">Confirm password</Label>
              <Input 
                id="tabs-confirm" 
                type="password" 
                value={formData.confirmPassword}
                onChange={handleConfirmPasswordChange}
                className={passwordError ? 'border-red-500' : ''}
              />
              {passwordError && (
                <div className="flex items-center gap-2 text-sm text-red-500 mt-1">
                  <AlertCircle className="h-4 w-4" />
                  <span>{passwordError}</span>
                </div>
              )}
            </div>
          </CardContent>
          <CardFooter>
            <Button 
              className="w-full md:w-auto" 
              onClick={handleSubmit}
              disabled={isLoading || !!passwordError}
            >
              {isLoading ? <Spinner/> : 'Change Password'}
            </Button>
          </CardFooter>
        </Card>
      </div>
    </TabsContent>
  )
}

export default PasswordSectiontab
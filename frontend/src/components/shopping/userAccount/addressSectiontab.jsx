import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { TabsContent } from '@/components/ui/tabs'
import { addressFormControls } from '@/config'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Checkbox } from '@/components/ui/checkbox'
import { useState } from 'react'
import { Edit2, Check, Plus, X, ChevronDown, Trash2Icon } from 'lucide-react'
import { toast } from 'react-toastify'
import { useAddAddressMutation, useDeleteAddressMutation, useEditAddressMutation, useGetAddressQuery, useMakeIdDefaultMutation } from '@/store/user/userAccountSlice'
import { Spinner } from '@/components/ui/shadcn-io/spinner'

const initialState = {
  line1: "",
  line2: "",
  city: "",
  province: "",
  postalCode: "",
  country: "srilanka",
  phone: "",
  type: "home",
  isDefault: false,
}

const AddressSectionTab = () => {
  const [formData, setFormData] = useState(initialState);
  const [addressId, setAddressId] = useState(null);
  const [loadingAddressId, setLoadingAddressId] = useState(null);
  const [showForm, setShowForm] = useState(false);

  const {data:addressess,isLoading:isLoadingAddresses} = useGetAddressQuery();
  const [addNewAddress,{isLoading:isAddingAddress}] = useAddAddressMutation();
  const [editAddress,{isLoading:isModifyingAddress}] = useEditAddressMutation();
  const [removeAddress] = useDeleteAddressMutation();
  const [makeDefault] = useMakeIdDefaultMutation();

  const isEditMode = addressId !== null;
  const isSubmiting = isAddingAddress || isModifyingAddress;

  const handleChange = (name, value) => {
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleEdit = (address) => {
    setAddressId(address._id)
    setFormData(address)
    setShowForm(true)
    setTimeout(() => {
      document.getElementById('address-form')?.scrollIntoView({ behavior: 'smooth', block: 'nearest' })
    }, 100)
  }

  const handleMakeDefault = async(addressId) => {
    setLoadingAddressId(addressId);

    try {
      const res = await makeDefault(addressId).unwrap();
      if(res.success){
        toast.success('Default address is set');
      }
    } catch (error) {
      if (error?.status === "FETCH_ERROR" || error?.error?.includes("Failed to fetch")) {
        toast.error("Sorry..Something Went Wrong");
      } else {
        toast.error(error?.data?.message || error.error || "Something went wrong");
      }
    }
    finally{
      setLoadingAddressId(null); 
    }
  }

  const onSubmit = async(e) => {
    if (!formData.line1 || !formData.line1.trim()) {
      toast.error("Address Line 1 is required");
      return;
    }
    if (!formData.city || !formData.city.trim()) {
      toast.error("City is required");
      return;
    }
    if (!formData.province || !formData.province.trim()) {
      toast.error("Province is required");
      return;
    }
    if (!formData.postalCode || !formData.postalCode.trim()) {
      toast.error("Postal Code is required");
      return;
    }
    if (!formData.phone || !formData.phone.trim()) {
      toast.error("Phone number is required");
      return;
    }
    e.preventDefault();
    try {
      const res = isEditMode 
        ? await editAddress({addressId: addressId, formData: formData}).unwrap() 
        : await addNewAddress(formData).unwrap()

      if (res.success) {
        toast.success(isEditMode ? 'Address updated successfully' : 'Address added successfully');
        setFormData(initialState);
        setAddressId(null);
        setShowForm(false);
      }
    } catch (error) {
      if (error?.status === "FETCH_ERROR" || error?.error?.includes("Failed to fetch")) {
        toast.error("Sorry..Something Went Wrong");
      } else {
        toast.error(error?.data?.message || error.error || "Something went wrong");
      }
    }
  }

  const handleDelete = async(addressId) =>{
    try {
       const res = await removeAddress(addressId).unwrap();
       if (res.success) {
        toast.success('Address removed successfully');
      }
      
    } catch (error) {
      if (error?.status === "FETCH_ERROR" || error?.error?.includes("Failed to fetch")) {
        toast.error("Sorry..Something Went Wrong");
      } else {
        toast.error(error?.data?.message || error.error || "Something went wrong");
      }
    }
  }


  const handleCancel = () => {
    setAddressId(null)
    setFormData(initialState)
    setShowForm(false)
  }

  const handleAddNew = () => {
    setAddressId(null)
    setFormData(initialState)
    setShowForm(true)
    setTimeout(() => {
      document.getElementById('address-form')?.scrollIntoView({ behavior: 'smooth', block: 'nearest' })
    }, 100)
  }

  return (
    <TabsContent value="address" className="flex justify-center">
      <div className="w-full max-w-3xl space-y-6">
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Saved Addresses</CardTitle>
                <CardDescription>Manage your delivery and billing addresses.</CardDescription>
              </div>
              <Button 
                onClick={handleAddNew}
                className="gap-2 bg-black hover:bg-gray-800 hover:cursor-pointer"
              >
                <Plus className="h-4 w-4" />
                Add Address
              </Button>
            </div>
          </CardHeader>
          <CardContent className="space-y-3">
            {isLoadingAddresses ? (
              <div className="flex justify-center py-8">
                <Spinner/>
              </div>
            ) : addressess?.data?.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                <p>No addresses saved yet.</p>
                <p className="text-sm mt-1">Add your first address to get started.</p>
              </div>
            ) : (
              <div className="grid gap-3 md:grid-cols-2">
                {addressess?.data?.map(address => (
                  <div
                    key={address._id}
                    className={`p-4 rounded-lg border-2 transition-all ${
                      address.isDefault
                        ? 'border-green-500 bg-green-50'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <div className="space-y-3">
                      <div className="flex items-start justify-between">
                        <div className="flex items-center gap-2">
                          <h3 className="font-semibold capitalize text-sm">{address.type}</h3>
                          {address.isDefault && (
                            <span className="flex items-center gap-1 text-xs font-medium text-green-700 bg-green-100 px-2 py-0.5 rounded-full">
                              <Check className="h-3 w-3" />
                              Default
                            </span>
                          )}
                        </div>
                        <div>
                          <Button variant='icon' className='hover:cursor-pointer hover:text-red-600' onClick={()=>handleDelete(address._id)}>
                            <Trash2Icon/>
                          </Button>
                        </div>
                      </div>
                      
                      <div className="text-sm text-gray-600 space-y-1">
                        <p className="font-medium text-gray-900">
                          {address.line1}
                          {address.line2 && `, ${address.line2}`}
                        </p>
                        <p>
                          {address.city}, {address.province} {address.postalCode}
                        </p>
                        <p>{address.phone}</p>
                      </div>

                      <div className="flex gap-2 pt-2 border-t border-gray-100">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleEdit(address)}
                          className="flex-1 gap-2 hover:bg-gray-100 hover:cursor-pointer"
                        >
                          <Edit2 className="h-3 w-3" />
                          Edit
                        </Button>
                        {loadingAddressId === address._id ? (
                          <div className="flex-1 flex items-center justify-center">
                            <Spinner/>
                          </div>
                        ) : !address.isDefault && (
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleMakeDefault(address._id)}
                            className="flex-1 hover:bg-gray-100 hover:cursor-pointer"
                          >
                            Set Default
                          </Button>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {showForm && (
          <Card id="address-form" className="border-2 border-black">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>{isEditMode ? 'Edit Address' : 'Add New Address'}</CardTitle>
                  <CardDescription>
                    {isEditMode
                      ? 'Update your delivery or billing address.'
                      : 'Add a new delivery or billing address.'}
                  </CardDescription>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleCancel}
                  className="h-8 w-8 p-0 hover:cursor-pointer"
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            </CardHeader>
            <CardContent className="grid gap-6 md:grid-cols-2">
              {addressFormControls.map(field => {
                if (field.componentType === "input") {
                  return (
                    <div key={field.name} className="grid gap-3">
                      <Label htmlFor={field.name}>{field.label}</Label>
                      <Input
                        id={field.name}
                        type={field.type}
                        placeholder={field.placeholder}
                        value={formData[field.name] || ""}
                        onChange={e => handleChange(field.name, e.target.value)}
                        className="border-gray-300 focus:border-black"
                      />
                    </div>
                  )
                } else if (field.componentType === "select") {
                  return (
                    <div key={field.name} className="grid gap-3">
                      <Label htmlFor={field.name}>{field.label}</Label>
                      <Select
                        value={formData[field.name] || ""}
                        onValueChange={value => handleChange(field.name, value)}
                      >
                        <SelectTrigger className="border-gray-300 focus:border-black">
                          <SelectValue placeholder="Select an option" />
                        </SelectTrigger>
                        <SelectContent>
                          {field.options.map(option => (
                            <SelectItem key={option.value} value={option.value}>
                              {option.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  )
                } else if (field.componentType === "checkbox") {
                  return (
                    <div key={field.name} className="flex items-center gap-2 col-span-full">
                      <Checkbox
                        checked={formData[field.name] || false}
                        onCheckedChange={checked => handleChange(field.name, checked)}
                      />
                      <Label>{field.label}</Label>
                    </div>
                  )
                }
              })}
            </CardContent>
            <CardFooter className="gap-2 bg-gray-50">
              <Button 
                onClick={onSubmit} 
                className="w-full md:w-auto bg-black hover:bg-gray-800 hover:cursor-pointer"
              >
                {isSubmiting ? <Spinner/> : isEditMode ? 'Update Address' : 'Save Address'}
              </Button>
              <Button
                onClick={handleCancel}
                variant="outline"
                className="hidden md:flex w-full md:w-auto border-gray-300 hover:bg-gray-100 hover:cursor-pointer"
              >
                Cancel
              </Button>
            </CardFooter>
          </Card>
        )}
      </div>
    </TabsContent>
  )
}

export default AddressSectionTab
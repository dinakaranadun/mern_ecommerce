import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { TabsContent } from '@/components/ui/tabs'
import { addressFormControls } from '@/config'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Checkbox } from '@/components/ui/checkbox'
import { useState } from 'react'

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
  const [formData, setFormData] = useState(initialState)

  const handleChange = (name, value) => {
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const onSubmit = () => {
    console.log('Form submitted:', formData)
  }

  return (
    <TabsContent value="address" className="flex justify-center">
      <div className="w-full max-w-3xl">
        <Card>
          <CardHeader>
            <CardTitle>Address</CardTitle>
            <CardDescription>Update your delivery and billing addresses here.</CardDescription>
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
                      <SelectTrigger>
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
          <CardFooter>
            <Button onClick={onSubmit} className="w-full md:w-auto">
              Save Address
            </Button>
          </CardFooter>
        </Card>
      </div>
    </TabsContent>
  )
}

export default AddressSectionTab

import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { TabsContent } from '@/components/ui/tabs'

const PersonalInfoTab = () => {
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
                      type="text" />
                    </div>
                    <div className="grid gap-3">
                      <Label htmlFor="tabs-demo-username">Email</Label>
                      <Input
                        id="email"
                        type="email"
                      />
                    </div>
                </CardContent>
                <CardFooter>
                    <Button className="w-full md:w-auto">Save changes</Button>
                </CardFooter>
            </Card>
        </div>
    </TabsContent>
  )
}

export default PersonalInfoTab
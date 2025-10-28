import AddressSectiontab from '@/components/shopping/userAccount/addressSectiontab'
import PasswordSectiontab from '@/components/shopping/userAccount/passwordSectiontab'
import PersonalInfoTab from '@/components/shopping/userAccount/personalInfoTab'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@/components/ui/tabs'

const ShoppingAccount = () => {
  return (
    <div className="min-h-screen flex flex-col items-center  bg-gray-50 p-2">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center p-6 gap-6 md:gap-10 justify-center text-center md:text-left">
        <Avatar className="bg-black size-32 mx-auto md:mx-0">
          <AvatarFallback className="bg-black text-white font-extrabold text-5xl">
            S
          </AvatarFallback>
        </Avatar>
        <div>
          <h3 className="text-3xl font-bold">Account Setting</h3>
          <p className="font-extralight">
            Manage your account settings and preferences
          </p>
        </div>
      </div>

      {/* Tabs Section */}
      <div className="flex justify-center w-full p-2">
        <div className="w-full  bg-white p-5 rounded-2xl shadow-md">
          <Tabs defaultValue="account" className="w-full">
            {/* Centered Tabs */}
            <div className="flex justify-center w-full mb-6">
              <div className="w-full max-w-md">
                <TabsList className="block md:flex justify-center  rounded-lg  ">
                  <TabsTrigger
                    value="account"
                    className="data-[state=active]:bg-white data-[state=active]:shadow-sm px-6 py-2 rounded-md"
                  >
                    Account
                  </TabsTrigger>
                  <TabsTrigger
                    value="password"
                    className="data-[state=active]:bg-white data-[state=active]:shadow-sm px-6 py-2 rounded-md"
                  >
                    Password
                  </TabsTrigger>
                  <TabsTrigger
                    value="address"
                    className="data-[state=active]:bg-white data-[state=active]:shadow-sm px-6 py-2 rounded-md"
                  >
                    Address
                  </TabsTrigger>
                </TabsList>
              </div>
            </div>

            {/* Account Section */}
            <PersonalInfoTab/>

            {/* Password Section */}
            <PasswordSectiontab/>

            {/* Address Section */}
            <AddressSectiontab/>
          </Tabs>
        </div>
      </div>
    </div>
  )
}

export default ShoppingAccount

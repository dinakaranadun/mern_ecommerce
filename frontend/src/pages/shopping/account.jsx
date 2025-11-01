import { useState } from 'react'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@/components/ui/tabs'
import AddressSectiontab from '@/components/shopping/userAccount/addressSectiontab'
import PasswordSectiontab from '@/components/shopping/userAccount/passwordSectiontab'
import PersonalInfoTab from '@/components/shopping/userAccount/personalInfoTab'

const ShoppingAccount = () => {
  const [activeTab, setActiveTab] = useState('account')

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-8">
      <div className="max-w-6xl mx-auto">
        <div className="mb-8 relative">
          <div className="absolute inset-0 overflow-hidden rounded-3xl">
            <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-bl from-gray-100 to-transparent opacity-60"></div>
            <div className="absolute bottom-0 left-0 w-96 h-96 bg-gradient-to-tr from-gray-100 to-transparent opacity-40"></div>
            <div className="absolute inset-0" style={{
              backgroundImage: 'repeating-linear-gradient(45deg, transparent, transparent 35px, rgba(0,0,0,0.02) 35px, rgba(0,0,0,0.02) 70px)'
            }}></div>
          </div>
          
          <div className="relative bg-white rounded-3xl p-8 md:p-12 shadow-lg border border-gray-200">
            <div className="flex flex-col md:flex-row items-center gap-6 md:gap-10">
              <div className="relative group">
                <div className="absolute -inset-1 bg-gradient-to-r from-gray-200 to-gray-300 rounded-full opacity-0 group-hover:opacity-100 blur transition-all duration-300"></div>
                <Avatar className="relative size-28 md:size-32 bg-gradient-to-br from-gray-800 to-gray-900 ring-4 ring-white shadow-xl transition-all duration-300 group-hover:scale-105">
                  <AvatarFallback className="bg-gradient-to-br from-gray-800 to-gray-900 text-white font-bold text-5xl">
                    S
                  </AvatarFallback>
                </Avatar>
                <div className="absolute -bottom-1 -right-1 w-7 h-7 bg-white rounded-full border-2 border-gray-900 flex items-center justify-center shadow-md">
                  <div className="w-3 h-3 bg-emerald-500 rounded-full"></div>
                </div>
              </div>
              
              <div className="text-center md:text-left">
                <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-2 tracking-tight">
                  My Account
                </h1>
                <p className="text-gray-500 text-lg">
                  Manage your profile & preferences
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content Card */}
        <div className="bg-white rounded-3xl shadow-lg border border-gray-200 overflow-hidden">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <div className="border-b border-gray-200 bg-gradient-to-b from-gray-50 to-white">
              <div className="px-6 md:px-10 pt-8 pb-6">
                <div className="md:bg-gray-100 p-1.5 rounded-2xl">
                  <TabsList className="w-full bg-transparent flex flex-col md:flex-row gap-1">
                    <TabsTrigger
                      value="account"
                      className="w-full rounded-xl px-8 py-2.5 font-semibold text-sm transition-all duration-300 data-[state=active]:bg-white data-[state=active]:text-gray-900 data-[state=active]:shadow-sm hover:text-gray-900"
                    >
                      Personal Info
                    </TabsTrigger>
                    <TabsTrigger
                      value="password"
                      className="w-full rounded-xl px-8 py-2.5 font-semibold text-sm transition-all duration-300 data-[state=active]:bg-white data-[state=active]:text-gray-900 data-[state=active]:shadow-sm hover:text-gray-900"
                    >
                      Security
                    </TabsTrigger>
                    <TabsTrigger
                      value="address"
                      className="w-full rounded-xl px-8 py-2.5 font-semibold text-sm transition-all duration-300 data-[state=active]:bg-white data-[state=active]:text-gray-900 data-[state=active]:shadow-sm hover:text-gray-900"
                    >
                      Addresses
                    </TabsTrigger>
                  </TabsList>
                </div>
              </div>
            </div>

            {/* Tab Content */}
            <div className="p-6 md:p-10">
              <div className="transition-all duration-300">
                <PersonalInfoTab />
                <PasswordSectiontab />
                <AddressSectiontab />
              </div>
            </div>
          </Tabs>
        </div>

        {/* Subtle Footer Note */}
        <div className="mt-6 text-center">
          <p className="text-sm text-gray-400 flex items-center justify-center gap-2">
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
            </svg>
            Your information is secure and encrypted
          </p>
        </div>
      </div>
    </div>
  )
}

export default ShoppingAccount
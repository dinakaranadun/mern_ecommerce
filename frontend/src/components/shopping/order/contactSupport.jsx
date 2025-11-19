import { Mail } from 'lucide-react';
import React from 'react'
import { useNavigate } from 'react-router';

const ContactSupport = () => {
  const navigate = useNavigate()
  return (
    <div className="bg-gray-900 rounded-2xl p-6 text-white">
              <h3 className="font-semibold mb-2">Need Help?</h3>
              <p className="text-sm text-gray-300 mb-4">
                Contact our support team for any questions about your order.
              </p>
              <button onClick={()=>navigate('/shop/contactUs')} className="w-full bg-white text-gray-900 font-medium py-2.5 px-4 rounded-xl hover:bg-gray-100 transition-all flex items-center justify-center gap-2 hover:cursor-pointer">
                <Mail className="w-4 h-4" />
                Contact Support
              </button>
         </div>
  )
}

export default ContactSupport;
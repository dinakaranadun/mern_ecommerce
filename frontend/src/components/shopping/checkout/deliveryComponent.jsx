import { useGetAddressQuery } from '@/store/user/userAccountSlice';
import { MapPin, Plus, Truck } from 'lucide-react'
import { useEffect, useState } from 'react';

const intialState = {
  line1: '',
  line2:'',
  city: '',
  zipCode: '',
  phone: ''
}

const DeliveryComponent = ({ onAddressChange }) => {
  const {data:addresses} = useGetAddressQuery();
  const [selectedAddress, setSelectedAddress] = useState(intialState);
  const [showNewAddress, setShowNewAddress] = useState(false);
  
  const handleAddressFieldChange = (field, value) => {
    setSelectedAddress(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleUseNewAddress = () => {
    setSelectedAddress(intialState);
    setShowNewAddress(true);
  };

  const handleSelectExistingAddress = (addr) => {
    setSelectedAddress({
      line1: addr.line1 || '',
      line2: addr.line2 || '',
      city: addr.city || '',
      zipCode: addr.postalCode || '',
      phone: addr.phone || ''
    });
    setShowNewAddress(false);
  };

  useEffect(() => {
    if (!showNewAddress && selectedAddress === intialState) {
      const defaultAddress = addresses?.data?.find(a => a.isDefault);
      if (defaultAddress) {
        handleSelectExistingAddress(defaultAddress);
      }
    }
  }, [addresses]);

  useEffect(() => {
    if (onAddressChange) {
      onAddressChange({
        isNewAddress: showNewAddress,
        address: selectedAddress
      });
    }
  }, [selectedAddress, showNewAddress]);
  
  return (
    <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm">
      <div className="flex items-center gap-2 mb-6">
        <Truck className="text-gray-900" size={24} />
        <h2 className="text-xl font-semibold text-gray-900">Delivery Address</h2>
      </div>
      
      <div className="space-y-3">
        {addresses?.data?.map(addr => (
          <label
            key={addr._id}
            className={`flex items-start gap-4 p-4 rounded-xl border-2 cursor-pointer transition-all ${
              selectedAddress.line1 === addr.line1 && 
              selectedAddress.city === addr.city && 
              !showNewAddress
                ? 'border-gray-900 bg-gray-50'
                : 'border-gray-200 hover:border-gray-300 bg-white'
            }`}
          >
            <input
              type="radio"
              name="address"
              value={addr._id}
              checked={selectedAddress.line1 === addr.line1 && 
                      selectedAddress.city === addr.city && 
                      !showNewAddress}
              onChange={() => handleSelectExistingAddress(addr)}
              className="mt-1 accent-gray-900"
            />
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-1">
                <MapPin size={16} className="text-gray-600" />
                <span className="font-semibold text-gray-900 capitalize">{addr.type}</span>
              </div>
              <p className="text-sm text-gray-700 capitalize ">{addr.line1}</p>
              <p className="text-sm text-gray-700 capitalize">{addr.line2}</p>
              <p className="text-sm text-gray-600 capitalize">{addr.city}</p>
            </div>
          </label>
        ))}

        {showNewAddress ? (
          <label className="block p-4 rounded-xl border-2 border-gray-900 bg-gray-50">
            <div className="flex items-center gap-4 mb-3">
              <input
                type="radio"
                name="address"
                value="new"
                checked={true}
                readOnly
                className="accent-gray-900"
              />
              <div className="flex items-center gap-2">
                <MapPin size={16} className="text-gray-600" />
                <span className="font-semibold text-gray-900">New Address</span>
              </div>
            </div>
            <div className="ml-8 space-y-3">
              <input
                type="text"
                placeholder="line 1"
                value={selectedAddress.line1}
                onChange={(e) => handleAddressFieldChange('line1', e.target.value)}
                className="w-full px-4 py-2 rounded-lg bg-white border border-gray-300 focus:outline-none focus:border-gray-900 text-gray-900 placeholder-gray-500"
              />
              <input
                type="text"
                placeholder="line2 (optional)"
                value={selectedAddress.line2}
                onChange={(e) => handleAddressFieldChange('line2', e.target.value)}
                className="w-full px-4 py-2 rounded-lg bg-white border border-gray-300 focus:outline-none focus:border-gray-900 text-gray-900 placeholder-gray-500"
              />
              <div className="grid sm:grid-cols-2 gap-3">
                <input
                  type="text"
                  placeholder="City"
                  value={selectedAddress.city}
                  onChange={(e) => handleAddressFieldChange('city', e.target.value)}
                  className="px-4 py-2 rounded-lg bg-white border border-gray-300 focus:outline-none focus:border-gray-900 text-gray-900 placeholder-gray-500"
                />
                <input
                  type="text"
                  placeholder="ZIP Code"
                  value={selectedAddress.zipCode}
                  onChange={(e) => handleAddressFieldChange('zipCode', e.target.value)}
                  className="px-4 py-2 rounded-lg bg-white border border-gray-300 focus:outline-none focus:border-gray-900 text-gray-900 placeholder-gray-500"
                />
              </div>
              <input
                type="tel"
                placeholder="Phone Number"
                value={selectedAddress.phone}
                onChange={(e) => handleAddressFieldChange('phone', e.target.value)}
                className="w-full px-4 py-2 rounded-lg bg-white border border-gray-300 focus:outline-none focus:border-gray-900 text-gray-900 placeholder-gray-500"
              />
            </div>
          </label>
        ) : (
          <button
            onClick={handleUseNewAddress}
            className="w-full flex items-center justify-center gap-2 p-4 rounded-xl border-2 border-dashed border-gray-300 hover:border-gray-900 hover:bg-gray-50 transition-all text-gray-600 hover:text-gray-900 font-medium"
          >
            <Plus size={20} />
            Use Different Address
          </button>
        )}
      </div>
    </div>
  )
}

export default DeliveryComponent;
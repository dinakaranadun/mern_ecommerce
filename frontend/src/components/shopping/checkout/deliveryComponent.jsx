import { useGetAddressQuery } from '@/store/user/userAccountSlice';
import { MapPin, Plus, Truck } from 'lucide-react'
import { useEffect, useState } from 'react';

const intialState = {
  fullName: '',
  line1: '',
  line2:'',
  city: '',
  zipCode: '',
  phone: ''
}

const DeliveryComponent = ({ onAddressChange }) => {
  const {data:addresses} = useGetAddressQuery();
  const [newAddress, setNewAddress] = useState(intialState);
  const [selectedAddress, setSelectedAddress] = useState();
  const [showNewAddress, setShowNewAddress] = useState(false);
  
  const handleNewAddressChange = (field, value) => {
    setNewAddress(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleUseNewAddress = () => {
    setSelectedAddress(null);
    setShowNewAddress(true);
  };

  const handleSelectExistingAddress = (addressId) => {
    setSelectedAddress(addressId);
    setShowNewAddress(false);
  };

  useEffect(() => {
    if (!selectedAddress && !showNewAddress) {
      const defaultAddress = addresses?.data?.find(a => a.isDefault);
      if (defaultAddress) {
        setSelectedAddress(defaultAddress._id);
      }
    }
  }, [addresses]);

  useEffect(() => {
    if (onAddressChange) {
      onAddressChange({
        selectedAddressId: selectedAddress,
        isNewAddress: showNewAddress,
        newAddress: showNewAddress ? newAddress : null,
        
      });
    }
  }, [selectedAddress, newAddress, showNewAddress]);
  
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
              selectedAddress === addr._id
                ? 'border-gray-900 bg-gray-50'
                : 'border-gray-200 hover:border-gray-300 bg-white'
            }`}
          >
            <input
              type="radio"
              name="address"
              value={addr._id}
              checked={selectedAddress === addr._id}
              onChange={() => handleSelectExistingAddress(addr._id)}
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
          <label className={`block p-4 rounded-xl border-2 cursor-pointer transition-all ${
            selectedAddress === 'new'
              ? 'border-gray-900 bg-gray-50'
              : 'border-gray-200 bg-white'
          }`}>
            <div className="flex items-center gap-4 mb-3">
              <input
                type="radio"
                name="address"
                value="new"
                checked={selectedAddress === 'new'}
                onChange={handleUseNewAddress}
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
                placeholder="Full Name"
                value={newAddress.fullName}
                onChange={(e) => handleNewAddressChange('fullName', e.target.value)}
                className="w-full px-4 py-2 rounded-lg bg-white border border-gray-300 focus:outline-none focus:border-gray-900 text-gray-900 placeholder-gray-500"
              />
              <input
                type="text"
                placeholder="line 1"
                value={newAddress.line1}
                onChange={(e) => handleNewAddressChange('line1', e.target.value)}
                className="w-full px-4 py-2 rounded-lg bg-white border border-gray-300 focus:outline-none focus:border-gray-900 text-gray-900 placeholder-gray-500"
              />
              <input
                type="text"
                placeholder="line2 (optional)"
                value={newAddress.line2}
                onChange={(e) => handleNewAddressChange('line2', e.target.value)}
                className="w-full px-4 py-2 rounded-lg bg-white border border-gray-300 focus:outline-none focus:border-gray-900 text-gray-900 placeholder-gray-500"
              />
              <div className="grid sm:grid-cols-2 gap-3">
                <input
                  type="text"
                  placeholder="City"
                  value={newAddress.city}
                  onChange={(e) => handleNewAddressChange('city', e.target.value)}
                  className="px-4 py-2 rounded-lg bg-white border border-gray-300 focus:outline-none focus:border-gray-900 text-gray-900 placeholder-gray-500"
                />
                <input
                  type="text"
                  placeholder="ZIP Code"
                  value={newAddress.zipCode}
                  onChange={(e) => handleNewAddressChange('zipCode', e.target.value)}
                  className="px-4 py-2 rounded-lg bg-white border border-gray-300 focus:outline-none focus:border-gray-900 text-gray-900 placeholder-gray-500"
                />
              </div>
              <input
                type="tel"
                placeholder="Phone Number"
                value={newAddress.phone}
                onChange={(e) => handleNewAddressChange('phone', e.target.value)}
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
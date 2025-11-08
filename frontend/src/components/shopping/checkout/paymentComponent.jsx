import { CreditCard } from 'lucide-react'
import {
  CardNumberElement,
  CardExpiryElement,
  CardCvcElement,
  useStripe,
  useElements,
} from "@stripe/react-stripe-js";


const PaymentComponent = ({selectedPayment,setSelectedPayment}) => {

  return (
    <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm">
        <div className="flex items-center gap-2 mb-6">
            <CreditCard className="text-gray-900" size={24} />
            <h2 className="text-xl font-semibold text-gray-900">Payment Method</h2>
        </div>
              
        <div className="space-y-3">
            <label className={`flex items-center gap-4 p-4 rounded-xl border-2 cursor-pointer transition-all ${
                  selectedPayment === 'card' ? 'border-gray-900 bg-gray-50' : 'border-gray-200 hover:border-gray-300 bg-white'
                }`}>
                  <input
                    type="radio"
                    name="payment"
                    value="card"
                    checked={selectedPayment === 'card'}
                    onChange={(e) => setSelectedPayment(e.target.value)}
                    className="accent-gray-900"
                  />
                  <CreditCard size={20} className="text-gray-600" />
                  <span className="font-medium text-gray-900">Credit / Debit Card</span>
            </label>
            {selectedPayment === 'card' && (
                  <div className="p-4 bg-gray-50 rounded-xl border-2 border-gray-200 space-y-4">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Card Details
                    </label>

                    <div>
                      <label className="text-sm text-gray-600">Card Number</label>
                      <div className="p-3 bg-white rounded-lg border border-gray-300">
                        <CardNumberElement options={{ style: { base: { fontSize: "16px" } } }} />
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="text-sm text-gray-600">Expiry</label>
                        <div className="p-3 bg-white rounded-lg border border-gray-300">
                          <CardExpiryElement options={{ style: { base: { fontSize: "16px" } } }} />
                        </div>
                      </div>
                      <div>
                        <label className="text-sm text-gray-600">CVC</label>
                        <div className="p-3 bg-white rounded-lg border border-gray-300">
                          <CardCvcElement options={{ style: { base: { fontSize: "16px" } } }} />
                        </div>
                      </div>
                    </div>
                  </div>
            )}

                <label className={`flex items-center gap-4 p-4 rounded-xl border-2 cursor-pointer transition-all ${
                  selectedPayment === 'cod' ? 'border-gray-900 bg-gray-50' : 'border-gray-200 hover:border-gray-300 bg-white'
                }`}>
                  <input
                    type="radio"
                    name="payment"
                    value="cod"
                    checked={selectedPayment === 'cod'}
                    onChange={(e) => setSelectedPayment(e.target.value)}
                    className="accent-gray-900"
                  />
                  <span className="font-medium text-gray-900">Cash on Delivery</span>
                </label>
        </div>
    </div>
  )
}

export default PaymentComponent;
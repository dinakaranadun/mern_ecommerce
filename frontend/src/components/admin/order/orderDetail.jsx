import { Button } from '@/components/ui/button';
import useAdminInvoiceDownload from '@/hooks/adminOrderInvoice';
import { Calendar, CreditCard, Mail, MapPin, Package, Phone, Printer, User, X } from 'lucide-react'
import React from 'react'

const OrderDetailDialog = ({selectedOrder,setSelectedOrder}) => {
  const{downloadAsPDF} = useAdminInvoiceDownload();
  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white border border-neutral-200 rounded-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white p-6 border-b border-neutral-200 flex items-center justify-between">
              <div>
                <h2 className="text-xl font-bold text-black">Order Details</h2>
                <p className="text-neutral-600 font-medium">#{selectedOrder.orderNumber}</p>
              </div>
              <button
                onClick={() => setSelectedOrder(null)}
                className="p-2 hover:bg-neutral-200 rounded-lg transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 space-y-6">
              {/* Status Row */}
              <div className="flex flex-wrap gap-3 ">
                <div className="flex items-center gap-3 px-4 py-3 bg-neutral-100 rounded-xl">
                  <Package className="w-5 h-5 text-neutral-600" />
                  <div>
                    <p className="text-xs text-neutral-600 capitalize font-semibold">Order Status: <span className='font-extrabold'>{selectedOrder.orderStatus}</span></p>
                    
                  </div>
                </div>
                <div className="flex items-center gap-3 px-4 py-3 bg-neutral-100 rounded-xl">
                  <CreditCard className="w-5 h-5 text-neutral-600" />
                  <div>
                    <p className="text-xs text-neutral-600 capitalize font-semibold">Payment: <span className='font-extrabold'>{selectedOrder.paymentStatus}</span></p>
                  </div>
                </div>
                <div className="flex items-center gap-3 px-4 py-3 bg-neutral-100 rounded-xl">
                  <Calendar className="w-5 h-5 text-neutral-600" />
                  <div>
                    <p className="text-xs text-neutral-600">Order Date: <span className='font-extrabold'>{new Date(selectedOrder.createdAt).toLocaleString()}</span></p>
                  </div>
                </div>
                <button
                onClick={()=>downloadAsPDF(selectedOrder)}
                  className="relative group bg-neutral-100 p-2 border rounded-xl cursor-pointer 
                            hover:bg-neutral-500 text-neutral-700"
                >
                  <Printer className="w-5 h-5" />
                  <span
                    className="absolute left-1/2 -top-10 -translate-x-1/2 
                              bg-black text-white text-xs px-2 py-1 rounded-md 
                              whitespace-nowrap opacity-0 group-hover:opacity-100
                              transition duration-200"
                  >
                    Print the invoice
                  </span>
                </button>
              </div>

              {/* Customer & Shipping */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 bg-neutral-100 rounded-xl">
                  <h4 className="font-semibold mb-3 flex items-center gap-2 text-black">
                    <User className="w-4 h-4 text-neutral-600" /> Customer Info
                  </h4>
                  <div className="space-y-2 text-sm">
                    <p className="flex items-center gap-2 text-black capitalize"><User className="w-4 h-4 text-neutral-600" /> {selectedOrder.shippingAddress.fullName || 'N/A'}</p>
                    <p className="flex items-center gap-2 text-black"><Mail className="w-4 h-4 text-neutral-600" /> {selectedOrder.userId.email || 'N/A'}</p>
                    <p className="flex items-center gap-2 text-black"><Phone className="w-4 h-4 text-neutral-600" /> {selectedOrder.shippingAddress.phone || 'N/A'}</p>
                  </div>
                </div>
                <div className="p-4 bg-neutral-100 rounded-xl">
                  <h4 className="font-semibold mb-3 flex items-center gap-2 text-black">
                    <MapPin className="w-4 h-4 text-neutral-600" /> Shipping Address
                  </h4>
                  <div className="text-sm text-black">
                    <p className='capitalize'>{selectedOrder.shippingAddress.fullName}</p>
                    <p>{selectedOrder.shippingAddress.addressLine1}</p>
                    {selectedOrder.shippingAddress.addressLine2 && <p>{selectedOrder.shippingAddress.addressLine2}</p>}
                    <p>{selectedOrder.shippingAddress.city}, {selectedOrder.shippingAddress.state || selectedOrder.shippingAddress.postalCode} </p>
                  </div>
                </div>
              </div>

              {/* Items */}
              <div className="p-4 bg-neutral-100 rounded-xl">
                <h4 className="font-semibold mb-3 text-black">Order Items</h4>
                <div className="space-y-3">
                  {selectedOrder.items.map((item, i) => (
                    <div key={i} className="flex items-center justify-between py-3 border-b border-neutral-300 last:border-0">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-neutral-300 rounded-lg flex items-center justify-center overflow-hidden">
                          {item.image ? (
                            <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                          ) : (
                            <Package className="w-6 h-6 text-neutral-600" />
                          )}
                        </div>
                        <div>
                          <p className="font-medium text-black">{item.name || 'Product'}</p>
                          <p className="text-sm text-neutral-600">Qty: {item.quantity}</p>
                        </div>
                      </div>
                      <p className="font-bold text-black">Rs. {(item.price * item.quantity).toFixed(2)}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Order Summary */}
              <div className="p-4 bg-neutral-100 rounded-xl">
                <h4 className="font-semibold mb-3 text-black">Order Summary</h4>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between text-black"><span className="text-neutral-600">Subtotal</span><span>Rs. {selectedOrder.subtotal}</span></div>
                  <div className="flex justify-between text-black"><span className="text-neutral-600">Shipping</span><span>Rs. {selectedOrder.shippingFee}</span></div>
                  {selectedOrder.tax > 0 && (
                    <div className="flex justify-between text-black"><span className="text-neutral-600">Tax</span><span>Rs. {selectedOrder.tax}</span></div>
                  )}
                  {selectedOrder.discount > 0 && (
                    <div className="flex justify-between text-black"><span className="text-neutral-600">Discount</span><span>-Rs. {selectedOrder.discount}</span></div>
                  )}
                  <div className="flex justify-between text-black"><span className="text-neutral-600">Payment Method</span><span className="uppercase">{selectedOrder.paymentMethod}</span></div>
                  {selectedOrder.trackingNumber && (
                    <div className="flex justify-between text-black"><span className="text-neutral-600">Tracking</span><span className="text-neutral-700">{selectedOrder.trackingNumber}</span></div>
                  )}
                  <div className="flex justify-between pt-3 border-t border-neutral-300 text-lg font-bold text-black">
                    <span>Total</span>
                    <span>Rs. {selectedOrder.totalAmount.toFixed(2)}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
  )
}

export default OrderDetailDialog;

import useInvoiceDownload from '@/hooks/orderInvoice';
import { Download, Loader2 } from 'lucide-react';
import React from 'react'

const InvoiceDownload = ({order}) => {
    const { downloadAsPDF, isGenerating } = useInvoiceDownload();

  return (
    <button
              onClick={() => downloadAsPDF(order)}
              disabled={isGenerating}
              className="bg-gray-900 text-white font-semibold py-3 px-6 rounded-xl hover:bg-gray-800 transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed hover:cursor-pointer"
            >
              {isGenerating ? (
                <>
                  <Loader2 className="animate-spin" size={20} />
                  Generating...
                </>
              ) : (
                <>
                  <Download size={20} />
                  Download Invoice
                </>
              )}
            </button>
  )
}

export default InvoiceDownload
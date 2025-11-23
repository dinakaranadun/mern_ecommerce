import { useState } from 'react';
import { toast } from 'react-toastify';

const useAdminInvoiceDownload = () => {
  const [isGenerating, setIsGenerating] = useState(false);

  const generateInvoiceHTML = (order) => {
    const invoiceDate = new Date(order.createdAt || order.confirmedAt).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });

    return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <style>
    * {
      margin: 0;
      padding: 0;
      box-sizing: border-box;
    }
    body {
      font-family: 'Arial', sans-serif;
      color: #333;
      line-height: 1.4;
      padding: 10px;
    }
    .invoice-container {
      max-width: 600px;
      margin: 0 auto;
      background: white;
      padding: 20px;
      font-size: 11px;
    }
    .header {
      text-align: center;
      margin-bottom: 12px;
      padding-bottom: 8px;
      border-bottom: 2px solid #111;
    }
    .company-info h1 {
      font-size: 18px;
      color: #111;
      margin-bottom: 2px;
    }
    .company-info p {
      color: #666;
      font-size: 9px;
      margin: 1px 0;
    }
    .invoice-number {
      font-size: 12px;
      font-weight: bold;
      color: #111;
      margin-top: 4px;
    }
    .invoice-date {
      font-size: 10px;
      color: #666;
    }
    .section {
      margin: 8px 0;
    }
    .section-title {
      font-size: 10px;
      font-weight: bold;
      color: #555;
      text-transform: uppercase;
      margin-bottom: 3px;
      margin-top: 6px;
    }
    .address-row {
      display: flex;
      font-size: 10px;
      margin: 1px 0;
    }
    .address-label {
      width: 50px;
      font-weight: bold;
      color: #333;
    }
    .address-value {
      flex: 1;
      color: #666;
    }
    .item-table {
      width: 100%;
      margin: 8px 0;
      border-collapse: collapse;
      font-size: 10px;
    }
    .item-table th {
      background: #f0f0f0;
      padding: 4px 2px;
      text-align: left;
      font-weight: bold;
      border-bottom: 1px solid #ccc;
      font-size: 9px;
    }
    .item-table td {
      padding: 3px 2px;
      border-bottom: 1px solid #eee;
    }
    .text-right {
      text-align: right;
    }
    .totals {
      width: 100%;
      margin-top: 6px;
      font-size: 10px;
    }
    .totals-row {
      display: flex;
      justify-content: space-between;
      padding: 2px 0;
    }
    .totals-row.total {
      border-top: 1px solid #111;
      border-bottom: 2px solid #111;
      padding-top: 4px;
      margin-top: 4px;
      font-weight: bold;
      font-size: 11px;
    }
    .payment-info {
      font-size: 9px;
      margin: 6px 0;
      padding: 4px;
      background: #f9fafb;
      border-radius: 2px;
    }
    .payment-info p {
      margin: 1px 0;
    }
    .footer {
      text-align: center;
      margin-top: 8px;
      padding-top: 6px;
      border-top: 1px solid #ddd;
      font-size: 8px;
      color: #999;
    }
    @media print {
      body {
        padding: 0;
        margin: 0;
        background: white;
      }
      .invoice-container {
        padding: 15px;
        box-shadow: none;
      }
    }
  </style>
</head>
<body>
  <div class="invoice-container">
    <!-- Header -->
    <div class="header">
      <div class="company-info">
        <h1>EasyCom</h1>
        <p>123 Business Street, Colombo, Sri Lanka</p>
        <p>Ph: +94 11 1111111 | Email: easycom@company.com</p>
      </div>
      <div class="invoice-number">Invoice #${order.orderNumber}</div>
      <div class="invoice-date">${invoiceDate}</div>
    </div>

    <!-- Ship To -->
    <div class="section">
      <div class="section-title">Address :</div>
      <div class="address-row">
        <span class="address-value"><strong>${order.shippingAddress?.fullName || order.shippingAddress?.name || 'N/A'}</strong></span>
      </div>
      <div class="address-row">
        <span class="address-value">${order.shippingAddress?.addressLine1 || order.shippingAddress?.line1 || ''}</span>
      </div>
      ${order.shippingAddress?.addressLine2 || order.shippingAddress?.line2 ? `<div class="address-row"><span class="address-value">${order.shippingAddress.addressLine2 || order.shippingAddress.line2}</span></div>` : ''}
      <div class="address-row">
        <span class="address-value">${order.shippingAddress?.city || ''} ${order.shippingAddress?.postalCode || ''}</span>
      </div>
    </div>
    

    <!-- Payment Info -->
    <div class="payment-info">
      <p><strong>Payment:</strong> ${order.paymentMethod === 'card' ? 'Card' : 'COD'} | <strong>Status:</strong> ${order.paymentStatus === 'completed' ? 'Paid' : 'Pending'}</p>
    </div>

    <!-- Totals -->
    <div class="totals">
      <div class="totals-row">
        <span>Subtotal:</span>
        <span>Rs. ${order.subtotal?.toFixed(2) || '0.00'}</span>
      </div>
      <div class="totals-row">
        <span>Shipping:</span>
        <span>Rs. ${order.shippingFee?.toFixed(2) || '0.00'}</span>
      </div>
      <div class="totals-row total">
        <span>Total:</span>
        <span>Rs. ${order.totalAmount?.toFixed(2) || '0.00'}</span>
      </div>
    </div>

    <!-- Footer -->
    <div class="footer">
      <p><strong>Thank you for your business!</strong></p>
      <p>For questions: info@company.com</p>
    </div>
  </div>
</body>
</html>
    `;
  };

  const downloadAsPDF = async (order) => {
    setIsGenerating(true);
    
    try {
      const html = generateInvoiceHTML(order);
      
      const iframe = document.createElement('iframe');
      iframe.style.position = 'absolute';
      iframe.style.width = '0';
      iframe.style.height = '0';
      iframe.style.border = 'none';
      
      document.body.appendChild(iframe);
      
      const iframeDoc = iframe.contentWindow.document;
      iframeDoc.open();
      iframeDoc.write(html);
      iframeDoc.close();
      
      await new Promise(resolve => setTimeout(resolve, 500));
      
      iframe.contentWindow.focus();
      iframe.contentWindow.print();
      
      setTimeout(() => {
        document.body.removeChild(iframe);
      }, 1000);
      
    } catch (error) {
      console.error('Error generating invoice:', error);
      toast.error('Failed to generate invoice');
    } finally {
      setIsGenerating(false);
    }
  };

  const downloadAsHTML = (order) => {
    setIsGenerating(true);
    
    try {
      const html = generateInvoiceHTML(order);
      const blob = new Blob([html], { type: 'text/html' });
      const url = URL.createObjectURL(blob);
      
      const link = document.createElement('a');
      link.href = url;
      link.download = `invoice-${order.orderNumber}.html`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      toast.success('Invoice downloaded successfully!');
    } catch (error) {
      console.error('Error downloading invoice:', error);
      toast.error('Failed to download invoice');
    } finally {
      setIsGenerating(false);
    }
  };

  return {
    downloadAsPDF,
    downloadAsHTML,
    isGenerating
  };
};

export default useAdminInvoiceDownload;
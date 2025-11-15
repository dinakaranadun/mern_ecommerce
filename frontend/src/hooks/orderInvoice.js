import { useState } from 'react';
import { toast } from 'react-toastify';

 const useInvoiceDownload = () => {
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
      line-height: 1.6;
      padding: 40px;
      background: #f9fafb;
    }
    .invoice-container {
      max-width: 800px;
      margin: 0 auto;
      background: white;
      padding: 60px;
      box-shadow: 0 0 20px rgba(0,0,0,0.1);
    }
    .header {
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
      margin-bottom: 40px;
      padding-bottom: 30px;
      border-bottom: 3px solid #111;
    }
    .company-info h1 {
      font-size: 32px;
      color: #111;
      margin-bottom: 5px;
    }
    .company-info p {
      color: #666;
      font-size: 14px;
    }
    .invoice-details {
      text-align: right;
    }
    .invoice-details h2 {
      font-size: 28px;
      color: #111;
      margin-bottom: 10px;
    }
    .invoice-details p {
      color: #666;
      font-size: 14px;
      margin: 4px 0;
    }
    .status-badge {
      display: inline-block;
      padding: 6px 16px;
      background: #10b981;
      color: white;
      border-radius: 20px;
      font-size: 12px;
      font-weight: bold;
      margin-top: 10px;
    }
    .addresses {
      display: flex;
      justify-content: space-between;
      margin: 40px 0;
    }
    .address-box {
      flex: 1;
      padding: 20px;
      background: #f9fafb;
      border-radius: 8px;
      margin: 0 10px;
    }
    .address-box:first-child {
      margin-left: 0;
    }
    .address-box:last-child {
      margin-right: 0;
    }
    .address-box h3 {
      font-size: 14px;
      color: #666;
      text-transform: uppercase;
      letter-spacing: 1px;
      margin-bottom: 15px;
    }
    .address-box p {
      color: #333;
      font-size: 14px;
      margin: 5px 0;
    }
    .address-box .name {
      font-weight: bold;
      font-size: 16px;
      color: #111;
      margin-bottom: 10px;
    }
    .items-table {
      width: 100%;
      border-collapse: collapse;
      margin: 40px 0;
    }
    .items-table thead {
      background: #111;
      color: white;
    }
    .items-table th {
      padding: 15px;
      text-align: left;
      font-weight: 600;
      font-size: 13px;
      text-transform: uppercase;
      letter-spacing: 0.5px;
    }
    .items-table td {
      padding: 15px;
      border-bottom: 1px solid #e5e7eb;
    }
    .items-table tbody tr:hover {
      background: #f9fafb;
    }
    .item-name {
      font-weight: 600;
      color: #111;
    }
    .text-right {
      text-align: right;
    }
    .text-center {
      text-align: center;
    }
    .totals {
      margin-top: 30px;
      float: right;
      width: 350px;
    }
    .totals-row {
      display: flex;
      justify-content: space-between;
      padding: 12px 0;
      font-size: 15px;
    }
    .totals-row.subtotal {
      color: #666;
    }
    .totals-row.total {
      border-top: 2px solid #111;
      margin-top: 10px;
      padding-top: 15px;
      font-size: 20px;
      font-weight: bold;
      color: #111;
    }
    .footer {
      clear: both;
      margin-top: 80px;
      padding-top: 30px;
      border-top: 1px solid #e5e7eb;
      text-align: center;
      color: #666;
      font-size: 12px;
    }
    .footer p {
      margin: 8px 0;
    }
    .payment-info {
      background: #f0fdf4;
      border-left: 4px solid #10b981;
      padding: 20px;
      margin: 30px 0;
      border-radius: 4px;
    }
    .payment-info h3 {
      color: #065f46;
      margin-bottom: 10px;
      font-size: 16px;
    }
    .payment-info p {
      color: #047857;
      font-size: 14px;
      margin: 5px 0;
    }
    @media print {
      body {
        padding: 0;
        background: white;
      }
      .invoice-container {
        box-shadow: none;
        padding: 40px;
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
        <p>123 Business Street</p>
        <p>Colombo, Sri Lanka</p>
        <p>Email: easycom@company.com</p>
        <p>Phone: +94 11 1111111</p>
      </div>
      <div class="invoice-details">
        <h2>INVOICE</h2>
        <p><strong>Invoice #:</strong> ${order.orderNumber}</p>
        <p><strong>Date:</strong> ${invoiceDate}</p>
        <p><strong>Order Status:</strong></p>
        <span class="status-badge">${order.orderStatus?.toUpperCase() || 'CONFIRMED'}</span>
      </div>
    </div>

    <!-- Addresses -->
    <div class="addresses">
      <div class="address-box">
        <h3>Bill To</h3>
        <p class="name">${order.shippingAddress?.fullName || order.shippingAddress?.name || 'N/A'}</p>
        <p>${order.shippingAddress?.addressLine1 || order.shippingAddress?.line1 || ''}</p>
        ${order.shippingAddress?.addressLine2 || order.shippingAddress?.line2 ? `<p>${order.shippingAddress.addressLine2 || order.shippingAddress.line2}</p>` : ''}
        <p>${order.shippingAddress?.city || ''}, ${order.shippingAddress?.postalCode || ''}</p>
        <p>${order.shippingAddress?.country || 'Sri Lanka'}</p>
        <p><strong>Phone:</strong> ${order.shippingAddress?.phone || ''}</p>
      </div>
      
      <div class="address-box">
        <h3>Ship To</h3>
        <p class="name">${order.shippingAddress?.fullName || order.shippingAddress?.name || 'N/A'}</p>
        <p>${order.shippingAddress?.addressLine1 || order.shippingAddress?.line1 || ''}</p>
        ${order.shippingAddress?.addressLine2 || order.shippingAddress?.line2 ? `<p>${order.shippingAddress.addressLine2 || order.shippingAddress.line2}</p>` : ''}
        <p>${order.shippingAddress?.city || ''}, ${order.shippingAddress?.postalCode || ''}</p>
        <p>${order.shippingAddress?.country || 'Sri Lanka'}</p>
      </div>
    </div>

    <!-- Payment Info -->
    <div class="payment-info">
      <h3>Payment Information</h3>
      <p><strong>Payment Method:</strong> ${order.paymentMethod === 'card' ? 'Credit/Debit Card' : 'Cash on Delivery'}</p>
      <p><strong>Payment Status:</strong> ${order.paymentStatus === 'completed' ? 'Paid' : 'Pending'}</p>
      ${order.transactionId ? `<p><strong>Transaction ID:</strong> ${order.transactionId}</p>` : ''}
    </div>

    <!-- Items Table -->
    <table class="items-table">
      <thead>
        <tr>
          <th>Item</th>
          <th class="text-center">Quantity</th>
          <th class="text-right">Unit Price</th>
          <th class="text-right">Total</th>
        </tr>
      </thead>
      <tbody>
        ${order.items?.map(item => `
          <tr>
            <td class="item-name">${item.name}</td>
            <td class="text-center">${item.quantity}</td>
            <td class="text-right">Rs. ${item.price.toFixed(2)}</td>
            <td class="text-right">Rs. ${(item.price * item.quantity).toFixed(2)}</td>
          </tr>
        `).join('')}
      </tbody>
    </table>

    <!-- Totals -->
    <div class="totals">
      <div class="totals-row subtotal">
        <span>Subtotal:</span>
        <span>Rs. ${order.subtotal?.toFixed(2) || '0.00'}</span>
      </div>
      <div class="totals-row subtotal">
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
      <p>For any questions about this invoice, please contact us at info@company.com</p>
      <p>Terms: Payment due within 30 days. Please include invoice number on your check.</p>
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
      
      URL.revokeObjectURL(url);
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

export default useInvoiceDownload;
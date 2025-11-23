import { useState } from 'react';
import { toast } from 'react-toastify';

export const useExportOrders = () => {
  const [showExportMenu, setShowExportMenu] = useState(false);
  const [exporting, setExporting] = useState(false);

  const exportToCSV = (orders) => {
    setExporting(true);
    try {
      const headers = ['Order ID', 'Customer', 'Email', 'Total Amount', 'Status', 'Payment Status', 'Order Date'];
      const data = orders.map(order => [
        order.orderNumber || '',
        order.userId?.name || order.userName || '',
        order.userId?.email || order.userEmail || '',
        `$${order.totalAmount || 0}`,
        order.orderStatus || '',
        order.paymentStatus || '',
        new Date(order.createdAt).toLocaleDateString() || ''
      ]);

      const csvContent = [
        headers.join(','),
        ...data.map(row => row.map(cell => `"${cell}"`).join(','))
      ].join('\n');

      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
      const link = document.createElement('a');
      const url = URL.createObjectURL(blob);
      link.setAttribute('href', url);
      link.setAttribute('download', `orders_${new Date().getTime()}.csv`);
      link.style.visibility = 'hidden';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      toast.success('Orders exported to CSV successfully');
    } catch (error) {
      toast.error('Failed to export CSV');
      console.error(error);
    } finally {
      setExporting(false);
      setShowExportMenu(false);
    }
  };

  const exportToJSON = (orders) => {
    setExporting(true);
    try {
      const jsonData = orders.map(order => ({
        orderId: order.orderNumber,
        customer: order.userId?.name || order.userName,
        email: order.userId?.email || order.userEmail,
        totalAmount: order.totalAmount,
        orderStatus: order.orderStatus,
        paymentStatus: order.paymentStatus,
        orderDate: new Date(order.createdAt).toLocaleDateString(),
        items: order.items || []
      }));

      const blob = new Blob([JSON.stringify(jsonData, null, 2)], { type: 'application/json;charset=utf-8;' });
      const link = document.createElement('a');
      const url = URL.createObjectURL(blob);
      link.setAttribute('href', url);
      link.setAttribute('download', `orders_${new Date().getTime()}.json`);
      link.style.visibility = 'hidden';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      toast.success('Orders exported to JSON successfully');
    } catch (error) {
      toast.error('Failed to export JSON');
      console.error(error);
    } finally {
      setExporting(false);
      setShowExportMenu(false);
    }
  };

  return {
    showExportMenu,
    setShowExportMenu,
    exporting,
    exportToCSV,
    exportToJSON
  };
};
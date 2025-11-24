import transPorter from "../config/nodemailer";
import { orderDeliveredTemplate, orderPlacedTemplate } from "../utils/emailTemplates";



const sendOrderPlacedEmail = async (orderData) => {
  try {
    const mailOptions = {
      from: `"EasyCom" <${process.env.EMAIL_USER}>`,
      to: orderData.customerEmail,
      subject: `Order Confirmation - Order #${orderData.orderNumber}`,
      html: orderPlacedTemplate(orderData)
    };

    const info = await transPorter.sendMail(mailOptions);
    console.log('Order placed email sent:', info.messageId);
    return { 
      success: true, 
      messageId: info.messageId,
      message: 'Order confirmation email sent successfully' 
    };
  } catch (error) {
    console.error('Error sending order placed email:', error);
    throw new Error(`Failed to send email: ${error.message}`);
  }
};

const sendOrderDeliveredEmail = async (orderData) => {
  try {
    const mailOptions = {
      from: `"EasyCom" <${process.env.EMAIL_USER}>`,
      to: orderData.customerEmail,
      subject: `Order Delivered - Order #${orderData.orderId}`,
      html: orderDeliveredTemplate(orderData)
    };

    const info = await transporter.sendMail(mailOptions);
    console.log('Order delivered email sent:', info.messageId);
    return { 
      success: true, 
      messageId: info.messageId,
      message: 'Order delivered email sent successfully' 
    };
  } catch (error) {
    console.error('Error sending order delivered email:', error);
    throw new Error(`Failed to send email: ${error.message}`);
  }
};

export{sendOrderPlacedEmail,sendOrderDeliveredEmail};
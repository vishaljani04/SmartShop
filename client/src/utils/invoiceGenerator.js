import { jsPDF } from 'jspdf';
import 'jspdf-autotable';

export const generateInvoice = (order) => {
  const doc = new jsPDF();
  const pageWidth = doc.internal.pageSize.width;

  // Header - Brand
  doc.setFontSize(24);
  doc.setTextColor(99, 102, 241); // #6366f1 (Indigo)
  doc.setFont('helvetica', 'bold');
  doc.text('SmartShop', 20, 25);
  
  doc.setFontSize(10);
  doc.setTextColor(150, 150, 150);
  doc.setFont('helvetica', 'normal');
  doc.text('Premium E-Commerce Experience', 20, 32);

  // Invoice Details
  doc.setFontSize(16);
  doc.setTextColor(30, 41, 59); // Slate 800
  doc.text('INVOICE', pageWidth - 60, 25);
  
  doc.setFontSize(10);
  doc.text(`Order ID: #${order._id.slice(-8).toUpperCase()}`, pageWidth - 60, 32);
  doc.text(`Date: ${new Date(order.createdAt).toLocaleDateString()}`, pageWidth - 60, 38);
  doc.text(`Payment: ${order.paymentStatus.toUpperCase()}`, pageWidth - 60, 44);

  // Billing Details
  doc.setFontSize(12);
  doc.setFont('helvetica', 'bold');
  doc.text('Ship To:', 20, 55);
  
  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');
  doc.text(order.shippingAddress?.fullName || 'Customer', 20, 62);
  doc.text(order.shippingAddress?.phone || '', 20, 68);
  doc.text(`${order.shippingAddress?.street}, ${order.shippingAddress?.city}`, 20, 74);
  doc.text(`${order.shippingAddress?.state} - ${order.shippingAddress?.pincode}`, 20, 80);

  // Table
  const tableColumn = ["Product", "Price", "Qty", "Total"];
  const tableRows = [];

  order.items.forEach(item => {
    const itemData = [
      item.title || item.product?.title || 'Unknown Product',
      `INR ${item.price}`,
      item.quantity,
      `INR ${item.price * item.quantity}`
    ];
    tableRows.push(itemData);
  });

  doc.autoTable({
    startY: 90,
    head: [tableColumn],
    body: tableRows,
    theme: 'grid',
    headStyles: { fillColor: [99, 102, 241], textColor: [255, 255, 255], fontStyle: 'bold' },
    styles: { fontSize: 9, cellPadding: 4 },
    columnStyles: {
      0: { cellWidth: 'auto' },
      1: { cellWidth: 30, halign: 'right' },
      2: { cellWidth: 20, halign: 'center' },
      3: { cellWidth: 30, halign: 'right' },
    }
  });

  // Totals
  const finalY = doc.lastAutoTable.finalY + 10;
  
  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');
  doc.text('Subtotal:', pageWidth - 80, finalY);
  doc.text(`INR ${order.totalAmount - order.taxAmount - order.shippingAmount + (order.discountAmount || 0)}`, pageWidth - 30, finalY, { align: 'right' });
  
  if (order.discountAmount > 0) {
    doc.setTextColor(16, 185, 129); // Emerald 500
    doc.text('Discount:', pageWidth - 80, finalY + 6);
    doc.text(`-INR ${order.discountAmount}`, pageWidth - 30, finalY + 6, { align: 'right' });
    doc.setTextColor(30, 41, 59);
  }

  doc.text('Shipping:', pageWidth - 80, finalY + 12);
  doc.text(`INR ${order.shippingAmount}`, pageWidth - 30, finalY + 12, { align: 'right' });
  
  doc.text('Tax (18%):', pageWidth - 80, finalY + 18);
  doc.text(`INR ${order.taxAmount}`, pageWidth - 30, finalY + 18, { align: 'right' });

  doc.setFontSize(14);
  doc.setFont('helvetica', 'bold');
  doc.text('TOTAL:', pageWidth - 80, finalY + 28);
  doc.text(`INR ${order.totalAmount}`, pageWidth - 30, finalY + 28, { align: 'right' });

  // Footer
  doc.setFontSize(8);
  doc.setTextColor(150, 150, 150);
  doc.text('This is a computer-generated invoice and does not require a signature.', pageWidth / 2, 280, { align: 'center' });
  doc.text('Thank you for shopping with SmartShop!', pageWidth / 2, 285, { align: 'center' });

  doc.save(`SmartShop_Invoice_${order._id.slice(-8).toUpperCase()}.pdf`);
};

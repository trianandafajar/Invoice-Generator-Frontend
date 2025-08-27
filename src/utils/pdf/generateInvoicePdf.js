import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

export async function generateInvoicePdf(invoice) {
  const doc = new jsPDF();

  if (invoice.logo_base64) {
    try {
      doc.addImage(invoice.logo_base64, "PNG", 14, 10, 30, 30); 
    } catch (e) {
      console.error("Gagal render logo base64:", e);
    }
  }

  doc.setFontSize(14);
  doc.text("INVOICE", 120, 20);

  doc.setFontSize(10);
  doc.text(`Billing Number / Invoice Number: ${invoice.invoice_number}`, 120, 30);
  doc.text(`Customer Name : ${invoice.customer_name}`, 120, 36);
  doc.text(`Customer ID   : ${invoice.customer_id}`, 120, 42);
  doc.text(`Process Date  : ${formatDate(invoice.process_date)}`, 120, 48);
  doc.text(`Due Date      : ${formatDate(invoice.due_date)}`, 120, 54);

  doc.text(`Dear / To:`, 14, 50);
  doc.text(`${invoice.customer_name}`, 14, 56);
  doc.text(`${invoice.customer_address}`, 14, 62);

  doc.setFontSize(12);
  doc.text("Billing Summary / Invoice Summary", 14, 80);

  autoTable(doc, {
    startY: 85,
    head: [["Description", "Amount"]],
    body: invoice.items.map((item) => [
      item.description,
      formatCurrency(item.amount),
    ]),
    theme: "grid",
    headStyles: { fillColor: [0, 0, 0], textColor: 255 },
    styles: { halign: "right" },
    columnStyles: { 0: { halign: "left" } },
  });

  const totalY = doc.lastAutoTable.finalY + 10;
  doc.setFontSize(11);
  doc.text("Total Current Balance", 14, totalY);
  doc.text(formatCurrency(invoice.previous_balance), 180, totalY, { align: "right" });

  doc.text("Total Amount Due", 14, totalY + 8);
  const totalAmount = invoice.items.reduce((sum, i) => sum + parseFloat(i.amount), 0);
  doc.text(formatCurrency(totalAmount), 180, totalY + 8, { align: "right" });

  if (invoice.signature) {
    const sigY = totalY + 25;
    doc.setFontSize(10);
    doc.text("Authorized Signature:", 14, sigY);
    try {
      doc.addImage(invoice.signature, "PNG", 14, sigY + 5, 40, 20); 
    } catch (e) {
      console.error("Gagal render signature base64:", e);
    }
  }

  const footerY = totalY + 60;
  doc.setFontSize(9);
  doc.text("If you have any question about this invoice, please contact :", 14, footerY);
  doc.text(`Telp / SMS / WA: ${invoice.contact_phone}`, 14, footerY + 6);
  doc.text(`Payment Account: ${invoice.payment_account}`, 14, footerY + 12);

  doc.save(`invoice-${invoice.id}.pdf`);
}

function formatCurrency(val) {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
  }).format(val);
}

function formatDate(date) {
  return new Date(date).toLocaleDateString("id-ID", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

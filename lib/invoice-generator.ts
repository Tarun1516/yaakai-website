import jsPDF from 'jspdf';

interface InvoiceData {
  userId: string;
  paymentId: string;
  payerName: string;
  email: string;
  modeOfPayment: string;
  applicationName: string;
  amount: number;
  productType: string;
  paymentTime: string;
}

export const generateInvoicePDF = (invoiceData: InvoiceData): void => {
  // Create HTML content based on your exact template
  const htmlContent = `
    <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Invoice - Checkblock</title>
        <style>
            body {
                font-family: Arial, sans-serif;
                margin: 0;
                padding: 20px;
                background-color: #f4f4f4;
                color: #000000;
            }
            .invoice-box {
                max-width: 800px;
                margin: auto;
                padding: 30px;
                border: 1px solid #eee;
                background-color: #fff;
                box-shadow: 0 0 10px rgba(0, 0, 0, 0.15);
            }
            .invoice-header {
                text-align: center;
                margin-bottom: 30px;
            }
            .invoice-header h1 {
                margin: 0 0 5px 0;
                font-size: 2.5em;
                color: #000000;
            }
            .invoice-header .company-name {
                font-size: 1.2em;
                color: #000000;
            }
            .details-section, .payer-info {
                margin-bottom: 20px;
            }
            .details-section h2, .payer-info h2 {
                border-bottom: 2px solid #eee;
                padding-bottom: 5px;
                margin-bottom: 10px;
                font-size: 1.2em;
                color: #000000;
            }
            .details-section p, .payer-info p {
                margin: 8px 0;
                line-height: 1.6;
                color: #000000;
            }
            .details-section p strong, .payer-info p strong {
                display: inline-block;
                width: 150px;
                color: #000000;
            }
            table {
                width: 100%;
                line-height: inherit;
                text-align: left;
                border-collapse: collapse;
                color: #000000;
                margin-top: 20px;
            }
            table td, table th {
                padding: 10px;
                border-bottom: 1px solid #eee;
                color: #000000;
            }
            table th {
                background-color: #f9f9f9;
                font-weight: bold;
                color: #000000;
            }
            .text-right {
                text-align: right;
            }
            .footer {
                text-align: center;
                margin-top: 40px;
                padding-top: 20px;
                border-top: 1px solid #eee;
                font-size: 0.9em;
                color: #000000;
            }
        </style>
    </head>
    <body>
        <div class="invoice-box">
            <div class="invoice-header">
                <h1>Checkblock Invoice</h1>
                <div class="company-name">A product of Yaakai</div>
            </div>

            <div class="details-section">
                <h2>Invoice Details</h2>
                <p><strong>Invoice #:</strong> INV-${invoiceData.paymentId.slice(-8)}</p>
                <p><strong>Date:</strong> ${new Date(invoiceData.paymentTime).toLocaleDateString('en-IN')}</p>
            </div>

            <div class="payer-info">
                <h2>Payer Information</h2>
                <p><strong>Payer Email ID:</strong> ${invoiceData.email}</p>
                <p><strong>Phone Number:</strong> Not Provided</p>
                <p><strong>Payment Mode:</strong> ${invoiceData.modeOfPayment}</p>
                <p><strong>Payment ID:</strong> ${invoiceData.paymentId}</p>
                <p><strong>User ID:</strong> ${invoiceData.userId}</p>
            </div>

            <table>
                <thead>
                    <tr>
                        <th>Item Description</th>
                        <th>Quantity</th>
                        <th>Unit Price</th>
                        <th class="text-right">Total</th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <td>Checkblock</td>
                        <td>1</td>
                        <td>₹${invoiceData.amount.toFixed(2)}</td>
                        <td class="text-right">₹${invoiceData.amount.toFixed(2)}</td>
                    </tr>
                </tbody>
            </table>

            <div class="footer">
                <p>Thank you for purchasing</p>
                <p>checkblock a product of yaakai © all copyrights reserved</p>
            </div>
        </div>
    </body>
    </html>
  `;

  // Create a new window/tab with the HTML content and print to PDF
  const printWindow = window.open('', '_blank');
  if (printWindow) {
    printWindow.document.write(htmlContent);
    printWindow.document.close();
    
    // Wait for content to load, then trigger print
    printWindow.onload = function() {
      setTimeout(() => {
        printWindow.print();
        printWindow.close();
      }, 500);
    };
  } else {
    // Fallback: Create a blob and download as HTML file that can be printed to PDF
    const blob = new Blob([htmlContent], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `Checkblock_Invoice_${invoiceData.paymentId.slice(-8)}_${new Date().toISOString().slice(0, 10)}.html`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    
    alert('Invoice downloaded as HTML file. Please open it in your browser and print to PDF.');
  }
};
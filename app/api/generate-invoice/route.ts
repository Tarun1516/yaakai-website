import { NextResponse } from "next/server"
import { jsPDF } from "jspdf"

export async function POST(req: Request) {
  try {
    const {
      userId,
      paymentId,
      userName,
      userEmail,
      amount,
      currency,
      applicationName,
      productType,
      paymentTime
    } = await req.json()

    // Create a new PDF document
    const doc = new jsPDF()

    // Set font
    doc.setFont("helvetica")

    // Header
    doc.setFontSize(20)
    doc.text("INVOICE", 105, 30, { align: "center" })

    // Company Details
    doc.setFontSize(16)
    doc.text("Yaakai", 20, 50)
    doc.setFontSize(10)
    doc.text("CheckBlock Application Store", 20, 60)
    doc.text("Email: yaakai1516@gmail.com", 20, 70)

    // Invoice Details
    doc.setFontSize(12)
    doc.text(`Invoice #: INV-${paymentId}`, 120, 50)
    doc.text(`Date: ${new Date(paymentTime).toLocaleDateString()}`, 120, 60)

    // Horizontal line
    doc.line(20, 80, 190, 80)

    // Customer Details
    doc.setFontSize(14)
    doc.text("Bill To:", 20, 100)
    doc.setFontSize(10)
    doc.text(`Name: ${userName}`, 20, 110)
    doc.text(`Email: ${userEmail}`, 20, 120)
    doc.text(`User ID: ${userId}`, 20, 130)

    // Payment Details
    doc.setFontSize(14)
    doc.text("Payment Details:", 20, 150)
    doc.setFontSize(10)
    doc.text(`Payment ID: ${paymentId}`, 20, 160)
    doc.text(`Mode of Payment: Online`, 20, 170)
    doc.text(`Payment Status: Completed`, 20, 180)

    // Horizontal line
    doc.line(20, 190, 190, 190)

    // Product Details Table Header
    doc.setFontSize(12)
    doc.text("Description", 20, 205)
    doc.text("Platform", 90, 205)
    doc.text("Qty", 130, 205)
    doc.text("Amount", 160, 205)

    // Table line
    doc.line(20, 210, 190, 210)

    // Product Details
    doc.setFontSize(10)
    doc.text(applicationName, 20, 220)
    doc.text(productType.charAt(0).toUpperCase() + productType.slice(1), 90, 220)
    doc.text("1", 130, 220)
    doc.text(`₹${amount}`, 160, 220)

    // Total line
    doc.line(20, 230, 190, 230)

    // Total
    doc.setFontSize(12)
    doc.text("Total Amount:", 130, 245)
    doc.text(`₹${amount} ${currency}`, 160, 245)

    // Footer
    doc.setFontSize(8)
    doc.text("Thank you for your purchase!", 105, 270, { align: "center" })
    doc.text("For support, contact: yaakai1516@gmail.com", 105, 280, { align: "center" })

    // Generate PDF as buffer
    const pdfBuffer = doc.output("arraybuffer")

    // Return PDF as response
    return new NextResponse(pdfBuffer, {
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": `attachment; filename="invoice-${paymentId}.pdf"`,
      },
    })
  } catch (error) {
    console.error("Error generating invoice:", error)
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : "An unexpected error occurred",
      },
      { status: 500 }
    )
  }
}

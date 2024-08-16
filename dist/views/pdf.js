"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const PDFDocument = require('pdfkit');
class PDFService {
    static generatePDF(bill) {
        return new Promise((resolve, reject) => {
            try {
                const doc = new PDFDocument();
                const buffers = [];
                doc.on('data', buffers.push.bind(buffers));
                doc.on('end', () => {
                    const pdfBuffer = Buffer.concat(buffers);
                    console.log(`PDF successfully generated in memory`);
                    resolve(pdfBuffer);
                });
                doc.on('error', (err) => {
                    console.error(`Error generating PDF:`, err);
                    reject(err);
                });
                // Add content to the PDF
                doc.fontSize(16).text(`Bill Details`, { underline: true });
                doc.moveDown();
                doc.fontSize(12);
                doc.text(`From Date: ${bill.fromDate.toISOString().split('T')[0]}`);
                doc.text(`To Date: ${bill.toDate.toISOString().split('T')[0]}`);
                doc.text(`Due Date: ${bill.dueDate.toISOString().split('T')[0]}`);
                doc.text(`Next Billing Date: ${bill.nextDate.toISOString().split('T')[0]}`);
                doc.text(`Reading Date: ${bill.readingDate.toISOString().split('T')[0]}`);
                doc.text(`kWh Consumed: ${bill.kwhConsume}`);
                doc.text(`Rate per kWh: ${bill.rate}`);
                doc.text(`Total Amount: ${bill.amount}`);
                doc.text(`Distribution Charge: ${bill.distribution}`);
                doc.text(`Generation Charge: ${bill.generation}`);
                doc.text(`System Loss Charge: ${bill.sLoss}`);
                doc.text(`Transmission Charge: ${bill.transmission}`);
                doc.text(`Subsidies: ${bill.subsidies}`);
                doc.text(`Government Tax: ${bill.gTax}`);
                doc.text(`FIT-All Charge: ${bill.fitAll}`);
                doc.text(`Applied Fees: ${bill.applied}`);
                doc.text(`Universal Charges: ${bill.uCharges}`);
                doc.text(`Other Charges: ${bill.other}`);
                doc.text(`Current Reading: ${bill.cRead}`);
                doc.text(`Previous Reading: ${bill.pRead}`);
                doc.text(`Amount: ${bill.amount}`);
                // Finalize the PDF and end the stream
                doc.end();
            }
            catch (error) {
                console.error(`Error generating PDF:`, error);
                reject(error);
            }
        });
    }
}
exports.default = PDFService;
//# sourceMappingURL=pdf.js.map
import React from "react";
import "./InvoicePage.css"; // Importing the CSS file for styling

const InvoicePage = ({ subscription, logoBase64 }) => {
  const currentDate = new Date();
  const year = currentDate.getFullYear();
  const month = String(currentDate.getMonth() + 1).padStart(2, "0");

  const invoiceNumber = String(subscription.invoiceNumber || 0).padStart(6, "0");
  const invoiceId = `SSD-${year}-${month}/${invoiceNumber}`;

  return (
    <div className="invoice-container">
      {/* Header Section */}
      <div className="invoiceheader">
        <div className="invoice-title">
          <h2>INVOICE</h2>
          <p># {invoiceId}</p>
          <p className="status_green">PAID</p>
        </div>
        <div className="invoice-title1">
          {logoBase64 && (
            <img
              src={logoBase64}
              alt="SREESHUDDHI Logo"
              style={{ width: "120px" }}
            />
          )}
          <h3>SREESHUDDHI</h3>
          <p>Kalady, Kerala, India - 683574</p>
          <p>Phone: +91 98470 47963</p>
        </div>
      </div>

      {/* Invoice Info */}
      <div className="invoiceheader">
        <div className="invoice-title">
          <p>
            <strong>Invoice Date:</strong>{" "}
            {new Date(subscription.startDate).toDateString()}
          </p>
          <p>
            <strong>Due Date:</strong>{" "}
            {new Date(subscription.endDate).toDateString()}
          </p>
        </div>
        <div className="invoice-title2">
          <h4>Bill To:</h4>
          <p>{subscription.templeName}</p>
          <p>{subscription.address}</p>
          <p>{subscription.number}</p>
          <p>{subscription.email}</p>
        </div>
      </div>

      {/* Table Section */}
      <table className="table">
        <thead>
          <tr>
            <th>#</th>
            <th>Description</th>
            <th>Amount</th>
            <th>GST (18%)</th>
            <th>Total Amount</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>1</td>
            <td>Subscription Charges</td>
            <td>₹1000.00</td>
            <td>₹180.00</td>
            <td>₹{subscription.totalAmount}</td>
          </tr>
        </tbody>
      </table>

      {/* Amount Section */}
      <div className="amount-section">
        <p className="bggrey">
          <strong>Total Amount: ₹{subscription.totalAmount}</strong>
        </p>
      </div>

      {/* Footer Section */}
      <div className="footer-section">
        <p>Thank you for your business!</p>
      </div>
    </div>
  );
};

export default InvoicePage;

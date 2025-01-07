import React from 'react';
import './Dash.css';

function Dash() {
  const user = JSON.parse(localStorage.getItem('user'));

  return (
    <div className="dashboard">
      <h1>Welcome to the {user.name} Dashboard</h1>
      <p className="breadcrumb">Home &gt; Dashboard</p>
      <div className="calendar-container">
      {user.role === 'admin' && (
            <>
             
            </>
          )}
      </div>
    </div>
  );
}

export default Dash;
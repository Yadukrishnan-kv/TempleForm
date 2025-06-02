import React from 'react';
import Header from '../Header/Header';
import Sidebar from '../Sidebar/Sidebar';
import LogTable from './LogTable';

function Log() {
  return (
    <div >
      <Header />
      <div className="content-container">
        <Sidebar />
        <div className="log-content p-6">
          <LogTable />
        </div>
      </div>
    </div>
  );
}

export default Log;



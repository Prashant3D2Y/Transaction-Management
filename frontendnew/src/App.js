import React, { useState } from 'react';
import TransactionsTable from './components/TransactionsTable';
import TransactionsStatistics from './components/TransactionsStatistics';
import TransactionsBarChart from './components/TransactionsBarChart';
import TransactionsPieChart from './components/TransactionsPieChart';

const App = () => {


  return (
    <div>
      <h1>Transaction Management</h1>
      
    
      <TransactionsTable/>
      <br />
      <hr />
      <TransactionsStatistics/>
      <br />
      <hr />
      <TransactionsBarChart/>
      <br />
      <hr />
      <TransactionsPieChart/>
      <br />
      <hr />
    </div>
  );
};

export default App;

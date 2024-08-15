// src/components/TransactionList.js
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import TransactionItem from './TransactionItem';

const TransactionList = ({ filters }) => {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchTransactions = async () => {
      setLoading(true);
      try {
        const response = await axios.get('api/transactions', {
          params: filters
        });
        setTransactions(response.data.transactions);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchTransactions();
  }, [start]);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error}</p>;

  return (
    <div className="transaction-list">
      {transactions.map(transaction => (
        <TransactionItem key={transaction.id} transaction={transaction} />
      ))}
    </div>
  );
};

export default TransactionList;

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './TransactionsStatistics.css';

const TransactionsStatistics = () => {
  const [statistics, setStatistics] = useState({
    totalSaleAmount: 0,
    totalSoldItems: 0,
    totalNotSoldItems: 0
  });
  const [startDate, setStartDate] = useState('');

  const fetchStatistics = async () => {
    try {
      const response = await axios.get(`http://localhost:5000/api/statistics`, {
        params: { month: startDate }
      });
      setStatistics(response.data);
    } catch (error) {
      console.error('Error fetching statistics:', error);
    }
  };

  useEffect(() => {
    fetchStatistics();
  }, [startDate]);


  return (
    <div className="statistics-container">
      <h2>Transactions Statistics for {setStartDate}</h2>
      <div>
        <label>Start Date:</label>
        <input
          type="month"
          value={startDate}
          onChange={(e) => setStartDate(e.target.value)}
        />
      </div>
      <div className="statistics-details">
        <p><strong>Total Sale Amount:</strong> ${statistics.totalSaleAmount}</p>
        <p><strong>Total Sold Items:</strong> {statistics.totalSoldItems}</p>
        <p><strong>Total Not Sold Items:</strong> {statistics.totalNotSoldItems}</p>
      </div>
    </div>
  );
};

export default TransactionsStatistics;

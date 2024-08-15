import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { BarChart, Bar, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import './TransactionsBarChart.css';

const TransactionsBarChart = () => {
  const [data, setData] = useState([]);
  const [startDate, setStartDate] = useState('');

  const fetchBarChartData = async () => {
    try {
      const response = await axios.get(`http://localhost:5000/api/barChart`, { params: { month: startDate } });
      setData(response.data.priceRanges);
    } catch (error) {
      console.error('Error fetching bar chart data:', error);
    }
  };

  useEffect(() => {
    fetchBarChartData();
  }, [startDate]);

  return (
    <div style={{marginTop:'100px'}}>
      <h2 style={{marginTop:'100px'}}>Transactions Bar Chart</h2>
      <div style={{display: 'flex' , justifyContent: 'center'}}>
        <label  >Start Date:</label>
        <input
          type="month"
          value={startDate}
          onChange={(e) => setStartDate(e.target.value)}
        />
      </div>
      <ResponsiveContainer width="100%" height={400} style={{marginTop:'100px'}}>
        <BarChart data={data}>
          <XAxis dataKey="range" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Bar dataKey="count" fill="#8884d8" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default TransactionsBarChart;

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { BarChart, Bar, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import './TransactionsBarChart.css';

const TransactionsBarChart = ({ selectedMonth }) => {
  const [data, setData] = useState([]);

  const fetchBarChartData = async () => {
    try {
      const response = await axios.get(`/api/barChart?month=${selectedMonth}`);
      setData(response.data.priceRanges);
    } catch (error) {
      console.error('Error fetching bar chart data:', error);
    }
  };

  useEffect(() => {
    fetchBarChartData();
  }, [selectedMonth]);

  return (
    <div>
      <h2>Transactions Bar Chart</h2>
      <ResponsiveContainer width="100%" height={400}>
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

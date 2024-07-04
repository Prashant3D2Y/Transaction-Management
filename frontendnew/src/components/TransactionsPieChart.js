import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import './TransactionsPieChart.css';

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];

const TransactionsPieChart = ({ selectedMonth }) => {
  const [data, setData] = useState([]);

  const fetchPieChartData = async () => {
    try {
      const response = await axios.get(`/api/pieChart?month=${selectedMonth}`);
      setData(response.data.categories);
    } catch (error) {
      console.error('Error fetching pie chart data:', error);
    }
  };

  useEffect(() => {
    fetchPieChartData();
  }, [selectedMonth]);

  return (
    <div>
      <h2>Transactions Pie Chart</h2>
      <ResponsiveContainer width="100%" height={400}>
        <PieChart>
          <Pie data={data} dataKey="count" nameKey="_id" cx="50%" cy="50%" outerRadius={100} fill="#8884d8">
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
            ))}
          </Pie>
          <Tooltip />
          <Legend />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
};

export default TransactionsPieChart;

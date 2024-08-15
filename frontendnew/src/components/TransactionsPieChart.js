// import React, { useState, useEffect } from 'react';
// import axios from 'axios';
// import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from 'recharts';
// import './TransactionsPieChart.css';

// const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];

// const TransactionsPieChart = () => {
//   const [data, setData] = useState([]);
//   const [startDate, setStartDate] = useState('');
//   const [endDate, setEndDate] = useState('');

//   const fetchPieChartData = async () => {
//     try {
//       const response = await axios.get(`http://localhost:5000/api/pieChart`);
//       setData(response.data.categories);
//     } catch (error) {
//       console.error('Error fetching pie chart data:', error);
//     }
//   };

//   useEffect(() => {
//     fetchPieChartData();
//   }, [startDate, endDate]);

//   return (
//     <div>
//       <h2>Transactions Pie Chart</h2>
//       <div>
//         <label>Start Date:</label>
//         <input
//           type="month"
//           value={startDate}
//           onChange={(e) => setStartDate(e.target.value)}
//         />
//          <label>End Date:</label>
//         <input
//           type="month"
//           value={endDate}
//           onChange={(e) => setEndDate(e.target.value)}
//         />
//       </div>
//       <ResponsiveContainer width="100%" height={400}>
//         <PieChart>
//           <Pie data={data} dataKey="count" nameKey="_id" cx="50%" cy="50%" outerRadius={100} fill="#8884d8">
//             {data.map((entry, index) => (
//               <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
//             ))}
//           </Pie>
//           <Tooltip />
//           <Legend />
//         </PieChart>
//       </ResponsiveContainer>
//     </div>
//   );
// };

// export default TransactionsPieChart;


import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Pie } from 'react-chartjs-2';
import 'chart.js/auto';
import './TransactionsPieChart.css';

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];

const TransactionsPieChart = () => {
  const [chartData, setChartData] = useState({});
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');

  const fetchPieChartData = async () => {
    try {
      const response = await axios.get(`http://localhost:5000/api/pieChart`);
      const categories = response.data.categories;

      const labels = categories.map((cat) => cat._id);
      const data = categories.map((cat) => cat.count);

      setChartData({
        labels: labels,
        datasets: [
          {
            label: 'Transactions by Category',
            data: data,
            backgroundColor: COLORS,
            borderWidth: 1,
          },
        ],
      });
    } catch (error) {
      console.error('Error fetching pie chart data:', error);
    }
  };

  useEffect(() => {
    fetchPieChartData();
  }, [startDate, endDate]);

  return (
    <div style={{marginTop:'100px'}}>
      <h2>Transactions Pie Chart</h2>
      <div style={{display: 'flex' , justifyContent: 'center'}}>
        <label>Start Date:</label>
        <input
          type="month"
          value={startDate}
          onChange={(e) => setStartDate(e.target.value)}
        />
        <label>End Date:</label>
        <input
          type="month"
          value={endDate}
          onChange={(e) => setEndDate(e.target.value)}
        />
      </div>

      <div style={{ width: '100%', height: '400px', marginTop:'100px' }}>
        {chartData.labels && chartData.labels.length > 0 ? (
          <Pie
            data={chartData}
            options={{
              responsive: true,
              maintainAspectRatio: false,
              plugins: {
                legend: {
                  position: 'bottom',
                },
                tooltip: {
                  callbacks: {
                    label: function (tooltipItem) {
                      const label = chartData.labels[tooltipItem.dataIndex] || '';
                      const value = chartData.datasets[tooltipItem.datasetIndex].data[tooltipItem.dataIndex];
                      return `${label}: ${value}`;
                    },
                  },
                },
              },
              layout: {
                padding: {
                  top: 20,
                  bottom: 20,
                },
              },
            }}
            style={{
              position: 'relative',
              width: '100%',
              height: '100%',
            }}
          />
        ) : (
          <p>No data available for the selected date range.</p>
        )}
      </div>
    </div>
  );
};

export default TransactionsPieChart;

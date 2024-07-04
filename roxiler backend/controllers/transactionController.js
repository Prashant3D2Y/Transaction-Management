const axios = require('axios');
const Transaction = require('../model/Transaction');

// Initialize database with external data
exports.initializeDatabase = async (req, res) => {
  try {
    const response = await axios.get('https://s3.amazonaws.com/roxiler.com/product_transaction.json');
    const transactions = response.data.transactions;

    await Transaction.insertMany(transactions);

    res.status(200).json({ message: 'Database initialized successfully' });
  } catch (error) {
    console.error('Error initializing database:', error);
    res.status(500).json({ message: 'Failed to initialize database' });
  }
};

// List transactions based on query parameters
exports.listTransactions = async (req, res) => {
  const { month, page = 1, perPage = 10, search } = req.query;
  const query = {
    dateOfSale: { $regex: new RegExp(month, 'i') },
  };

  if (search) {
    query.$or = [
      { productName: { $regex: new RegExp(search, 'i') } },
      { amount: { $regex: new RegExp(search, 'i') } },
      // Add more fields as needed
    ];
  }

  try {
    const totalCount = await Transaction.countDocuments(query);
    const transactions = await Transaction.find(query)
      .skip((page - 1) * perPage)
      .limit(parseInt(perPage));

    res.status(200).json({ transactions, totalCount });
  } catch (error) {
    console.error('Error fetching transactions:', error);
    res.status(500).json({ message: 'Failed to fetch transactions' });
  }
};

// Calculate statistics for transactions in a given month
exports.getStatistics = async (req, res) => {
  const { month } = req.query;
  const query = {
    dateOfSale: { $regex: new RegExp(month, 'i') },
  };

  try {
    const totalSaleAmount = await Transaction.aggregate([
      { $match: query },
      { $group: { _id: null, totalAmount: { $sum: '$amount' } } },
    ]);

    const totalSoldItems = await Transaction.countDocuments(query);
    const totalNotSoldItems = await Transaction.countDocuments({ ...query, sold: false });

    res.status(200).json({
      totalSaleAmount: totalSaleAmount.length > 0 ? totalSaleAmount[0].totalAmount : 0,
      totalSoldItems,
      totalNotSoldItems,
    });
  } catch (error) {
    console.error('Error calculating statistics:', error);
    res.status(500).json({ message: 'Failed to calculate statistics' });
  }
};

// Generate data for bar chart based on price ranges
exports.getBarChart = async (req, res) => {
  const { month } = req.query;
  const query = {
    dateOfSale: { $regex: new RegExp(month, 'i') },
  };

  try {
    const priceRanges = [
      { range: '0-100', count: await Transaction.countDocuments({ ...query, amount: { $lte: 100 } }) },
      { range: '101-200', count: await Transaction.countDocuments({ ...query, amount: { $gt: 100, $lte: 200 } }) },
      { range: '201-300', count: await Transaction.countDocuments({ ...query, amount: { $gt: 200, $lte: 300 } }) },
      // Add more ranges as needed
    ];

    res.status(200).json({ priceRanges });
  } catch (error) {
    console.error('Error generating bar chart data:', error);
    res.status(500).json({ message: 'Failed to generate bar chart data' });
  }
};

// Generate data for pie chart based on categories
exports.getPieChart = async (req, res) => {
  const { month } = req.query;
  const query = {
    dateOfSale: { $regex: new RegExp(month, 'i') },
  };

  try {
    const categories = await Transaction.aggregate([
      { $match: query },
      { $group: { _id: '$category', count: { $sum: 1 } } },
    ]);

    res.status(200).json({ categories });
  } catch (error) {
    console.error('Error generating pie chart data:', error);
    res.status(500).json({ message: 'Failed to generate pie chart data' });
  }
};

// Fetch combined data from different endpoints
exports.getCombinedData = async (req, res) => {
  const { month } = req.query;

  try {
    const [transactions, statistics, barChart, pieChart] = await Promise.all([
      axios.get(`/api/transactions?month=${month}`),
      axios.get(`/api/statistics?month=${month}`),
      axios.get(`/api/barChart?month=${month}`),
      axios.get(`/api/pieChart?month=${month}`),
    ]);

    res.status(200).json({
      transactions: transactions.data,
      statistics: statistics.data,
      barChart: barChart.data,
      pieChart: pieChart.data,
    });
  } catch (error) {
    console.error('Error fetching combined data:', error);
    res.status(500).json({ message: 'Failed to fetch combined data' });
  }
};

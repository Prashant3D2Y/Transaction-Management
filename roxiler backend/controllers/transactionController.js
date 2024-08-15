const axios = require('axios');
const Transaction = require('../model/Transaction');


exports.initializeDatabase = async (req, res) => {
  try {
    const response = await axios.get('https://s3.amazonaws.com/roxiler.com/product_transaction.json');
    const transactions = response.data;
    await Transaction.insertMany(transactions);

    res.status(200).json({ message: 'Database initialized successfully' });
  } catch (error) {
    console.error('Error initializing database:', error);
    res.status(500).json({ message: 'Failed to initialize database' });
  }
};


exports.listTransactions = async (req, res) => {
  // const { month, page = 1, perPage = 10, search } = req.query;
  const { startDate, endDate, page = 1, perPage = 10, search, minPrice, maxPrice, exactId } = req.query;
  const query = {};

  // Validate and format 'month' parameter if provided
  if (startDate || endDate) {
    query.dateOfSale = {};
    if (startDate) {
      query.dateOfSale.$gte = new Date(startDate);  
    }
    if (endDate) {
      query.dateOfSale.$lte = new Date(endDate);
    }
  }

  if (search) {
    query.$or = [
      { title: { $regex: new RegExp(search, 'i') } },
      { description: { $regex: new RegExp(search, 'i') } },
      { category: { $regex: new RegExp(search, 'i') } },
      { image: { $regex: new RegExp(search, 'i') } }
    ];
  }

  // Add search functionality for numerical fields
  if (minPrice || maxPrice) {
    query.price = {};
    if (minPrice) {
      query.price.$gte = parseFloat(minPrice);
    }
    if (maxPrice) {
      query.price.$lte = parseFloat(maxPrice);
    }
  }

  // Handle exact match for 'id' if 'exactId' parameter is provided
  if (exactId) {
    query.id = parseInt(exactId);
  }

  // Handle 'id' as part of the search term if it's numerical
  if (search && !isNaN(search)) {
    query.$or = query.$or || [];
    query.$or.push(
      { id: parseInt(search) },
      { price: parseFloat(search) }
    );
  }

  try {
    const totalCount = await Transaction.countDocuments(query);
    const transactions = await Transaction.find(query)
      .skip((page - 1) * perPage)
      .limit(parseInt(perPage))
      .sort({ dateOfSale: -1 }); // Sort by dateOfSale, most recent first.

    res.status(200).json({ transactions, totalCount });
  } catch (error) {
    console.error('Error fetching transactions:', error);
    res.status(500).json({ message: 'Failed to fetch transactions' });
  }
};


exports.getStatistics = async (req, res) => {
  const { month } = req.query;
  const query = {};

  if (month) {
    const [year, monthNum] = month.split('-').map(Number);

    if (year && monthNum >= 1 && monthNum <= 12) {
      query.$expr = {
        $and: [
          { $eq: [{ $year: '$dateOfSale' }, year] },
          { $eq: [{ $month: '$dateOfSale' }, monthNum] }
        ]
      };
    } else {
      return res.status(400).json({ message: 'Invalid month format. Use YYYY-MM.' });
    }
  }

  try {
    // Calculate total sale amount
    const totalSaleAmount = await Transaction.aggregate([
      { $match: query },
      { $group: { _id: null, totalAmount: { $sum: '$price' } } }, // Assuming 'price' represents the sale amount
    ]);

    // Calculate total sold and not sold items
    const totalSoldItems = await Transaction.countDocuments({ ...query, sold: true });
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



exports.getBarChart = async (req, res) => {
  const { month } = req.query;
  const query = {};
  if (month) {
    const [year, monthNum] = month.split('-').map(Number);

    if (year && monthNum >= 1 && monthNum <= 12) {
      query.$expr = {
        $and: [
          { $eq: [{ $year: '$dateOfSale' }, year] },
          { $eq: [{ $month: '$dateOfSale' }, monthNum] }
        ]
      };
    } else {
      return res.status(400).json({ message: 'Invalid month format. Use YYYY-MM.' });
    }
  }

  try {
    const priceRanges = [
      { range: '0-100', count: await Transaction.countDocuments({ ...query, price: { $lte: 100 } }) },
      { range: '101-200', count: await Transaction.countDocuments({ ...query, price: { $gt: 100, $lte: 200 } }) },
      { range: '201-300', count: await Transaction.countDocuments({ ...query, price: { $gt: 200, $lte: 300 } }) },
      
    ];

    res.status(200).json({ priceRanges });
  } catch (error) {
    console.error('Error generating bar chart data:', error);
    res.status(500).json({ message: 'Failed to generate bar chart data' });
  }
};


exports.getPieChart = async (req, res) => {
  const { month } = req.query;
  const query = {};
  if (month) {
    const [year, monthNum] = month.split('-').map(Number);

    if (year && monthNum >= 1 && monthNum <= 12) {
      query.$expr = {
        $and: [
          { $eq: [{ $year: '$dateOfSale' }, year] },
          { $eq: [{ $month: '$dateOfSale' }, monthNum] }
        ]
      };
    } else {
      return res.status(400).json({ message: 'Invalid month format. Use YYYY-MM.' });
    }
  }

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


exports.getCombinedData = async (req, res) => {
  const { month } = req.query;

  try {

    const baseUrl = 'http://localhost:5000';

    const [transactions, statistics, barChart, pieChart] = await Promise.all([
      axios.get(`${baseUrl}/api/transactions?month=${month}`), // Make sure to include baseUrl if needed
      axios.get(`${baseUrl}/api/statistics?month=${month}`),
      axios.get(`${baseUrl}/api/barChart?month=${month}`),
      axios.get(`${baseUrl}/api/pieChart?month=${month}`),
    ]);

    res.status(200).json({
      transactions: transactions.data,
      statistics: statistics.data,
      barChart: barChart.data,
      pieChart: pieChart.data,
    });
  } catch (error) {
    console.error('Error fetching combined data:', error.message);
  }  
};

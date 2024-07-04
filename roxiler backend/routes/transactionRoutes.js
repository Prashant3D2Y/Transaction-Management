const express = require('express');
const router = express.Router();
const transactionController = require('../controllers/transactionController');

router.get('/initializeDatabase', transactionController.initializeDatabase);
router.get('/transactions', transactionController.listTransactions);
router.get('/statistics', transactionController.getStatistics);
router.get('/barChart', transactionController.getBarChart);
router.get('/pieChart', transactionController.getPieChart);
router.get('/combinedData', transactionController.getCombinedData);

module.exports = router;

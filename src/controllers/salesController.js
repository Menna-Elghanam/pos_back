import prisma from '../../app.js';

// Get total sales for a date range
export const getTotalSales = async (req, res) => {
  const { startDate, endDate } = req.body;

  try {
    const totalSales = await prisma.invoice.aggregate({
      _sum: {
        totalAmount: true,
      },
      where: {
        createdAt: {
          gte: new Date(startDate), // Start date
          lte: new Date(endDate),   // End date
        },
      },
    });

    res.status(200).json({ totalSales: totalSales._sum.totalAmount || 0 });
  } catch (error) {
    console.error('Error fetching total sales:', error);
    res.status(500).json({ message: 'Failed to fetch total sales', error: error.message });
  }
};


// Get sales by table
export const getSalesByTable = async (req, res) => {
    try {
      const salesByTable = await prisma.table.findMany({
        include: {
          orders: {
            where: {
              status: 'completed', // You can filter by completed orders
            },
            select: {
              total: true, // Total amount per order
            },
          },
        },
      });
  
      const salesData = salesByTable.map((table) => ({
        tableNumber: table.number,
        totalSales: table.orders.reduce((acc, order) => acc + order.total, 0), // Sum of total sales for the table
      }));
  
      res.status(200).json(salesData);
    } catch (error) {
      console.error('Error fetching sales by table:', error);
      res.status(500).json({ message: 'Failed to fetch sales by table', error: error.message });
    }
  };

  

// Get daily sales for a date range
export const getSalesByDay = async (req, res) => {
    const { startDate, endDate } = req.body;
  
    try {
      const salesByDay = await prisma.invoice.groupBy({
        by: ['createdAt'],
        _sum: {
          totalAmount: true,
        },
        where: {
          createdAt: {
            gte: new Date(startDate),
            lte: new Date(endDate),
          },
        },
        orderBy: {
          createdAt: 'asc',
        },
      });
  
      const dailySales = salesByDay.map((item) => ({
        date: item.createdAt.toISOString().split('T')[0], // Convert to date format
        totalSales: item._sum.totalAmount || 0,
      }));
  
      res.status(200).json(dailySales);
    } catch (error) {
      console.error('Error fetching sales by day:', error);
      res.status(500).json({ message: 'Failed to fetch sales by day', error: error.message });
    }
  };
  
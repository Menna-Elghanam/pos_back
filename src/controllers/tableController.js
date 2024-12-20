
import prisma from '../../app.js';

// Create a new table
export const createTable = async (req, res) => {
  const { number, seats, status = "Free" } = req.body;

  try {
    const newTable = await prisma.table.create({
      data: {
        number,
        seats,
        status,
      },
    });
    res.status(201).json({ message: 'Table created successfully', table: newTable });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Failed to create table' });
  }
};

// Get all tables - with safer order handling
export const getAllTables = async (req, res) => {
  try {
    // First, fetch tables without orders
    const tables = await prisma.table.findMany({
      include: {
        orders: {
          where: {
            orderType: {
              in: ['PLACE', 'TAKEAWAY', 'DELIVERY']
            }
          },
          include: {
            user: {
              select: {
                id: true,
                name: true,
                email: true,
                role: true
              }
            },
            orderItems: {
              include: {
                menuItem: {
                  select: {
                    id: true,
                    name: true,
                    price: true,
                    description: true
                  }
                }
              }
            }
          }
        }
      }
    });

    res.status(200).json(tables);
  } catch (error) {
    console.error('Error fetching tables:', error);
    res.status(500).json({ 
      message: 'Failed to fetch tables',
      error: error.message 
    });
  }
};

// Get a single table by ID - with safer order handling
export const getTableById = async (req, res) => {
  const { tableId } = req.params;

  try {
    const table = await prisma.table.findUnique({
      where: { 
        id: parseInt(tableId) 
      },
      include: {
        orders: {
          where: {
            orderType: {
              in: ['PLACE', 'TAKEAWAY', 'DELIVERY']
            }
          },
          include: {
            user: {
              select: {
                id: true,
                name: true,
                email: true,
                role: true
              }
            },
            orderItems: {
              include: {
                menuItem: {
                  select: {
                    id: true,
                    name: true,
                    price: true,
                    description: true
                  }
                }
              }
            }
          }
        }
      }
    });

    if (!table) {
      return res.status(404).json({ message: 'Table not found' });
    }

    res.status(200).json(table);
  } catch (error) {
    console.error(error);
    res.status(500).json({ 
      message: 'Failed to fetch table',
      error: error.message 
    });
  }
};

// Update a table
export const updateTable = async (req, res) => {
  const { tableId } = req.params;
  const { number, seats, status } = req.body;

  try {
    const updatedTable = await prisma.table.update({
      where: { 
        id: parseInt(tableId) 
      },
      data: {
        number,
        seats,
        status,
      },
    });
    res.status(200).json({ message: 'Table updated successfully', table: updatedTable });
  } catch (error) {
    console.error(error);
    res.status(500).json({ 
      message: 'Failed to update table',
      error: error.message 
    });
  }
};

// Update table status
export const updateTableStatus = async (req, res) => {
  const { tableId } = req.params;
  const { status } = req.body;

  try {
    const updatedTable = await prisma.table.update({
      where: { 
        id: parseInt(tableId) 
      },
      data: {
        status,
      },
    });

    res.status(200).json({ message: 'Table status updated successfully', table: updatedTable });
  } catch (error) {
    console.error(error);
    res.status(500).json({ 
      message: 'Failed to update table status',
      error: error.message 
    });
  }
};

// Delete a table
export const deleteTable = async (req, res) => {
  const { tableId } = req.params;

  try {
    await prisma.table.delete({
      where: { 
        id: parseInt(tableId) 
      },
    });
    res.status(200).json({ message: 'Table deleted successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ 
      message: 'Failed to delete table',
      error: error.message 
    });
  }
};
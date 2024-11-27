import prisma from '../../app.js'; 

// Create a new table
export const createTable = async (req, res) => {
  const { number, seats } = req.body;

  try {
    const newTable = await prisma.table.create({
      data: {
        number,
        seats,
      },
    });
    res.status(201).json({ message: 'Table created successfully', table: newTable });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Failed to create table' });
  }
};

// Get all tables
export const getAllTables = async (req, res) => {
  try {
    const tables = await prisma.table.findMany({
      include: {
        orders: true,  // Include orders for each table if needed
      },
    });
    res.status(200).json(tables);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Failed to fetch tables' });
  }
};

// Get a single table by ID
export const getTableById = async (req, res) => {
  const { tableId } = req.params;

  try {
    const table = await prisma.table.findUnique({
      where: { id: parseInt(tableId) },
      include: {
        orders: true,  // Include orders for this table
      },
    });

    if (!table) {
      return res.status(404).json({ message: 'Table not found' });
    }

    res.status(200).json(table);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Failed to fetch table' });
  }
};

// Update a table
export const updateTable = async (req, res) => {
  const { tableId } = req.params;
  const { number, seats } = req.body;

  try {
    const updatedTable = await prisma.table.update({
      where: { id: parseInt(tableId) },
      data: {
        number,
        seats,
      },
    });
    res.status(200).json({ message: 'Table updated successfully', table: updatedTable });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Failed to update table' });
  }
};

// Delete a table
export const deleteTable = async (req, res) => {
  const { tableId } = req.params;

  try {
    await prisma.table.delete({
      where: { id: parseInt(tableId) },
    });
    res.status(200).json({ message: 'Table deleted successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Failed to delete table' });
  }
};

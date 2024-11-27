import prisma from '../../app.js';

// Create a new menu item
export const createMenuItem = async (req, res) => {
  try {
    const { name, description, price, category, available } = req.body;

    // Create a new menu item in the database
    const newMenuItem = await prisma.menuItem.create({
      data: {
        name,
        description,
        price,
        category,
        available,
      },
    });

    res.status(201).json({ message: 'Menu item created successfully', newMenuItem });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error' });
  }
};

// Get all menu items
export const getAllMenuItems = async (req, res) => {
  try {
    const menuItems = await prisma.menuItem.findMany();
    res.status(200).json(menuItems);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error' });
  }
};

// Get a specific menu item by ID
export const getMenuItemById = async (req, res) => {
  const { id } = req.params;

  try {
    const menuItem = await prisma.menuItem.findUnique({ where: { id: parseInt(id) } });

    if (!menuItem) {
      return res.status(404).json({ message: 'Menu item not found' });
    }

    res.status(200).json(menuItem);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error' });
  }
};

// Update a menu item
export const updateMenuItem = async (req, res) => {
  const { id } = req.params;
  const { name, description, price, category, available } = req.body;

  try {
    const updatedMenuItem = await prisma.menuItem.update({
      where: { id: parseInt(id) },
      data: {
        name,
        description,
        price,
        category,
        available,
      },
    });

    res.status(200).json({ message: 'Menu item updated successfully', updatedMenuItem });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error' });
  }
};

// Delete a menu item
export const deleteMenuItem = async (req, res) => {
  const { id } = req.params;

  try {
    await prisma.menuItem.delete({
      where: { id: parseInt(id) },
    });

    res.status(200).json({ message: 'Menu item deleted successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error' });
  }
};

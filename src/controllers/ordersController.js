// import prisma from '../../app.js';  

// // Utility function to calculate the total price for the order
// const calculateTotal = (menuItems) => {
//   return menuItems.reduce((total, item) => total + (item.price * item.quantity), 0);
// };

// // Create a new order
// export const createOrder = async (req, res) => {
//   const { userId, tableId, menuItems, orderType, deliveryAddress, deliveryTime } = req.body;

//   try {
//     // Create the order
//     const newOrder = await prisma.order.create({
//       data: {
//         userId,
//         tableId: orderType === 'in_place' ? tableId : null, // If in-place, link to a table
//         total: calculateTotal(menuItems),
//         status: 'pending', // Default to pending
//         orderType,
//         deliveryAddress: orderType === 'delivery' ? deliveryAddress : null,
//         deliveryTime: orderType === 'delivery' ? new Date(deliveryTime) : null,
//       },
//     });

//     // Add order items (linking menu items)
//     const orderItems = menuItems.map((item) => ({
//       orderId: newOrder.id,
//       menuItemId: item.menuItemId,
//       quantity: item.quantity,
//       price: item.price,
//     }));

//     await prisma.orderItem.createMany({
//       data: orderItems,
//     });

//     res.status(201).json({ message: 'Order created successfully', order: newOrder });
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ message: 'Failed to create order' });
//   }
// };

// // Get all orders
// export const getAllOrders = async (req, res) => {
//   try {
//     const orders = await prisma.order.findMany({
//       include: {
//         user: true,
//         table: true,
//         orderItems: {
//           include: {
//             menuItem: true,
//           },
//         },
//       },
//     });
//     res.status(200).json(orders);
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ message: 'Failed to fetch orders' });
//   }
// };

// // Get a single order by ID
// export const getOrderById = async (req, res) => {
//   const { orderId } = req.params;

//   try {
//     const order = await prisma.order.findUnique({
//       where: { id: parseInt(orderId) },
//       include: {
//         user: true,
//         table: true,
//         orderItems: {
//           include: {
//             menuItem: true,
//           },
//         },
//       },
//     });

//     if (!order) {
//       return res.status(404).json({ message: 'Order not found' });
//     }

//     res.status(200).json(order);
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ message: 'Failed to fetch order' });
//   }
// };


import prisma from '../../app.js';  

// Utility function to calculate the total price for the order
const calculateTotal = (menuItems) => {
  return menuItems.reduce((total, item) => total + (item.price * item.quantity), 0);
};

// Create a new order
export const createOrder = async (req, res) => {
  const { userId, tableId, menuItems, orderType, deliveryAddress, deliveryTime } = req.body;

  try {
    // Step 1: Validate the input data (check if menu items and user exist)
    if (!userId || !menuItems || menuItems.length === 0) {
      return res.status(400).json({ message: 'User ID and menu items are required' });
    }

    // Check if the user exists
    const user = await prisma.user.findUnique({ where: { id: userId } });
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // If the order type is 'in_place', ensure the table exists
    if (orderType === 'in_place') {
      if (!tableId) {
        return res.status(400).json({ message: 'Table ID is required for in-place orders' });
      }

      const table = await prisma.table.findUnique({ where: { id: tableId } });
      if (!table) {
        return res.status(404).json({ message: 'Table not found' });
      }
    }

    // Step 2: Calculate total price for the order
    const total = calculateTotal(menuItems);

    // Step 3: Create the order in the database
    const newOrder = await prisma.order.create({
      data: {
        userId,
        tableId: orderType === 'in_place' ? tableId : null, // If in-place, link to a table
        total,
        status: 'pending', // Default to pending
        orderType,
        deliveryAddress: orderType === 'delivery' ? deliveryAddress : null,
        deliveryTime: orderType === 'delivery' ? new Date(deliveryTime) : null,
      },
    });

    // Step 4: Add order items (linking menu items)
    const orderItems = menuItems.map((item) => ({
      orderId: newOrder.id,
      menuItemId: item.menuItemId,
      quantity: item.quantity,
      price: item.price,
    }));

    await prisma.orderItem.createMany({
      data: orderItems,
    });

    // Step 5: Respond with success message
    res.status(201).json({ message: 'Order created successfully', order: newOrder });
  } catch (error) {
    console.error('Error creating order: ', error.message);
    if (error.code) {
      console.error('Prisma Error Code: ', error.code);  // Prisma-specific error code
    }
    res.status(500).json({ message: 'Failed to create order', error: error.message });
  }
};

import prisma from '../../app.js';

// // Utility function to calculate the total price for the order
const calculateTotal = (menuItems) => {
  return menuItems.reduce((total, item) => total + item.price * item.quantity, 0);
};

// // Create a new order
// export const createOrder = async (req, res) => {
//   const { userId, tableId, menuItems, orderType, deliveryAddress, deliveryTime } = req.body;

//   try {
//     // Validate input data
//     if (!userId || !menuItems || menuItems.length === 0) {
//       return res.status(400).json({ message: 'User ID and menu items are required.' });
//     }

//     // Check if user exists
//     const user = await prisma.user.findUnique({ where: { id: userId } });
//     if (!user) return res.status(404).json({ message: 'User not found.' });

//     // Validate table for in-place orders
//     if (orderType === 'in_place' && !tableId) {
//       return res.status(400).json({ message: 'Table ID is required for in-place orders.' });
//     }

//     // Check if table exists for in-place orders
//     const table = orderType === 'in_place'
//       ? await prisma.table.findUnique({ where: { id: tableId } })
//       : null;

//     if (orderType === 'in_place' && !table) {
//       return res.status(404).json({ message: 'Table not found.' });
//     }

//     // Validate that all menu items exist
//     const menuItemIds = menuItems.map(item => item.menuItemId);
//     const existingMenuItems = await prisma.menuItem.findMany({
//       where: {
//         id: {
//           in: menuItemIds
//         }
//       }
//     });

//     if (existingMenuItems.length !== menuItemIds.length) {
//       return res.status(400).json({ 
//         message: 'One or more menu items do not exist.',
//         existingIds: existingMenuItems.map(item => item.id),
//         requestedIds: menuItemIds
//       });
//     }

//     // Create the order using a transaction to ensure data consistency
//     const result = await prisma.$transaction(async (prisma) => {
//       // Create the order first
//       const newOrder = await prisma.order.create({
//         data: {
//           userId,
//           tableId: orderType === 'in_place' ? tableId : null,
//           total: calculateTotal(menuItems),
//           status: 'pending',
//           orderType,
//           deliveryAddress: orderType === 'delivery' ? deliveryAddress : null,
//           deliveryTime: orderType === 'delivery' ? new Date(deliveryTime) : null,
//         },
//       });

//       // Create the order items
//       const orderItems = menuItems.map((item) => ({
//         orderId: newOrder.id,
//         menuItemId: item.menuItemId,
//         quantity: item.quantity,
//         price: item.price,
//       }));

//       await prisma.orderItem.createMany({
//         data: orderItems
//       });

//       return newOrder;
//     });

//     res.status(201).json({ 
//       message: 'Order created successfully', 
//       order: result 
//     });

//   } catch (error) {
//     console.error('Error creating order:', error);
//     res.status(500).json({ 
//       message: 'Failed to create order.', 
//       error: error.message 
//     });
//   }
// };

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
//     console.error('Error fetching orders:', error);
//     res.status(500).json({ message: 'Failed to fetch orders.', error: error.message });
//   }
// };

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

//     if (!order) return res.status(404).json({ message: 'Order not found.' });

//     res.status(200).json(order);
//   } catch (error) {
//     console.error('Error fetching order by ID:', error);
//     res.status(500).json({ message: 'Failed to fetch order.', error: error.message });
//   }
// };


export const createOrder = async (req, res) => {
  const { userId, tableNumber, menuItems, orderType, deliveryAddress, deliveryTime } = req.body;

  try {
    // Validate input data
    if (!userId || !menuItems || menuItems.length === 0) {
      return res.status(400).json({ message: "User ID and menu items are required." });
    }

    // Validate orderType
    const validOrderTypes = ["DINE_IN", "TAKEAWAY", "DELIVERY"];
    if (!validOrderTypes.includes(orderType)) {
      return res.status(400).json({ message: "Invalid order type." });
    }

    // Check if user exists
    const user = await prisma.user.findUnique({ where: { id: userId } });
    if (!user) return res.status(404).json({ message: "User not found." });

    // Validate table for dine-in orders
    let table = null;
    if (orderType === "DINE_IN") {
      if (!tableNumber) {
        return res.status(400).json({ message: "Table number is required for dine-in orders." });
      }

      // Find the table by its number
      table = await prisma.table.findUnique({ where: { number: tableNumber } });
      if (!table) {
        return res.status(404).json({ message: "Table not found." });
      }

      // Ensure the table is available (optional based on business logic)
      if (table.status !== "Free") {
        return res.status(400).json({ message: "Selected table is not available." });
      }
    }

    // Validate that all menu items exist
    const menuItemIds = menuItems.map((item) => item.menuItemId);
    const existingMenuItems = await prisma.menuItem.findMany({
      where: { id: { in: menuItemIds } },
    });

    if (existingMenuItems.length !== menuItemIds.length) {
      return res.status(400).json({
        message: "One or more menu items do not exist.",
        existingIds: existingMenuItems.map((item) => item.id),
        requestedIds: menuItemIds,
      });
    }

    // Create the order using a transaction to ensure data consistency
    const result = await prisma.$transaction(async (prisma) => {
      // Create the order first
      const newOrder = await prisma.order.create({
        data: {
          userId,
          tableId: orderType === "DINE_IN" ? table.id : null, // Use table.id from the query
          total: calculateTotal(menuItems),
          status: "PENDING",
          orderType, // Ensure this matches the enum values
          deliveryAddress: orderType === "DELIVERY" ? deliveryAddress : null,
          deliveryTime: orderType === "DELIVERY" ? new Date(deliveryTime) : null,
        },
      });

      // Create the order items
      const orderItems = menuItems.map((item) => ({
        orderId: newOrder.id,
        menuItemId: item.menuItemId,
        quantity: item.quantity,
        price: item.price,
      }));

      await prisma.orderItem.createMany({ data: orderItems });

      // Optionally update table status to "Occupied"
      if (orderType === "DINE_IN") {
        await prisma.table.update({
          where: { id: table.id },
          data: { status: "Occupied" },
        });
      }

      return newOrder;
    });

    res.status(201).json({
      message: "Order created successfully",
      order: result,
    });
  } catch (error) {
    console.error("Error creating order:", error);
    res.status(500).json({
      message: "Failed to create order.",
      error: error.message,
    });
  }
};



export const getAllOrders = async (req, res) => {
  try {
    const orders = await prisma.order.findMany({
      include: {
        user: true,
        table: true,
        orderItems: {
          include: {
            menuItem: true,
          },
        },
      },
    });

    res.status(200).json(orders);
  } catch (error) {
    console.error('Error fetching orders:', error);
    res.status(500).json({ message: 'Failed to fetch orders.', error: error.message });
  }
};

export const getOrderById = async (req, res) => {
  const { orderId } = req.params;

  try {
    const order = await prisma.order.findUnique({
      where: { id: parseInt(orderId) },
      include: {
        user: true,
        table: true,
        orderItems: {
          include: {
            menuItem: true,
          },
        },
      },
    });

    if (!order) return res.status(404).json({ message: 'Order not found.' });

    res.status(200).json(order);
  } catch (error) {
    console.error('Error fetching order by ID:', error);
    res.status(500).json({ message: 'Failed to fetch order.', error: error.message });
  }
};

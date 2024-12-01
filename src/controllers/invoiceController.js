import prisma from '../../app.js';

// Create an invoice
export const createInvoice = async (req, res) => {
  const { orderId, billingName, billingAddress, billingEmail, billingPhone } = req.body;

  try {
    // Check if the invoice already exists for the order
    const existingInvoice = await prisma.invoice.findUnique({
      where: { orderId: parseInt(orderId) },
    });

    if (existingInvoice) {
      return res.status(400).json({ message: 'Invoice already exists for this order' });
    }

    // Fetch the order to get the total amount
    const order = await prisma.order.findUnique({
      where: { id: parseInt(orderId) },
    });

    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    // Create the invoice
    const invoice = await prisma.invoice.create({
      data: {
        orderId: parseInt(orderId),
        billingName,
        billingAddress,
        billingEmail,
        billingPhone,
        totalAmount: order.total,
        status: 'unpaid',
      },
    });

    // Return the  invoice response
    res.status(201).json({
      message: 'Invoice created successfully',
      invoice,
    });
  } catch (error) {
    console.error('Error creating invoice:', error);
    res.status(500).json({ message: 'Failed to create invoice', error: error.message });
  }
};



// Get all invoices
export const getAllInvoices = async (req, res) => {
  try {
    const invoices = await prisma.invoice.findMany({
      include: {
        order: {
          include: {
            user: true,
            orderItems: {
              include: { menuItem: true },
            },
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    res.status(200).json(invoices);
  } catch (error) {
    console.error('Error fetching invoices:', error);
    res.status(500).json({ message: 'Failed to fetch invoices', error: error.message });
  }
};



// Get a specific invoice by ID
export const getInvoiceById = async (req, res) => {
  const { id } = req.params;

  try {
    const invoice = await prisma.invoice.findUnique({
      where: { id: parseInt(id) },
      include: {
        order: {
          include: {
            user: true,
            orderItems: {
              include: { menuItem: true },
            },
          },
        },
      },
    });

    if (!invoice) {
      return res.status(404).json({ message: 'Invoice not found' });
    }

    res.status(200).json(invoice);
  } catch (error) {
    console.error('Error fetching invoice:', error);
    res.status(500).json({ message: 'Failed to fetch invoice', error: error.message });
  }
};

// Update an invoice's status
export const updateInvoiceStatus = async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;

  try {
    const invoice = await prisma.invoice.findUnique({
      where: { id: parseInt(id) },
    });

    if (!invoice) {
      return res.status(404).json({ message: 'Invoice not found' });
    }

    const updatedInvoice = await prisma.invoice.update({
      where: { id: parseInt(id) },
      data: { status },
      include: {
        order: {
          include: {
            user: true,
            orderItems: {
              include: { menuItem: true },
            },
          },
        },
      },
    });

    res.status(200).json({
      message: 'Invoice status updated successfully',
      invoice: updatedInvoice,
    });
  } catch (error) {
    console.error('Error updating invoice status:', error);
    res.status(500).json({ message: 'Failed to update invoice', error: error.message });
  }
};

import prisma from '../../app.js';  // Importing prisma instance
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

// User signup
export const signup = async (req, res) => {
  const { name, email, password, role } = req.body;
  console.log(req.body)
  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await prisma.user.create({
      data: { name, email, password: hashedPassword, role },
    });
    res.status(201).json({ message: 'User created', user });
  } catch (error) {
    res.status(500).json({ error: 'Failed to create user' });
  }
};

// User login
export const login = async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) return res.status(404).json({ error: 'User not found' });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(401).json({ error: 'Invalid credentials' });

    const token = jwt.sign({ id: user.id, role: user.role }, process.env.JWT_SECRET, { expiresIn: '1d' });
    res.json({ message: 'Login successful', token });
  } catch (error) {
    res.status(500).json({ error: 'Failed to login' });
  }
};

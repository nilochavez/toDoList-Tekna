import { Request, Response, RequestHandler } from 'express';
import { AuthService } from '../services/auth.service';

const authService = new AuthService();

export const registerUser: RequestHandler = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      res.status(400).json({ message: 'Email and password are required.' });
      return;
    }

    const user = await authService.register(email, password);

    res.status(201).json({
      message: 'User created successfully',
      user: {
        id: user.id,
        email: user.email,
      },
    });
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
};

export const loginUser: RequestHandler = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      res.status(400).json({ message: 'Email and password are required.' });
      return;
    }

    const result = await authService.login(email, password);

    res.status(200).json(result);
  } catch (error: any) {
    res.status(401).json({ error: error.message });
  }
};

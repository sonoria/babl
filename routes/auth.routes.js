import { Router } from 'express';
import argon2 from 'argon2';
import { validationResult } from 'express-validator';
import jsonwebtoken from 'jsonwebtoken';
import config from 'config';
import { signupValidator } from '../validation.js';
import User from '../models/User.js';

export const router = Router();

const argon = argon2;
const jwt = jsonwebtoken;

// /account/signup
router.post('/signup', signupValidator, async (req, res) => {
  try {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res.status(400).json({
        errors: errors.array(),
        message: 'Ошибка регистрации',
      });
    }

    const { email, password } = req.body;

    const candidate = await User.findOne({
      email,
    });

    if (candidate) {
      return res.status(400).json({
        message: 'Пользователь с таким email уже существует',
      });
    }

    const passwordHash = await argon.hash(password, {
      hashLength: 50,
      timeCost: 10,
    });

    const user = new User({
      email,
      password: passwordHash,
    });

    await user.save();

    res.status(201).json({
      message: 'Регистрация прошла успешно',
    });
  } catch (err) {
    res.status(500).json({
      message: 'Что-то пошло не так, попробуйте позже',
    });
  }
  return null;
});

// /account/signin
router.post('/signin', async (req, res) => {
  try {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res.status(400).json({
        errors: errors.array(),
        message: 'Ошибка авторизации',
      });
    }

    const { email, password } = req.body;

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(400).json({ message: 'Неверный логин' });
    }

    const isMatch = await argon.verify(user.password, password);

    if (!isMatch) {
      return res.status(400).json({ message: 'Неверный пароль' });
    }

    const token = jwt.sign({ userId: user.id }, config.get('jwtSecret'), {
      expiresIn: '1h',
    });

    res.json({ token, userId: user.id, email: user.email });

    return res.status(200).json({ message: 'Авторизация прошла успешно!' });
  } catch (err) {
    res.status(500).json({
      message: 'Что-то пошло не так, попробуйте позже',
    });
  }
  return null;
});

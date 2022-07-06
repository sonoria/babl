import { body } from 'express-validator';

export const signupValidator = [
  body('email').normalizeEmail().isEmail().withMessage('Неверный формат почты'),
  body('password')
    .isStrongPassword({
      minSymbols: 0,
    })
    .withMessage(
      'Пароль должен содержать не менее восьми знаков, включать цифры, строчные и прописные буквы',
    ),
];

export const signinValidator = [
  body('email').normalizeEmail().isEmail().withMessage('Неверный формат почты'),
  body('password').exists(),
];

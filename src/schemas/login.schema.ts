import { z } from 'zod';

export const loginSchema = z.object({
  email: z.string().min(1).email({ message: 'Invalid email address' }),
  password: z.string().min(1, { message: 'Password is required' }),
});

export const registerSchema = z
  .object({
    username: z.string().min(1, { message: 'Username is required' }),
    email: z.string().email({ message: 'Invalid email address' }),
    password: z
      .string()
      .min(6, { message: 'Password must be at least 6 characters long' })
      .regex(/[A-Z]/, { message: 'Password must include at least one uppercase letter' }) // Uppercase letter
      .regex(/[a-z]/, { message: 'Password must include at least one lowercase letter' }) // Lowercase letter
      .regex(/\d/, { message: 'Password must include at least one number' }) // Number
      .regex(/[@$!%*?&#]/, { message: 'Password must include at least one special character' }), // Special character
    confirmPassword: z.string().min(1, { message: 'Confirm password is required' }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'Passwords do not match',
    path: ['confirmPassword'], // Apply the error to the `confirmPassword` field
  });

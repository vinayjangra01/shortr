import * as yup from 'yup'
import { config } from '../config/config.js'

export const urlSchema = yup.object({
    originalUrl: yup
    .string()
    .trim()
    .url(config.messages.error.invalidUrl)
    .required(config.messages.error.missingUrl)
    .max(2048, "URL is too long"),
     customUrl: yup
    .string()
    .optional()
    .matches(/^[a-zA-Z0-9-_]+$/, 'Custom URL can only contain letters, numbers, hyphens and underscores')
    .min(3, 'Custom URL must be at least 3 characters')
    .max(50, 'Custom URL must not exceed 50 characters'),
    title: yup
    .string()
    .optional()
    .max(200, 'Title must not exceed 200 characters'),
})

export const registerSchema = yup.object({
    name: yup
    .string()
    .required("Name is required")
    .min(2, 'Name must be at least 2 characters')
    .max(50, 'Name must not exceed 50 characters'),
    email: yup
    .string()
    .required("Email is required")
    .email("Invalid email format")
    .lowercase()
    .trim(),
    password: yup
    .string()
    .required("Password is required")
    .min(8, "Password must be at least 8 characters")
    .matches(
         /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/,
      'Password must contain uppercase, lowercase, number and special character'
    )
})

export const loginSchema = yup.object({
  email: yup
    .string()
    .required('Email is required')
    .email('Invalid email format')
    .lowercase()
    .trim(),
  password: yup.string().required('Password is required'),
});
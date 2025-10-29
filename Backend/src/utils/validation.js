import * as yup from 'yup'
import { config } from '../config/config.js'

export const urlSchema = yup.object({
    originalUrl: yup
        .string()
        .trim()
        .url(config.messages.error.invalidUrl)
        .required(config.messages.error.missingUrl)
})

import { z } from 'zod';

// User schema
export const userSchema = z.object({
  id: z.number(),
  username: z.string(),
  email: z.string().email(),
  password_hash: z.string(),
  created_at: z.coerce.date(),
  updated_at: z.coerce.date()
});

export type User = z.infer<typeof userSchema>;

// Message schema
export const messageSchema = z.object({
  id: z.number(),
  sender_id: z.number(),
  subject: z.string(),
  body: z.string(),
  created_at: z.coerce.date(),
  updated_at: z.coerce.date()
});

export type Message = z.infer<typeof messageSchema>;

// Message recipient schema (for handling multiple recipients)
export const messageRecipientSchema = z.object({
  id: z.number(),
  message_id: z.number(),
  recipient_id: z.number(),
  is_read: z.boolean(),
  read_at: z.coerce.date().nullable(),
  created_at: z.coerce.date()
});

export type MessageRecipient = z.infer<typeof messageRecipientSchema>;

// Enhanced message schema with sender and recipient info
export const messageWithDetailsSchema = z.object({
  id: z.number(),
  sender_id: z.number(),
  sender_username: z.string(),
  sender_email: z.string(),
  subject: z.string(),
  body: z.string(),
  recipients: z.array(z.object({
    id: z.number(),
    username: z.string(),
    email: z.string(),
    is_read: z.boolean(),
    read_at: z.coerce.date().nullable()
  })),
  created_at: z.coerce.date(),
  updated_at: z.coerce.date()
});

export type MessageWithDetails = z.infer<typeof messageWithDetailsSchema>;

// Input schemas
export const registerUserInputSchema = z.object({
  username: z.string().min(3).max(50),
  email: z.string().email(),
  password: z.string().min(6)
});

export type RegisterUserInput = z.infer<typeof registerUserInputSchema>;

export const loginInputSchema = z.object({
  email: z.string().email(),
  password: z.string()
});

export type LoginInput = z.infer<typeof loginInputSchema>;

export const composeMessageInputSchema = z.object({
  sender_id: z.number(),
  recipient_ids: z.array(z.number()).min(1),
  subject: z.string().min(1).max(200),
  body: z.string()
});

export type ComposeMessageInput = z.infer<typeof composeMessageInputSchema>;

export const markMessageReadInputSchema = z.object({
  message_id: z.number(),
  user_id: z.number()
});

export type MarkMessageReadInput = z.infer<typeof markMessageReadInputSchema>;

export const getUserMessagesInputSchema = z.object({
  user_id: z.number(),
  type: z.enum(['inbox', 'sent']).optional()
});

export type GetUserMessagesInput = z.infer<typeof getUserMessagesInputSchema>;

export const getMessageInputSchema = z.object({
  message_id: z.number(),
  user_id: z.number()
});

export type GetMessageInput = z.infer<typeof getMessageInputSchema>;

// Authentication response schema
export const authResponseSchema = z.object({
  success: z.boolean(),
  user: userSchema.omit({ password_hash: true }).optional(),
  message: z.string().optional()
});

export type AuthResponse = z.infer<typeof authResponseSchema>;

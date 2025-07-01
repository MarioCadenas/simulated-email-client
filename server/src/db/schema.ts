
import { serial, text, pgTable, timestamp, integer, boolean } from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm';

export const usersTable = pgTable('users', {
  id: serial('id').primaryKey(),
  username: text('username').notNull().unique(),
  email: text('email').notNull().unique(),
  password_hash: text('password_hash').notNull(),
  created_at: timestamp('created_at').defaultNow().notNull(),
  updated_at: timestamp('updated_at').defaultNow().notNull()
});

export const messagesTable = pgTable('messages', {
  id: serial('id').primaryKey(),
  sender_id: integer('sender_id').notNull().references(() => usersTable.id),
  subject: text('subject').notNull(),
  body: text('body').notNull(),
  created_at: timestamp('created_at').defaultNow().notNull(),
  updated_at: timestamp('updated_at').defaultNow().notNull()
});

export const messageRecipientsTable = pgTable('message_recipients', {
  id: serial('id').primaryKey(),
  message_id: integer('message_id').notNull().references(() => messagesTable.id),
  recipient_id: integer('recipient_id').notNull().references(() => usersTable.id),
  is_read: boolean('is_read').default(false).notNull(),
  read_at: timestamp('read_at'),
  created_at: timestamp('created_at').defaultNow().notNull()
});

// Define relations
export const usersRelations = relations(usersTable, ({ many }) => ({
  sentMessages: many(messagesTable),
  receivedMessages: many(messageRecipientsTable)
}));

export const messagesRelations = relations(messagesTable, ({ one, many }) => ({
  sender: one(usersTable, {
    fields: [messagesTable.sender_id],
    references: [usersTable.id]
  }),
  recipients: many(messageRecipientsTable)
}));

export const messageRecipientsRelations = relations(messageRecipientsTable, ({ one }) => ({
  message: one(messagesTable, {
    fields: [messageRecipientsTable.message_id],
    references: [messagesTable.id]
  }),
  recipient: one(usersTable, {
    fields: [messageRecipientsTable.recipient_id],
    references: [usersTable.id]
  })
}));

// TypeScript types for the table schemas
export type User = typeof usersTable.$inferSelect;
export type NewUser = typeof usersTable.$inferInsert;
export type Message = typeof messagesTable.$inferSelect;
export type NewMessage = typeof messagesTable.$inferInsert;
export type MessageRecipient = typeof messageRecipientsTable.$inferSelect;
export type NewMessageRecipient = typeof messageRecipientsTable.$inferInsert;

// Export all tables for proper query building
export const tables = { 
  users: usersTable, 
  messages: messagesTable, 
  messageRecipients: messageRecipientsTable 
};

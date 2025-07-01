
import { initTRPC } from '@trpc/server';
import { createHTTPServer } from '@trpc/server/adapters/standalone';
import 'dotenv/config';
import cors from 'cors';
import superjson from 'superjson';

import { 
  registerUserInputSchema, 
  loginInputSchema,
  composeMessageInputSchema,
  markMessageReadInputSchema,
  getUserMessagesInputSchema,
  getMessageInputSchema
} from './schema';

import { registerUser } from './handlers/register_user';
import { loginUser } from './handlers/login_user';
import { getUsers } from './handlers/get_users';
import { composeMessage } from './handlers/compose_message';
import { getUserMessages } from './handlers/get_user_messages';
import { getMessage } from './handlers/get_message';
import { markMessageRead } from './handlers/mark_message_read';

const t = initTRPC.create({
  transformer: superjson,
});

const publicProcedure = t.procedure;
const router = t.router;

const appRouter = router({
  healthcheck: publicProcedure.query(() => {
    return { status: 'ok', timestamp: new Date().toISOString() };
  }),
  
  // User authentication routes
  registerUser: publicProcedure
    .input(registerUserInputSchema)
    .mutation(({ input }) => registerUser(input)),
    
  loginUser: publicProcedure
    .input(loginInputSchema)
    .mutation(({ input }) => loginUser(input)),
    
  getUsers: publicProcedure
    .query(() => getUsers()),
    
  // Message management routes
  composeMessage: publicProcedure
    .input(composeMessageInputSchema)
    .mutation(({ input }) => composeMessage(input)),
    
  getUserMessages: publicProcedure
    .input(getUserMessagesInputSchema)
    .query(({ input }) => getUserMessages(input)),
    
  getMessage: publicProcedure
    .input(getMessageInputSchema)
    .query(({ input }) => getMessage(input)),
    
  markMessageRead: publicProcedure
    .input(markMessageReadInputSchema)
    .mutation(({ input }) => markMessageRead(input)),
});

export type AppRouter = typeof appRouter;

async function start() {
  const port = process.env['SERVER_PORT'] || 2022;
  const server = createHTTPServer({
    middleware: (req, res, next) => {
      cors()(req, res, next);
    },
    router: appRouter,
    createContext() {
      return {};
    },
  });
  server.listen(port);
  console.log(`TRPC server listening at port: ${port}`);
}

start();

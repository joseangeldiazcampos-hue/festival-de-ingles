/**
 * NextAuth v5 route handler
 * Handles all /api/auth/* routes (login, logout, session, etc.)
 */

import { handlers } from "@/lib/auth";

export const { GET, POST } = handlers;

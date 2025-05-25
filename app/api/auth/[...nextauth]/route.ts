import NextAuth from "next-auth";
import { authOptions } from "@/lib/auth";
import connectDB from "@/lib/db";

// Ensure database connection is established
connectDB().catch(console.error);

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };
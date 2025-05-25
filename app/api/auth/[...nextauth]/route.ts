import NextAuth, { AuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";
import VkProvider from "next-auth/providers/vk";
import { MongoDBAdapter } from "@auth/mongodb-adapter";
import User from "@/models/User";
import bcrypt from "bcryptjs";
import clientPromise from "@/lib/mongodb";

export const authOptions = {
    adapter: MongoDBAdapter(clientPromise),
    session: {
        strategy: "jwt",
    },
    callbacks: {
        async jwt({ token, user, account }) {
            if (user) {
                token.id = user.id;
                token.role = user.role;
                token.profileCompleted = user.profileCompleted;
            }
            return token;
        },
        async session({ session, token }) {
            if (token) {
                // Получаем свежие данные пользователя из базы
                const user = await User.findOne({ email: session.user.email });
                if (user) {
                    session.user.id = user._id.toString();
                    session.user.name = user.name;
                    session.user.email = user.email;
                    session.user.role = user.role;
                    session.user.profileCompleted = user.profileCompleted;
                }
            }
            return session;
        },
        async signIn({ user, account, profile }) {
            if (account?.provider === 'google' || account?.provider === 'vk') {
                const existingUser = await User.findOne({ email: user.email });
                if (existingUser && profile?.sub) {
                    // Обновляем данные пользователя из соцсети
                    await User.findOneAndUpdate(
                        { email: user.email },
                        {
                            name: user.name,
                            [`${account.provider}Id`]: profile.sub,
                            updatedAt: new Date()
                        }
                    );
                }
            }
            return true;
        }
    },
    providers: [
        VkProvider({
            clientId: process.env.VK_CLIENT_ID!,
            clientSecret: process.env.VK_CLIENT_SECRET!
        }),
        GoogleProvider({
            clientId: process.env.GOOGLE_CLIENT_ID!,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET!
        }),
        CredentialsProvider({
            name: "Credentials",
            credentials: {
                email: { label: "Email", type: "email" },
                password: { label: "Password", type: "password" }
            },
            async authorize(credentials) {
                if (!credentials) return null;
                const user = await User.findOne({ email: credentials.email });
                if (!user) return null;
                const isValid = await bcrypt.compare(credentials.password, user.passwordHash);
                if (!isValid) return null;
                return {
                    id: user._id.toString(),
                    name: user.name,
                    email: user.email,
                    role: user.role,
                    profileCompleted: user.profileCompleted
                };
            }
        })
    ],
    secret: process.env.NEXTAUTH_SECRET
} as AuthOptions;

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };
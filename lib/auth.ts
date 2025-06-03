import { AuthOptions, Session, User as NextAuthUser, Account, Profile, DefaultSession } from "next-auth";
import { JWT } from "next-auth/jwt";
import CredentialsProvider from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";
import YandexProvider from "next-auth/providers/yandex";
import AppleProvider from "next-auth/providers/apple";
import VkProvider from "next-auth/providers/vk";
import UserModel from "@/models/User";
import bcrypt from "bcryptjs";
import connectDB from './db';
import mongoose from 'mongoose';

declare module "next-auth" {
    interface Session extends DefaultSession {
        user: {
            id: string;
            role: string;
            profileCompleted: boolean;
            listings: string[];
        } & DefaultSession["user"]
    }
}

declare module "next-auth/jwt" {
    interface JWT {
        id: string;
        role: string;
        profileCompleted: boolean;
        listings: string[];
    }
}

type CustomUser = NextAuthUser & {
    role: string;
    profileCompleted: boolean;
    listings: string[];
};

export const authOptions: AuthOptions = {
    session: {
        strategy: "jwt",
    },
    cookies: {
        csrfToken: {
            name: 'next-auth.csrf-token',
            options: {
                httpOnly: true,
                sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
                path: '/',
                secure: process.env.NODE_ENV === 'production'
            }
        },
        pkceCodeVerifier: {
            name: 'next-auth.pkce.code_verifier',
            options: {
                httpOnly: true,
                sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
                path: '/',
                secure: process.env.NODE_ENV === 'production'
            }
        }
    },
    callbacks: {
        async jwt({ token, user, account }: { token: JWT; user?: CustomUser; account?: Account | null }) {
            if (user) {
                token.id = user.id;
                token.role = user.role;
                token.profileCompleted = user.profileCompleted;
                token.listings = user.listings;
            }
            if (account) {
                token.provider = account.provider;
            }
            return token;
        },
        async session({ session, token }: { session: Session; token: JWT }) {
            if (token && session.user?.email) {
                try {
                    // Получаем свежие данные пользователя из базы
                    const user = await UserModel.findOne({ email: session.user.email });
                    if (user) {
                        session.user.id = user._id.toString();
                        session.user.name = user.name || '';
                        session.user.email = user.email;
                        session.user.role = user.role;
                        session.user.profileCompleted = user.profileCompleted;
                        session.user.listings = user.listings?.map((id: mongoose.Types.ObjectId) => id.toString()) || [];
                    } else {
                        // If user not found in database, clear the session data
                        session.user = {
                            ...session.user,
                            id: '',
                            name: '',
                            email: '',
                            role: 'user',
                            profileCompleted: false,
                            listings: []
                        };
                    }
                } catch (error) {
                    console.error('Error fetching user in session callback:', error);
                    // On error, clear the session data
                    session.user = {
                        ...session.user,
                        id: '',
                        name: '',
                        email: '',
                        role: 'user',
                        profileCompleted: false,
                        listings: []
                    };
                }
            }
            return session;
        },
        async signIn({ user, account, profile }: { user: CustomUser; account: Account | null; profile?: Profile }) {
            try {
                if (account?.provider === 'google' || account?.provider === 'yandex' || account?.provider === 'vk' || account?.provider === 'apple') {
                    const existingUser = await UserModel.findOne({ email: user.email });

                    if (existingUser) {
                        // Update existing user's social ID and name
                        const updateData: any = {
                            updatedAt: new Date()
                        };

                        // Set the appropriate social ID based on provider
                        if (account.provider === 'google') updateData.googleId = profile?.sub;
                        if (account.provider === 'yandex') updateData.yandexId = profile?.sub;
                        if (account.provider === 'vk') updateData.vkId = profile?.sub;
                        if (account.provider === 'apple') updateData.appleId = profile?.sub;

                        await UserModel.findOneAndUpdate(
                            { email: user.email },
                            updateData,
                            { runValidators: false }
                        );
                    } else {
                        // Create new user without passwordHash for social login
                        const newUserData: any = {
                            email: user.email,
                            name: user.name,
                            role: 'landlord',
                            profileCompleted: false,
                            listings: []
                        };

                        // Set the appropriate social ID based on provider
                        if (account.provider === 'google') newUserData.googleId = profile?.sub;
                        if (account.provider === 'yandex') newUserData.yandexId = profile?.sub;
                        if (account.provider === 'vk') newUserData.vkId = profile?.sub;
                        if (account.provider === 'apple') newUserData.appleId = profile?.sub;

                        await UserModel.create(newUserData);
                    }
                }
                return true;
            } catch (error) {
                console.error('Error in signIn callback:', error);
                return false;
            }
        }
    },
    providers: [
        YandexProvider({
            clientId: process.env.YANDEX_CLIENT_ID!,
            clientSecret: process.env.YANDEX_CLIENT_SECRET!,
            authorization: {
                params: {
                    scope: "login:email login:info"
                }
            }
        }),
        AppleProvider({
            clientId: process.env.APPLE_CLIENT_ID!,
            clientSecret: process.env.AUTH_APPLE_SECRET!,
            wellKnown: "https://appleid.apple.com/.well-known/openid-configuration",
            authorization: {
                params: {
                    scope: "openid name email",
                    response_mode: "form_post"
                }
            },
            profile(profile) {
                return {
                    id: profile.sub,
                    name: profile.name?.firstName,
                    email: profile.email,
                    role: 'landlord',
                    profileCompleted: false,
                    listings: []
                }
            }
        }),
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
                const user = await UserModel.findOne({ email: credentials.email });
                if (!user) return null;
                const isValid = await bcrypt.compare(credentials.password, user.passwordHash);
                if (!isValid) return null;
                return {
                    id: user._id.toString(),
                    name: user.name,
                    email: user.email,
                    role: user.role,
                    profileCompleted: user.profileCompleted,
                    listings: user.listings?.map((id: mongoose.Types.ObjectId) => id.toString()) || []
                };
            }
        })
    ],
    pages: {
        signIn: '/signin',
    },
    secret: process.env.NEXTAUTH_SECRET
}; 
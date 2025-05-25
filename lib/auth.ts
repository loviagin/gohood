import { AuthOptions, Session, User as NextAuthUser, Account, Profile, DefaultSession } from "next-auth";
import { JWT } from "next-auth/jwt";
import CredentialsProvider from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";
import YandexProvider from "next-auth/providers/yandex";
import UserModel from "@/models/User";
import bcrypt from "bcryptjs";

declare module "next-auth" {
    interface Session extends DefaultSession {
        user: {
            id: string;
            role: string;
            profileCompleted: boolean;
        } & DefaultSession["user"]
    }
}

declare module "next-auth/jwt" {
    interface JWT {
        id: string;
        role: string;
        profileCompleted: boolean;
    }
}

type CustomUser = NextAuthUser & {
    role: string;
    profileCompleted: boolean;
};

export const authOptions: AuthOptions = {
    session: {
        strategy: "jwt",
    },
    callbacks: {
        async jwt({ token, user, account }: { token: JWT; user?: CustomUser; account?: Account | null }) {
            if (user) {
                token.id = user.id;
                token.role = user.role;
                token.profileCompleted = user.profileCompleted;
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
                    } else {
                        // If user not found in database, clear the session data
                        session.user = {
                            ...session.user,
                            id: '',
                            name: '',
                            email: '',
                            role: 'user',
                            profileCompleted: false
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
                        profileCompleted: false
                    };
                }
            }
            return session;
        },
        async signIn({ user, account, profile }: { user: CustomUser; account: Account | null; profile?: Profile }) {
            if (account?.provider === 'google' || account?.provider === 'vk') {
                const existingUser = await UserModel.findOne({ email: user.email });
                if (existingUser && profile?.sub) {
                    // Обновляем данные пользователя из соцсети
                    await UserModel.findOneAndUpdate(
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
        YandexProvider({
            clientId: process.env.YANDEX_CLIENT_ID!,
            clientSecret: process.env.YANDEX_CLIENT_SECRET!,
            authorization: {
                params: {
                    scope: "login:email login:info"
                }
            }
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
                    profileCompleted: user.profileCompleted
                };
            }
        })
    ],
    secret: process.env.NEXTAUTH_SECRET
}; 
'use client';

import { useState, useEffect } from 'react';
import { signIn, useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { FcGoogle } from 'react-icons/fc';
import { FaYandex } from 'react-icons/fa';
import { toast } from 'react-hot-toast';
import styles from './page.module.css';

type RegistrationStep = 'auth' | 'details';

export default function LandlordRegister() {
    const router = useRouter();
    const { data: session, update: updateSession } = useSession();
    const [currentStep, setCurrentStep] = useState<RegistrationStep>(
        session ? 'details' : 'auth'
    );
    const [isLoading, setIsLoading] = useState(false);
    const [authData, setAuthData] = useState({
        email: '',
        password: '',
    });
    const [profileData, setProfileData] = useState({
        name: '',
        phone: '',
        companyName: '',
    });

    // Обновляем шаг при изменении сессии
    useEffect(() => {
        if (session && currentStep === 'auth') {
            setCurrentStep('details');
            if (session.user.name) {
                setProfileData(prev => ({
                    ...prev,
                    name: session.user.name || ''
                }));
            }
        }

        if (session?.user.profileCompleted) {
            console.log('PROFILE COMPLETED');
            router.push('/account');
        }
    }, [session, currentStep]);

    const handleAuthChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setAuthData({
            ...authData,
            [e.target.name]: e.target.value
        });
    };

    const handleProfileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setProfileData({
            ...profileData,
            [e.target.name]: e.target.value
        });
    };

    const handleAuthSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);

        try {
            const res = await fetch('/api/auth/register', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    email: authData.email,
                    password: authData.password,
                    role: 'landlord'
                }),
            });

            const data = await res.json();

            if (!res.ok) {
                if (data.error === 'User already exists') {
                    // Try to sign in the existing user
                    const signInResult = await signIn('credentials', {
                        email: authData.email,
                        password: authData.password,
                        redirect: false,
                    });

                    if (signInResult?.error) {
                        throw new Error('Неверный пароль для существующего пользователя');
                    }

                    // If sign in successful, move to profile step
                    setCurrentStep('details');
                    toast.success('Вход выполнен! Заполните профиль');
                    return;
                }
                throw new Error(data.error || 'Registration failed');
            }

            // Sign in the user after successful registration
            const result = await signIn('credentials', {
                email: authData.email,
                password: authData.password,
                redirect: false,
            });

            if (result?.error) {
                throw new Error(result.error);
            }

            setCurrentStep('details');
            toast.success('Аккаунт создан! Заполните профиль');
        } catch (error) {
            toast.error(error instanceof Error ? error.message : 'Ошибка при регистрации. Попробуйте снова.');
            console.error(error);
        } finally {
            setIsLoading(false);
        }
    };

    const handleProfileSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);

        try {
            const res = await fetch('/api/auth/update-profile', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    ...profileData,
                    role: 'landlord'
                }),
            });

            if (!res.ok) {
                const error = await res.json();
                throw new Error(error.error || 'Profile update failed');
            }

            const data = await res.json();
            
            // Обновляем сессию
            await updateSession({
                ...session,
                user: {
                    ...session?.user,
                    name: data.user.name,
                    email: data.user.email,
                    role: data.user.role,
                    profileCompleted: true
                }
            });

            toast.success('Профиль успешно обновлен!');
            
            // Принудительно обновляем страницу и перенаправляем
            window.location.href = '/account';
        } catch (error) {
            toast.error(error instanceof Error ? error.message : 'Ошибка при обновлении профиля');
            console.error(error);
        } finally {
            setIsLoading(false);
        }
    };

    const handleSocialSignIn = (provider: string) => {
        signIn(provider, { 
            callbackUrl: '/become-landlord/register?step=details'
        });
    };

    if (currentStep === 'auth') {
        return (
            <div className={styles.container}>
                <div className={styles.content}>
                    <div className={styles.header}>
                        <h1 className={styles.title}>Регистрация арендодателя</h1>
                        <p className={styles.subtitle}>
                            Создайте аккаунт, чтобы начать размещать свои объекты
                        </p>
                    </div>

                    <form className={styles.form} onSubmit={handleAuthSubmit}>
                        <div className={styles.formGroup}>
                            <label htmlFor="email" className={styles.label}>
                                Email
                            </label>
                            <input
                                id="email"
                                name="email"
                                type="email"
                                autoComplete="email"
                                required
                                value={authData.email}
                                onChange={handleAuthChange}
                                className={styles.input}
                                placeholder="your@email.com"
                            />
                        </div>

                        <div className={styles.formGroup}>
                            <label htmlFor="password" className={styles.label}>
                                Пароль
                            </label>
                            <input
                                id="password"
                                name="password"
                                type="password"
                                autoComplete="new-password"
                                required
                                value={authData.password}
                                onChange={handleAuthChange}
                                className={styles.input}
                                placeholder="Минимум 8 символов"
                            />
                        </div>

                        <button
                            type="submit"
                            disabled={isLoading}
                            className={styles.submitButton}
                        >
                            {isLoading ? 'Регистрация...' : 'Продолжить'}
                        </button>
                    </form>

                    <div className={styles.divider}>или</div>

                    <div className={styles.socialButtons}>
                        <button
                            onClick={() => handleSocialSignIn('google')}
                            className={styles.googleButton}
                        >
                            <FcGoogle className={styles.socialIcon} />
                            Войти через Google
                        </button>

                        <button
                            onClick={() => handleSocialSignIn('yandex')}
                            className={styles.yandexButton}
                        >
                            <FaYandex className={styles.socialIcon} />
                            Войти через Яндекс
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className={styles.container}>
            <div className={styles.content}>
                <div className={styles.header}>
                    <h1 className={styles.title}>Заполните профиль</h1>
                    <p className={styles.subtitle}>
                        Расскажите о себе, чтобы мы могли лучше подобрать вам арендаторов
                    </p>
                </div>

                <form className={styles.form} onSubmit={handleProfileSubmit}>
                    <div className={styles.formGroup}>
                        <label htmlFor="name" className={styles.label}>
                            ФИО
                        </label>
                        <input
                            id="name"
                            name="name"
                            type="text"
                            required
                            value={profileData.name}
                            onChange={handleProfileChange}
                            className={styles.input}
                            placeholder="Введите ваше полное имя"
                        />
                    </div>

                    <div className={styles.formGroup}>
                        <label htmlFor="phone" className={styles.label}>
                            Телефон
                        </label>
                        <input
                            id="phone"
                            name="phone"
                            type="tel"
                            required
                            value={profileData.phone}
                            onChange={handleProfileChange}
                            className={styles.input}
                            placeholder="+7 (___) ___-__-__"
                        />
                    </div>

                    <div className={styles.formGroup}>
                        <label htmlFor="companyName" className={styles.label}>
                            Название компании (необязательно)
                        </label>
                        <input
                            id="companyName"
                            name="companyName"
                            type="text"
                            value={profileData.companyName}
                            onChange={handleProfileChange}
                            className={styles.input}
                            placeholder="Введите название вашей компании"
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={isLoading}
                        className={styles.submitButton}
                    >
                        {isLoading ? 'Сохранение...' : 'Завершить регистрацию'}
                    </button>
                </form>
            </div>
        </div>
    );
}

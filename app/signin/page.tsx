'use client';

import { useState } from 'react';
import { signIn } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { FcGoogle } from 'react-icons/fc';
import { FaApple } from 'react-icons/fa';
import { toast } from 'react-hot-toast';
import styles from './page.module.css';

export default function SignIn() {
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(false);
    const [formData, setFormData] = useState({
        email: '',
        password: ''
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);

        try {
            const result = await signIn('credentials', {
                email: formData.email,
                password: formData.password,
                redirect: false
            });

            if (result?.error) {
                throw new Error('Неверный email или пароль');
            }

            toast.success('Вход выполнен успешно!');
            router.push('/');
            router.refresh();
        } catch (error) {
            toast.error(error instanceof Error ? error.message : 'Ошибка при входе');
            console.error(error);
        } finally {
            setIsLoading(false);
        }
    };

    const handleGoogleSignIn = () => {
        signIn('google', { callbackUrl: '/' });
    };

    const handleAppleSignIn = () => {
        signIn('apple', { callbackUrl: '/' });
    };

    const handleTenantRegistration = () => {
        router.push('/become-landlord/register');
    };

    const handleLandlordRegistration = () => {
        router.push('/rent/register');
    };

    return (
        <div className={styles.container}>
            <div className={styles.content}>
                <div className={styles.header}>
                    <h1 className={styles.title}>Вход в аккаунт</h1>
                    <p className={styles.subtitle}>
                        Войдите, чтобы получить доступ к вашему аккаунту
                    </p>
                </div>

                <form className={styles.form} onSubmit={handleSubmit}>
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
                            value={formData.email}
                            onChange={handleChange}
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
                            autoComplete="current-password"
                            required
                            value={formData.password}
                            onChange={handleChange}
                            className={styles.input}
                            placeholder="Введите ваш пароль"
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={isLoading}
                        className={styles.submitButton}
                    >
                        {isLoading ? 'Вход...' : 'Войти'}
                    </button>
                </form>

                <div className={styles.divider}>или</div>

                <div className={styles.socialButtons}>
                    <button
                        onClick={handleGoogleSignIn}
                        className={styles.googleButton}
                    >
                        <FcGoogle className={styles.socialIcon} />
                        Войти через Google
                    </button>
                    <button
                        onClick={handleAppleSignIn}
                        className={styles.appleButton}
                    >
                        <FaApple className={styles.socialIcon} />
                        Войти через Apple
                    </button>
                </div>

                <div className={styles.divider}>или зарегистрироваться</div>

                <div className={styles.socialButtons}>
                    <button
                        onClick={handleTenantRegistration}
                        className={styles.registerButton}
                    >
                        Регистрация для размещения жилья
                    </button>
                    <button
                        onClick={handleLandlordRegistration}
                        className={styles.registerButton}
                    >
                        Регистрация для аренды жилья
                    </button>
                </div>
            </div>
        </div>
    );
}

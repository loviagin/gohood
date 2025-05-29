'use client';

import { useState, useEffect, Suspense } from 'react';
import { signIn, useSession } from 'next-auth/react';
import { useRouter, useSearchParams } from 'next/navigation';
import { FcGoogle } from 'react-icons/fc';
import { FaApple } from 'react-icons/fa';
import { FaYandex } from 'react-icons/fa';
import { FaVk } from 'react-icons/fa';
import { toast } from 'react-hot-toast';
import styles from './page.module.css';

type RegistrationStep = 'auth' | 'details';
type UserRole = 'landlord' | 'tenant';

// Client component that uses useSearchParams
function RegistrationForm() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const { data: session, update: updateSession } = useSession();
    const [selectedRole, setSelectedRole] = useState<UserRole>(() => {
        const roleParam = searchParams.get('role');
        return (roleParam === 'tenant' || roleParam === 'landlord') ? roleParam : 'landlord';
    });
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

    // Add session status logging
    useEffect(() => {
        console.log('Session status:', session ? 'Active' : 'No session');
        if (session) {
            console.log('Session data:', {
                email: session.user?.email,
                name: session.user?.name,
                role: session.user?.role,
                profileCompleted: session.user?.profileCompleted
            });
        }
    }, [session]);

    // Update URL when role changes
    useEffect(() => {
        const url = new URL(window.location.href);
        url.searchParams.set('role', selectedRole);
        window.history.replaceState({}, '', url.toString());
    }, [selectedRole]);

    // Update role when URL changes
    useEffect(() => {
        const roleParam = searchParams.get('role');
        if (roleParam === 'tenant' || roleParam === 'landlord') {
            setSelectedRole(roleParam);
        }
    }, [searchParams]);

    const handleAuthChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setAuthData({
            ...authData,
            [e.target.name]: e.target.value
        });
    };

    const handleProfileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        
        if (name === 'phone') {
            // Оставляем только цифры и первый плюс
            let numbers = value.replace(/[^\d+]/g, '');
            
            // Убираем все плюсы кроме первого
            if (numbers.includes('+')) {
                numbers = '+' + numbers.replace(/\+/g, '');
            } else {
                numbers = '+' + numbers;
            }
            
            // Форматируем номер
            let result = '';
            const digits = numbers.slice(1); // убираем плюс для форматирования
            
            if (digits.length > 0) {
                result = '+' + digits[0]; // код страны
                
                if (digits.length > 1) {
                    result += ' (' + digits.slice(1, 4);
                    
                    if (digits.length > 4) {
                        result += ') ' + digits.slice(4, 7);
                        
                        if (digits.length > 7) {
                            result += '-' + digits.slice(7, 9);
                            
                            if (digits.length > 9) {
                                result += '-' + digits.slice(9, 11);
                            }
                        }
                    } else {
                        result += ')';
                    }
                }
            }
            
            console.log('Input value:', value);
            console.log('Formatted number:', result);
            
            setProfileData(prev => ({
                ...prev,
                [name]: result
            }));
        } else {
            setProfileData(prev => ({
                ...prev,
                [name]: value
            }));
        }
    };

    const handleAuthSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);

        console.log('Submitting registration with role:', selectedRole);

        try {
            const res = await fetch('/api/auth/register', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    email: authData.email,
                    password: authData.password,
                    role: selectedRole
                }),
            });

            const data = await res.json();
            console.log('Registration response:', data);

            if (!res.ok) {
                if (data.error === 'User already exists') {
                    // Try to sign in the existing user
                    const signInResult = await signIn('credentials', {
                        email: authData.email,
                        password: authData.password,
                        redirect: false,
                        callbackUrl: '/registration?role=' + selectedRole
                    });

                    if (signInResult?.error) {
                        throw new Error('Неверный пароль для существующего пользователя');
                    }

                    // Wait for session to be updated
                    await new Promise(resolve => setTimeout(resolve, 1000));
                    
                    // Force session update
                    await updateSession();
                    
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
                callbackUrl: '/registration?role=' + selectedRole
            });

            if (result?.error) {
                throw new Error(result.error);
            }

            // Wait for session to be updated
            await new Promise(resolve => setTimeout(resolve, 1000));
            
            // Force session update
            await updateSession();

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

        console.log('Submitting profile update with role:', selectedRole);

        // Ensure we have a valid session
        if (!session?.user?.email) {
            toast.error('Сессия истекла. Пожалуйста, войдите снова.');
            setIsLoading(false);
            return;
        }

        try {
            const res = await fetch('/api/auth/update-profile', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                credentials: 'include',
                body: JSON.stringify({
                    ...profileData,
                    role: selectedRole
                }),
            });

            if (!res.ok) {
                const error = await res.json();
                if (res.status === 401) {
                    // Session expired or invalid
                    toast.error('Сессия истекла. Пожалуйста, войдите снова.');
                    // Force a sign out and redirect to login
                    await signIn('credentials', { redirect: false });
                    return;
                }
                throw new Error(error.error || 'Profile update failed');
            }

            const data = await res.json();
            console.log('Profile update response:', data);

            // Обновляем сессию
            await updateSession({
                ...session,
                user: {
                    ...session.user,
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
            callbackUrl: '/registration?step=details&role=' + selectedRole
        });
    };

    if (currentStep === 'auth') {
        return (
            <div className={styles.container}>
                <div className={styles.content}>
                    <div className={styles.header}>
                        <h1 className={styles.title}>Регистрация</h1>
                        <p className={styles.subtitle}>
                            Создайте аккаунт, чтобы начать размещать свои объекты или искать жилье
                        </p>
                    </div>

                    <div className={styles.roleSelector}>
                        <button
                            type="button"
                            className={`${styles.roleButton} ${selectedRole === 'landlord' ? styles.roleButtonActive : ''}`}
                            onClick={() => setSelectedRole('landlord')}
                        >
                            <span className={styles.roleIcon}>🏠</span>
                            <span className={styles.roleText}>Арендодатель</span>
                            <span className={styles.roleDescription}>Размещаю недвижимость</span>
                        </button>
                        <button
                            type="button"
                            className={`${styles.roleButton} ${selectedRole === 'tenant' ? styles.roleButtonActive : ''}`}
                            onClick={() => setSelectedRole('tenant')}
                        >
                            <span className={styles.roleIcon}>🔑</span>
                            <span className={styles.roleText}>Арендатор</span>
                            <span className={styles.roleDescription}>Ищу жилье</span>
                        </button>
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
                            onClick={() => handleSocialSignIn('apple')}
                            className={styles.appleButton}
                        >
                            <FaApple className={styles.socialIcon} />
                            Войти через Apple
                        </button>

                        <button
                            onClick={() => handleSocialSignIn('yandex')}
                            className={styles.yandexButton}
                        >
                            <FaYandex className={styles.socialIcon} />
                            Войти через Яндекс
                        </button>

                        <button
                            onClick={() => handleSocialSignIn('vk')}
                            className={styles.vkButton}
                        >
                            <FaVk className={styles.socialIcon} />
                            Войти через ВКонтакте
                        </button>
                    </div>

                    <div className={styles.loginLink}>
                        Уже есть аккаунт?{' '}
                        <a href="/signin" className={styles.loginLinkText}>
                            Войти
                        </a>
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
                            value={profileData.phone}
                            onChange={handleProfileChange}
                            onKeyDown={(e) => {
                                // Разрешаем только цифры, плюс, бэкспейс и удаление
                                if (!/[\d+]/.test(e.key) && 
                                    e.key !== 'Backspace' && 
                                    e.key !== 'Delete' && 
                                    e.key !== 'ArrowLeft' && 
                                    e.key !== 'ArrowRight' &&
                                    e.key !== 'Tab') {
                                    e.preventDefault();
                                }
                            }}
                            className={styles.input}
                            placeholder="+X (XXX) XXX-XX-XX"
                            maxLength={20}
                            required
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

// Main page component
export default function RegistrationPage() {
    return (
        <Suspense fallback={
            <div className={styles.container}>
                <div className={styles.content}>
                    <div className={styles.header}>
                        <h1 className={styles.title}>Загрузка...</h1>
                    </div>
                </div>
            </div>
        }>
            <RegistrationForm />
        </Suspense>
    );
}

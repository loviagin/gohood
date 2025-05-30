'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useSession, signOut } from 'next-auth/react';
import { usePathname, useRouter } from 'next/navigation';
import { FaUser, FaSignOutAlt, FaCog, FaBars, FaTimes, FaBuilding } from 'react-icons/fa';
import { TbSwitch3 } from "react-icons/tb";
import styles from './Header.module.css';

export default function Header() {
    const { data: session, update: updateSession } = useSession();
    const router = useRouter();
    const pathname = usePathname();
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    const handleSignOut = async () => {
        await signOut({ callbackUrl: '/' });
    };

    const handleRoleSwitch = async () => {
        try {
            const newRole = session?.user?.role === 'landlord' ? 'tenant' : 'landlord';
            const response = await fetch('/api/auth/update-profile', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    name: session?.user?.name,
                    role: newRole,
                }),
            });

            if (!response.ok) {
                throw new Error('Failed to update role');
            }

            // Update the session with new role
            await updateSession();

            // Close dropdown and redirect to dashboard
            setIsDropdownOpen(false);
            router.push('/account');
        } catch (error) {
            console.error('Error switching role:', error);
            // You might want to show an error message to the user here
        }
    };

    const toggleDropdown = () => {
        setIsDropdownOpen(!isDropdownOpen);
    };

    const toggleMobileMenu = () => {
        console.log('Toggle mobile menu clicked, current state:', isMobileMenuOpen);
        setIsMobileMenuOpen(prev => {
            const newState = !prev;
            console.log('New mobile menu state:', newState);
            return newState;
        });
        if (isDropdownOpen) {
            setIsDropdownOpen(false);
        }
    };

    // Закрываем меню при клике вне его
    const handleClickOutside = (e: MouseEvent) => {
        const target = e.target as HTMLElement;
        if (!target.closest(`.${styles.userMenu}`) && !target.closest(`.${styles.mobileMenuButton}`)) {
            setIsDropdownOpen(false);
        }
        if (!target.closest(`.${styles.mobileMenu}`) && !target.closest(`.${styles.mobileMenuButton}`)) {
            setIsMobileMenuOpen(false);
        }
    };

    // Закрываем меню при изменении роута
    useEffect(() => {
        setIsMobileMenuOpen(false);
        setIsDropdownOpen(false);
    }, [pathname]);

    useEffect(() => {
        document.addEventListener('click', handleClickOutside);
        return () => document.removeEventListener('click', handleClickOutside);
    }, []);

    // Блокируем скролл при открытом мобильном меню
    useEffect(() => {
        if (isMobileMenuOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = '';
        }
        return () => {
            document.body.style.overflow = '';
        };
    }, [isMobileMenuOpen]);

    const renderNavLinks = () => (
        <>
            {session?.user?.role === 'landlord' ? (
                <>
                    <Link
                        href="/account/listings"
                        className={`${styles.navLink} ${pathname === '/account/listings' ? styles.active : ''}`}
                    >
                        Мои объекты
                    </Link>
                    <Link
                        href="/account/bookings"
                        className={`${styles.navLink} ${pathname === '/account/bookings' ? styles.active : ''}`}
                    >
                        Бронирования
                    </Link>
                </>
            ) : session?.user?.role === 'tenant' ? (
                <>
                    <Link
                        href="/my-rentals"
                        className={`${styles.navLink} ${pathname === '/my-rentals' ? styles.active : ''}`}
                    >
                        Мои аренды
                    </Link>
                    <Link
                        href="/rent"
                        className={`${styles.navLink} ${pathname === '/rent' ? styles.active : ''}`}
                    >
                        Снять жилье
                    </Link>
                </>
            ) : (
                <>
                    <Link
                        href="/become-landlord"
                        className={`${styles.navLink} ${pathname === '/become-landlord' ? styles.active : ''}`}
                    >
                        Стать арендодателем
                    </Link>
                    <Link
                        href="/rent"
                        className={`${styles.navLink} ${pathname === '/rent' ? styles.active : ''}`}
                    >
                        Снять жилье
                    </Link>
                </>
            )}
        </>
    );

    return (
        <header className={styles.header}>
            <div className={styles.container}>
                <Link href="/" className={styles.logo}>
                    Go<span className={styles.logoHighlight}>Hood</span>
                </Link>

                <nav className={styles.nav}>
                    {renderNavLinks()}
                </nav>

                <div className={styles.authSection}>
                    {session?.user?.profileCompleted ? (
                        <div className={styles.userMenu}>
                            <button
                                className={styles.avatarButton}
                                onClick={toggleDropdown}
                                aria-label="Меню пользователя"
                            >
                                <div className={styles.avatarPlaceholder}>
                                    {session.user?.name?.[0]?.toUpperCase() || <FaUser />}
                                </div>
                            </button>

                            {isDropdownOpen && (
                                <div className={styles.dropdown}>
                                    <div className={styles.userInfo}>
                                        <span className={styles.userName}>{session.user?.name}</span>
                                        <span className={styles.userEmail}>{session.user?.email}</span>
                                    </div>

                                    {session.user?.role === 'landlord' ? (
                                        <>
                                            <button
                                                onClick={handleRoleSwitch}
                                                className={styles.dropdownItem}
                                            >
                                                <TbSwitch3 className={styles.dropdownIcon} />
                                                В профиль арендатора
                                            </button>
                                            <div className={styles.dropdownDivider} />
                                        </>
                                    ) : (
                                        <>
                                            <button
                                                onClick={handleRoleSwitch}
                                                className={styles.dropdownItem}
                                            >
                                                <TbSwitch3 className={styles.dropdownIcon} />
                                                В профиль арендодателя
                                            </button>
                                            <div className={styles.dropdownDivider} />
                                        </>
                                    )}

                                    <Link
                                        href="/account"
                                        className={styles.dropdownItem}
                                        onClick={() => setIsDropdownOpen(false)}
                                    >
                                        <FaBuilding className={styles.dropdownIcon} />
                                        Панель управления
                                    </Link>

                                    <Link
                                        href="/account/settings"
                                        className={styles.dropdownItem}
                                        onClick={() => setIsDropdownOpen(false)}
                                    >
                                        <FaCog className={styles.dropdownIcon} />
                                        Настройки
                                    </Link>

                                    <button
                                        onClick={handleSignOut}
                                        className={styles.dropdownItem}
                                    >
                                        <FaSignOutAlt className={styles.dropdownIcon} />
                                        Выйти
                                    </button>
                                </div>
                            )}
                        </div>
                    ) : (
                        <>
                            <Link href="/signin" className={`${styles.authButton} ${styles.desktopAuthButton}`}>
                                Войти
                            </Link>
                            <button
                                type="button"
                                className={styles.mobileMenuButton}
                                onClick={(e) => {
                                    e.preventDefault();
                                    e.stopPropagation();
                                    console.log('Button clicked');
                                    toggleMobileMenu();
                                }}
                                aria-label={isMobileMenuOpen ? "Закрыть меню" : "Открыть меню"}
                                aria-expanded={isMobileMenuOpen}
                            >
                                {isMobileMenuOpen ? <FaTimes /> : <FaBars />}
                            </button>
                        </>
                    )}
                </div>
            </div>

            {/* Мобильное меню */}
            <div
                className={`${styles.mobileMenu} ${isMobileMenuOpen ? styles.mobileMenuOpen : ''}`}
                style={{ display: isMobileMenuOpen ? 'block' : 'none' }}
            >
                <nav className={styles.mobileNav}>
                    {renderNavLinks()}
                    {!session?.user?.profileCompleted && (
                        <Link
                            href="/signin"
                            className={styles.mobileAuthButton}
                            onClick={() => setIsMobileMenuOpen(false)}
                        >
                            Войти
                        </Link>
                    )}
                </nav>
            </div>

            {/* Оверлей для затемнения фона */}
            {isMobileMenuOpen && (
                <div
                    className={styles.mobileMenuOverlay}
                    onClick={() => {
                        console.log('Overlay clicked');
                        setIsMobileMenuOpen(false);
                    }}
                    aria-hidden="true"
                />
            )}
        </header>
    );
} 
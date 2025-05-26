'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useSession, signOut } from 'next-auth/react';
import { usePathname } from 'next/navigation';
import { FaUser, FaSignOutAlt, FaCog, FaBuilding, FaBars, FaTimes } from 'react-icons/fa';
import styles from './Header.module.css';

export default function Header() {
    const { data: session } = useSession();
    const pathname = usePathname();
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    const handleSignOut = async () => {
        await signOut({ callbackUrl: '/' });
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
                    {/* <Link 
                        href="/become-landlord/dashboard" 
                        className={`${styles.navLink} ${pathname === '/become-landlord/dashboard' ? styles.active : ''}`}
                    >
                        Панель управления
                    </Link>
                    <Link 
                        href="/become-landlord/listings" 
                        className={`${styles.navLink} ${pathname === '/become-landlord/listings' ? styles.active : ''}`}
                    >
                        Мои объекты
                    </Link> */}
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

                                    <div className={styles.dropdownDivider} />

                                    {session.user?.role === 'landlord' && (
                                        <>
                                            {/* <Link
                                                href="/account/dashboard"
                                                className={styles.dropdownItem}
                                                onClick={() => setIsDropdownOpen(false)}
                                            >
                                                <FaBuilding className={styles.dropdownIcon} />
                                                Панель управления
                                            </Link> */}
                                            <div className={styles.dropdownDivider} />
                                        </>
                                    )}

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
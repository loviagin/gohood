'use client';

import { useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';

export default function AccountLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const { data: session, status } = useSession();
    const router = useRouter();

    useEffect(() => {
        if (status === 'loading') return;

        if (!session) {
            // Redirect to login page if not authenticated
            router.push('/become-landlord/register');
            return;
        }

        // If user is authenticated but hasn't completed their profile
        if (!session.user.profileCompleted) {
            router.push('/become-landlord/register');
            return;
        }
    }, [session, status, router]);

    // Show nothing while checking authentication
    if (status === 'loading') {
        return null;
    }

    // Only render children if user is authenticated and has completed profile
    if (session?.user?.profileCompleted) {
        return <>{children}</>;
    }

    return null;
}

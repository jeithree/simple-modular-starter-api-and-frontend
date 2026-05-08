'use client';

import {useRouter} from 'next/navigation';
import {useEffect, useState} from 'react';
import {useSession} from '@/hooks/useSession';
import {logout} from '@/services/auth';
import {Button} from '@/components/ui/button';
import Link from 'next/link';

export default function DashboardLayout({children}: {children: React.ReactNode}) {
	const router = useRouter();
	const {session, isLoading, mutate} = useSession();
	const [isLoggingOut, setIsLoggingOut] = useState(false);

	const handleLogout = async () => {
		try {
			setIsLoggingOut(true);
			await logout();
			await mutate(undefined, false);
			router.push('/login');
		} catch (error) {
			console.error('Logout failed:', error);
			setIsLoggingOut(false);
		}
	};

	useEffect(() => {
		if (!isLoading && !session?.isAuthenticated) {
			router.push('/login');
		}
	}, [isLoading, session, router]);

	if (isLoading || !session?.isAuthenticated || isLoggingOut) {
		return (
			<div className="min-h-screen flex items-center justify-center">
				<p>Loading...</p>
			</div>
		);
	}

	return (
		<div className="min-h-screen">
			<nav className="border-b bg-white">
				<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
					<div className="flex justify-between h-16 items-center">
						<div className="flex space-x-8">
							<Link
								href="/dashboard"
								className="text-lg font-semibold">
								Dashboard
							</Link>
							<Link
								href="/dashboard/profile"
								className="text-muted-foreground hover:text-foreground">
								Profile
							</Link>
						</div>
						<div className="flex items-center space-x-4">
							<span className="text-sm text-muted-foreground">{session.user?.email}</span>
							<Button
								onClick={handleLogout}
								variant="outline"
								size="sm">
								Logout
							</Button>
						</div>
					</div>
				</div>
			</nav>
			<main>{children}</main>
		</div>
	);
}

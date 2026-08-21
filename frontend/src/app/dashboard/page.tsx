'use client';

import Link from 'next/link';
import useSWR from 'swr';
import {Copy, MonitorSmartphone} from 'lucide-react';
import {toast} from 'sonner';
import {useSession} from '@/hooks/useSession';
import {Card, CardContent, CardHeader, CardTitle} from '@/components/ui/card';
import {Button} from '@/components/ui/button';
import {getSessionCount} from '@/services/user';

export default function DashboardPage() {
	const {session} = useSession();
	const isAdmin = session?.user?.role === 'ADMIN';
	const isUser = session?.user?.role === 'USER';

	const {data: sessionsData} = useSWR('user-sessions', getSessionCount);

	const handleCopyId = async () => {
		const id = session?.user?.id;
		if (!id) {
			toast.error('No ID to copy');
			return;
		}

		try {
			await navigator.clipboard.writeText(id);
			toast.success('ID copied');
		} catch {
			toast.error('Failed to copy ID');
		}
	};

	return (
		<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
			<h1 className="text-3xl font-bold mb-4">Welcome to your Dashboard</h1>
			<p className="text-muted-foreground mb-8">
				You&apos;re logged in as {session?.user?.username}
			</p>

			<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
				<Card>
					<CardHeader>
						<CardTitle>User Information</CardTitle>
					</CardHeader>
					<CardContent className="space-y-2 text-sm">
						<div className="flex items-center gap-1">
							<p>
								<span className="font-medium">ID:</span> {session?.user?.id}
							</p>
							<Button
								type="button"
								variant="ghost"
								size="icon"
								className="h-6 w-6"
								onClick={handleCopyId}
								aria-label="Copiar ID"
								title="Copiar ID">
								<Copy className="h-3.5 w-3.5" />
							</Button>
						</div>
						<p>
							<span className="font-medium">Username:</span>{' '}
							{session?.user?.username}
						</p>
						<p>
							<span className="font-medium">Email:</span> {session?.user?.email}
						</p>
						<p>
							<span className="font-medium">Role:</span> {session?.user?.role}
						</p>
					</CardContent>
				</Card>

				<Card>
					<CardHeader>
						<CardTitle>Quick Links</CardTitle>
					</CardHeader>
					<CardContent>
						<div className="flex flex-col gap-1">
							{isUser && (
								<>
									<Link
										href="/dashboard/profile#update-profile"
										className="text-sm underline underline-offset-4 py-1">
										Manage Profile →
									</Link>
								</>
							)}
							{isAdmin && (
								<>
									<Link
										href="/dashboard/admin#search-users"
										className="text-sm underline underline-offset-4 py-1">
										Admin: Search Users →
									</Link>
								</>
							)}
						</div>
					</CardContent>
				</Card>

				<Card>
					<CardHeader>
						<CardTitle>Active Sessions</CardTitle>
					</CardHeader>
					<CardContent className="space-y-3">
						<div className="flex items-center gap-2">
							<MonitorSmartphone className="size-6 text-muted-foreground" />
							<p className="text-4xl font-bold">{sessionsData?.count ?? '—'}</p>
						</div>
						<p className="text-sm text-muted-foreground">
							{sessionsData?.count === 1 ? 'Active session' : 'Active sessions'}
						</p>
						<Link
							href="/dashboard/profile#sessions"
							className="text-sm underline underline-offset-4">
							Manage sessions →
						</Link>
					</CardContent>
				</Card>
			</div>
		</div>
	);
}

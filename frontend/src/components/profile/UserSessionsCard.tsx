'use client';

import {useState} from 'react';
import {useRouter} from 'next/navigation';
import useSWR from 'swr';
import {toast} from 'sonner';
import {MonitorSmartphone} from 'lucide-react';
import {Button} from '@/components/ui/button';
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from '@/components/ui/card';
import {getSessionCount, killAllSessions} from '@/services/user';
import type {ApiError} from '@/types/api';

export function UserSessionsCard() {
	const router = useRouter();
	const [isKilling, setIsKilling] = useState(false);

	const {data, mutate} = useSWR('user-sessions', getSessionCount);

	const handleKillAll = async () => {
		setIsKilling(true);
		try {
			await killAllSessions();
			await mutate();
			toast.success('All sessions have been logged out');
			router.push('/login');
		} catch (err) {
			toast.error((err as ApiError).message || 'Error logging out sessions');
			setIsKilling(false);
		}
	};

	return (
		<Card>
			<CardHeader>
				<div className="flex items-start justify-between gap-4">
					<div className="space-y-1">
						<CardTitle>Manage sessions</CardTitle>
						<CardDescription>
							Devices where your account has an active session.
						</CardDescription>
					</div>
					<div className="flex items-center gap-2 shrink-0">
						<MonitorSmartphone className="size-4 text-muted-foreground" />
						<span className="text-2xl font-bold">{data?.count ?? '—'}</span>
					</div>
				</div>
			</CardHeader>
			<CardContent className="space-y-3">
				<p className="text-sm text-muted-foreground">
					Logging out all sessions will also log out the current session and you
					will need to log in again.
				</p>
				<Button
					variant="destructive"
					className="w-full"
					disabled={isKilling || !data?.count}
					onClick={handleKillAll}>
					{isKilling ? 'Logging out sessions...' : 'Log out all sessions'}
				</Button>
			</CardContent>
		</Card>
	);
}

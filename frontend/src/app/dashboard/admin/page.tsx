'use client';

import {useState, useCallback} from 'react';
import Link from 'next/link';
import useSWR from 'swr';
import {Button} from '@/components/ui/button';
import {Card, CardContent, CardHeader, CardTitle} from '@/components/ui/card';
import {useSession} from '@/hooks/useSession';
import {UserSearchBar} from '@/components/admin/UserSearchBar';
import {UsersTable} from '@/components/admin/UsersTable';
import {EditUserDialog} from '@/components/admin/EditUserDialog';
import {DeactivateUserDialog} from '@/components/admin/DeactivateUserDialog';
import {searchUsers} from '@/services/admin';
import type {AdminUser} from '@/types/admin';

export default function AdminPage() {
	const {session, isLoading: sessionLoading} = useSession();
	const isAdmin = session?.user?.role === 'ADMIN';

	const [query, setQuery] = useState('');
	const [editUser, setEditUser] = useState<AdminUser | null>(null);
	const [editOpen, setEditOpen] = useState(false);
	const [actionUser, setActionUser] = useState<AdminUser | null>(null);
	const [actionType, setActionType] = useState<'deactivate' | 'reactivate'>(
		'deactivate',
	);
	const [actionOpen, setActionOpen] = useState(false);

	const {
		data: users,
		isLoading: usersLoading,
		mutate,
	} = useSWR(isAdmin && query ? ['admin-users', query] : null, () =>
		searchUsers(query),
	);

	const handleSearch = useCallback(
		(q: string) => {
			setQuery(q);
			if (!q) mutate(undefined, false);
		},
		[mutate],
	);

	const handleEdit = (user: AdminUser) => {
		setEditUser(user);
		setEditOpen(true);
	};

	const handleDeactivate = (user: AdminUser) => {
		setActionUser(user);
		setActionType('deactivate');
		setActionOpen(true);
	};

	const handleReactivate = (user: AdminUser) => {
		setActionUser(user);
		setActionType('reactivate');
		setActionOpen(true);
	};

	if (sessionLoading) {
		return (
			<div className="min-h-screen flex items-center justify-center">
				<p>Loading...</p>
			</div>
		);
	}

	if (!isAdmin) {
		return (
			<div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
				<Card>
					<CardHeader>
						<CardTitle>Access Denied</CardTitle>
					</CardHeader>
					<CardContent className="space-y-3">
						<p className="text-muted-foreground">
							You do not have permission to access this page.
						</p>
						<Link href="/dashboard">
							<Button variant="outline">Go back to dashboard</Button>
						</Link>
					</CardContent>
				</Card>
			</div>
		);
	}

	return (
		<div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
			<div>
				<p className="text-sm text-muted-foreground">
					Admin Tools
				</p>
				<h1 className="text-2xl font-bold">Admin Panel</h1>
			</div>

			{/* Search users */}
			<div
				className="space-y-4 scroll-mt-32 md:scroll-mt-20"
				id="search-users">
				<h2 className="text-lg font-semibold">Search Users</h2>
				<UserSearchBar
					onSearch={handleSearch}
					isLoading={usersLoading}
				/>

				{query &&
					(usersLoading ? (
						<p className="text-sm text-muted-foreground py-4 text-center">
							Loading...
						</p>
					) : (
						<UsersTable
							users={users ?? []}
							onEdit={handleEdit}
							onDeactivate={handleDeactivate}
							onReactivate={handleReactivate}
						/>
					))}
			</div>

			<EditUserDialog
				user={editUser}
				open={editOpen}
				onOpenChange={setEditOpen}
				onSuccess={() => mutate()}
			/>

			<DeactivateUserDialog
				user={actionUser}
				action={actionType}
				open={actionOpen}
				onOpenChange={setActionOpen}
				onSuccess={() => mutate()}
			/>
		</div>
	);
}

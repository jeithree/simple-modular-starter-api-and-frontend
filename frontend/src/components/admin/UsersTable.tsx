'use client';

import {useState} from 'react';
import {Pencil, UserX, UserCheck} from 'lucide-react';
import {Badge} from '@/components/ui/badge';
import {Button} from '@/components/ui/button';
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from '@/components/ui/table';
import {Tooltip, TooltipContent, TooltipTrigger} from '@/components/ui/tooltip';
import type {AdminUser} from '@/types/admin';

interface UsersTableProps {
	users: AdminUser[];
	onEdit: (user: AdminUser) => void;
	onDeactivate: (user: AdminUser) => void;
	onReactivate: (user: AdminUser) => void;
}

export function UsersTable({
	users,
	onEdit,
	onDeactivate,
	onReactivate,
}: UsersTableProps) {
	const [openId, setOpenId] = useState<string | null>(null);
	const [copiedId, setCopiedId] = useState<string | null>(null);

	function copyId(id: string) {
		navigator.clipboard.writeText(id);
		setCopiedId(id);
	}

	if (users.length === 0) {
		return (
			<p className="py-8 text-center text-sm text-muted-foreground">
				No users found.
			</p>
		);
	}

	return (
		<Table>
			<TableHeader>
				<TableRow>
					<TableHead>ID</TableHead>
					<TableHead>Username</TableHead>
					<TableHead>Name</TableHead>
					<TableHead>Email</TableHead>
					<TableHead>Role</TableHead>
					<TableHead>Status</TableHead>
					<TableHead className="text-right">Actions</TableHead>
				</TableRow>
			</TableHeader>
			<TableBody>
				{users.map((user) => (
					<TableRow
						key={user.id}
						className={!user.isActive ? 'opacity-60' : undefined}>
						<TableCell>
							<Tooltip open={openId === user.id}>
								<TooltipTrigger asChild>
									<button
										type="button"
										className="font-medium cursor-pointer"
										onMouseEnter={() => setOpenId(user.id)}
										onMouseLeave={() => {
											setOpenId(null);
											setCopiedId(null);
										}}
										onClick={() => copyId(user.id)}>
										{user.id.slice(0, 8)}…
									</button>
								</TooltipTrigger>
								<TooltipContent>
									{copiedId === user.id ? 'ID copied!' : 'Click to copy ID'}
								</TooltipContent>
							</Tooltip>
						</TableCell>
						<TableCell className="font-medium">{user.username}</TableCell>
						<TableCell>
							{user.name ?? <span className="text-muted-foreground">—</span>}
						</TableCell>
						<TableCell>{user.email}</TableCell>
						<TableCell>{user.role}</TableCell>
						<TableCell>
							{user.isActive ? (
								<Badge variant="default">Active</Badge>
							) : (
								<Badge variant="destructive">Inactive</Badge>
							)}
						</TableCell>
						<TableCell className="text-right">
							<div className="flex items-center justify-end gap-1">
								<Button
									variant="ghost"
									size="icon"
									title="Edit user"
									onClick={() => onEdit(user)}>
									<Pencil className="size-4" />
								</Button>
								{user.isActive ? (
									<Button
										variant="ghost"
										size="icon"
										title="Deactivate user"
										className="text-destructive hover:text-destructive"
										onClick={() => onDeactivate(user)}>
										<UserX className="size-4" />
									</Button>
								) : (
									<Button
										variant="ghost"
										size="icon"
										title="Reactivate user"
										className="text-emerald-600 hover:text-emerald-600"
										onClick={() => onReactivate(user)}>
										<UserCheck className="size-4" />
									</Button>
								)}
							</div>
						</TableCell>
					</TableRow>
				))}
			</TableBody>
		</Table>
	);
}

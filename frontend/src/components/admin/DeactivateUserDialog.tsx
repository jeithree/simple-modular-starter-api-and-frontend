'use client';

import {useState} from 'react';
import {
	Dialog,
	DialogContent,
	DialogHeader,
	DialogTitle,
	DialogDescription,
	DialogFooter,
} from '@/components/ui/dialog';
import {Button} from '@/components/ui/button';
import {deactivateUser, reactivateUser} from '@/services/admin';
import type {AdminUser} from '@/types/admin';
import {toast} from 'sonner';

interface DeactivateUserDialogProps {
	user: AdminUser | null;
	action: 'deactivate' | 'reactivate';
	open: boolean;
	onOpenChange: (open: boolean) => void;
	onSuccess: () => void;
}

export function DeactivateUserDialog({
	user,
	action,
	open,
	onOpenChange,
	onSuccess,
}: DeactivateUserDialogProps) {
	const [isLoading, setIsLoading] = useState(false);
	const isDeactivate = action === 'deactivate';

	const handleConfirm = async () => {
		if (!user) return;
		setIsLoading(true);

		try {
			if (isDeactivate) {
				await deactivateUser(user.id);
				toast.success(`User ${user.username} deactivated successfully`);
			} else {
				await reactivateUser(user.id);
				toast.success(`User ${user.username} reactivated successfully`);
			}
			onSuccess();
			onOpenChange(false);
		} catch (err) {
			toast.error((err as Error)?.message ?? 'Error updating user status');
		} finally {
			setIsLoading(false);
		}
	};

	return (
		<Dialog
			open={open}
			onOpenChange={onOpenChange}>
			<DialogContent>
				<DialogHeader>
					<DialogTitle>
						{isDeactivate ? 'Deactivate User' : 'Reactivate User'}
					</DialogTitle>
					<DialogDescription>
						{isDeactivate
							? `Are you sure you want to deactivate the user "${user?.username}"? This will prevent them from logging in.`
							: `Are you sure you want to reactivate the user "${user?.username}"? This will allow them to log in again.`}
					</DialogDescription>
				</DialogHeader>

				<DialogFooter>
					<Button
						variant="outline"
						onClick={() => onOpenChange(false)}
						disabled={isLoading}>
						Cancel
					</Button>
					<Button
						variant={isDeactivate ? 'destructive' : 'default'}
						onClick={handleConfirm}
						disabled={isLoading}>
						{isLoading
							? isDeactivate
								? 'Deactivating...'
								: 'Reactivating...'
							: isDeactivate
								? 'Yes, Deactivate'
								: 'Yes, Reactivate'}
					</Button>
				</DialogFooter>
			</DialogContent>
		</Dialog>
	);
}

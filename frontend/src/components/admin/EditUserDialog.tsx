'use client';

import {useEffect} from 'react';
import {useForm} from 'react-hook-form';
import {zodResolver} from '@hookform/resolvers/zod';
import {
	Dialog,
	DialogContent,
	DialogHeader,
	DialogTitle,
	DialogFooter,
} from '@/components/ui/dialog';
import {Button} from '@/components/ui/button';
import {Input} from '@/components/ui/input';
import {Label} from '@/components/ui/label';
import {
	updateUserSchema,
	type UpdateUserInput,
	type AdminUser,
} from '@/types/admin';
import {updateUser} from '@/services/admin';
import {toast} from 'sonner';

interface EditUserDialogProps {
	user: AdminUser | null;
	open: boolean;
	onOpenChange: (open: boolean) => void;
	onSuccess: () => void;
}

export function EditUserDialog({
	user,
	open,
	onOpenChange,
	onSuccess,
}: EditUserDialogProps) {
	const {
		register,
		handleSubmit,
		reset,
		formState: {errors, isSubmitting},
	} = useForm<UpdateUserInput>({
		resolver: zodResolver(updateUserSchema),
	});

	useEffect(() => {
		if (!open) return;
		if (user) {
			reset({
				name: user.name ?? '',
				email: user.email,
				password: '',
			});
		}
	}, [open, user, reset]);

	const onSubmit = async (data: UpdateUserInput) => {
		if (!user) return;

		const payload: UpdateUserInput = {};
		if (data.name !== undefined && data.name !== '') payload.name = data.name;
		if (data.email && data.email !== user.email) payload.email = data.email;
		if (data.password) payload.password = data.password;

		if (Object.keys(payload).length === 0) {
			onOpenChange(false);
			return;
		}

		try {
			await updateUser(user.id, payload);
			toast.success('User updated successfully');
			onSuccess();
			onOpenChange(false);
		} catch (err) {
			toast.error((err as Error)?.message ?? 'Error updating user');
		}
	};

	return (
		<Dialog
			open={open}
			onOpenChange={onOpenChange}>
			<DialogContent>
				<DialogHeader>
					<DialogTitle>Edit User</DialogTitle>
				</DialogHeader>

				<form
					onSubmit={handleSubmit(onSubmit)}
					className="flex flex-col gap-4">
					<div className="flex flex-col gap-1.5">
						<Label htmlFor="edit-name">Name</Label>
						<Input
							id="edit-name"
							placeholder="Full Name"
							{...register('name')}
						/>
						{errors.name && (
							<p className="text-sm text-destructive">{errors.name.message}</p>
						)}
					</div>

					<div className="flex flex-col gap-1.5">
						<Label htmlFor="edit-email">Email</Label>
						<Input
							id="edit-email"
							type="email"
							placeholder="email@example.com"
							{...register('email')}
						/>
						{errors.email && (
							<p className="text-sm text-destructive">{errors.email.message}</p>
						)}
					</div>

					<div className="flex flex-col gap-1.5">
						<Label htmlFor="edit-password">New Password</Label>
						<Input
							id="edit-password"
							type="password"
							placeholder="Leave blank to keep current password"
							{...register('password')}
						/>
						{errors.password && (
							<p className="text-sm text-destructive">
								{errors.password.message}
							</p>
						)}
					</div>

					<DialogFooter>
						<Button
							type="button"
							variant="outline"
							onClick={() => onOpenChange(false)}
							disabled={isSubmitting}>
							Cancel
						</Button>
						<Button
							type="submit"
							disabled={isSubmitting}>
							{isSubmitting ? 'Saving...' : 'Save changes'}
						</Button>
					</DialogFooter>
				</form>
			</DialogContent>
		</Dialog>
	);
}

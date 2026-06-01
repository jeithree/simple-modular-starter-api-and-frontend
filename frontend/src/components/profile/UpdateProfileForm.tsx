'use client';

import {useForm} from 'react-hook-form';
import {zodResolver} from '@hookform/resolvers/zod';
import useSWR from 'swr';
import {toast} from 'sonner';
import {updateProfileSchema, type UpdateProfileData} from '@/types/user';
import {getProfile, updateProfile} from '@/services/user';
import {Button} from '@/components/ui/button';
import {Input} from '@/components/ui/input';
import {Label} from '@/components/ui/label';
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from '@/components/ui/card';
import type {ApiError} from '@/types/api';

export function UpdateProfileForm() {
	const {data: profileData, mutate} = useSWR('user-profile', getProfile);

	const {
		register,
		handleSubmit,
		reset,
		formState: {errors, isSubmitting},
	} = useForm<UpdateProfileData>({
		resolver: zodResolver(updateProfileSchema),
		values: {
			name: profileData?.name || '',
			password: '',
		},
	});

	const onSubmit = async (data: UpdateProfileData) => {
		try {
			await updateProfile(data);
			mutate();
			reset({name: data.name, password: ''});
			toast.success('Profile updated successfully');
		} catch (err) {
			toast.error((err as ApiError).message || 'Failed to update profile');
		}
	};

	return (
		<Card>
			<CardHeader>
				<CardTitle>Update Profile</CardTitle>
				<CardDescription>
					View and update your profile information. You can change your name and
					password here.
				</CardDescription>
			</CardHeader>
			<CardContent>
				<form
					onSubmit={handleSubmit(onSubmit)}
					className="space-y-4">
					<div className="space-y-2">
						<Label>Username</Label>
						<Input
							value={profileData?.username || ''}
							disabled
						/>
						<p className="text-xs text-muted-foreground">
							Username cannot be changed
						</p>
					</div>

					<div className="space-y-2">
						<Label>Email</Label>
						<Input
							value={profileData?.email || ''}
							disabled
						/>
						<p className="text-xs text-muted-foreground">
							Email cannot be changed
						</p>
					</div>

					<div className="space-y-2">
						<Label htmlFor="name">Name</Label>
						<Input
							id="name"
							{...register('name')}
						/>
						{errors.name && (
							<p className="text-sm text-destructive">{errors.name.message}</p>
						)}
					</div>

					<div className="space-y-2">
						<Label htmlFor="password">New Password</Label>
						<Input
							id="password"
							type="password"
							placeholder="Leave blank to keep current password"
							{...register('password')}
						/>
						{errors.password && (
							<p className="text-sm text-destructive">
								{errors.password.message}
							</p>
						)}
						<p className="text-xs text-muted-foreground">
							it must include uppercase, lowercase, a number, and a special
							character.
						</p>
					</div>

					<Button
						type="submit"
						className="w-full"
						disabled={isSubmitting}>
						{isSubmitting ? 'Updating...' : 'Update Profile'}
					</Button>
				</form>
			</CardContent>
		</Card>
	);
}

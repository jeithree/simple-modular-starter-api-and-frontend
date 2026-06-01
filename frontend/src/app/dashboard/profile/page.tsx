'use client';

import {UpdateProfileForm} from '@/components/profile/UpdateProfileForm';
import {UserSessionsCard} from '@/components/profile/UserSessionsCard';

export default function ProfilePage() {
	return (
		<div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
			<div>
				<h1 className="text-2xl font-bold">Profile settings</h1>
			</div>

			<div
				className="space-y-4 scroll-mt-32 md:scroll-mt-20"
				id="update-profile">
				<h2 className="text-lg font-semibold">Personal information</h2>
				<UpdateProfileForm />
			</div>

			<div
				className="space-y-4 scroll-mt-32 md:scroll-mt-20"
				id="sessions">
				<h2 className="text-lg font-semibold">Active sessions</h2>
				<UserSessionsCard />
			</div>
		</div>
	);
}

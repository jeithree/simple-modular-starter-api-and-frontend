'use client';

import {useSession} from '@/hooks/useSession';

export default function DashboardPage() {
	const {session} = useSession();

	return (
		<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
			<h1 className="text-3xl font-bold mb-4">Welcome to your Dashboard</h1>
			<p className="text-muted-foreground mb-8">
				You&apos;re logged in as {session?.user?.username}
			</p>

			<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
				<div className="border rounded-lg p-6">
					<h2 className="text-xl font-semibold mb-2">User Info</h2>
					<div className="space-y-2 text-sm">
						<p>
							<span className="font-medium">Username:</span> {session?.user?.username}
						</p>
						<p>
							<span className="font-medium">Email:</span> {session?.user?.email}
						</p>
						<p>
							<span className="font-medium">Role:</span> {session?.user?.role}
						</p>
					</div>
				</div>

				<div className="border rounded-lg p-6">
					<h2 className="text-xl font-semibold mb-2">Quick Actions</h2>
					<p className="text-sm text-muted-foreground">
						Add your custom functionality here
					</p>
				</div>

				<div className="border rounded-lg p-6">
					<h2 className="text-xl font-semibold mb-2">Stats</h2>
					<p className="text-sm text-muted-foreground">Display relevant metrics here</p>
				</div>
			</div>
		</div>
	);
}

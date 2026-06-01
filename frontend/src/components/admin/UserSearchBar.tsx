'use client';

import {useState} from 'react';
import {Search} from 'lucide-react';
import {Input} from '@/components/ui/input';
import {Button} from '@/components/ui/button';

interface UserSearchBarProps {
	onSearch: (query: string) => void;
	isLoading?: boolean;
}

export function UserSearchBar({onSearch, isLoading}: UserSearchBarProps) {
	const [value, setValue] = useState('');

	const handleSubmit = (e: React.SubmitEvent) => {
		e.preventDefault();
		onSearch(value.trim());
	};

	const handleOnChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		setValue(e.target.value);
		if (!e.target.value.trim()) {
			onSearch('');
		}
	};

	return (
		<form
			onSubmit={handleSubmit}
			className="flex gap-2">
			<div className="relative flex-1">
				<Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
				<Input
					placeholder="Search by username, email, or ID"
					value={value}
					onChange={handleOnChange}
					className="pl-9"
				/>
			</div>
			<Button
				type="submit"
				disabled={isLoading || !value.trim()}>
				Search
			</Button>
			{value && (
				<Button
					type="button"
					variant="outline"
					onClick={() => {
						setValue('');
						onSearch('');
					}}>
					Clear
				</Button>
			)}
		</form>
	);
}

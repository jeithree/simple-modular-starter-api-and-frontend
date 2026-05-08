import {createInitialAdminUser} from '../modules/admin/index.ts';

export const init = async () => {
	await createInitialAdminUser();
};

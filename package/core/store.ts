import Conf from "conf";

export interface VaultEntryData {
	id: string;
	service: string;
	updatedAt: string;
	data: VaultEntry;
}

export interface VaultEntry {
	content: string;
	iv: string;
	salt: string;
	tag: string;
}

export const store = new Conf<{
	initialized: boolean;
	entries: VaultEntryData[];
}>({
	projectName: "vaultgen",
	defaults: {
		initialized: false,
		entries: [],
	},
});

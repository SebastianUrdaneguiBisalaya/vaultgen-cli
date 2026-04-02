import Conf from "conf";

export interface VaultEntry {
    id: string;
    service: string;
    updatedAt: string;
    data: Record<string, string>;
}

export const store = new Conf({
    projectName: "vaultgen",
    defaults: {
        initialized: false,
        entries: [] as VaultEntry[],
    }
})
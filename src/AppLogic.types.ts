export type CatId = string | number;

export type CatRecord = {
	room: string;
	[key: string]: unknown;
};

export type PayloadBasic = {
	current_day: number;
};

export type PayloadMeta = {
	basic: PayloadBasic | null;
	script_start_time: string;
};

export type SourceType = 'preload-json' | 'upload-json' | 'upload-sav' | 'demo' | 'legacy-storage';

export type SourceMeta = {
	sourceType: SourceType;
	fileModifiedAt?: number | string;
	scriptStartTime?: number | string;
	loadedAt?: number | string;
};

export type DownloadPayload = {
	cats: CatRecord[];
	basic?: PayloadBasic;
	script_start_time?: string;
};

export type PersistedStorage = {
	payload?: unknown;
	cats?: unknown;
	payloadMeta?: Partial<PayloadMeta> | null;
	current_day?: unknown;
	script_start_time?: unknown;
	sourceMeta?: SourceMeta | null;
};

export type UnpackedPayload = {
	cats: CatRecord[];
	payloadMeta: PayloadMeta;
};

export const defaultPayloadMeta: PayloadMeta = { basic: null, script_start_time: '' };

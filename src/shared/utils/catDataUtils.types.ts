export type UnknownRecord = Record<string, unknown>;

export type CatLikeRecord = UnknownRecord & {
	id?: unknown;
	key?: unknown;
	id64?: unknown;
	name?: unknown;
	sex?: unknown;
	stats?: unknown;
	genealogy?: unknown;
	birthday?: unknown;
	_birth_day?: unknown;
	age?: unknown;
	script_start_time?: unknown;
	LCK?: unknown;
	LUCK?: unknown;
};

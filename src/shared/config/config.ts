const APP_EMOJIS = {
	default: '🐱',
	local: '🐈',
} as const;

const STAT_ICONS = {
	STR: '💪',
	DEX: '🏹',
	CON: '🔰',
	INT: '💡',
	SPD: '🥾',
	CHA: '💋',
	LCK: '🍀',
} as const;

const STATS = ['STR', 'DEX', 'CON', 'INT', 'SPD', 'CHA', 'LCK'] as const;

const OTHER_INFO_ICONS = {
	libido: '💕',
	aggression: '😾',
	loves: '❤️',
	hates: '⚔️',
} as const;

const SEX_ICON = { male: '♂', female: '♀', herm: '⚥' } as const;

const CAT_ICON = {
	triangle: '▲',
	circle: '●',
	star2: '⭐',
	str: STAT_ICONS.STR,
	dex: STAT_ICONS.DEX,
	con: STAT_ICONS.CON,
	int: STAT_ICONS.INT,
	spd: STAT_ICONS.SPD,
	cha: STAT_ICONS.CHA,
	lck: STAT_ICONS.LCK,
	health: '⚕️',
	evolution: '🧬',
} as const;

const SECURITY_LIMITS = {
	maxSaveUploadKb: 5000,
	maxJsonUploadKb: 5000,
	maxLz4DecompressedKb: 2000,
	maxCatsProcessed: 5000,
} as const;

export { APP_EMOJIS, STAT_ICONS, STATS, SEX_ICON, OTHER_INFO_ICONS, CAT_ICON, SECURITY_LIMITS };

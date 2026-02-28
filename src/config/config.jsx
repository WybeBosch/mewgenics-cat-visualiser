// Icon and config constants for Mewgenics Cat Visualiser

const APP_EMOJIS = {
	default: '🐱',
	local: '🐈',
};

const STAT_ICONS = {
	STR: '💪',
	DEX: '🏹',
	CON: '➕',
	INT: '💡',
	SPD: '🥾',
	CHA: '💋',
	LCK: '🍀',
};

const STATS = ['STR', 'DEX', 'CON', 'INT', 'SPD', 'CHA', 'LCK'];

const OTHER_INFO_ICONS = {
	libido: '💕',
	aggression: '😾',
	loves: '❤️',
	hates: '⚔️', // Changed to two cross swords
};

const SEX_ICON = { male: '♂', female: '♀', herm: '⚥' };

const SECURITY_LIMITS = {
	maxSaveUploadKb: 5000, // normal saves are around 300 - 400 kb
	maxJsonUploadKb: 5000,
	maxLz4DecompressedKb: 2000,
	maxCatsProcessed: 5000,
};

export { APP_EMOJIS, STAT_ICONS, STATS, SEX_ICON, OTHER_INFO_ICONS, SECURITY_LIMITS };

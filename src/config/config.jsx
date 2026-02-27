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
const SEX_COLOR = {
	male: '#60a5fa',
	female: '#f472b6',
	herm: '#c084fc',
};
const SEX_BG = { male: '#1a2a4a', female: '#3b1a3b', herm: '#2a1a4a' };
const SEX_BG_HOVER = {
	male: '#2a3a6a',
	female: '#5a2a5a',
	herm: '#3b2a5a',
};

const SECURITY_LIMITS = {
	maxSaveUploadKb: 5000, // normal saves are around 300 - 400 kb
	maxJsonUploadKb: 5000,
	maxLz4DecompressedKb: 2000,
	maxCatsProcessed: 5000,
};

export {
	APP_EMOJIS,
	STAT_ICONS,
	STATS,
	SEX_ICON,
	SEX_COLOR,
	SEX_BG,
	SEX_BG_HOVER,
	OTHER_INFO_ICONS,
	SECURITY_LIMITS,
};

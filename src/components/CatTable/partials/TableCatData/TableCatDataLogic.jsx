import {
	STAT_ICONS,
	STATS,
	OTHER_INFO_ICONS,
} from '../../../../config/config.jsx';

export function TableCatDataLogic({ cats }) {
	// Derived columns for table header
	const columns = [
		{ key: 'name', label: 'Name' },
		{ key: 'partnerRoom', label: '💞' },
		{ key: 'age', label: 'Age' },
		{ key: 'sex', label: 'Sex' },
		...STATS.map((s) => ({ key: s, label: `${STAT_ICONS[s]} ${s}` })),
		{ key: 'total', label: 'Total' },
		{ key: 'libido', label: OTHER_INFO_ICONS.libido },
		{ key: 'aggression', label: OTHER_INFO_ICONS.aggression },
		{ key: 'loves', label: OTHER_INFO_ICONS.loves },
		{ key: 'hates', label: OTHER_INFO_ICONS.hates },
		{ key: 'mutations', label: OTHER_INFO_ICONS.mutations },
		{ key: 'actions', label: '' },
	];

	// Helper to get partnerInOtherRoom
	function isPartnerInOtherRoom(cat) {
		if (!cat.loves) return false;
		const partner = cats.find(
			(c) => c.name === cat.loves || c.id === cat.loves
		);
		return partner && partner.room && cat.room && partner.room !== cat.room;
	}

	// Helper to get row background
	function getRowBg(isHovered, index) {
		if (isHovered) return '#2a2a5a';
		return index % 2 === 0 ? '#1a1a2e' : '#1f1f3a';
	}

	// Helper to get age color and font size
	function getAgeStyle(age) {
		if (age === null) return { color: '#888', fontSize: '1em' };
		if (age <= 1) return { color: '#fbbf24', fontSize: '0.95em' };
		return { color: '#38bdf8', fontSize: '1em' };
	}

	// Helper to get stat style
	function getStatStyle(val) {
		if (val >= 7)
			return { fontWeight: 800, color: '#4ade80', fontSize: '1.05em' };
		return { fontWeight: 400, color: '#ccc', fontSize: '1em' };
	}

	// Helper to get cell style for info columns
	function getInfoStyle(color) {
		return {
			padding: '10px 12px',
			textAlign: 'center',
			fontSize: 12,
			color,
			whiteSpace: 'nowrap',
		};
	}

	return {
		columns,
		isPartnerInOtherRoom,
		getRowBg,
		getAgeStyle,
		getStatStyle,
		getInfoStyle,
	};
}

import { STAT_ICONS, STATS, OTHER_INFO_ICONS } from '../../../../shared/config/config.ts';
import { getCatId } from '../../../../shared/utils/catDataUtils.ts';
import type { TableCatDataLogicParams, TableCatDataLogicResult } from './TableCatDataLogic.types.ts';

function toStringValue(value: unknown): string {
	if (value === null || value === undefined) return '';
	return String(value);
}

export function TableCatDataLogic({ cats }: TableCatDataLogicParams): TableCatDataLogicResult {
	const columns = [
		{ key: 'name', label: 'Name', tooltip: 'Cat name' },
		{
			key: 'partner-room',
			label: '💞',
			isStatic: true,
			tooltip:
				'Matching partner in another room. Shows when this cat and another cat love each other, but they are currently in different rooms. A detective icon appears in this column for those separated matching partners.',
		},
		{ key: 'stray', label: 'Stray', tooltip: 'Whether this cat has no family' },
		{ key: 'age', label: 'Age', tooltip: 'Cat age in days' },
		{ key: 'sex', label: 'Sex', tooltip: 'Sex (male, female, or herm)' },
		{ key: 'icon', label: '🔷', tooltip: 'Cat icon badge' },
		...STATS.map((statKey) => ({
			key: statKey,
			label: `${STAT_ICONS[statKey]} ${statKey}`,
			isStat: true,
			tooltip: `${statKey} stat`,
		})),
		{ key: 'total', label: 'Total', tooltip: 'Total of all core stats' },
		{
			key: 'libido',
			label: OTHER_INFO_ICONS.libido,
			tooltip: 'Libido',
		},
		{
			key: 'aggression',
			label: OTHER_INFO_ICONS.aggression,
			tooltip: 'Aggression',
		},
		{ key: 'loves', label: OTHER_INFO_ICONS.loves, tooltip: 'Cats they love' },
		{ key: 'hates', label: OTHER_INFO_ICONS.hates, tooltip: 'Cats they hate' },
		{ key: 'spacer', label: '', isStatic: true },
	];

	function isPartnerInOtherRoom(cat: { [key: string]: unknown; room: string }): boolean {
		const loves = toStringValue(cat.loves);
		if (!loves) return false;

		const catId = getCatId(cat);
		const partner = cats.find((candidate) => {
			const candidateId = getCatId(candidate);
			const candidateName = toStringValue(candidate.name);
			return candidateName === loves || candidateId === loves;
		});

		if (!partner || !partner.room || partner.room === cat.room) return false;

		const partnerLoves = toStringValue(partner.loves);
		const catName = toStringValue(cat.name);
		return partnerLoves === catName || partnerLoves === catId;
	}

	function getRowBg(isHovered: boolean, index: number): string {
		if (isHovered) return 'var(--color-bg-strong)';
		return index % 2 === 0 ? 'var(--color-bg-page)' : 'var(--color-bg-muted-alt)';
	}

	function getAgeStyle(age: number | null) {
		if (age === null) return { color: 'var(--color-text-subtle)', fontSize: '1em' };
		if (age <= 1) return { color: 'var(--color-age-kitten)', fontSize: '0.95em' };
		return { color: 'var(--color-age-adult)', fontSize: '1em' };
	}

	function getStatStyle(value: number) {
		if (value >= 7) return { fontWeight: 800, color: 'var(--color-positive)', fontSize: '1.05em' };
		return { fontWeight: 400, color: 'var(--color-text-neutral)', fontSize: '1em' };
	}

	function getInfoStyle(color: string) {
		return {
			padding: '10px 12px',
			textAlign: 'center',
			fontSize: 12,
			color,
			whiteSpace: 'nowrap',
		} as const;
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

import type { Dispatch, SetStateAction } from 'react';
import type { CatId, CatRecord } from '../../../../AppLogic.types.ts';
import type { SortColumn, StatFilters } from '../../CatTable.types.ts';

export type TableCatDataProps = {
	cats: CatRecord[];
	activeRoom: string;
	setActiveRoom: Dispatch<SetStateAction<string>>;
	hoveredCatId: CatId | null;
	setHoveredCatId: Dispatch<SetStateAction<CatId | null>>;
	handleSort: (column: string) => void;
	sortCol: SortColumn;
	sortAsc: boolean;
	sorted: CatRecord[];
	totalStat: (cat: CatRecord) => number;
	statFilters: StatFilters;
	setStatFilter: (statKey: string, value: number | null) => void;
	aggroColor: (value: number) => string;
};

import type { Dispatch, SetStateAction } from 'react';
import type { CatId, CatRecord } from '../../AppLogic.types.ts';

export type SortColumn = string | null;

export type StatFilters = Record<string, number>;

export type CatTableProps = {
	cats: CatRecord[];
	rooms: string[];
	activeRoom: string;
	setActiveRoom: Dispatch<SetStateAction<string>>;
};

export type CatTableLogicParams = {
	cats: CatRecord[];
	activeRoom: string;
};

export type CatTableLogicResult = {
	hoveredCatId: CatId | null;
	setHoveredCatId: Dispatch<SetStateAction<CatId | null>>;
	handleSort: (column: string) => void;
	sorted: CatRecord[];
	aggroColor: (value: number) => string;
	totalStat: (cat: CatRecord) => number;
	sortCol: SortColumn;
	sortAsc: boolean;
	statFilters: StatFilters;
	setStatFilter: (statKey: string, value: number | null) => void;
	clearStatFilters: () => void;
};

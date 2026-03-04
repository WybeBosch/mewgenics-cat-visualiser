import type { SortColumn, StatFilters } from '../../../../CatTable.types.ts';
import type { TableColumn } from '../../TableCatDataLogic.types.ts';

export type TableHeadProps = {
	columns: TableColumn[];
	handleSort: (column: string) => void;
	sortCol: SortColumn;
	sortAsc: boolean;
	searchQuery: string;
	onSearchChange: (query: string) => void;
	onSearchSubmit: (query: string) => void;
	statFilters: StatFilters;
	setStatFilter: (statKey: string, value: number | null) => void;
};

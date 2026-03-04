import type { Dispatch, SetStateAction } from 'react';
import type { CatRecord } from '../../../../AppLogic.types.ts';
import type { StatFilters } from '../../CatTable.types.ts';

export type TableRoomTabsProps = {
	cats: CatRecord[];
	rooms: string[];
	activeRoom: string;
	setActiveRoom: Dispatch<SetStateAction<string>>;
	sortedRooms?: string[];
	statFilters: StatFilters;
	clearStatFilters: () => void;
};

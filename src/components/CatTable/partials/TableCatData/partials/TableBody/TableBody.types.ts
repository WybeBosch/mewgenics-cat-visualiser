import type { Dispatch, SetStateAction } from 'react';
import type { CatId, CatRecord } from '../../../../../../AppLogic.types.ts';
import type { PartnerRoomInfo, TableColumn } from '../../TableCatDataLogic.types.ts';

export type NoCatsFoundWarningProps = {
	columnsLength: number;
};

export type TableBodyProps = {
	cats: CatRecord[];
	columns: TableColumn[];
	sorted: CatRecord[];
	hoveredCatId: CatId | null;
	setHoveredCatId: Dispatch<SetStateAction<CatId | null>>;
	totalStat: (cat: CatRecord) => number;
	getPartnerInOtherRoom: (cat: CatRecord) => PartnerRoomInfo;
	highlightedCatId: CatId | null;
	onPartnerSearch: (partnerName: string) => void;
};

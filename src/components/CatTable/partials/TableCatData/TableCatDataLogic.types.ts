import type { CSSProperties } from 'react';
import type { CatRecord } from '../../../../AppLogic.types.ts';

export type TableColumn = {
	key: string;
	label: string;
	tooltip?: string;
	isStatic?: boolean;
	isStat?: boolean;
};

export type PartnerRoomInfo = {
	partnerName: string;
	partnerRoom: string;
} | null;

export type TableCatDataLogicParams = {
	cats: CatRecord[];
};

export type TableCatDataLogicResult = {
	columns: TableColumn[];
	getPartnerInOtherRoom: (cat: CatRecord) => PartnerRoomInfo;
	getRowBg: (isHovered: boolean, index: number) => string;
	getAgeStyle: (age: number | null) => CSSProperties;
	getStatStyle: (value: number) => CSSProperties;
	getInfoStyle: (color: string) => CSSProperties;
};

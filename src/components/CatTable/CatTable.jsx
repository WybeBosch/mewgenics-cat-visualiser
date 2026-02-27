import { TableRoomTabs } from './partials/TableRoomTabs';
import { TableCatData } from './partials/TableCatData/TableCatData';

import { CatTableLogic } from './CatTableLogic';

export function CatTable({ cats, rooms, activeRoom, setActiveRoom }) {
	const {
		hoveredCatId,
		setHoveredCatId,
		handleSort,
		sorted,
		aggroColor,
		totalStat,
		getAge,
		sortCol,
		sortAsc,
	} = CatTableLogic({ cats, activeRoom });
	return (
		<>
			<TableRoomTabs
				cats={cats}
				rooms={rooms}
				activeRoom={activeRoom}
				setActiveRoom={setActiveRoom}
			/>
			<TableCatData
				cats={cats}
				totalStat={totalStat}
				getAge={getAge}
				aggroColor={aggroColor}
				hoveredCatId={hoveredCatId}
				setHoveredCatId={setHoveredCatId}
				handleSort={handleSort}
				sortCol={sortCol}
				sortAsc={sortAsc}
				sorted={sorted}
			/>
		</>
	);
}

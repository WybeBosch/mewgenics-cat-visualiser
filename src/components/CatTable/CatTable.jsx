import { TableRoomTabs } from './partials/TableRoomTabs';
import { TableEditRow } from './partials/TableEditRow';
import { TableCatData } from './partials/TableCatData/TableCatData';

import { CatTableLogic } from './CatTableLogic';

export function CatTable({ cats, rooms, activeRoom, setActiveRoom }) {
	const {
		showForm,
		form,
		editIdx,
		hoveredCatId,
		setHoveredCatId,
		setForm,
		setEditIdx,
		setShowForm,
		resetForm,
		handleEdit,
		handleDelete,
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
			<TableEditRow
				showForm={showForm}
				form={form}
				setForm={setForm}
				rooms={rooms}
				editIdx={editIdx}
				setEditIdx={setEditIdx}
				cats={cats}
				resetForm={resetForm}
				setShowForm={setShowForm}
			/>
			<TableCatData
				cats={cats}
				totalStat={totalStat}
				getAge={getAge}
				aggroColor={aggroColor}
				hoveredCatId={hoveredCatId}
				setHoveredCatId={setHoveredCatId}
				handleEdit={handleEdit}
				handleDelete={handleDelete}
				handleSort={handleSort}
				sortCol={sortCol}
				sortAsc={sortAsc}
				sorted={sorted}
			/>
		</>
	);
}

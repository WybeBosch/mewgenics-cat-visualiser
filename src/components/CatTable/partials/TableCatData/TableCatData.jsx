import { TableCatDataLogic } from './TableCatDataLogic.jsx';
import { TableHead } from './partials/TableHead/TableHead.jsx';
import { TableBody } from './partials/TableBody/TableBody.jsx';
import './TableCatData.css';

export function TableCatData({
	cats,
	hoveredCatId,
	setHoveredCatId,
	handleSort,
	sortCol,
	sortAsc,
	sorted,
	totalStat,
	getAge,
}) {
	const { columns, isPartnerInOtherRoom } = TableCatDataLogic({ cats });

	return (
		<>
			{/* Table */}
			<section className="table-cat-data" aria-label="Cats table">
				<table className="table">
					<TableHead
						columns={columns}
						handleSort={handleSort}
						sortCol={sortCol}
						sortAsc={sortAsc}
					/>
					<TableBody
						cats={cats}
						columns={columns}
						sorted={sorted}
						hoveredCatId={hoveredCatId}
						setHoveredCatId={setHoveredCatId}
						totalStat={totalStat}
						getAge={getAge}
						isPartnerInOtherRoom={isPartnerInOtherRoom}
					/>
				</table>
			</section>
		</>
	);
}

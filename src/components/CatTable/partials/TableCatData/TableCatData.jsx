import { TableCatDataLogic } from './TableCatDataLogic.jsx';
import { TableHead } from './partials/TableHead.jsx';
import { TableBody } from './partials/TableBody.jsx';

export function TableCatData({
	cats,
	aggroColor,
	hoveredCatId,
	setHoveredCatId,
	handleEdit,
	handleDelete,
	handleSort,
	sortCol,
	sortAsc,
	sorted,
	totalStat,
	getAge,
}) {
	const {
		columns,
		isPartnerInOtherRoom,
		getRowBg,
		getAgeStyle,
		getStatStyle,
		getInfoStyle,
	} = TableCatDataLogic({ cats });

	return (
		<>
			{/* Table */}
			<div
				className="table-cat-data"
				style={{
					overflowX: 'auto',
					overflowY: 'auto',
					maxHeight: '510px',
					border: '1px solid #333',
					borderTop: 'none',
				}}
			>
				<table
					style={{ width: '100%', borderCollapse: 'collapse', fontSize: 14 }}
				>
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
						handleEdit={handleEdit}
						handleDelete={handleDelete}
						totalStat={totalStat}
						getAge={getAge}
						isPartnerInOtherRoom={isPartnerInOtherRoom}
						getRowBg={getRowBg}
						getAgeStyle={getAgeStyle}
						getStatStyle={getStatStyle}
						getInfoStyle={getInfoStyle}
						aggroColor={aggroColor}
					/>
				</table>
			</div>
		</>
	);
}

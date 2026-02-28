import { useState } from 'react';
import { joinClass } from '../../../../../../utils/utils.jsx';
import './TableHead.css';

export function TableHead({ columns, handleSort, sortCol, sortAsc }) {
	const [hoveredColumn, setHoveredColumn] = useState(null);

	return (
		<thead>
			<tr className="table-head">
				{columns.map((col, index) => {
					const isLeftAlignedTooltip = index < 2;
					const isRightAlignedTooltip = index === columns.length - 1;
					const isSortable = !col.isStatic;
					const isSorted = sortCol === col.key;
					const textAlignClass = col.key === 'name' ? 'left' : '';
					const staticClass = isSortable ? '' : 'static';
					const sortedClass = isSorted ? 'sorted' : '';
					const tooltipAlignClass = isLeftAlignedTooltip
						? 'left'
						: isRightAlignedTooltip
							? 'right'
							: '';
					const tooltipWidthClass = col.key === 'partnerRoom' ? 'wide' : '';
					const columnClass = `col-${col.key}`;
					const statClass = col.isStat ? 'col-stat' : '';

					return (
						<th
							key={col.key}
							className={joinClass(
								'cell',
								columnClass,
								statClass,
								textAlignClass,
								staticClass,
								sortedClass
							)}
							onMouseEnter={() => setHoveredColumn(col.key)}
							onMouseLeave={() => setHoveredColumn(null)}
							onClick={isSortable ? () => handleSort(col.key) : undefined}
						>
							{col.label}
							{isSorted && (
								<span className="sort-indicator">{sortAsc ? '▲' : '▼'}</span>
							)}
							{hoveredColumn === col.key && col.tooltip && (
								<div
									className={joinClass(
										'tooltip',
										tooltipAlignClass,
										tooltipWidthClass
									)}
								>
									{col.tooltip}
								</div>
							)}
						</th>
					);
				})}
			</tr>
		</thead>
	);
}

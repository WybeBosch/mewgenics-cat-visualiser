import { useState } from 'react';

export function TableHead({ columns, handleSort, sortCol, sortAsc }) {
	const [hoveredColumn, setHoveredColumn] = useState(null);

	return (
		<thead>
			<tr style={{ background: '#252547' }}>
				{columns.map((col, index) => {
					const isLeftAlignedTooltip = index < 2;
					const isRightAlignedTooltip = index === columns.length - 1;

					return (
						<th
							key={col.key}
							onMouseEnter={() => setHoveredColumn(col.key)}
							onMouseLeave={() => setHoveredColumn(null)}
							onClick={
								col.key !== 'partnerRoom'
									? () => handleSort(col.key)
									: undefined
							}
							style={{
								padding: '12px 12px',
								textAlign: col.key === 'name' ? 'left' : 'center',
								cursor: col.key !== 'partnerRoom' ? 'pointer' : 'default',
								userSelect: 'none',
								fontWeight: 600,
								color: sortCol === col.key ? '#6366f1' : '#aaa',
								fontSize: 13,
								borderBottom: '2px solid #333',
								whiteSpace: 'nowrap',
								position: 'relative',
							}}
						>
							{col.label}
							{sortCol === col.key && (
								<span
									style={{
										marginLeft: 4,
										position: 'absolute',
										right: '0',
										top: '50%',
										transform: 'translateY(-50%)',
									}}
								>
									{sortAsc ? '▲' : '▼'}
								</span>
							)}
							{hoveredColumn === col.key && col.tooltip && (
								<div
									style={{
										position: 'absolute',
										top: 'calc(100% + 6px)',
										left: isLeftAlignedTooltip
											? 0
											: isRightAlignedTooltip
												? 'auto'
												: '50%',
										right: isRightAlignedTooltip ? 0 : 'auto',
										transform:
											isLeftAlignedTooltip || isRightAlignedTooltip
												? 'none'
												: 'translateX(-50%)',
										background: '#111827',
										color: '#f3f4f6',
										padding: '8px 10px',
										border: '1px solid #374151',
										borderRadius: 6,
										fontSize: 12,
										fontWeight: 400,
										lineHeight: 1.35,
										whiteSpace: 'normal',
										width: col.key === 'partnerRoom' ? 320 : 180,
										zIndex: 30,
										boxShadow: '0 10px 15px -3px rgba(0,0,0,0.35)',
										pointerEvents: 'none',
									}}
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

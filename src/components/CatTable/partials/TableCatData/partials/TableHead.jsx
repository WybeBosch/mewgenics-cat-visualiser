export function TableHead({ columns, handleSort, sortCol, sortAsc }) {
	return (
		<thead>
			<tr style={{ background: '#252547' }}>
				{columns.map((col) => (
					<th
						key={col.key}
						onClick={
							col.key !== 'actions' && col.key !== 'partnerRoom'
								? () => handleSort(col.key)
								: undefined
						}
						style={{
							padding: '12px 12px',
							textAlign: col.key === 'name' ? 'left' : 'center',
							cursor:
								col.key !== 'actions' && col.key !== 'partnerRoom'
									? 'pointer'
									: 'default',
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
					</th>
				))}
			</tr>
		</thead>
	);
}

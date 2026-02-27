import { STATS, SEX_ICON, SEX_COLOR } from '../../../../../config/config.jsx';
import { TableTooltipPopup } from '../../../../../utils/utils.jsx';

export function TableBody({
	cats,
	columns,
	sorted,
	hoveredCatId,
	setHoveredCatId,
	totalStat,
	getAge,
	isPartnerInOtherRoom,
	getRowBg,
	getAgeStyle,
	getStatStyle,
	getInfoStyle,
	aggroColor,
}) {
	const noCatsFound = !sorted.length > 0;
	function NoCatsFoundWarning() {
		return (
			<tr>
				<td
					colSpan={columns.length}
					style={{ padding: 40, textAlign: 'center', color: '#666' }}
				>
					No cats in this room.
				</td>
			</tr>
		);
	}

	return (
		<tbody>
			{noCatsFound ? <NoCatsFoundWarning /> : null}
			{sorted.map((cat, i) => {
				const total = totalStat(cat);
				const age = getAge(cat);
				const isHovered = hoveredCatId === cat.id;
				const rowBg = getRowBg(isHovered, i);
				const partnerInOtherRoom = isPartnerInOtherRoom(cat);
				const ageStyle = getAgeStyle(age);

				return (
					<tr
						key={cat.id + i}
						style={{
							background: rowBg,
							borderBottom: '1px solid #2a2a4a',
							transition: 'background 0.1s',
						}}
						onMouseEnter={() => setHoveredCatId(cat.id)}
						onMouseLeave={() => setHoveredCatId(null)}
					>
						<TableTooltipPopup cat={cat} allCats={cats} />
						<td
							style={{
								padding: '10px 12px',
								textAlign: 'center',
								fontSize: 18,
							}}
						>
							{partnerInOtherRoom ? '🕵️‍♂️' : ''}
						</td>
						<td
							style={{
								padding: '10px 12px',
								textAlign: 'center',
								fontWeight: 600,
								...ageStyle,
							}}
							title={
								age !== null
									? `${age} day${age === 1 ? '' : 's'} old`
									: 'Unknown'
							}
						>
							{age !== null ? age : '—'}
						</td>
						<td
							style={{
								padding: '10px 12px',
								textAlign: 'center',
								color: SEX_COLOR[cat.sex],
							}}
						>
							{SEX_ICON[cat.sex] || cat.sex}
						</td>
						{STATS.map((s) => (
							<td
								key={s}
								style={{
									padding: '10px 12px',
									textAlign: 'center',
									fontVariantNumeric: 'tabular-nums',
									...getStatStyle(cat[s]),
								}}
							>
								{cat[s]}
							</td>
						))}
						<td
							style={{
								padding: '10px 12px',
								textAlign: 'center',
								fontWeight: 600,
								color: '#a78bfa',
							}}
						>
							{total}
						</td>
						<td style={getInfoStyle('#ccc')}>{cat.libido}</td>
						<td style={getInfoStyle(aggroColor(cat.aggression))}>
							{cat.aggression}
						</td>
						<td style={getInfoStyle('#a7f3d0')}>{cat.loves || '—'}</td>
						<td style={getInfoStyle('#fca5a5')}>{cat.hates || '—'}</td>
					</tr>
				);
			})}
		</tbody>
	);
}

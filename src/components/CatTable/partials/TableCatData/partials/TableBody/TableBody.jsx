import { STATS, SEX_ICON } from '../../../../../../config/config.jsx';
import { TableTooltipPopup, joinClass } from '../../../../../../utils/utils.jsx';
import './TableBody.css';

function NoCatsFoundWarning({ columnsLength }) {
	return (
		<tr>
			<td colSpan={columnsLength} className="no-cats-warning">
				No cats in this room.
			</td>
		</tr>
	);
}

export function TableBody({
	cats,
	columns,
	sorted,
	hoveredCatId,
	setHoveredCatId,
	totalStat,
	getAge,
	isPartnerInOtherRoom,
}) {
	const noCatsFound = sorted.length === 0;

	function getAggressionClass(aggression) {
		if (aggression <= 3) return 'low';
		if (aggression <= 6) return '';
		return 'high';
	}

	function getAgeClass(age) {
		if (age === null) return 'unknown';
		if (age <= 1) return 'kitten';
		return '';
	}

	function getStatClass(statValue) {
		return statValue >= 7 ? 'high' : '';
	}

	return (
		<tbody className="table-body">
			{noCatsFound ? <NoCatsFoundWarning columnsLength={columns.length} /> : null}
			{sorted.map((cat, i) => {
				const total = totalStat(cat);
				const age = getAge(cat);
				const isHovered = hoveredCatId === cat.id;
				const partnerInOtherRoom = isPartnerInOtherRoom(cat);

				return (
					<tr
						key={cat.id + i}
						className={joinClass('row', { hovered: isHovered })}
						onMouseEnter={() => setHoveredCatId(cat.id)}
						onMouseLeave={() => setHoveredCatId(null)}
					>
						<TableTooltipPopup cat={cat} allCats={cats} />
						<td className="cell partner-indicator">{partnerInOtherRoom ? '🕵️‍♂️' : ''}</td>
						<td
							className={joinClass('cell age', getAgeClass(age))}
							title={
								age !== null ? `${age} day${age === 1 ? '' : 's'} old` : 'Unknown'
							}
						>
							{age !== null ? age : '—'}
						</td>
						<td className={joinClass('cell sex', cat.sex)}>
							{SEX_ICON[cat.sex] || cat.sex}
						</td>
						{STATS.map((s) => (
							<td key={s} className={joinClass('cell stat', getStatClass(cat[s]))}>
								{cat[s]}
							</td>
						))}
						<td className="cell total">{total}</td>
						<td className="cell info libido">{cat.libido}</td>
						<td
							className={joinClass(
								'cell info aggression',
								getAggressionClass(cat.aggression)
							)}
						>
							{cat.aggression}
						</td>
						<td className="cell info loves">{cat.loves || '—'}</td>
						<td className="cell info hates">{cat.hates || '—'}</td>
						<td className="cell spacer" aria-hidden="true"></td>
					</tr>
				);
			})}
		</tbody>
	);
}

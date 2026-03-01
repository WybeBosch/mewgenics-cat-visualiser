import {
	canBreed,
	getInbreedingCoefficient,
	isLineTypeActive,
	isSameRoom,
} from './SvgRelationLogic.jsx';

export default function SvgInbreedingLines({
	hovIdx,
	ordered,
	positions,
	hiddenLineTypes,
	allCats,
}) {
	if (hovIdx === null) return null;
	if (!isLineTypeActive(hiddenLineTypes, 'inbreeding')) return null;

	const hovCat = ordered[hovIdx];
	const from = positions[hovIdx];

	return (
		<g className="inbreeding-lines">
			{ordered.map((other, oi) => {
				if (oi === hovIdx) return null;
				if (!isSameRoom(hovCat, other)) return null;
				if (!canBreed(hovCat, other)) return null;

				const to = positions[oi];
				const coeff = getInbreedingCoefficient(hovCat, other, allCats);
				const hasRisk = coeff > 0;

				const nodeR = 28;
				const dx = to.x - from.x;
				const dy = to.y - from.y;
				const dist = Math.sqrt(dx * dx + dy * dy) || 1;

				const x1 = from.x + dx * (nodeR / dist);
				const y1 = from.y + dy * (nodeR / dist);
				const x2 = to.x - dx * (nodeR / dist);
				const y2 = to.y - dy * (nodeR / dist);

				return (
					<g key={`inbr-${oi}`} className="kin-inbreeding">
						<line
							className="kin-line"
							x1={x1}
							y1={y1}
							x2={x2}
							y2={y2}
							strokeWidth={hasRisk ? 2 : 1}
							strokeDasharray="2,4"
							opacity={hasRisk ? 0.7 : 0.15}
						/>
						{/* Coefficient label above the target cat's node */}
						<text
							className="kin-label"
							x={to.x}
							y={to.y - nodeR - 6}
							textAnchor="middle"
							fontSize={hasRisk ? 11 : 9}
							fontWeight={hasRisk ? 'bold' : 'normal'}
							opacity={hasRisk ? 0.95 : 0.4}
						>
							{coeff === 0 ? '0' : coeff.toFixed(4).replace(/0+$/, '').replace(/\.$/, '')}
						</text>
					</g>
				);
			})}
		</g>
	);
}

import {
	canBreed,
	createKinshipContext,
	getInbreedingCoefficient,
	isLineTypeActive,
	isSameRoom,
} from './SvgRelationLogic.tsx';
import type { GraphPosition, HiddenLineTypes } from '../../../RelationshipGraph.types.ts';
import type { CatRecord } from '../../../../../AppLogic.types.ts';

export default function SvgInbreedingPercentages({
	hovIdx,
	ordered,
	positions,
	hiddenLineTypes,
	allCats,
}: {
	hovIdx: number | null;
	ordered: CatRecord[];
	positions: GraphPosition[];
	hiddenLineTypes: HiddenLineTypes;
	allCats: CatRecord[];
}) {
	if (hovIdx === null) return null;
	if (!isLineTypeActive(hiddenLineTypes as Set<string>, 'inbreeding')) return null;

	const hovCat = ordered[hovIdx];
	const ctx = createKinshipContext(allCats);

	return (
		<g className="inbreeding-percentages">
			{ordered.map((other, oi) => {
				if (oi === hovIdx) return null;
				if (!isSameRoom(hovCat, other)) return null;
				if (!canBreed(hovCat, other)) return null;

				const to = positions[oi];
				const coeff = getInbreedingCoefficient(hovCat, other, allCats, ctx);
				const hasRisk = coeff > 0;
				const pctRaw = coeff * 100;
				const pct = Number.isInteger(pctRaw) ? pctRaw : parseFloat(pctRaw.toFixed(2));

				return (
					<g key={`inbr-${oi}`} className="kin-inbreeding">
						<text
							className="kin-label"
							x={to.x}
							y={to.y - (to.nodeR || 28) - 6}
							textAnchor="middle"
							fontSize={hasRisk ? 11 : 9}
							fontWeight={hasRisk ? 'bold' : 'normal'}
							opacity={hasRisk ? 0.95 : 0.4}
							stroke="var(--color-bg-page)"
							strokeWidth={3}
							paintOrder="stroke"
						>
							{pct}%
						</text>
					</g>
				);
			})}
		</g>
	);
}

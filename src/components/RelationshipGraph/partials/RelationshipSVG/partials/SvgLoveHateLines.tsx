import {
	findCatByName,
	findPositionByName,
	isLineTypeActive,
	isSameRoom,
} from './SvgRelationLogic.tsx';
import { getCatId } from '../../../../../shared/utils/catDataUtils.ts';
import type { GraphPosition, HiddenLineTypes } from '../../../RelationshipGraph.types.ts';
import type { CatRecord } from '../../../../../AppLogic.types.ts';

export default function SvgLoveHateLines({
	hovIdx,
	ordered,
	positions,
	hiddenLineTypes,
}: {
	hovIdx: number | null;
	ordered: CatRecord[];
	positions: GraphPosition[];
	hiddenLineTypes: HiddenLineTypes;
}) {
	const edges: Array<{
		from: GraphPosition;
		to: GraphPosition;
		type: 'love' | 'hate';
		fromId: string;
		toId: string;
		toName: string;
	}> = [];

	ordered.forEach((cat) => {
		const from = findPositionByName(positions, cat.name);
		if (!from) return;
		if (cat.hates) {
			const toCat = findCatByName(ordered, cat.hates);
			if (isSameRoom(cat, toCat || undefined)) {
				const to = findPositionByName(positions, toCat?.name);
				if (to)
					edges.push({
						from,
						to,
						type: 'hate',
						fromId: getCatId(cat),
						toId: getCatId(toCat),
						toName: String(toCat?.name || ''),
					});
			}
		}
		if (cat.loves) {
			const toCat = findCatByName(ordered, cat.loves);
			if (isSameRoom(cat, toCat || undefined)) {
				const to = findPositionByName(positions, toCat?.name);
				if (to) {
					edges.push({
						from,
						to,
						type: 'love',
						fromId: getCatId(cat),
						toId: getCatId(toCat),
						toName: String(toCat?.name || ''),
					});
				}
			}
		}
	});

	const getPath = (from: GraphPosition, to: GraphPosition, type: 'love' | 'hate') => {
		const dx = to.x - from.x;
		const dy = to.y - from.y;
		const dist = Math.sqrt(dx * dx + dy * dy) || 1;
		const nodeR1 = from.nodeR || 28;
		const nodeR2 = to.nodeR || 28;
		const x1 = from.x + dx * (nodeR1 / dist);
		const y1 = from.y + dy * (nodeR1 / dist);
		const x2 = from.x + dx * ((dist - nodeR2) / dist);
		const y2 = from.y + dy * ((dist - nodeR2) / dist);
		const mx = (x1 + x2) / 2;
		const my = (y1 + y2) / 2;
		const offset = type === 'love' ? 25 : -25;
		return {
			x1,
			y1,
			x2,
			y2,
			cx: mx + (-dy / dist) * offset,
			cy: my + (dx / dist) * offset,
		};
	};

	const visibleEdges = edges.filter((edge) => {
		if (!isLineTypeActive(hiddenLineTypes as Set<string>, edge.type)) return false;
		if (hovIdx === null) return true;
		const hoveredCatId = getCatId(ordered[hovIdx]);
		return edge.fromId === hoveredCatId || edge.toId === hoveredCatId;
	});

	const loveEdges = visibleEdges.filter((edge) => edge.type === 'love');
	const hateEdges = visibleEdges.filter((edge) => edge.type === 'hate');

	return (
		<>
			<g className="edge-love-group">
				{loveEdges.map((edge, i) => {
					const p = getPath(edge.from, edge.to, edge.type);
					return (
						<path
							key={`love-${i}`}
							className="edge-love"
							d={`M ${p.x1} ${p.y1} Q ${p.cx} ${p.cy} ${p.x2} ${p.y2}`}
							fill="none"
							strokeWidth={2}
							strokeDasharray="0"
							markerEnd="url(#arrow-love)"
							opacity={0.7}
						/>
					);
				})}
			</g>

			<g className="edge-hate-group">
				{hateEdges.map((edge, i) => {
					const p = getPath(edge.from, edge.to, edge.type);
					return (
						<path
							key={`hate-${i}`}
							className="edge-hate"
							d={`M ${p.x1} ${p.y1} Q ${p.cx} ${p.cy} ${p.x2} ${p.y2}`}
							fill="none"
							strokeWidth={2}
							strokeDasharray="6,4"
							markerEnd="url(#arrow-hate)"
							opacity={0.7}
						/>
					);
				})}
			</g>
		</>
	);
}

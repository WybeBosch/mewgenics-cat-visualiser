import './SvgMatchedRelationships.css';
import { isLineTypeActive, normalizeLineageName } from '../SvgRelationLogic.tsx';
import type { GraphPosition, HiddenLineTypes } from '../../../../RelationshipGraph.types.ts';
import type { CatRecord } from '../../../../../../AppLogic.types.ts';

export default function SvgMatchedRelationships({
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
	if (!isLineTypeActive(hiddenLineTypes as Set<string>, 'love')) {
		return null;
	}

	return (
		<g className="love-boxes">
			{(() => {
				const boxes = [];
				const drawn = new Set<string>();
				const boxOpacity = hovIdx !== null ? 0.05 : 0.7;
				for (let i = 0; i < ordered.length - 1; i++) {
					const a = ordered[i];
					const b = ordered[i + 1];
					if (
						a.loves &&
						b.loves &&
						normalizeLineageName(a.loves) === normalizeLineageName(b.name) &&
						normalizeLineageName(b.loves) === normalizeLineageName(a.name) &&
						!drawn.has(String(a.name || '')) &&
						!drawn.has(String(b.name || ''))
					) {
						const pa = positions[i];
						const pb = positions[i + 1];
						const minX = Math.min(pa.x, pb.x) - 36;
						const maxX = Math.max(pa.x, pb.x) + 36;
						const minY = Math.min(pa.y, pb.y) - 36;
						const maxY = Math.max(pa.y, pb.y) + 36;
						boxes.push(
							<rect
								key={`lovebox-${String(a.name || '')}-${String(b.name || '')}`}
								className="love-box"
								x={minX}
								y={minY}
								width={maxX - minX}
								height={maxY - minY}
								rx={22}
								fill="none"
								stroke="#4ade80"
								strokeWidth={4}
								opacity={boxOpacity}
							/>
						);
						drawn.add(String(a.name || ''));
						drawn.add(String(b.name || ''));
					}
				}
				return boxes;
			})()}
		</g>
	);
}

import { useState } from 'react';

import { getCatId, isKitten } from '../../../../shared/utils/catDataUtils.ts';
import type { GraphPosition, RelationshipSVGProps } from '../../RelationshipGraph.types.ts';
import Tooltip from './partials/Tooltip.tsx';
import TooltipCloseArea from './partials/TooltipCloseArea.tsx';
import SvgLoveHateLines from './partials/SvgLoveHateLines.tsx';
import SvgMarkers from './partials/SvgMarkers.tsx';
import SvgMatchedRelationships from './partials/SvgMatchedRelationships/SvgMatchedRelationships.tsx';
import SvgRelationLines from './partials/SvgRelationLines.tsx';
import SvgInbreedingPercentages from './partials/SvgInbreedingPercentages.tsx';
import SvgCatNodes from './partials/SvgCatNodes/SvgCatNodes.tsx';
import {
	areMutualLovePair,
	hasOneWayLoveInRoom,
	isLineTypeActive,
} from './partials/SvgRelationLogic.tsx';

export default function RelationshipSVG({
	cats,
	allCats,
	hoveredCatId,
	setHoveredCatId,
	hiddenLineTypes,
}: RelationshipSVGProps) {
	const [selectedCatId, setSelectedCatId] = useState<string | number | null>(null);

	const ordered = (() => {
		if (!isLineTypeActive(hiddenLineTypes, 'love')) {
			return [...cats];
		}

		const pairs: Array<[(typeof cats)[number], (typeof cats)[number]]> = [];
		const paired = new Set<string>();
		cats.forEach((a) => {
			const aId = getCatId(a);
			if (paired.has(aId)) return;
			const match = cats.find((b) => areMutualLovePair(a, b));
			if (match && !paired.has(getCatId(match))) {
				pairs.push([a, match]);
				paired.add(aId);
				paired.add(getCatId(match));
			}
		});

		const unpaired = cats.filter((c) => !paired.has(getCatId(c)));

		const oneWayLovers: typeof cats = [];
		const others: typeof cats = [];
		unpaired.forEach((cat) => {
			if (hasOneWayLoveInRoom(cat, cats)) {
				oneWayLovers.push(cat);
			} else {
				others.push(cat);
			}
		});

		const result: typeof cats = [];
		for (const [a, b] of pairs) {
			result.push(a, b);
		}
		for (const c of oneWayLovers) {
			result.push(c);
		}
		for (const c of others) {
			result.push(c);
		}
		return result;
	})();

	const useRowLayout = ordered.length >= 15;

	const selected = ordered.findIndex((c) => getCatId(c) === selectedCatId);
	const selIdx = selected >= 0 ? selected : null;
	const hovered = ordered.findIndex((c) => getCatId(c) === hoveredCatId);
	const hovIdx = hovered >= 0 ? hovered : null;

	const W = 800;
	const H = useRowLayout ? 20 + Math.ceil(ordered.length / 8) * 110 : 500;
	const cx = W / 2;
	const cy = H / 2;
	const radius = Math.min(200, 60 + ordered.length * 12);

	const getNodeRadius = (cat: (typeof ordered)[number]) => {
		if (isKitten(cat)) return 18;
		return 28;
	};

	let positions: GraphPosition[];
	if (useRowLayout) {
		const perRow = 8;
		const rowHeight = 110;
		const startY = 70;
		const marginX = 60;
		const usableW = W - marginX * 2;
		positions = ordered.map((cat, i) => {
			const row = Math.floor(i / perRow);
			const col = i % perRow;
			const y = startY + row * rowHeight;
			const x = marginX + col * (usableW / (Math.min(perRow, ordered.length) - 1));
			return {
				name: String(cat.name || ''),
				sex: cat.sex,
				x,
				y,
				nodeR: getNodeRadius(cat),
			};
		});
	} else {
		positions = ordered.map((cat, i) => {
			const angle = (i / ordered.length) * 2 * Math.PI - Math.PI / 2;
			return {
				name: String(cat.name || ''),
				sex: cat.sex,
				x: cx + radius * Math.cos(angle),
				y: cy + radius * Math.sin(angle),
				nodeR: getNodeRadius(cat),
			};
		});
	}

	return (
		<svg className="graph-svg" width={W} height={H} viewBox={`0 0 ${W} ${H}`}>
			<SvgMarkers />

			<SvgLoveHateLines
				hovIdx={hovIdx}
				ordered={ordered}
				positions={positions}
				hiddenLineTypes={hiddenLineTypes}
			/>
			<SvgMatchedRelationships
				hovIdx={hovIdx}
				ordered={ordered}
				positions={positions}
				hiddenLineTypes={hiddenLineTypes}
			/>
			<SvgRelationLines
				hovIdx={hovIdx}
				ordered={ordered}
				positions={positions}
				hiddenLineTypes={hiddenLineTypes}
			/>
			<SvgInbreedingPercentages
				hovIdx={hovIdx}
				ordered={ordered}
				positions={positions}
				hiddenLineTypes={hiddenLineTypes}
				allCats={allCats}
			/>

			<TooltipCloseArea selectedCatId={selectedCatId} setSelectedCatId={setSelectedCatId} />
			<SvgCatNodes
				hovIdx={hovIdx}
				ordered={ordered}
				positions={positions}
				setHoveredCatId={setHoveredCatId}
				setSelectedCatId={setSelectedCatId}
				selectedCatId={selectedCatId}
			/>

			<Tooltip
				allCats={allCats}
				selIdx={selIdx}
				ordered={ordered}
				positions={positions}
				W={W}
			/>
		</svg>
	);
}

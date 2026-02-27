import { useState } from 'react';

import Tooltip from './partials/Tooltip.jsx';
import TooltipCloseArea from './partials/TooltipCloseArea.jsx';
import SvgLoveHateLines from './partials/SvgLoveHateLines.jsx';
import SvgMatchedRelationships from './partials/SvgMatchedRelationships.jsx';
import SvgRelationLines from './partials/SvgRelationLines.jsx';
import SvgCatNodes from './partials/SvgCatNodes.jsx';

export default function RelationshipSVG({
	cats,
	allCats,
	hoveredCatId,
	setHoveredCatId,
	getAge,
}) {
	const [selectedCatId, setSelectedCatId] = useState(null);

	// Reorder cats: 1. mutual pairs, 2. one-way lovers, 3. others
	const ordered = (() => {
		const pairs = [];
		const paired = new Set();
		cats.forEach((a) => {
			if (paired.has(a.id)) return;
			const match = cats.find(
				(b) =>
					b.id !== a.id &&
					a.loves &&
					b.loves &&
					a.loves === b.name &&
					b.loves === a.name
			);
			if (match && !paired.has(match.id)) {
				pairs.push([a, match]);
				paired.add(a.id);
				paired.add(match.id);
			}
		});

		// Unpaired cats
		const unpaired = cats.filter((c) => !paired.has(c.id));

		// One-way lovers: cats that love someone in the room, but are not in a mutual pair
		const oneWayLovers = [];
		const others = [];
		unpaired.forEach((cat) => {
			if (
				cat.loves &&
				cats.some((other) => other.id !== cat.id && other.name === cat.loves)
			) {
				oneWayLovers.push(cat);
			} else {
				others.push(cat);
			}
		});

		const result = [];
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

	// Switch to row layout if there are 15 or more cats
	const useRowLayout = ordered.length >= 15;

	const selected = ordered.findIndex((c) => c.id === selectedCatId);
	const selIdx = selected >= 0 ? selected : null;
	const hovered = ordered.findIndex((c) => c.id === hoveredCatId);
	const hovIdx = hovered >= 0 ? hovered : null;

	const W = 800,
		H = useRowLayout ? 120 + Math.ceil(ordered.length / 10) * 80 : 500;
	const cx = W / 2,
		cy = H / 2;
	const radius = Math.min(200, 60 + ordered.length * 12);

	// Node radius based on age
	const getNodeRadius = (cat) => {
		if (getAge) {
			const age = getAge(cat);
			if (age !== null && age <= 1) return 18; // kitten
		}
		return 28;
	};

	let positions;
	if (useRowLayout) {
		// Place cats in rows, 8 per row, with more spacing
		const perRow = 8;
		const rowHeight = 110;
		const startY = 70;
		const marginX = 60;
		const usableW = W - marginX * 2;
		positions = ordered.map((cat, i) => {
			const row = Math.floor(i / perRow);
			const col = i % perRow;
			const y = startY + row * rowHeight;
			const x =
				marginX + col * (usableW / (Math.min(perRow, ordered.length) - 1));
			return {
				name: cat.name,
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
				name: cat.name,
				sex: cat.sex,
				x: cx + radius * Math.cos(angle),
				y: cy + radius * Math.sin(angle),
				nodeR: getNodeRadius(cat),
			};
		});
	}

	return (
		<svg
			className="relationship-graph-svg"
			width={W}
			height={H}
			viewBox={`0 0 ${W} ${H}`}
			style={{ maxWidth: '100%' }}
		>
			<SvgLoveHateLines
				zIndex="2"
				hovIdx={hovIdx}
				ordered={ordered}
				positions={positions}
			/>

			<SvgMatchedRelationships
				hovIdx={hovIdx}
				ordered={ordered}
				positions={positions}
			/>
			<SvgRelationLines
				hovIdx={hovIdx}
				ordered={ordered}
				positions={positions}
			/>

			<TooltipCloseArea
				selectedCatId={selectedCatId}
				setSelectedCatId={setSelectedCatId}
			/>
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

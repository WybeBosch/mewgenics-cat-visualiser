import SvgMarkers from './SvgMarkers.jsx';

export default function SvgLoveHateLines({ hovIdx, ordered, positions }) {
	const findPos = (name) => {
		if (!name) return null;
		const clean = name.replace(/\s*☠️/g, '').trim().toLowerCase();
		return positions.find((p) => p.name.toLowerCase() === clean);
	};

	// Add hate and love edges
	const edges = [];
	ordered.forEach((cat) => {
		const from = findPos(cat.name);
		if (!from) return;
		// Hate edges
		if (cat.hates) {
			const to = findPos(cat.hates);
			if (to)
				edges.push({
					from,
					to,
					type: 'hate',
					fromId: cat.id,
					toName: cat.hates,
				});
		}
		// Love edges
		if (cat.loves) {
			const to = findPos(cat.loves);
			if (to) {
				edges.push({
					from,
					to,
					type: 'love',
					fromId: cat.id,
					toName: cat.loves,
				});
			}
		}
	});

	const getPath = (from, to, type) => {
		const dx = to.x - from.x,
			dy = to.y - from.y;
		const dist = Math.sqrt(dx * dx + dy * dy) || 1;
		const nodeR1 = from.nodeR || 28;
		const nodeR2 = to.nodeR || 28;
		const x1 = from.x + dx * (nodeR1 / dist),
			y1 = from.y + dy * (nodeR1 / dist);
		const x2 = from.x + dx * ((dist - nodeR2) / dist),
			y2 = from.y + dy * ((dist - nodeR2) / dist);
		const mx = (x1 + x2) / 2,
			my = (y1 + y2) / 2;
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

	return (
		<>
			<SvgMarkers />
			{/*(edges, external relations, shared lineage, nodes) */}
			{edges
				.filter((e) => {
					if (hovIdx === null) return true;
					// Only show edges where hovered cat is involved
					const hoveredCat = ordered[hovIdx];
					return (
						e.fromId === hoveredCat.id ||
						(hoveredCat.hates &&
							e.toName === hoveredCat.hates &&
							e.fromId === hoveredCat.id) ||
						hoveredCat.name === e.to.name ||
						(hoveredCat.loves &&
							e.toName === hoveredCat.loves &&
							e.fromId === hoveredCat.id)
					);
				})
				.map((e, i) => {
					const p = getPath(e.from, e.to, e.type);
					const isLove = e.type === 'love';
					return (
						<path
							key={i}
							d={`M ${p.x1} ${p.y1} Q ${p.cx} ${p.cy} ${p.x2} ${p.y2}`}
							fill="none"
							stroke={isLove ? '#4ade80' : '#ef4444'}
							strokeWidth={2}
							strokeDasharray={isLove ? '0' : '6,4'}
							markerEnd={isLove ? 'url(#arrow-love)' : 'url(#arrow-hate)'}
							opacity={0.7}
						/>
					);
				})}
		</>
	);
}

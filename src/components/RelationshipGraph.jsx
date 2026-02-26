import { sharedTooltipContents } from '../utils/utils.jsx';
import {
	SEX_ICON,
	SEX_COLOR,
	SEX_BG,
	SEX_BG_HOVER,
} from '../config/config.jsx';

/* ─── Relationship Graph ─── */

import { useState } from 'react';

function RelationshipGraph({
	cats,
	allCats,
	hoveredCatId,
	setHoveredCatId,
	getAge,
	activeRoom,
}) {
	const [selectedCatId, setSelectedCatId] = useState(null);

	if (cats.length === 0) return '';

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
			const totalRows = Math.ceil(ordered.length / perRow);
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

	const findPos = (name) => {
		if (!name) return null;
		const clean = name.replace(/\s*☠️/g, '').trim().toLowerCase();
		return positions.find((p) => p.name.toLowerCase() === clean);
	};

	// Add hate edges and one-way love edges (not mutual pairs)
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
		// Love edges (one-way, not mutual)
		if (cat.loves) {
			const to = findPos(cat.loves);
			if (to) {
				const isMutual = ordered.some(
					(other) => other.name === cat.loves && other.loves === cat.name
				);
				if (!isMutual) {
					edges.push({
						from,
						to,
						type: 'love',
						fromId: cat.id,
						toName: cat.loves,
					});
				}
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

	const buildTooltip = (cat) => sharedTooltipContents(cat, allCats);

	return (
		<div style={{ marginTop: 32 }}>
			<h2
				style={{
					fontSize: 20,
					fontWeight: 700,
					color: '#fff',
					marginBottom: 16,
				}}
			>
				💞 {activeRoom} — Relationships
			</h2>
			<div
				style={{
					background: '#1a1a2e',
					borderRadius: 12,
					border: '1px solid #333',
					padding: 16,
					display: 'flex',
					flexDirection: 'column',
					alignItems: 'center',
					position: 'relative',
				}}
			>
				{/* Overlay to close tooltip on outside click */}
				{selectedCatId !== null && (
					<div
						onClick={() => setSelectedCatId(null)}
						style={{
							position: 'absolute',
							left: 0,
							top: 0,
							width: '100%',
							height: '100%',
							zIndex: 2,
							background: 'transparent',
						}}
					/>
				)}
				<svg
					width={W}
					height={H}
					viewBox={`0 0 ${W} ${H}`}
					style={{ maxWidth: '100%' }}
				>
					<defs>
						<marker
							id="arrow-love"
							viewBox="0 0 10 6"
							refX="10"
							refY="3"
							markerWidth="8"
							markerHeight="6"
							orient="auto-start-reverse"
						>
							<path d="M 0 0 L 10 3 L 0 6 z" fill="#4ade80" />
						</marker>
						<marker
							id="arrow-hate"
							viewBox="0 0 10 6"
							refX="10"
							refY="3"
							markerWidth="8"
							markerHeight="6"
							orient="auto-start-reverse"
						>
							<path d="M 0 0 L 10 3 L 0 6 z" fill="#ef4444" />
						</marker>
					</defs>

					{/*(edges, external relations, shared lineage, nodes, tooltip) */}
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

					{/* Draw shared box for mutual love pairs */}
					{(() => {
						const boxes = [];
						const drawn = new Set();
						const boxOpacity = hovIdx !== null ? 0.05 : 0.7;
						for (let i = 0; i < ordered.length - 1; i++) {
							const a = ordered[i],
								b = ordered[i + 1];
							if (
								a.loves &&
								b.loves &&
								a.loves === b.name &&
								b.loves === a.name &&
								!drawn.has(a.name) &&
								!drawn.has(b.name)
							) {
								const pa = positions[i],
									pb = positions[i + 1];
								const minX = Math.min(pa.x, pb.x) - 36;
								const maxX = Math.max(pa.x, pb.x) + 36;
								const minY = Math.min(pa.y, pb.y) - 36;
								const maxY = Math.max(pa.y, pb.y) + 36;
								boxes.push(
									<rect
										key={`lovebox-${a.name}-${b.name}`}
										x={minX}
										y={minY}
										width={maxX - minX}
										height={maxY - minY}
										rx={22}
										fill="none"
										stroke="#4ade80"
										strokeWidth={4}
										opacity={boxOpacity}
										style={{
											transition: 'opacity 0.45s cubic-bezier(0.4,0,0.2,1)',
										}}
									/>
								);
								drawn.add(a.name);
								drawn.add(b.name);
							}
						}
						return boxes;
					})()}

					{/* (shared lineage, nodes, tooltip) */}
					{hovIdx !== null &&
						(() => {
							const hovCat = ordered[hovIdx];
							const hovAnc = [
								hovCat.parent1,
								hovCat.parent2,
								hovCat.grandparent1,
								hovCat.grandparent2,
								hovCat.grandparent3,
								hovCat.grandparent4,
							].filter(Boolean);
							return ordered.map((other, oi) => {
								if (oi === hovIdx) return null;
								const from = positions[hovIdx],
									to = positions[oi];
								const hovIsParent =
									other.parent1 === hovCat.name ||
									other.parent2 === hovCat.name;
								const otherIsParent =
									hovCat.parent1 === other.name ||
									hovCat.parent2 === other.name;
								if (hovIsParent || otherIsParent) {
									// Draw line from parent to child, and add emoji at each end
									let parentPos, childPos;
									if (hovIsParent) {
										parentPos = from;
										childPos = to;
									} else {
										parentPos = to;
										childPos = from;
									}
									const dx = childPos.x - parentPos.x;
									const dy = childPos.y - parentPos.y;
									const dist = Math.sqrt(dx * dx + dy * dy) || 1;
									const nodeR = 28;
									const emojiPad = 18;
									const x1 = parentPos.x + dx * ((nodeR + emojiPad) / dist);
									const y1 = parentPos.y + dy * ((nodeR + emojiPad) / dist);
									const x2 = childPos.x - dx * (nodeR / dist);
									const y2 = childPos.y - dy * (nodeR / dist);
									return (
										<g key={`kin-${oi}`}>
											<line
												x1={x1}
												y1={y1}
												x2={x2}
												y2={y2}
												stroke="#f97316"
												strokeWidth={3}
												opacity={0.6}
											/>
											{/* Pregnant emoji at parent end */}
											<text
												x={parentPos.x + dx * ((nodeR + emojiPad - 8) / dist)}
												y={
													parentPos.y + dy * ((nodeR + emojiPad - 8) / dist) + 8
												}
												fontSize={22}
												textAnchor="middle"
												dominantBaseline="middle"
												opacity={0.95}
											>
												🤰
											</text>
											{/* Baby emoji at child end - smaller and further from node */}
											<text
												x={childPos.x - dx * ((nodeR + 20) / dist)}
												y={childPos.y - dy * ((nodeR + 20) / dist) + 8}
												fontSize={16}
												textAnchor="middle"
												dominantBaseline="middle"
												opacity={0.95}
											>
												👶
											</text>
											<text
												x={(x1 + x2) / 2}
												y={(y1 + y2) / 2 - 8}
												textAnchor="middle"
												fontSize={9}
												fill="#f97316"
												opacity={0.8}
											>
												parent
											</text>
										</g>
									);
								}
								const otherAnc = [
									other.parent1,
									other.parent2,
									other.grandparent1,
									other.grandparent2,
									other.grandparent3,
									other.grandparent4,
								].filter(Boolean);
								const shared = hovAnc.filter((a) => otherAnc.includes(a));
								if (shared.length === 0) return null;
								const isSibling = shared.some(
									(s) =>
										[hovCat.parent1, hovCat.parent2].includes(s) &&
										[other.parent1, other.parent2].includes(s)
								);
								return (
									<g key={`kin-${oi}`}>
										<line
											x1={from.x}
											y1={from.y}
											x2={to.x}
											y2={to.y}
											stroke={isSibling ? '#fbbf24' : '#a78bfa'}
											strokeWidth={isSibling ? 3 : 2}
											strokeDasharray={isSibling ? 'none' : '8,4'}
											opacity={0.6}
										/>
										<text
											x={(from.x + to.x) / 2}
											y={(from.y + to.y) / 2 - 8}
											textAnchor="middle"
											fontSize={9}
											fill={isSibling ? '#fbbf24' : '#a78bfa'}
											opacity={0.8}
										>
											{isSibling ? 'sibling' : 'related'}
										</text>
									</g>
								);
							});
						})()}

					{positions.map((p, i) => (
						<g
							key={p.name}
							onMouseEnter={() => setHoveredCatId(ordered[i].id)}
							onMouseLeave={() => setHoveredCatId(null)}
							onClick={(e) => {
								e.stopPropagation();
								setSelectedCatId(
									selectedCatId === ordered[i].id ? null : ordered[i].id
								);
							}}
							style={{ cursor: 'pointer', zIndex: 3 }}
						>
							<circle
								cx={p.x}
								cy={p.y}
								r={p.nodeR || 28}
								fill={
									hovIdx === i
										? SEX_BG_HOVER[ordered[i].sex]
										: SEX_BG[ordered[i].sex]
								}
								stroke={SEX_COLOR[ordered[i].sex]}
								strokeWidth={hovIdx === i ? 3.5 : 2.5}
							/>
							<text
								x={p.x}
								y={p.y - 2}
								textAnchor="middle"
								dominantBaseline="middle"
								fill="#fff"
								fontSize={
									ordered[i].name.length > 10
										? 8
										: ordered[i].name.length > 8
											? 9
											: 11
								}
								fontWeight={600}
							>
								{ordered[i].name.length > 14
									? ordered[i].name.slice(0, 13) + '…'
									: ordered[i].name}
							</text>
							<text
								x={p.x}
								y={p.y + 12}
								textAnchor="middle"
								fill={SEX_COLOR[ordered[i].sex]}
								fontSize={10}
							>
								{SEX_ICON[ordered[i].sex] || ordered[i].sex}
							</text>
						</g>
					))}

					{/* Tooltip */}
					{selIdx !== null &&
						(() => {
							const cat = ordered[selIdx],
								pos = positions[selIdx];
							const lines = buildTooltip(cat);
							const tipW = 220,
								tipH = 20 + lines.length * 22;
							let tx = pos.x - tipW / 2,
								ty = pos.y - 40 - tipH;
							if (ty < 5) ty = pos.y + 38;
							if (tx < 5) tx = 5;
							if (tx + tipW > W - 5) tx = W - tipW - 5;
							return (
								<g>
									<rect
										x={tx}
										y={ty}
										width={tipW}
										height={tipH}
										rx={8}
										fill="#1e1e3a"
										stroke="#555"
										strokeWidth={1}
										opacity={0.95}
									/>
									<text
										x={tx + tipW / 2}
										y={ty + 16}
										textAnchor="middle"
										fill="#fff"
										fontSize={12}
										fontWeight={700}
									>
										{cat.name}
									</text>
									{lines.map((line, li) => (
										<g key={li}>
											<text
												x={tx + 10}
												y={ty + 36 + li * 22}
												fill="#888"
												fontSize={10}
											>
												{line.label}:
											</text>
											<text
												x={tx + tipW - 10}
												y={ty + 36 + li * 22}
												textAnchor="end"
												fill="#ddd"
												fontSize={10}
											>
												{line.value}
											</text>
										</g>
									))}
								</g>
							);
						})()}
				</svg>

				{/* Legend bar outside SVG */}
				<div
					style={{
						display: 'flex',
						flexWrap: 'wrap',
						gap: 18,
						alignItems: 'center',
						marginTop: 18,
						background: 'rgba(30,30,58,0.95)',
						borderRadius: 8,
						padding: '8px 18px',
					}}
				>
					<span style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
						<svg width="32" height="8">
							<line
								x1="0"
								y1="4"
								x2="30"
								y2="4"
								stroke="#4ade80"
								strokeWidth="2"
							/>
						</svg>
						<span style={{ color: '#aaa', fontSize: 12 }}>Loves</span>
					</span>
					<span style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
						<svg width="32" height="8">
							<line
								x1="0"
								y1="4"
								x2="30"
								y2="4"
								stroke="#ef4444"
								strokeWidth="2"
								strokeDasharray="6,4"
							/>
						</svg>
						<span style={{ color: '#aaa', fontSize: 12 }}>Hates</span>
					</span>
					<span style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
						<svg width="16" height="16">
							<circle
								cx="8"
								cy="8"
								r="6"
								fill="#3b1a3b"
								stroke="#f472b6"
								strokeWidth="1.5"
							/>
						</svg>
						<span style={{ color: '#aaa', fontSize: 12 }}>Female</span>
					</span>
					<span style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
						<svg width="16" height="16">
							<circle
								cx="8"
								cy="8"
								r="6"
								fill="#1a2a4a"
								stroke="#60a5fa"
								strokeWidth="1.5"
							/>
						</svg>
						<span style={{ color: '#aaa', fontSize: 12 }}>Male</span>
					</span>
					<span style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
						<svg width="16" height="16">
							<circle
								cx="8"
								cy="8"
								r="6"
								fill="#2a1a4a"
								stroke="#c084fc"
								strokeWidth="1.5"
							/>
						</svg>
						<span style={{ color: '#aaa', fontSize: 12 }}>Herm</span>
					</span>
					<span style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
						<svg width="32" height="8">
							<line
								x1="0"
								y1="4"
								x2="30"
								y2="4"
								stroke="#f97316"
								strokeWidth="3"
							/>
						</svg>
						<span style={{ color: '#aaa', fontSize: 12 }}>Parent</span>
					</span>
					<span style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
						<svg width="32" height="8">
							<line
								x1="0"
								y1="4"
								x2="30"
								y2="4"
								stroke="#fbbf24"
								strokeWidth="3"
							/>
						</svg>
						<span style={{ color: '#aaa', fontSize: 12 }}>Sibling</span>
					</span>
					<span style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
						<svg width="32" height="8">
							<line
								x1="0"
								y1="4"
								x2="30"
								y2="4"
								stroke="#a78bfa"
								strokeWidth="2"
								strokeDasharray="8,4"
							/>
						</svg>
						<span style={{ color: '#aaa', fontSize: 12 }}>Related</span>
					</span>
				</div>
			</div>
		</div>
	);
}

export { RelationshipGraph };

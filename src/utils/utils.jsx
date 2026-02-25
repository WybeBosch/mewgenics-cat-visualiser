import { useState } from 'react';
import {
	SEX_ICON,
	SEX_COLOR,
	SEX_BG,
	SEX_BG_HOVER,
} from '../config/config.jsx';

/* ─── Shared tooltip builder ─── */
function buildTooltipLines(cat, allCats) {
	const displayName = (n) => {
		if (!n) return null;
		const found = allCats.find((c) => c.name === n || c.id === n);
		return found ? found.name : n;
	};
	const isParentStray = (c, num) => {
		if (num === 1) return !c.grandparent1 && !c.grandparent2;
		return !c.grandparent3 && !c.grandparent4;
	};
	if (cat.stray) return [{ label: 'Stray', value: 'Yes' }];
	const lines = [];
	if (cat.parent1 || cat.parent2) {
		const p1 = cat.parent1
			? displayName(cat.parent1) + (isParentStray(cat, 1) ? ' (Stray)' : '')
			: '—';
		const p2 = cat.parent2
			? displayName(cat.parent2) + (isParentStray(cat, 2) ? ' (Stray)' : '')
			: '—';
		lines.push({ label: 'Parents', value: `${p1}  ×  ${p2}` });
	}
	const gps = [
		cat.grandparent1,
		cat.grandparent2,
		cat.grandparent3,
		cat.grandparent4,
	];
	if (gps.some((g) => g)) {
		const gpn = gps.map((g) => (g ? displayName(g) : '—'));
		lines.push({ label: 'GP (P1 side)', value: `${gpn[0]}  ×  ${gpn[1]}` });
		lines.push({ label: 'GP (P2 side)', value: `${gpn[2]}  ×  ${gpn[3]}` });
	}
	return lines;
}

/* ─── HTML tooltip for table ─── */
function NameCellTooltip({ cat, allCats }) {
	const [show, setShow] = useState(false);
	const [pos, setPos] = useState({ x: 0, y: 0 });
	const lines = buildTooltipLines(cat, allCats);
	return (
		<td
			style={{
				padding: '10px 12px',
				fontWeight: 600,
				color: '#fff',
				cursor: 'default',
			}}
			onMouseEnter={() => setShow(true)}
			onMouseLeave={() => setShow(false)}
			onMouseMove={(e) => setPos({ x: e.clientX, y: e.clientY })}
		>
			<span style={{ borderBottom: '1px dashed #666' }}>{cat.name}</span>
			{show && (
				<div
					style={{
						position: 'fixed',
						top: pos.y - 10,
						left: pos.x + 16,
						zIndex: 99999,
						transform: 'translateY(-100%)',
						background: '#1e1e3a',
						border: '1px solid #555',
						borderRadius: 8,
						padding: '10px 14px',
						minWidth: 220,
						pointerEvents: 'none',
						boxShadow: '0 4px 16px rgba(0,0,0,0.5)',
					}}
				>
					<div
						style={{
							fontWeight: 700,
							fontSize: 13,
							color: '#fff',
							marginBottom: 6,
						}}
					>
						{cat.name}
					</div>
					{lines.map((line, i) => (
						<div
							key={i}
							style={{
								display: 'flex',
								justifyContent: 'space-between',
								gap: 12,
								fontSize: 11,
								marginBottom: 3,
							}}
						>
							<span style={{ color: '#888' }}>{line.label}:</span>
							<span style={{ color: '#ddd', textAlign: 'right' }}>
								{line.value}
							</span>
						</div>
					))}
				</div>
			)}
		</td>
	);
}

/* ─── Relationship Graph ─── */
function RelationshipGraph({ cats, allCats, hoveredCatId, setHoveredCatId }) {
	if (cats.length === 0)
		return (
			<p style={{ color: '#666', textAlign: 'center', padding: 40 }}>
				No cats in this room yet.
			</p>
		);

	// Reorder cats so mutual love pairs are adjacent
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
		const unpaired = cats.filter((c) => !paired.has(c.id));
		const result = [];
		let uIdx = 0;
		// Interleave pairs with unpaired cats around the circle
		for (const [a, b] of pairs) {
			result.push(a, b);
		}
		for (const c of unpaired) {
			result.push(c);
		}
		return result;
	})();

	const hovered = ordered.findIndex((c) => c.id === hoveredCatId);
	const hovIdx = hovered >= 0 ? hovered : null;

	const W = 800,
		H = 500;
	const cx = W / 2,
		cy = H / 2;
	const radius = Math.min(200, 60 + ordered.length * 12);

	const positions = ordered.map((cat, i) => {
		const angle = (i / ordered.length) * 2 * Math.PI - Math.PI / 2;
		return {
			name: cat.name,
			sex: cat.sex,
			x: cx + radius * Math.cos(angle),
			y: cy + radius * Math.sin(angle),
		};
	});

	const findPos = (name) => {
		if (!name) return null;
		const clean = name.replace(/\s*☠️/g, '').trim().toLowerCase();
		return positions.find((p) => p.name.toLowerCase() === clean);
	};

	const edges = [];
	ordered.forEach((cat) => {
		const from = findPos(cat.name);
		if (!from) return;
		if (cat.loves) {
			const to = findPos(cat.loves);
			if (to) edges.push({ from, to, type: 'love' });
		}
		if (cat.hates) {
			const to = findPos(cat.hates);
			if (to) edges.push({ from, to, type: 'hate' });
		}
	});

	const getPath = (from, to, type) => {
		const dx = to.x - from.x,
			dy = to.y - from.y;
		const dist = Math.sqrt(dx * dx + dy * dy) || 1;
		const nodeR = 28;
		const x1 = from.x + dx * (nodeR / dist),
			y1 = from.y + dy * (nodeR / dist);
		const x2 = from.x + dx * ((dist - nodeR) / dist),
			y2 = from.y + dy * ((dist - nodeR) / dist);
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

	const buildTooltip = (cat) => buildTooltipLines(cat, allCats);

	return (
		<div
			style={{
				background: '#1a1a2e',
				borderRadius: 12,
				border: '1px solid #333',
				padding: 16,
				display: 'flex',
				justifyContent: 'center',
				position: 'relative',
			}}
		>
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

				{edges.map((e, i) => {
					const p = getPath(e.from, e.to, e.type);
					return (
						<path
							key={i}
							d={`M ${p.x1} ${p.y1} Q ${p.cx} ${p.cy} ${p.x2} ${p.y2}`}
							fill="none"
							stroke={e.type === 'love' ? '#4ade80' : '#ef4444'}
							strokeWidth={2}
							strokeDasharray={e.type === 'hate' ? '6,4' : 'none'}
							markerEnd={`url(#arrow-${e.type})`}
							opacity={0.7}
						/>
					);
				})}

				{/* External relations */}
				{ordered.map((cat, i) => {
					const from = positions[i];
					const externals = [];
					if (cat.loves && !findPos(cat.loves))
						externals.push({ label: cat.loves, type: 'love' });
					if (cat.hates && !findPos(cat.hates))
						externals.push({ label: cat.hates, type: 'hate' });
					return externals.map((ext, j) => {
						const angle = Math.atan2(from.y - cy, from.x - cx);
						const outX = from.x + 55 * Math.cos(angle) + j * 20;
						const outY = from.y + 55 * Math.sin(angle) + j * 14;
						const color = ext.type === 'love' ? '#4ade80' : '#ef4444';
						return (
							<g key={`ext-${i}-${j}`}>
								<line
									x1={from.x + 28 * Math.cos(angle)}
									y1={from.y + 28 * Math.sin(angle)}
									x2={outX}
									y2={outY}
									stroke={color}
									strokeWidth={1.5}
									strokeDasharray={ext.type === 'hate' ? '4,3' : 'none'}
									opacity={0.5}
								/>
								<text
									x={outX + 8 * Math.cos(angle)}
									y={outY + 8 * Math.sin(angle)}
									textAnchor="middle"
									fill={color}
									fontSize={11}
									fontStyle="italic"
									dominantBaseline="middle"
								>
									{ext.type === 'love' ? '❤️' : '💔'} {ext.label}
								</text>
							</g>
						);
					});
				})}

				{/* Shared lineage lines on hover */}
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
								other.parent1 === hovCat.name || other.parent2 === hovCat.name;
							const otherIsParent =
								hovCat.parent1 === other.name || hovCat.parent2 === other.name;
							if (hovIsParent || otherIsParent) {
								return (
									<g key={`kin-${oi}`}>
										<line
											x1={from.x}
											y1={from.y}
											x2={to.x}
											y2={to.y}
											stroke="#f97316"
											strokeWidth={3}
											opacity={0.6}
										/>
										<text
											x={(from.x + to.x) / 2}
											y={(from.y + to.y) / 2 - 8}
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
						style={{ cursor: 'pointer' }}
					>
						<circle
							cx={p.x}
							cy={p.y}
							r={28}
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
				{hovIdx !== null &&
					(() => {
						const cat = ordered[hovIdx],
							pos = positions[hovIdx];
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

				<g transform={`translate(16, ${H - 50})`}>
					<line x1={0} y1={0} x2={30} y2={0} stroke="#4ade80" strokeWidth={2} />
					<text x={36} y={4} fill="#aaa" fontSize={11}>
						Loves
					</text>
					<line
						x1={100}
						y1={0}
						x2={130}
						y2={0}
						stroke="#ef4444"
						strokeWidth={2}
						strokeDasharray="6,4"
					/>
					<text x={136} y={4} fill="#aaa" fontSize={11}>
						Hates
					</text>
					<circle
						cx={230}
						cy={0}
						r={6}
						fill="#3b1a3b"
						stroke="#f472b6"
						strokeWidth={1.5}
					/>
					<text x={242} y={4} fill="#aaa" fontSize={11}>
						Female
					</text>
					<circle
						cx={300}
						cy={0}
						r={6}
						fill="#1a2a4a"
						stroke="#60a5fa"
						strokeWidth={1.5}
					/>
					<text x={312} y={4} fill="#aaa" fontSize={11}>
						Male
					</text>
					<circle
						cx={370}
						cy={0}
						r={6}
						fill="#2a1a4a"
						stroke="#c084fc"
						strokeWidth={1.5}
					/>
					<text x={382} y={4} fill="#aaa" fontSize={11}>
						Herm
					</text>
					<line
						x1={440}
						y1={0}
						x2={470}
						y2={0}
						stroke="#f97316"
						strokeWidth={3}
					/>
					<text x={476} y={4} fill="#aaa" fontSize={11}>
						Parent
					</text>
					<line
						x1={540}
						y1={0}
						x2={570}
						y2={0}
						stroke="#fbbf24"
						strokeWidth={3}
					/>
					<text x={576} y={4} fill="#aaa" fontSize={11}>
						Sibling
					</text>
					<line
						x1={640}
						y1={0}
						x2={670}
						y2={0}
						stroke="#a78bfa"
						strokeWidth={2}
						strokeDasharray="8,4"
					/>
					<text x={676} y={4} fill="#aaa" fontSize={11}>
						Related
					</text>
				</g>
			</svg>
		</div>
	);
}

export { buildTooltipLines, NameCellTooltip, RelationshipGraph };

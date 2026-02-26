import { useState } from 'react';

/* ─── Shared tooltip builder ─── */
function sharedTooltipContents(cat, allCats) {
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
	// Partner in other room logic (always last)
	if (cat.loves) {
		const partner = allCats.find(
			(c) => c.name === cat.loves || c.id === cat.loves
		);
		if (partner && partner.room && cat.room && partner.room !== cat.room) {
			lines.push({ label: '—', value: '' }); // separator line
			lines.push({
				label: 'Partner in other room',
				value: `${partner.name}, ${partner.room}`,
			});
		}
	}
	return lines;
}

/* ─── HTML tooltip for table ─── */
function TableTooltipPopup({ cat, allCats }) {
	const [show, setShow] = useState(false);
	const [pos, setPos] = useState({ x: 0, y: 0 });
	const lines = sharedTooltipContents(cat, allCats);
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

function logIfEnabled(...args) {
	const enableLogging = false;
	if (enableLogging) {
		// eslint-disable-next-line no-console
		console.log(...args);
	}
}

export { sharedTooltipContents, TableTooltipPopup, logIfEnabled };

import { useState } from 'react';
import './utils.css';

function logIfEnabled(...args) {
	const enableLogging = import.meta.env.DEV;

	if (enableLogging || window.enableLogging === true) {
		// eslint-disable-next-line no-console
		console.log(...args);
	}
}

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
			className="tooltip-popup"
			onMouseEnter={() => setShow(true)}
			onMouseLeave={() => setShow(false)}
			onMouseMove={(e) => setPos({ x: e.clientX, y: e.clientY })}
		>
			<span className="name">{cat.name}</span>
			{show && (
				<div
					className="panel"
					style={{
						top: pos.y - 10,
						left: pos.x + 16,
					}}
				>
					<div className="title">{cat.name}</div>
					{lines.map((line, i) => (
						<div key={i} className="line">
							<span className="label">{line.label}:</span>
							<span className="value">{line.value}</span>
						</div>
					))}
				</div>
			)}
		</td>
	);
}

export { sharedTooltipContents, TableTooltipPopup, logIfEnabled };

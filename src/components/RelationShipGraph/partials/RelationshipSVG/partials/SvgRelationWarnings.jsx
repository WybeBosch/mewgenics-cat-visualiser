import { useMemo, useState } from 'react';

import {
	getParentNames,
	isParentChild,
	isRelated,
	isSibling,
	normalizeLineageName,
} from './SvgRelationLogic.jsx';

function getCatKey(cat, index) {
	return cat.id ?? `${cat.name || 'Unknown'}-${index}`;
}

function getCatDisplayName(cat) {
	const name = String(cat?.name || '').trim();
	return name || 'Unknown cat';
}

function toSortedNames(catMap, keySet) {
	return [...keySet]
		.map((key) => catMap.get(key))
		.filter(Boolean)
		.sort((a, b) => a.localeCompare(b, undefined, { sensitivity: 'base' }));
}

function addRelatedName(relatedMap, key, relatedName) {
	if (!relatedMap.has(key)) {
		relatedMap.set(key, new Set());
	}
	relatedMap.get(key).add(relatedName);
}

function toSortedRows(catMap, keySet, roleMap) {
	return [...keySet]
		.map((key) => {
			const name = catMap.get(key);
			const roles = roleMap?.get(key) || new Set();
			const isParent = roles.has('parent');
			const isChild = roles.has('child');
			const prefix = `${isParent ? '🤰' : ''}${isChild ? '👶' : ''}`;

			return {
				key,
				name,
				label: prefix ? `${prefix} ${name}` : name,
			};
		})
		.filter((item) => Boolean(item.name))
		.sort((a, b) =>
			a.name.localeCompare(b.name, undefined, { sensitivity: 'base' })
		);
}

function toSortedRelatedLookup(relatedMap) {
	const lookup = new Map();

	for (const [key, values] of relatedMap.entries()) {
		lookup.set(
			key,
			[...values].sort((a, b) =>
				a.localeCompare(b, undefined, { sensitivity: 'base' })
			)
		);
	}

	return lookup;
}

function getParentChildDirection(a, b) {
	const aParents = getParentNames(a);
	const bParents = getParentNames(b);
	const aName = normalizeLineageName(a.name);
	const bName = normalizeLineageName(b.name);

	return {
		aIsParent: bParents.includes(aName),
		bIsParent: aParents.includes(bName),
	};
}

function getWarningBuckets(cats = []) {
	const catMap = new Map();
	cats.forEach((cat, index) => {
		catMap.set(getCatKey(cat, index), getCatDisplayName(cat));
	});

	const siblings = new Set();
	const parentChild = new Set();
	const distantlyRelated = new Set();
	const parentChildRoles = new Map();
	const siblingRelatedMap = new Map();
	const parentChildRelatedMap = new Map();
	const distantlyRelatedMap = new Map();

	for (let i = 0; i < cats.length; i++) {
		const a = cats[i];
		const aKey = getCatKey(a, i);

		for (let j = i + 1; j < cats.length; j++) {
			const b = cats[j];
			const bKey = getCatKey(b, j);

			if (isParentChild(a, b)) {
				parentChild.add(aKey);
				parentChild.add(bKey);

				const direction = getParentChildDirection(a, b);

				if (direction.aIsParent) {
					if (!parentChildRoles.has(aKey)) {
						parentChildRoles.set(aKey, new Set());
					}
					parentChildRoles.get(aKey).add('parent');

					if (!parentChildRoles.has(bKey)) {
						parentChildRoles.set(bKey, new Set());
					}
					parentChildRoles.get(bKey).add('child');

					addRelatedName(parentChildRelatedMap, aKey, `👶 ${catMap.get(bKey)}`);
					addRelatedName(parentChildRelatedMap, bKey, `🤰 ${catMap.get(aKey)}`);
				}

				if (direction.bIsParent) {
					if (!parentChildRoles.has(bKey)) {
						parentChildRoles.set(bKey, new Set());
					}
					parentChildRoles.get(bKey).add('parent');

					if (!parentChildRoles.has(aKey)) {
						parentChildRoles.set(aKey, new Set());
					}
					parentChildRoles.get(aKey).add('child');

					addRelatedName(parentChildRelatedMap, bKey, `👶 ${catMap.get(aKey)}`);
					addRelatedName(parentChildRelatedMap, aKey, `🤰 ${catMap.get(bKey)}`);
				}

				continue;
			}

			if (isSibling(a, b)) {
				siblings.add(aKey);
				siblings.add(bKey);
				addRelatedName(siblingRelatedMap, aKey, catMap.get(bKey));
				addRelatedName(siblingRelatedMap, bKey, catMap.get(aKey));
				continue;
			}

			if (isRelated(a, b)) {
				distantlyRelated.add(aKey);
				distantlyRelated.add(bKey);
				addRelatedName(distantlyRelatedMap, aKey, catMap.get(bKey));
				addRelatedName(distantlyRelatedMap, bKey, catMap.get(aKey));
			}
		}
	}

	return {
		siblings: {
			rows: toSortedRows(catMap, siblings),
			relatedLookup: toSortedRelatedLookup(siblingRelatedMap),
		},
		parentChild: {
			rows: toSortedRows(catMap, parentChild, parentChildRoles),
			relatedLookup: toSortedRelatedLookup(parentChildRelatedMap),
		},
		distantlyRelated: {
			rows: toSortedRows(catMap, distantlyRelated),
			relatedLookup: toSortedRelatedLookup(distantlyRelatedMap),
		},
	};
}

function WarningPill({
	categoryKey,
	count,
	label,
	rows,
	relatedLookup,
	isOpen,
	onOpen,
	onClose,
	background,
	color,
	popupTitle,
}) {
	if (count < 1) {
		return null;
	}

	const [hoveredRowKey, setHoveredRowKey] = useState('');
	const hoveredRow = rows.find((row) => row.key === hoveredRowKey);
	const hoveredRelated = hoveredRowKey
		? relatedLookup.get(hoveredRowKey) || []
		: [];

	return (
		<div
			style={{ position: 'relative', display: 'inline-flex' }}
			onMouseEnter={() => onOpen(categoryKey)}
			onMouseLeave={() => {
				setHoveredRowKey('');
				onClose();
			}}
			onFocus={() => onOpen(categoryKey)}
			onBlur={() => {
				setHoveredRowKey('');
				onClose();
			}}
		>
			<span
				tabIndex={0}
				style={{
					background,
					color,
					borderRadius: 999,
					padding: '4px 10px',
					cursor: 'default',
					outline: 'none',
				}}
			>
				{count} cats are {label}
			</span>
			{isOpen ? (
				<div
					style={{
						position: 'absolute',
						top: '100%',
						left: 0,
						zIndex: 20,
						minWidth: 260,
						maxWidth: 320,
						padding: '10px 12px',
						borderRadius: 10,
						background: '#0b1220',
						border: '1px solid #2f3b55',
						boxShadow: '0 10px 30px rgba(0,0,0,0.35)',
						color: '#e5e7eb',
						fontSize: 12,
						lineHeight: 1.4,
					}}
				>
					{hoveredRow ? (
						<div
							style={{
								position: 'absolute',
								top: 'calc(100% + 8px)',
								left: 0,
								zIndex: 30,
								minWidth: 220,
								maxWidth: 280,
								padding: '8px 10px',
								borderRadius: 8,
								background: '#090f1a',
								border: '1px solid #334155',
								boxShadow: '0 10px 24px rgba(0,0,0,0.35)',
								color: '#e5e7eb',
							}}
						>
							<div
								style={{
									fontSize: 11,
									fontWeight: 700,
									color: '#cbd5e1',
									marginBottom: 6,
									paddingBottom: 6,
									borderBottom: '1px solid #334155',
								}}
							>
								{hoveredRow.label} related to
							</div>
							<div
								style={{
									display: 'grid',
									gap: 4,
									maxHeight: 180,
									overflowY: 'auto',
									fontSize: 12,
								}}
							>
								{hoveredRelated.map((relatedName) => (
									<div key={`${hoveredRow.key}-${relatedName}`}>
										{relatedName}
									</div>
								))}
							</div>
						</div>
					) : null}

					<div style={{ fontWeight: 700, marginBottom: 8 }}>{popupTitle}</div>
					<div
						style={{
							margin: 0,
							padding: 0,
							display: 'grid',
							gap: 0,
							maxHeight: 220,
							overflowY: 'auto',
						}}
					>
						{rows.map((row, index) => (
							<div
								key={`${categoryKey}-${row.key}`}
								style={{
									padding: '6px 8px',
									display: 'flex',
									alignItems: 'center',
									gap: 8,
									position: 'relative',
									borderTop: '1px solid #2f3b55',
									borderBottom: '1px solid #2f3b55',
								}}
								onMouseEnter={() => setHoveredRowKey(row.key)}
							>
								<span
									style={{
										paddingRight: 8,
										borderRight: '1px solid #2f3b55',
										minWidth: 24,
										textAlign: 'right',
										color: '#9ca3af',
									}}
								>
									{index + 1}
								</span>
								<span>{row.label}</span>
							</div>
						))}
					</div>
				</div>
			) : null}
		</div>
	);
}

function SvgRelationWarnings({ cats = [] }) {
	const [hoveredCategory, setHoveredCategory] = useState('');
	const warningBuckets = useMemo(() => getWarningBuckets(cats), [cats]);

	return (
		<div
			style={{
				display: 'flex',
				alignItems: 'center',
				gap: 8,
				flexWrap: 'wrap',
				fontSize: 13,
			}}
		>
			<span style={{ color: '#fca5a5', fontWeight: 600 }}>
				🚨 Inbreeding alert!
			</span>

			<WarningPill
				categoryKey="siblings"
				count={warningBuckets.siblings.rows.length}
				label="sibling"
				rows={warningBuckets.siblings.rows}
				relatedLookup={warningBuckets.siblings.relatedLookup}
				isOpen={hoveredCategory === 'siblings'}
				onOpen={setHoveredCategory}
				onClose={() => setHoveredCategory('')}
				background="#7c2d12"
				color="#fdba74"
				popupTitle={`Which ${warningBuckets.siblings.rows.length} cats are siblings`}
			/>

			<WarningPill
				categoryKey="parent-child"
				count={warningBuckets.parentChild.rows.length}
				label="child/parent"
				rows={warningBuckets.parentChild.rows}
				relatedLookup={warningBuckets.parentChild.relatedLookup}
				isOpen={hoveredCategory === 'parent-child'}
				onOpen={setHoveredCategory}
				onClose={() => setHoveredCategory('')}
				background="#78350f"
				color="#fde68a"
				popupTitle={`Which ${warningBuckets.parentChild.rows.length} cats are child/parent`}
			/>

			<WarningPill
				categoryKey="distantly-related"
				count={warningBuckets.distantlyRelated.rows.length}
				label="distantly related"
				rows={warningBuckets.distantlyRelated.rows}
				relatedLookup={warningBuckets.distantlyRelated.relatedLookup}
				isOpen={hoveredCategory === 'distantly-related'}
				onOpen={setHoveredCategory}
				onClose={() => setHoveredCategory('')}
				background="#312e81"
				color="#c4b5fd"
				popupTitle={`Which ${warningBuckets.distantlyRelated.rows.length} cats are distantly related`}
			/>
		</div>
	);
}

export default SvgRelationWarnings;

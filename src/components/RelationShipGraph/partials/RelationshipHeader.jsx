import { useMemo } from 'react';

import { getFamilySummary } from './RelationshipSVG/partials/SvgRelationLogic.jsx';

function RelationshipHeader({ activeRoom, cats = [] }) {
	const familySummary = useMemo(() => getFamilySummary(cats), [cats]);

	const {
		siblings = 0,
		parentChild = 0,
		distantlyRelated = 0,
		hasFamily = false,
	} = familySummary || {};

	return (
		<div style={{ marginBottom: 16 }}>
			<h2
				style={{
					fontSize: 20,
					fontWeight: 700,
					color: '#fff',
					marginBottom: 4,
				}}
			>
				💞 {activeRoom} — Relationships
			</h2>
			{hasFamily ? (
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
					<span
						style={{
							background: '#7c2d12',
							color: '#fdba74',
							borderRadius: 999,
							padding: '4px 10px',
						}}
					>
						{siblings} cats are sibling
					</span>
					<span
						style={{
							background: '#78350f',
							color: '#fde68a',
							borderRadius: 999,
							padding: '4px 10px',
						}}
					>
						{parentChild} cats are child/parent
					</span>
					<span
						style={{
							background: '#312e81',
							color: '#c4b5fd',
							borderRadius: 999,
							padding: '4px 10px',
						}}
					>
						{distantlyRelated} cats are distantly related
					</span>
				</div>
			) : (
				<span
					style={{
						fontSize: 13,
						color: '#b7bdd0',
						display: 'block',
					}}
				>
					There is no family in this room.
				</span>
			)}
		</div>
	);
}

export default RelationshipHeader;

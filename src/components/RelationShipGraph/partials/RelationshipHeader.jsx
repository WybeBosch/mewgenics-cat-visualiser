import { useMemo } from 'react';

import { getFamilySummary } from './RelationshipSVG/partials/SvgRelationLogic.jsx';
import SvgRelationWarnings from './RelationshipSVG/partials/SvgRelationWarnings.jsx';

function RelationshipHeader({ activeRoom, cats = [] }) {
	const familySummary = useMemo(() => getFamilySummary(cats), [cats]);

	const { hasFamily = false } = familySummary || {};

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
				<SvgRelationWarnings cats={cats} />
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

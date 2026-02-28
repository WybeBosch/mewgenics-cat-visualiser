import { useMemo } from 'react';

import { getFamilySummary } from './RelationshipSVG/partials/SvgRelationLogic.jsx';
import SvgRelationWarnings from './RelationshipSVG/partials/SvgRelationWarnings.jsx';
import './RelationshipHeader.css';

function RelationshipHeader({ activeRoom, cats = [] }) {
	const familySummary = useMemo(() => getFamilySummary(cats), [cats]);

	const { hasFamily = false } = familySummary || {};

	return (
		<div className="relationship-header">
			<h2 className="title">💞 {activeRoom} — Relationships</h2>
			{hasFamily ? (
				<SvgRelationWarnings cats={cats} />
			) : (
				<span className="empty-state">There is no family in this room.</span>
			)}
		</div>
	);
}

export default RelationshipHeader;

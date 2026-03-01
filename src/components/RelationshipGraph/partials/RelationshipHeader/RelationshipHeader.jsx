import { useMemo } from 'react';

import { getFamilySummary } from '../RelationshipSVG/partials/SvgRelationLogic.jsx';
import SvgRelationWarnings from '../RelationshipSVG/partials/SvgRelationWarnings/SvgRelationWarnings.jsx';
import './RelationshipHeader.css';

function RelationshipHeader({ activeRoom, cats = [], allCats = [] }) {
	const familySummary = useMemo(() => getFamilySummary(cats), [cats]);

	const { hasFamily = false } = familySummary || {};

	return (
		<header className="graph-header">
			<h2 className="title">💞 {activeRoom} — Relationships</h2>
			{hasFamily ? (
				<SvgRelationWarnings cats={cats} allCats={allCats} />
			) : (
				<span className="empty-state">There is no family in this room.</span>
			)}
		</header>
	);
}

export default RelationshipHeader;

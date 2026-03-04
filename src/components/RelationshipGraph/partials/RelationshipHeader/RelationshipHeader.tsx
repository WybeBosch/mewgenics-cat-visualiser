import { useMemo } from 'react';

import type { CatRecord } from '../../../../AppLogic.types.ts';
import { getFamilySummary } from '../RelationshipSVG/partials/SvgRelationLogic.tsx';
import SvgRelationWarnings from '../RelationshipSVG/partials/SvgRelationWarnings/SvgRelationWarnings.tsx';
import './RelationshipHeader.css';

function RelationshipHeader({
	activeRoom,
	cats = [],
	allCats = [],
}: {
	activeRoom: string;
	cats?: CatRecord[];
	allCats?: CatRecord[];
}) {
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

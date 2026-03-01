import { useCallback, useState } from 'react';

import RelationshipHeader from './partials/RelationshipHeader/RelationshipHeader.jsx';
import RelationshipLegendBar from './partials/RelationshipLegendBar/RelationshipLegendBar.jsx';
import RelationshipSVG from './partials/RelationshipSVG/RelationshipSVG.jsx';
import './RelationshipGraph.css';

function RelationshipGraph({ cats, allCats, hoveredCatId, setHoveredCatId, activeRoom }) {
	const [hiddenLineTypes, setHiddenLineTypes] = useState(
		() => new Set(['grandparent', 'related', 'inbreeding'])
	);

	const toggleLineType = useCallback((type) => {
		setHiddenLineTypes((prev) => {
			const next = new Set(prev);
			if (next.has(type)) next.delete(type);
			else next.add(type);
			return next;
		});
	}, []);

	if (cats.length === 0) return '';

	return (
		<section className="section-relationships">
			<RelationshipHeader activeRoom={activeRoom} cats={cats} />
			<div className="panel">
				<RelationshipSVG
					cats={cats}
					allCats={allCats}
					hoveredCatId={hoveredCatId}
					setHoveredCatId={setHoveredCatId}
					hiddenLineTypes={hiddenLineTypes}
				/>
				<RelationshipLegendBar
					hiddenLineTypes={hiddenLineTypes}
					onToggle={toggleLineType}
				/>
			</div>
		</section>
	);
}

export { RelationshipGraph };

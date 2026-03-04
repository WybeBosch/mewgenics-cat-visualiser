import { useCallback, useState } from 'react';

import RelationshipHeader from './partials/RelationshipHeader/RelationshipHeader.tsx';
import RelationshipLegendBar from './partials/RelationshipLegendBar/RelationshipLegendBar.tsx';
import RelationshipSVG from './partials/RelationshipSVG/RelationshipSVG.tsx';
import type { HiddenLineType, RelationshipGraphProps } from './RelationshipGraph.types.ts';
import './RelationshipGraph.css';

function RelationshipGraph({
	cats,
	allCats,
	hoveredCatId,
	setHoveredCatId,
	activeRoom,
}: RelationshipGraphProps) {
	const [hiddenLineTypes, setHiddenLineTypes] = useState<Set<HiddenLineType | string>>(
		() => new Set(['grandparent', 'related'])
	);

	const toggleLineType = useCallback((type: HiddenLineType | string) => {
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
			<RelationshipHeader activeRoom={activeRoom} cats={cats} allCats={allCats} />
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

import RelationshipHeader from './partials/RelationshipHeader/RelationshipHeader.jsx';
import RelationshipLegendBar from './partials/RelationshipLegendBar/RelationshipLegendBar.jsx';
import RelationshipSVG from './partials/RelationshipSVG/RelationshipSVG.jsx';
import './RelationshipGraph.css';

function RelationshipGraph({
	cats,
	allCats,
	hoveredCatId,
	setHoveredCatId,
	getAge,
	activeRoom,
}) {
	if (cats.length === 0) return '';

	return (
		<div className="relationship-graph">
			<RelationshipHeader activeRoom={activeRoom} cats={cats} />
			<div className="panel">
				<RelationshipSVG
					cats={cats}
					allCats={allCats}
					hoveredCatId={hoveredCatId}
					setHoveredCatId={setHoveredCatId}
					getAge={getAge}
				/>
				<RelationshipLegendBar />
			</div>
		</div>
	);
}

export { RelationshipGraph };

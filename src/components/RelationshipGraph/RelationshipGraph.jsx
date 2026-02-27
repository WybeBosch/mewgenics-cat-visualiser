import RelationshipHeader from './partials/RelationshipHeader.jsx';
import RelationshipLegendBar from './partials/RelationshipLegendBar.jsx';
import RelationshipSVG from './partials/RelationshipSVG/RelationshipSVG.jsx';

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
		<div style={{ marginTop: 32 }}>
			<RelationshipHeader activeRoom={activeRoom} cats={cats} />
			<div
				style={{
					background: '#1a1a2e',
					borderRadius: 12,
					border: '1px solid #333',
					padding: 16,
					display: 'flex',
					flexDirection: 'column',
					alignItems: 'center',
					position: 'relative',
				}}
			>
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

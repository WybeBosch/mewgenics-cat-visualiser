import './RelationshipLegendBar.css';

function RelationshipLegendBar() {
	return (
		<aside className="graph-legend" aria-label="Relationship legend">
			<span className="item">
				<svg width="32" height="8">
					<line
						className="legend-line-love"
						x1="0"
						y1="4"
						x2="30"
						y2="4"
						strokeWidth="2"
					/>
				</svg>
				<span className="label">Loves</span>
			</span>
			<span className="item">
				<svg width="32" height="8">
					<line
						className="legend-line-hate"
						x1="0"
						y1="4"
						x2="30"
						y2="4"
						strokeWidth="2"
						strokeDasharray="6,4"
					/>
				</svg>
				<span className="label">Hates</span>
			</span>
			<span className="item">
				<svg width="16" height="16">
					<circle className="legend-node-female" cx="8" cy="8" r="6" strokeWidth="1.5" />
				</svg>
				<span className="label">Female</span>
			</span>
			<span className="item">
				<svg width="16" height="16">
					<circle className="legend-node-male" cx="8" cy="8" r="6" strokeWidth="1.5" />
				</svg>
				<span className="label">Male</span>
			</span>
			<span className="item">
				<svg width="16" height="16">
					<circle className="legend-node-herm" cx="8" cy="8" r="6" strokeWidth="1.5" />
				</svg>
				<span className="label">Herm</span>
			</span>
			<span className="item">
				<svg width="32" height="8">
					<line
						className="legend-line-parent"
						x1="0"
						y1="4"
						x2="30"
						y2="4"
						strokeWidth="3"
					/>
				</svg>
				<span className="label">Parent</span>
			</span>
			<span className="item">
				<svg width="32" height="8">
					<line
						className="legend-line-grandparent"
						x1="0"
						y1="4"
						x2="30"
						y2="4"
						strokeWidth="2"
						strokeDasharray="6,3"
					/>
				</svg>
				<span className="label">Grandparent</span>
			</span>
			<span className="item">
				<svg width="32" height="8">
					<line
						className="legend-line-sibling"
						x1="0"
						y1="4"
						x2="30"
						y2="4"
						strokeWidth="3"
					/>
				</svg>
				<span className="label">Sibling</span>
			</span>
			<span className="item">
				<svg width="32" height="8">
					<line
						className="legend-line-related"
						x1="0"
						y1="4"
						x2="30"
						y2="4"
						strokeWidth="2"
						strokeDasharray="8,4"
					/>
				</svg>
				<span className="label">Related</span>
			</span>
		</aside>
	);
}

export default RelationshipLegendBar;

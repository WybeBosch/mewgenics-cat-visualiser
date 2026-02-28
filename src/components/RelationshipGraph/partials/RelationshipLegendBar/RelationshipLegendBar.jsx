import './RelationshipLegendBar.css';

function RelationshipLegendBar() {
	return (
		<div className="relationship-legend-bar">
			<span className="item">
				<svg width="32" height="8">
					<line x1="0" y1="4" x2="30" y2="4" stroke="#4ade80" strokeWidth="2" />
				</svg>
				<span className="label">Loves</span>
			</span>
			<span className="item">
				<svg width="32" height="8">
					<line
						x1="0"
						y1="4"
						x2="30"
						y2="4"
						stroke="#ef4444"
						strokeWidth="2"
						strokeDasharray="6,4"
					/>
				</svg>
				<span className="label">Hates</span>
			</span>
			<span className="item">
				<svg width="16" height="16">
					<circle cx="8" cy="8" r="6" fill="#3b1a3b" stroke="#f472b6" strokeWidth="1.5" />
				</svg>
				<span className="label">Female</span>
			</span>
			<span className="item">
				<svg width="16" height="16">
					<circle cx="8" cy="8" r="6" fill="#1a2a4a" stroke="#60a5fa" strokeWidth="1.5" />
				</svg>
				<span className="label">Male</span>
			</span>
			<span className="item">
				<svg width="16" height="16">
					<circle cx="8" cy="8" r="6" fill="#2a1a4a" stroke="#c084fc" strokeWidth="1.5" />
				</svg>
				<span className="label">Herm</span>
			</span>
			<span className="item">
				<svg width="32" height="8">
					<line x1="0" y1="4" x2="30" y2="4" stroke="#f97316" strokeWidth="3" />
				</svg>
				<span className="label">Parent</span>
			</span>
			<span className="item">
				<svg width="32" height="8">
					<line x1="0" y1="4" x2="30" y2="4" stroke="#fbbf24" strokeWidth="3" />
				</svg>
				<span className="label">Sibling</span>
			</span>
			<span className="item">
				<svg width="32" height="8">
					<line
						x1="0"
						y1="4"
						x2="30"
						y2="4"
						stroke="#a78bfa"
						strokeWidth="2"
						strokeDasharray="8,4"
					/>
				</svg>
				<span className="label">Related</span>
			</span>
		</div>
	);
}

export default RelationshipLegendBar;

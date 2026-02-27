function RelationshipLegendBar() {
	return (
		<div
			style={{
				display: 'flex',
				flexWrap: 'wrap',
				gap: 18,
				alignItems: 'center',
				marginTop: 18,
				background: 'rgba(30,30,58,0.95)',
				borderRadius: 8,
				padding: '8px 18px',
			}}
		>
			<span style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
				<svg width="32" height="8">
					<line x1="0" y1="4" x2="30" y2="4" stroke="#4ade80" strokeWidth="2" />
				</svg>
				<span style={{ color: '#aaa', fontSize: 12 }}>Loves</span>
			</span>
			<span style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
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
				<span style={{ color: '#aaa', fontSize: 12 }}>Hates</span>
			</span>
			<span style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
				<svg width="16" height="16">
					<circle
						cx="8"
						cy="8"
						r="6"
						fill="#3b1a3b"
						stroke="#f472b6"
						strokeWidth="1.5"
					/>
				</svg>
				<span style={{ color: '#aaa', fontSize: 12 }}>Female</span>
			</span>
			<span style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
				<svg width="16" height="16">
					<circle
						cx="8"
						cy="8"
						r="6"
						fill="#1a2a4a"
						stroke="#60a5fa"
						strokeWidth="1.5"
					/>
				</svg>
				<span style={{ color: '#aaa', fontSize: 12 }}>Male</span>
			</span>
			<span style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
				<svg width="16" height="16">
					<circle
						cx="8"
						cy="8"
						r="6"
						fill="#2a1a4a"
						stroke="#c084fc"
						strokeWidth="1.5"
					/>
				</svg>
				<span style={{ color: '#aaa', fontSize: 12 }}>Herm</span>
			</span>
			<span style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
				<svg width="32" height="8">
					<line x1="0" y1="4" x2="30" y2="4" stroke="#f97316" strokeWidth="3" />
				</svg>
				<span style={{ color: '#aaa', fontSize: 12 }}>Parent</span>
			</span>
			<span style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
				<svg width="32" height="8">
					<line x1="0" y1="4" x2="30" y2="4" stroke="#fbbf24" strokeWidth="3" />
				</svg>
				<span style={{ color: '#aaa', fontSize: 12 }}>Sibling</span>
			</span>
			<span style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
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
				<span style={{ color: '#aaa', fontSize: 12 }}>Related</span>
			</span>
		</div>
	);
}

export default RelationshipLegendBar;

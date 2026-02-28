export default function SvgMarkers() {
	return (
		<defs>
			<marker
				id="arrow-love"
				viewBox="0 0 10 6"
				refX="10"
				refY="3"
				markerWidth="8"
				markerHeight="6"
				orient="auto-start-reverse"
			>
				<path d="M 0 0 L 10 3 L 0 6 z" fill="#4ade80" />
			</marker>
			<marker
				id="arrow-hate"
				viewBox="0 0 10 6"
				refX="10"
				refY="3"
				markerWidth="8"
				markerHeight="6"
				orient="auto-start-reverse"
			>
				<path d="M 0 0 L 10 3 L 0 6 z" fill="#ef4444" />
			</marker>
		</defs>
	);
}

export default function TooltipCloseArea({ selectedCatId, setSelectedCatId }) {
	return (
		<>
			{/* Overlay to close tooltip on outside click */}
			{selectedCatId !== null && (
				<rect
					className="tooltip-close-area"
					x={0}
					y={0}
					width="100%"
					height="100%"
					fill="transparent"
					onClick={() => setSelectedCatId(null)}
				/>
			)}
		</>
	);
}

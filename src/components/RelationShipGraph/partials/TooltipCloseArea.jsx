export default function TooltipCloseArea({ selectedCatId, setSelectedCatId }) {
	return (
		<>
			{/* Overlay to close tooltip on outside click */}
			{selectedCatId !== null && (
				<div
					onClick={() => setSelectedCatId(null)}
					style={{
						position: 'absolute',
						left: 0,
						top: 0,
						width: '100%',
						height: '100%',
						zIndex: 2,
						background: 'transparent',
					}}
				/>
			)}
		</>
	);
}

import { useState } from 'react';

export function ButtonCopySavePath() {
	const [showPopup, setShowPopup] = useState(false);
	const [fadeOut, setFadeOut] = useState(false);
	const savePath = '%APPDATA%/Glaiel Games/Mewgenics';

	const handleCopy = async () => {
		try {
			await navigator.clipboard.writeText(savePath);
			setShowPopup(true);
			setFadeOut(false);
			setTimeout(() => setFadeOut(true), 900); // Start fade out after 900ms
			setTimeout(() => setShowPopup(false), 1300); // Hide after fade
		} catch (e) {
			alert('Failed to copy');
		}
	};

	return (
		<div style={{ position: 'absolute', top: '100%', width: 'fit-content' }}>
			<button
				onClick={handleCopy}
				style={{
					background: '#374151',
					color: '#fff',
					border: 'none',
					fontStyle: 'italic',
					borderRadius: 6,
					padding: '4px 10px',
					fontSize: 13,
					cursor: 'pointer',
					marginTop: 5,
					fontWeight: 500,
					opacity: 0.85,
					transition: 'background 0.2s',
				}}
			>
				📁 Copy Save Path
			</button>
			<div
				style={{
					position: 'absolute',
					left: '50%',
					top: '110%',
					transform: 'translateX(-50%)',
					background: '#374151',
					color: '#fff',
					borderRadius: 6,
					padding: '4px 12px',
					fontSize: 13,
					opacity: showPopup && !fadeOut ? 1 : 0,
					pointerEvents: 'none',
					boxShadow: '0 2px 8px rgba(0,0,0,0.18)',
					transition: 'opacity 0.4s',
					zIndex: 10,
				}}
			>
				Copied to clipboard!
			</div>
		</div>
	);
}

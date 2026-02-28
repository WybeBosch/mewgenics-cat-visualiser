import { useState } from 'react';
import './ButtonCopySavePath.css';

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
		<div className="button-copy-save-path">
			<button onClick={handleCopy} className="button">
				📁 Copy Save Path
			</button>
			<div className="popup" aria-hidden={!(showPopup && !fadeOut)}>
				Copied to clipboard!
			</div>
		</div>
	);
}

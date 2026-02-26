import { useState } from 'react';

function ButtonCopySavePath() {
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
export function ButtonUploadSave({ onUploadSav, savLoading, savError }) {
	const buttonName = 'button-upload-save';
	return (
		<>
			<div
				className={`${buttonName}--wrapper`}
				style={{
					position: 'relative',
					display: 'flex',
					flexDirection: 'column',
					alignItems: 'center',
					justifyContent: 'center',
				}}
			>
				<label
					className={buttonName}
					style={{
						display: 'flex',
						alignItems: 'center',
						background: savLoading ? '#1f2937' : '#374151',
						color: savLoading ? '#9ca3af' : '#fff',
						border: 'none',
						borderRadius: 8,
						padding: '10px 16px',
						cursor: savLoading ? 'not-allowed' : 'pointer',
						fontWeight: 600,
						fontSize: 14,
						marginRight: 0,
					}}
				>
					<span role="img" aria-label="Save File" style={{ marginRight: 6 }}>
						{savLoading ? '⏳' : '💾'}
					</span>
					{savLoading ? 'Reading...' : 'Upload Save File'}
					<input
						type="file"
						accept=".sav"
						disabled={savLoading}
						style={{ display: 'none' }}
						onChange={(e) => {
							const file = e.target.files?.[0];
							if (file) {
								if (!file.name.endsWith('.sav')) {
									alert('Please upload a .sav file for the database.');
								} else {
									onUploadSav?.(file);
								}
							}
							e.target.value = '';
						}}
					/>
				</label>
				<ButtonCopySavePath />
			</div>
			{savError && (
				<span style={{ color: '#f87171', fontSize: 12, maxWidth: 220 }}>
					{savError}
				</span>
			)}
		</>
	);
}

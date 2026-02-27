import { ButtonCopySavePath } from './ButtonCopySavePath.jsx';
import { SECURITY_LIMITS } from '../../../config/config.jsx';

export function ButtonUploadSave({ onUploadSav, savLoading, savError }) {
	const buttonName = 'button-upload-save';
	const maxSaveUploadBytes = SECURITY_LIMITS.maxSaveUploadKb * 1024;
	const maxSaveSizeMb = Math.round(SECURITY_LIMITS.maxSaveUploadKb / 1024);
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
						justifyContent: 'center',
						background: savLoading ? '#1f2937' : '#374151',
						color: savLoading ? '#9ca3af' : '#fff',
						border: 'none',
						borderRadius: 8,
						padding: '10px 16px',
						cursor: savLoading ? 'not-allowed' : 'pointer',
						fontWeight: 600,
						fontSize: 14,
						marginRight: 0,
						minWidth: '155px',
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
								} else if (file.size > maxSaveUploadBytes) {
									alert(
										`Save file is too large. Max allowed size is ${maxSaveSizeMb} MB.`
									);
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

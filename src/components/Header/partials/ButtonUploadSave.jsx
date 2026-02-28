import { ButtonCopySavePath } from './ButtonCopySavePath.jsx';
import { SECURITY_LIMITS } from '../../../config/config.jsx';
import './ButtonUploadSave.css';

export function ButtonUploadSave({ onUploadSav, savLoading, savError }) {
	const maxSaveUploadBytes = SECURITY_LIMITS.maxSaveUploadKb * 1024;
	const maxSaveSizeMb = Math.round(SECURITY_LIMITS.maxSaveUploadKb / 1024);
	return (
		<>
			<div className="upload-save-wrap">
				<label className={`upload-save ${savLoading ? 'loading' : ''}`}>
					<span role="img" aria-label="Save File" className="icon">
						{savLoading ? '⏳' : '💾'}
					</span>
					{savLoading ? 'Reading...' : 'Upload Save File'}
					<input
						type="file"
						accept=".sav"
						disabled={savLoading}
						className="input"
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
			{savError && <span className="upload-save-error">{savError}</span>}
		</>
	);
}

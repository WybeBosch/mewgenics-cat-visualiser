export function ButtonUploadJson({ onUploadJson }) {
	return (
		<>
			<label
				className="button-upload-json"
				style={{
					display: 'flex',
					alignItems: 'center',
					background: '#374151',
					color: '#fff',
					border: 'none',
					borderRadius: 8,
					padding: '10px 16px',
					cursor: 'pointer',
					fontWeight: 600,
					fontSize: 14,
					marginRight: 0,
				}}
			>
				<span role="img" aria-label="Upload" style={{ marginRight: 6 }}>
					⬆️
				</span>{' '}
				Upload JSON
				<input
					type="file"
					accept=".json,application/json"
					style={{ display: 'none' }}
					onChange={async (e) => {
						const file = e.target.files && e.target.files[0];
						if (!file) return;
						if (!file.name.endsWith('.json')) {
							alert('Please upload a .json file for the JSON button.');
							e.target.value = '';
							return;
						}
						try {
							const text = await file.text();
							let data = JSON.parse(text);
							if (!Array.isArray(data)) data = data.cats || [];
							onUploadJson && onUploadJson(data, file);
						} catch (err) {
							alert('Invalid JSON file.');
						}
						e.target.value = '';
					}}
				/>
			</label>
		</>
	);
}

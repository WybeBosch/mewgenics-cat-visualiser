export function ButtonDownloadJson({ cats }) {
	return (
		<>
			<button
				className="button-download-json"
				onClick={() => {
					const dataStr = JSON.stringify(cats, null, 2);
					const blob = new Blob([dataStr], { type: 'application/json' });
					const url = URL.createObjectURL(blob);
					const a = document.createElement('a');
					a.href = url;
					a.download = 'mewgenics_cats.json';
					document.body.appendChild(a);
					a.click();
					document.body.removeChild(a);
					URL.revokeObjectURL(url);
				}}
				style={{
					background: '#374151',
					color: '#fff',
					border: 'none',
					borderRadius: 8,
					padding: '10px 20px',
					cursor: 'pointer',
					fontWeight: 600,
					fontSize: 14,
				}}
			>
				{'⬇️ Download JSON'}
			</button>
		</>
	);
}

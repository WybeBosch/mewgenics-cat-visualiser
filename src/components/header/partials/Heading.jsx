export function Heading({ cats, rooms }) {
	return (
		<div className="heading">
			<h1
				style={{
					fontSize: 28,
					fontWeight: 700,
					color: '#fff',
					margin: 0,
				}}
			>
				🐱 Mewgenics Cat Tracker
			</h1>
			<p style={{ color: '#888', margin: '4px 0 0', fontSize: 14 }}>
				{cats.length} total cats across {rooms.length} rooms
			</p>
		</div>
	);
}

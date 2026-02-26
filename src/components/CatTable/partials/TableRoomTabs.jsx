export function TableRoomTabs({
	cats,
	rooms,
	activeRoom,
	setActiveRoom,
	sortedRooms,
}) {
	const tabStyle = (room) => ({
		padding: '10px 20px',
		background: activeRoom === room ? '#6366f1' : '#252547',
		color: activeRoom === room ? '#fff' : '#aaa',
		border: 'none',
		borderRadius: '8px 8px 0 0',
		cursor: 'pointer',
		fontWeight: activeRoom === room ? 700 : 500,
		fontSize: 14,
		transition: 'background 0.15s',
	});

	// Always sort rooms alphabetically for tab rendering
	sortedRooms = [...rooms].sort((a, b) => a.localeCompare(b));

	return (
		<>
			{sortedRooms.length > 0 && (
				<div
					className="table-room-tabs"
					style={{
						display: 'flex',
						alignItems: 'end',
						gap: 4,
						borderBottom: '2px solid #333',
					}}
				>
					{sortedRooms.map((room) => (
						<div key={room} style={{ position: 'relative' }}>
							<button
								onClick={() => setActiveRoom(room)}
								style={tabStyle(room)}
							>
								{room}{' '}
								<span style={{ marginLeft: 8, fontSize: 12, opacity: 0.6 }}>
									({cats.filter((c) => c.room === room).length})
								</span>
							</button>
						</div>
					))}
				</div>
			)}
		</>
	);
}

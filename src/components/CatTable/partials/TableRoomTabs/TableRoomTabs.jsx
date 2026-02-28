import './TableRoomTabs.css';

export function TableRoomTabs({ cats, rooms, activeRoom, setActiveRoom, sortedRooms }) {
	// Always sort rooms alphabetically for tab rendering
	sortedRooms = [...rooms].sort((a, b) => a.localeCompare(b));

	return (
		<>
			{sortedRooms.length > 0 && (
				<div className="table-room-tabs">
					{sortedRooms.map((room) => (
						<div key={room} className="item">
							<button
								className={`button ${activeRoom === room ? 'active' : ''}`}
								onClick={() => setActiveRoom(room)}
							>
								{room}{' '}
								<span className="count">
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

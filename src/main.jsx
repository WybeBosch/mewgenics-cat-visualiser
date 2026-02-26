import { createRoot } from 'react-dom/client';
import { RelationshipGraph } from './components/RelationshipGraph.jsx';
import { CatTable } from './components/CatTable.jsx';
import { useMewgenicsCatsLogic } from './main-logic.jsx';

console.log('Mewgenics cat tracker v14');

const root = createRoot(document.getElementById('root'));
root.render(<MewgenicsCats />);

function MewgenicsCats() {
	const {
		cats,
		rooms,
		getAge,
		activeRoom,
		setActiveRoom,
		savLoading,
		savError,
		hoveredCatId,
		setHoveredCatId,
		handleUploadSav,
		handleUploadJson,
	} = useMewgenicsCatsLogic();

	return (
		<div
			style={{
				fontFamily: "'Inter', system-ui, sans-serif",
				background: '#1a1a2e',
				minHeight: '100vh',
				color: '#e0e0e0',
				padding: '24px',
			}}
		>
			<div style={{ margin: '0 auto' }}>
				<CatTable
					cats={cats}
					rooms={rooms}
					activeRoom={activeRoom}
					setActiveRoom={setActiveRoom}
					onUploadJson={handleUploadJson}
					onUploadSav={handleUploadSav}
					savLoading={savLoading}
					savError={savError}
				/>

				{/* Relationship Graph */}
				<div style={{ marginTop: 32 }}>
					<h2
						style={{
							fontSize: 20,
							fontWeight: 700,
							color: '#fff',
							marginBottom: 16,
						}}
					>
						💞 {activeRoom} — Relationships
					</h2>
					<RelationshipGraph
						cats={cats.filter((c) => c.room === activeRoom)}
						allCats={cats}
						hoveredCatId={hoveredCatId}
						setHoveredCatId={setHoveredCatId}
						getAge={getAge}
					/>
				</div>
			</div>
		</div>
	);
}

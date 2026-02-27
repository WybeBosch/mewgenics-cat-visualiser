import { RelationshipGraph } from './components/RelationshipGraph/RelationshipGraph.jsx';
import { CatTable } from './components/CatTable/CatTable.jsx';
import { Header } from './components/Header/Header.jsx';
import { useMewgenicsCatsLogic } from './AppLogic.jsx';
import { useEnvironmentFavicon } from './utils/faviconUtils.jsx';

console.log('Mewgenics cat tracker v15');

export default function App() {
	useEnvironmentFavicon();

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
			id="App"
			style={{
				fontFamily: "'Inter', system-ui, sans-serif",
				background: '#1a1a2e',
				minHeight: '100vh',
				color: '#e0e0e0',
				padding: '24px',
			}}
		>
			<Header
				cats={cats}
				rooms={rooms}
				onUploadJson={handleUploadJson}
				onUploadSav={handleUploadSav}
				savLoading={savLoading}
				savError={savError}
			/>
			<main>
				<CatTable
					cats={cats}
					rooms={rooms}
					activeRoom={activeRoom}
					setActiveRoom={setActiveRoom}
				/>
				<RelationshipGraph
					cats={cats.filter((c) => c.room === activeRoom)}
					allCats={cats}
					hoveredCatId={hoveredCatId}
					setHoveredCatId={setHoveredCatId}
					getAge={getAge}
					activeRoom={activeRoom}
				/>
			</main>
		</div>
	);
}

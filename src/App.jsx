import { RelationshipGraph } from './components/RelationshipGraph/RelationshipGraph.jsx';
import { CatTable } from './components/CatTable/CatTable.jsx';
import { Header } from './components/Header/Header.jsx';
import { useMewgenicsCatsLogic } from './AppLogic.jsx';
import { useEnvironmentFavicon } from './utils/faviconUtils.jsx';

//eslint-disable-next-line no-console
console.log(`Mewgenics cat tracker v${import.meta.env.VITE_APP_VERSION}`);

export default function App() {
	useEnvironmentFavicon();

	const {
		cats,
		rooms,
		getAge,
		dataTimeLineText,
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
		<div id="app">
			<Header
				cats={cats}
				rooms={rooms}
				getAge={getAge}
				dataTimeLineText={dataTimeLineText}
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

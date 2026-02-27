import { APP_EMOJIS } from '../../../config/config.jsx';

export function Heading({ cats, rooms, getAge }) {
	const headingEmoji = import.meta.env.DEV
		? APP_EMOJIS.local
		: APP_EMOJIS.default;

	const maleCount = cats.filter((cat) => cat.sex === 'male').length;
	const femaleCount = cats.filter((cat) => cat.sex === 'female').length;
	const kittenCount = cats.filter((cat) => {
		if (typeof getAge === 'function') {
			const age = getAge(cat);
			return age !== null && age <= 1;
		}

		if (typeof cat.saveDay === 'number' && typeof cat.birthday === 'number') {
			return cat.saveDay - cat.birthday <= 1;
		}

		return false;
	}).length;

	const latestScriptTimestamp = cats.reduce((latestTimestamp, cat) => {
		const currentTimestamp = cat?.script_start_time;
		if (!currentTimestamp) return latestTimestamp;
		if (!latestTimestamp) return currentTimestamp;
		return currentTimestamp > latestTimestamp
			? currentTimestamp
			: latestTimestamp;
	}, '');

	const parsedLatestDate = latestScriptTimestamp
		? new Date(latestScriptTimestamp)
		: null;
	const lastDataDateText = latestScriptTimestamp
		? Number.isNaN(parsedLatestDate.getTime())
			? latestScriptTimestamp
			: parsedLatestDate.toLocaleString()
		: 'unknown';

	const kittenLabel = kittenCount === 1 ? 'kitten' : 'kittens';

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
				{headingEmoji} Mewgenics Cat Tracker
			</h1>
			<p style={{ color: '#888', margin: '4px 0 0', fontSize: 14 }}>
				Data from: {lastDataDateText}
			</p>
			<p style={{ color: '#888', margin: '4px 0 0', fontSize: 14 }}>
				{cats.length} total cats across {rooms.length} rooms
				<br />
				{maleCount} male, {femaleCount} female, {kittenCount} {kittenLabel}
			</p>
		</div>
	);
}

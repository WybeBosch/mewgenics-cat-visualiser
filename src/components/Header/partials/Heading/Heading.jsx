import { APP_EMOJIS } from '../../../../config/config.jsx';
import './Heading.css';

export function Heading({ cats, rooms, getAge, dataTimeLineText }) {
	const headingEmoji = import.meta.env.DEV ? APP_EMOJIS.local : APP_EMOJIS.default;

	const maleCount = cats.filter((cat) => cat.sex === 'male').length;
	const femaleCount = cats.filter((cat) => cat.sex === 'female').length;
	const hermCount = cats.filter((cat) => cat.sex === 'herm').length;
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

	return (
		<div className="heading">
			<h1 className="title">{headingEmoji} Mewgenics Cat Visualiser</h1>
			<p className="meta-text">{dataTimeLineText}</p>
			<div className="svg-relation-warnings" style={{ marginTop: '8px' }}>
				{/* (x rooms, x cats) */}
				<div className="warning-pill">
					<div className="badge">
						{rooms.length} rooms, {cats.length} cats
					</div>
				</div>
				{/* (x male, x female, x herm) */}
				<div className="warning-pill">
					<div className="badge siblings">
						{maleCount} male, {femaleCount} female, {hermCount} herm
					</div>
				</div>
				{/* (x kittens) */}
				<div className="warning-pill">
					<div className="badge">{kittenCount} kittens</div>
				</div>
			</div>
		</div>
	);
}

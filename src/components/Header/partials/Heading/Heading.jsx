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
			<p className="meta-text">
				{rooms.length} rooms, {cats.length} total cats, {maleCount} male, {femaleCount}{' '}
				female, {hermCount} herm, {kittenCount} kitten
			</p>
		</div>
	);
}

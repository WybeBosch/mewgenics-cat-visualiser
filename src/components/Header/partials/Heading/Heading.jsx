import { APP_EMOJIS } from '../../../../shared/config/config.jsx';
import { isKitten } from '../../../../shared/utils/ageUtils.jsx';
import './Heading.css';

export function Heading({ cats, rooms, dataTimeLineText }) {
	const headingEmoji = import.meta.env.DEV ? APP_EMOJIS.local : APP_EMOJIS.default;

	const maleCount = cats.filter((cat) => cat.sex === 'male').length;
	const femaleCount = cats.filter((cat) => cat.sex === 'female').length;
	const hermCount = cats.filter((cat) => cat.sex === 'herm').length;
	const kittenCount = cats.filter((cat) => isKitten(cat)).length;

	return (
		<div className="heading">
			<h1 className="title">{headingEmoji} Mewgenics Cat Visualiser</h1>
			<p className="meta-text">{dataTimeLineText}</p>
			<div className="meta-text">
				{/* [x rooms, x cats] */}
				<span>
					[{rooms.length} rooms, {cats.length} cats],
				</span>
				{/* [x male, x female, x herm] */}
				<span>
					[{maleCount} male, {femaleCount} female, {hermCount} herm],
				</span>
				{/* [x kittens] */}
				<span>[{kittenCount} kittens]</span>
			</div>
		</div>
	);
}

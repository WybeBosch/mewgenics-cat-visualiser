import { SEX_ICON } from '../../../../../../shared/config/config.jsx';
import { joinClass } from '../../../../../../shared/utils/utils.jsx';
import './SvgCatNodes.css';

export default function SvgCatNodes({
	hovIdx,
	ordered,
	positions,
	setHoveredCatId,
	setSelectedCatId,
	selectedCatId,
}) {
	function getCircleStrokeWidth(i, hovIdx) {
		return hovIdx === i ? 3.5 : 2.5;
	}

	function getNodeSexClass(sex) {
		if (sex === 'male' || sex === 'female' || sex === 'herm') {
			return `sex-${sex}`;
		}
		return 'sex-unknown';
	}

	function getNameFontSize(name) {
		if (name.length > 10) return 8;
		if (name.length > 8) return 9;
		return 11;
	}

	function getDisplayName(name) {
		return name.length > 14 ? name.slice(0, 13) + '…' : name;
	}

	function getSexIcon(sex) {
		return SEX_ICON[sex] || sex;
	}

	function handleMouseEnter(setHoveredCatId, id) {
		return () => setHoveredCatId(id);
	}

	function handleMouseLeave(setHoveredCatId) {
		return () => setHoveredCatId(null);
	}

	function handleClick(setSelectedCatId, selectedCatId, id) {
		return (e) => {
			e.stopPropagation();
			setSelectedCatId(selectedCatId === id ? null : id);
		};
	}
	return (
		<g className="nodes">
			{/* Drawing the circles on the map for each cat*/}
			{positions.map((p, i) => (
				<g
					key={p.name}
					className={joinClass('node', getNodeSexClass(ordered[i].sex), {
						'is-hovered': hovIdx === i,
					})}
					onMouseEnter={handleMouseEnter(setHoveredCatId, ordered[i].id)}
					onMouseLeave={handleMouseLeave(setHoveredCatId)}
					onClick={handleClick(setSelectedCatId, selectedCatId, ordered[i].id)}
				>
					<circle
						className="circle"
						cx={p.x}
						cy={p.y}
						r={p.nodeR || 28}
						strokeWidth={getCircleStrokeWidth(i, hovIdx)}
					/>
					<text
						className="name"
						x={p.x}
						y={p.y - 2}
						textAnchor="middle"
						dominantBaseline="middle"
						fontSize={getNameFontSize(ordered[i].name)}
						fontWeight={600}
					>
						{getDisplayName(ordered[i].name)}
					</text>
					<text className="sex" x={p.x} y={p.y + 12} textAnchor="middle" fontSize={10}>
						{getSexIcon(ordered[i].sex)}
					</text>
				</g>
			))}
		</g>
	);
}

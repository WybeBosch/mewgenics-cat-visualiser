import { SEX_ICON, SEX_COLOR, SEX_BG, SEX_BG_HOVER } from '../../../../../../config/config.jsx';
import './SvgCatNodes.css';

export default function SvgCatNodes({
	hovIdx,
	ordered,
	positions,
	setHoveredCatId,
	setSelectedCatId,
	selectedCatId,
}) {
	function getCircleFill(i, hovIdx, ordered) {
		return hovIdx === i ? SEX_BG_HOVER[ordered[i].sex] : SEX_BG[ordered[i].sex];
	}

	function getCircleStroke(i, ordered) {
		return SEX_COLOR[ordered[i].sex];
	}

	function getCircleStrokeWidth(i, hovIdx) {
		return hovIdx === i ? 3.5 : 2.5;
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
		<>
			{/* Drawing the circles on the map for each cat*/}
			{positions.map((p, i) => (
				<g
					key={p.name}
					className="node"
					onMouseEnter={handleMouseEnter(setHoveredCatId, ordered[i].id)}
					onMouseLeave={handleMouseLeave(setHoveredCatId)}
					onClick={handleClick(setSelectedCatId, selectedCatId, ordered[i].id)}
				>
					<circle
						cx={p.x}
						cy={p.y}
						r={p.nodeR || 28}
						fill={getCircleFill(i, hovIdx, ordered)}
						stroke={getCircleStroke(i, ordered)}
						strokeWidth={getCircleStrokeWidth(i, hovIdx)}
					/>
					<text
						x={p.x}
						y={p.y - 2}
						textAnchor="middle"
						dominantBaseline="middle"
						fill="#fff"
						fontSize={getNameFontSize(ordered[i].name)}
						fontWeight={600}
					>
						{getDisplayName(ordered[i].name)}
					</text>
					<text
						x={p.x}
						y={p.y + 12}
						textAnchor="middle"
						fill={getCircleStroke(i, ordered)}
						fontSize={10}
					>
						{getSexIcon(ordered[i].sex)}
					</text>
				</g>
			))}
		</>
	);
}

export default function Tooltip({
	selIdx,
	ordered,
	positions,
	buildTooltip,
	W,
}) {
	return (
		<>
			{/* Tooltip */}
			{selIdx !== null &&
				(() => {
					const cat = ordered[selIdx],
						pos = positions[selIdx];
					const lines = buildTooltip(cat);
					const tipW = 220,
						tipH = 20 + lines.length * 22;
					let tx = pos.x - tipW / 2,
						ty = pos.y - 40 - tipH;
					if (ty < 5) ty = pos.y + 38;
					if (tx < 5) tx = 5;
					if (tx + tipW > W - 5) tx = W - tipW - 5;
					return (
						<g>
							<rect
								x={tx}
								y={ty}
								width={tipW}
								height={tipH}
								rx={8}
								fill="#1e1e3a"
								stroke="#555"
								strokeWidth={1}
								opacity={0.95}
							/>
							<text
								x={tx + tipW / 2}
								y={ty + 16}
								textAnchor="middle"
								fill="#fff"
								fontSize={12}
								fontWeight={700}
							>
								{cat.name}
							</text>
							{lines.map((line, li) => (
								<g key={li}>
									<text
										x={tx + 10}
										y={ty + 36 + li * 22}
										fill="#888"
										fontSize={10}
									>
										{line.label}:
									</text>
									<text
										x={tx + tipW - 10}
										y={ty + 36 + li * 22}
										textAnchor="end"
										fill="#ddd"
										fontSize={10}
									>
										{line.value}
									</text>
								</g>
							))}
						</g>
					);
				})()}
		</>
	);
}

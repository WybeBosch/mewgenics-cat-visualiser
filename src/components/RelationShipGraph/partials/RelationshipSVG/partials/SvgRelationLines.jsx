export default function SvgRelationLines({ hovIdx, ordered, positions }) {
	return (
		<>
			{/* (shared lineage, nodes) */}
			{hovIdx !== null &&
				(() => {
					const hovCat = ordered[hovIdx];
					const hovAnc = [
						hovCat.parent1,
						hovCat.parent2,
						hovCat.grandparent1,
						hovCat.grandparent2,
						hovCat.grandparent3,
						hovCat.grandparent4,
					].filter(Boolean);
					return ordered.map((other, oi) => {
						if (oi === hovIdx) return null;
						const from = positions[hovIdx],
							to = positions[oi];
						const hovIsParent =
							other.parent1 === hovCat.name || other.parent2 === hovCat.name;
						const otherIsParent =
							hovCat.parent1 === other.name || hovCat.parent2 === other.name;
						if (hovIsParent || otherIsParent) {
							// Draw line from parent to child, and add emoji at each end
							let parentPos, childPos;
							if (hovIsParent) {
								parentPos = from;
								childPos = to;
							} else {
								parentPos = to;
								childPos = from;
							}
							const dx = childPos.x - parentPos.x;
							const dy = childPos.y - parentPos.y;
							const dist = Math.sqrt(dx * dx + dy * dy) || 1;
							const nodeR = 28;
							const emojiPad = 18;
							const x1 = parentPos.x + dx * ((nodeR + emojiPad) / dist);
							const y1 = parentPos.y + dy * ((nodeR + emojiPad) / dist);
							const x2 = childPos.x - dx * (nodeR / dist);
							const y2 = childPos.y - dy * (nodeR / dist);
							return (
								<g key={`kin-${oi}`}>
									<line
										x1={x1}
										y1={y1}
										x2={x2}
										y2={y2}
										stroke="#f97316"
										strokeWidth={3}
										opacity={0.6}
									/>
									{/* Pregnant emoji at parent end */}
									<text
										x={parentPos.x + dx * ((nodeR + emojiPad - 8) / dist)}
										y={parentPos.y + dy * ((nodeR + emojiPad - 8) / dist) + 8}
										fontSize={22}
										textAnchor="middle"
										dominantBaseline="middle"
										opacity={0.95}
									>
										🤰
									</text>
									{/* Baby emoji at child end - smaller and further from node */}
									<text
										x={childPos.x - dx * ((nodeR + 20) / dist)}
										y={childPos.y - dy * ((nodeR + 20) / dist) + 8}
										fontSize={16}
										textAnchor="middle"
										dominantBaseline="middle"
										opacity={0.95}
									>
										👶
									</text>
									<text
										x={(x1 + x2) / 2}
										y={(y1 + y2) / 2 - 8}
										textAnchor="middle"
										fontSize={9}
										fill="#f97316"
										opacity={0.8}
									>
										parent
									</text>
								</g>
							);
						}
						const otherAnc = [
							other.parent1,
							other.parent2,
							other.grandparent1,
							other.grandparent2,
							other.grandparent3,
							other.grandparent4,
						].filter(Boolean);
						const shared = hovAnc.filter((a) => otherAnc.includes(a));
						if (shared.length === 0) return null;
						const isSibling = shared.some(
							(s) =>
								[hovCat.parent1, hovCat.parent2].includes(s) &&
								[other.parent1, other.parent2].includes(s)
						);
						return (
							<g key={`kin-${oi}`}>
								<line
									x1={from.x}
									y1={from.y}
									x2={to.x}
									y2={to.y}
									stroke={isSibling ? '#fbbf24' : '#a78bfa'}
									strokeWidth={isSibling ? 3 : 2}
									strokeDasharray={isSibling ? 'none' : '8,4'}
									opacity={0.6}
								/>
								<text
									x={(from.x + to.x) / 2}
									y={(from.y + to.y) / 2 - 8}
									textAnchor="middle"
									fontSize={9}
									fill={isSibling ? '#fbbf24' : '#a78bfa'}
									opacity={0.8}
								>
									{isSibling ? 'sibling' : 'related'}
								</text>
							</g>
						);
					});
				})()}
		</>
	);
}

function normalizeLineageName(value) {
	return String(value || '')
		.replace(/☠️/g, '')
		.trim()
		.toLowerCase();
}

function getParentNames(cat) {
	return [cat.parent1, cat.parent2].map(normalizeLineageName).filter(Boolean);
}

function getGrandparentNames(cat) {
	return [cat.grandparent1, cat.grandparent2, cat.grandparent3, cat.grandparent4]
		.map(normalizeLineageName)
		.filter(Boolean);
}

function getAncestorNames(cat) {
	return [
		cat.parent1,
		cat.parent2,
		cat.grandparent1,
		cat.grandparent2,
		cat.grandparent3,
		cat.grandparent4,
	]
		.map(normalizeLineageName)
		.filter(Boolean);
}

function hasOverlap(a, b) {
	const bSet = new Set(b);
	return a.some((item) => bSet.has(item));
}

function isSameRoom(a, b) {
	return Boolean(a && b && a.room && b.room && a.room === b.room);
}

function isLineTypeActive(hiddenLineTypes, lineType) {
	return !hiddenLineTypes?.has(lineType);
}

function areMutualLovePair(a, b) {
	if (!a || !b || a.id === b.id) return false;
	const aLoves = normalizeLineageName(a.loves);
	const bLoves = normalizeLineageName(b.loves);
	if (!aLoves || !bLoves) return false;
	return aLoves === normalizeLineageName(b.name) && bLoves === normalizeLineageName(a.name);
}

function hasOneWayLoveInRoom(cat, cats) {
	const lovesName = normalizeLineageName(cat?.loves);
	if (!lovesName) return false;
	return cats.some(
		(other) => other.id !== cat.id && normalizeLineageName(other.name) === lovesName
	);
}

function findCatByName(cats, name) {
	if (!name) return null;
	const clean = normalizeLineageName(name);
	return cats.find((cat) => normalizeLineageName(cat.name) === clean) || null;
}

function findPositionByName(positions, name) {
	if (!name) return null;
	const clean = normalizeLineageName(name);
	return positions.find((position) => normalizeLineageName(position.name) === clean) || null;
}

function isParentChild(a, b) {
	const aParents = getParentNames(a);
	const bParents = getParentNames(b);
	const aName = normalizeLineageName(a.name);
	const bName = normalizeLineageName(b.name);

	const aIsParentOfB = bParents.includes(aName);
	const bIsParentOfA = aParents.includes(bName);

	return aIsParentOfB || bIsParentOfA;
}

function isGrandparentGrandchild(a, b) {
	const aGrandparents = getGrandparentNames(a);
	const bGrandparents = getGrandparentNames(b);
	const aName = normalizeLineageName(a.name);
	const bName = normalizeLineageName(b.name);

	return bGrandparents.includes(aName) || aGrandparents.includes(bName);
}

function isSibling(a, b) {
	return hasOverlap(getParentNames(a), getParentNames(b));
}

function isRelated(a, b) {
	return hasOverlap(getAncestorNames(a), getAncestorNames(b));
}

function getFamilySummary(cats) {
	const siblingCats = new Set();
	const parentChildCats = new Set();
	const grandparentChildCats = new Set();
	const distantCats = new Set();

	for (let i = 0; i < cats.length; i++) {
		const a = cats[i];
		const aKey = a.id ?? `${a.name}-${i}`;

		for (let j = i + 1; j < cats.length; j++) {
			const b = cats[j];
			const bKey = b.id ?? `${b.name}-${j}`;

			if (isParentChild(a, b)) {
				parentChildCats.add(aKey);
				parentChildCats.add(bKey);
				continue;
			}

			if (isGrandparentGrandchild(a, b)) {
				grandparentChildCats.add(aKey);
				grandparentChildCats.add(bKey);
				continue;
			}

			if (isSibling(a, b)) {
				siblingCats.add(aKey);
				siblingCats.add(bKey);
				continue;
			}

			if (isRelated(a, b)) {
				distantCats.add(aKey);
				distantCats.add(bKey);
			}
		}
	}

	return {
		siblings: siblingCats.size,
		parentChild: parentChildCats.size,
		grandparentChild: grandparentChildCats.size,
		distantlyRelated: distantCats.size,
		hasFamily:
			siblingCats.size > 0 ||
			parentChildCats.size > 0 ||
			grandparentChildCats.size > 0 ||
			distantCats.size > 0,
	};
}

export {
	normalizeLineageName,
	getParentNames,
	getGrandparentNames,
	getAncestorNames,
	hasOverlap,
	isSameRoom,
	isLineTypeActive,
	areMutualLovePair,
	hasOneWayLoveInRoom,
	findCatByName,
	findPositionByName,
	isParentChild,
	isGrandparentGrandchild,
	isSibling,
	isRelated,
	getFamilySummary,
};

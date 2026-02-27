function normalizeLineageName(value) {
	return String(value || '')
		.replace(/☠️/g, '')
		.trim()
		.toLowerCase();
}

function getParentNames(cat) {
	return [cat.parent1, cat.parent2].map(normalizeLineageName).filter(Boolean);
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

function isParentChild(a, b) {
	const aParents = getParentNames(a);
	const bParents = getParentNames(b);
	const aName = normalizeLineageName(a.name);
	const bName = normalizeLineageName(b.name);

	const aIsParentOfB = bParents.includes(aName);
	const bIsParentOfA = aParents.includes(bName);

	return aIsParentOfB || bIsParentOfA;
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
		distantlyRelated: distantCats.size,
		hasFamily:
			siblingCats.size > 0 || parentChildCats.size > 0 || distantCats.size > 0,
	};
}

export {
	normalizeLineageName,
	getParentNames,
	getAncestorNames,
	hasOverlap,
	isParentChild,
	isSibling,
	isRelated,
	getFamilySummary,
};

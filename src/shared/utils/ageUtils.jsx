/**
 * Calculate cat age from saveDay and birthday.
 * In-game age = saveDay - birthday + 2 when both are available.
 * Returns 1 for cats with a null/missing birthday (newborns).
 * Returns null when saveDay is missing (truly unknown).
 */
export function getAge(cat) {
	if (typeof cat.saveDay !== 'number') return null;
	if (typeof cat.birthday === 'number') return cat.saveDay - cat.birthday + 2;
	return 1;
}

export function isKitten(cat) {
	const age = getAge(cat);
	return age === null || age <= 1;
}

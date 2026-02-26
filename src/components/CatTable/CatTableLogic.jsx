import { useState, useCallback } from 'react';
import { STATS } from '../../config/config.jsx';

export function CatTableLogic({ cats, activeRoom }) {
	// Table-specific state
	const defaultForm = {
		name: '',
		id: '',
		sex: 'male',
		STR: 5,
		DEX: 5,
		CON: 5,
		INT: 5,
		SPD: 5,
		CHA: 5,
		LCK: 5,
		libido: 5,
		aggression: 5,
		loves: '',
		hates: '',
		mutations: '',
		room: '',
		stray: false,
		parent1: '',
		parent2: '',
		grandparent1: '',
		grandparent2: '',
		grandparent3: '',
		grandparent4: '',
	};
	const [showForm, setShowForm] = useState(false);
	const [form, setForm] = useState({ ...defaultForm, room: activeRoom });
	const [editIdx, setEditIdx] = useState(null);
	const [sortCol, setSortCol] = useState(null);
	const [sortAsc, setSortAsc] = useState(true);
	const [hoveredCatId, setHoveredCatId] = useState(null);

	// Handlers
	const resetForm = useCallback(
		() => setForm({ ...defaultForm, room: activeRoom }),
		[activeRoom]
	);

	// Removed handleAdd and add cat functionality

	const handleEdit = useCallback(
		(gi) => {
			setForm({ ...cats[gi] });
			setEditIdx(gi);
			setShowForm(true);
		},
		[cats]
	);

	const handleDelete = useCallback(
		(gi) => {
			// TODO: Add callback to update cats in App.jsx
		},
		[cats]
	);

	const handleSort = useCallback(
		(col) => {
			if (sortCol !== col) {
				setSortCol(col);
				setSortAsc(true);
			} else if (sortAsc) {
				setSortAsc(false);
			} else {
				setSortCol(null);
				setSortAsc(true);
			}
		},
		[sortCol, sortAsc]
	);
	const totalStat = (cat) => STATS.reduce((sum, s) => sum + cat[s], 0);
	const getAge = (cat) => {
		if (typeof cat.saveDay === 'number' && typeof cat.birthday === 'number') {
			return cat.saveDay - cat.birthday;
		}
		return null;
	};
	const roomCats = cats.filter((c) => c.room === activeRoom);
	const sorted = [...roomCats].sort((a, b) => {
		if (!sortCol) return 0;
		if (sortCol === 'total')
			return sortAsc
				? totalStat(a) - totalStat(b)
				: totalStat(b) - totalStat(a);
		if (sortCol === 'age') {
			const av = getAge(a);
			const bv = getAge(b);
			return sortAsc ? av - bv : bv - av;
		}
		const av = a[sortCol],
			bv = b[sortCol];
		if (typeof av === 'string')
			return sortAsc ? av.localeCompare(bv) : bv.localeCompare(av);
		return sortAsc ? av - bv : bv - av;
	});

	const aggroColor = (v) => (v <= 3 ? '#86efac' : v <= 6 ? '#ccc' : '#f87171');

	return {
		showForm,
		form,
		editIdx,
		hoveredCatId,
		setHoveredCatId,
		setForm,
		setEditIdx,
		setShowForm,
		resetForm,
		handleEdit,
		handleDelete,
		handleSort,
		sorted,
		aggroColor,
		totalStat,
		getAge,
		sortCol,
		sortAsc,
	};
}

import { useState, useEffect } from 'react';

import {
	STAT_ICONS,
	STATS,
	SEX_ICON,
	SEX_COLOR,
	SEX_BG,
	SEX_BG_HOVER,
} from './config/config.jsx';
import { INITIAL_CATS } from './data/initial-cats.jsx';

import { TableTooltipPopup } from './utils/utils.jsx';
import { RelationshipGraph } from './components/RelationshipGraph.jsx';
import { CatTable } from './components/CatTable.jsx';

/* ─── Main App ─── */
export default function MewgenicsCats() {
	const [cats, setCats] = useState(INITIAL_CATS);
	const [rooms, setRooms] = useState([]);
	const [activeRoom, setActiveRoom] = useState('');
	const [loaded, setLoaded] = useState(false);
	const [showForm, setShowForm] = useState(false);
	const [editIdx, setEditIdx] = useState(null);
	const emptyForm = {
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
	const [form, setForm] = useState({ ...emptyForm });
	const [sortCol, setSortCol] = useState(null);
	const [sortAsc, setSortAsc] = useState(true);
	const [copied, setCopied] = useState(false);
	const [showAddRoom, setShowAddRoom] = useState(false);
	const [newRoomName, setNewRoomName] = useState('');
	const [hoveredCatId, setHoveredCatId] = useState(null);

	// Derive rooms from cats
	useEffect(() => {
		const r = [...new Set(cats.map((c) => c.room))];
		setRooms(r);
		if (!r.includes(activeRoom)) setActiveRoom(r[0] || '');
	}, [cats]);

	// Load
	useEffect(() => {
		(async () => {
			try {
				const result = await window.storage.get('mewgenics-v13');
				if (result?.value) {
					const data = JSON.parse(result.value);
					if (data.cats) setCats(data.cats);
				}
			} catch {}
			setLoaded(true);
		})();
	}, []);

	// Save
	useEffect(() => {
		if (!loaded) return;
		(async () => {
			try {
				await window.storage.set('mewgenics-v13', JSON.stringify({ cats }));
			} catch {}
		})();
	}, [cats, loaded]);

	const resetForm = () => setForm({ ...emptyForm, room: activeRoom });

	const handleAdd = () => {
		if (!form.name.trim()) return;
		const entry = { ...form, name: form.name.trim() };
		entry.id = entry.name
			.toLowerCase()
			.replace(/[^a-z0-9_.]/g, (c) => (c === ' ' ? '_' : c === '.' ? '.' : ''));
		STATS.forEach((s) => (entry[s] = Number(entry[s])));
		entry.libido = Number(entry.libido);
		entry.aggression = Number(entry.aggression);
		if (editIdx !== null) {
			const u = [...cats];
			u[editIdx] = entry;
			setCats(u);
			setEditIdx(null);
		} else setCats([...cats, entry]);
		resetForm();
		setShowForm(false);
	};

	const handleEdit = (gi) => {
		setForm({ ...cats[gi] });
		setEditIdx(gi);
		setShowForm(true);
	};
	const handleDelete = (gi) => setCats(cats.filter((_, i) => i !== gi));
	const handleSort = (col) => {
		if (sortCol === col) setSortAsc(!sortAsc);
		else {
			setSortCol(col);
			setSortAsc(col === 'name' || col === 'sex');
		}
	};

	const handleAddRoom = () => {
		const t = newRoomName.trim();
		if (!t || rooms.includes(t)) return;
		setNewRoomName('');
		setShowAddRoom(false);
		setActiveRoom(t);
		setRooms([...rooms, t]);
	};

	return (
		<div
			style={{
				fontFamily: "'Inter', system-ui, sans-serif",
				background: '#1a1a2e',
				minHeight: '100vh',
				color: '#e0e0e0',
				padding: '24px',
			}}
		>
			<div style={{ margin: '0 auto' }}>
				<CatTable
					cats={cats}
					rooms={rooms}
					activeRoom={activeRoom}
					setActiveRoom={setActiveRoom}
					showForm={showForm}
					setShowForm={setShowForm}
					form={form}
					setForm={setForm}
					editIdx={editIdx}
					setEditIdx={setEditIdx}
					emptyForm={emptyForm}
					sortCol={sortCol}
					setSortCol={setSortCol}
					sortAsc={sortAsc}
					setSortAsc={setSortAsc}
					copied={copied}
					setCopied={setCopied}
					showAddRoom={showAddRoom}
					setShowAddRoom={setShowAddRoom}
					newRoomName={newRoomName}
					setNewRoomName={setNewRoomName}
					hoveredCatId={hoveredCatId}
					setHoveredCatId={setHoveredCatId}
					handleAdd={handleAdd}
					handleEdit={handleEdit}
					handleDelete={handleDelete}
					handleSort={handleSort}
					handleAddRoom={handleAddRoom}
					resetForm={resetForm}
				/>

				{/* Relationship Graph */}
				<div style={{ marginTop: 32 }}>
					<h2
						style={{
							fontSize: 20,
							fontWeight: 700,
							color: '#fff',
							marginBottom: 16,
						}}
					>
						💞 {activeRoom} — Relationships
					</h2>
					<RelationshipGraph
						cats={cats.filter((c) => c.room === activeRoom)}
						allCats={cats}
						hoveredCatId={hoveredCatId}
						setHoveredCatId={setHoveredCatId}
					/>
				</div>
			</div>
		</div>
	);
}

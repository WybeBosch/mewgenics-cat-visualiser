import { useState, useEffect, useCallback, useMemo } from 'react';
import { createRoot } from 'react-dom/client';
import { STATS } from './config/config.jsx';
import { RelationshipGraph } from './components/RelationshipGraph.jsx';
import { CatTable } from './components/CatTable.jsx';
import { logIfEnabled } from './utils/utils.jsx';
/* ─── Main App ─── */

console.log('Mewgenics cat tracker v14');

const root = createRoot(document.getElementById('root'));
root.render(<MewgenicsCats />);

function MewgenicsCats() {
	// --- State ---
	const [cats, setCats] = useState([]);
	const [activeRoom, setActiveRoom] = useState('');
	const [loaded, setLoaded] = useState(false);
	const [showForm, setShowForm] = useState(false);
	const [editIdx, setEditIdx] = useState(null);
	const [sortCol, setSortCol] = useState(null);
	const [sortAsc, setSortAsc] = useState(true);
	const [copied, setCopied] = useState(false);

	const [hoveredCatId, setHoveredCatId] = useState(null);
	const [savLoading, setSavLoading] = useState(false);
	const [savError, setSavError] = useState(null);

	// --- Derived ---
	const rooms = useMemo(() => [...new Set(cats.map((c) => c.room))], [cats]);

	// --- Form State ---
	const emptyForm = useMemo(
		() => ({
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
		}),
		[]
	);
	const [form, setForm] = useState({ ...emptyForm });

	// Keep activeRoom valid
	useEffect(() => {
		if (!rooms.includes(activeRoom)) setActiveRoom(rooms[0] || '');
		// eslint-disable-next-line
	}, [rooms]);

	// Load cats from storage and JSON, merge mutations, use newer source
	useEffect(() => {
		(async () => {
			let jsonCats = [];
			let jsonTimestamp = '';
			let storageCats = [];
			let storageTimestamp = '';
			try {
				// Load JSON
				const response = await fetch('/mewgenics_cats.json');
				if (response.ok) {
					const data = await response.json();
					jsonCats = Array.isArray(data) ? data : data.cats || [];
					if (jsonCats.length > 0 && jsonCats[0].script_start_time) {
						jsonTimestamp = jsonCats[0].script_start_time;
					}
				}
			} catch {}
			try {
				// Load storage
				const storageRaw = await window.storage.get('mewgenics-v14');
				if (storageRaw) {
					const parsed = JSON.parse(storageRaw);
					storageCats = Array.isArray(parsed.cats) ? parsed.cats : [];
					if (storageCats.length > 0 && storageCats[0].script_start_time) {
						storageTimestamp = storageCats[0].script_start_time;
					}
				}
			} catch {}

			// Compare timestamps
			let useJson = false;
			if (jsonTimestamp && storageTimestamp) {
				useJson = jsonTimestamp > storageTimestamp;
			} else if (jsonTimestamp && !storageTimestamp) {
				useJson = true;
			} else if (!jsonTimestamp && storageTimestamp) {
				useJson = false;
			} else {
				useJson = jsonCats.length > storageCats.length;
			}

			let mergedCats = [];
			if (useJson) {
				// Merge mutations from storage into jsonCats
				const storageMap = {};
				for (const cat of storageCats) {
					if (cat.id) storageMap[cat.id] = cat;
				}
				mergedCats = jsonCats.map((cat) => {
					const stored = storageMap[cat.id];
					if (stored && stored.mutations) {
						return { ...cat, mutations: stored.mutations };
					}
					return { ...cat };
				});
			} else {
				mergedCats = storageCats;
			}
			logIfEnabled('[cats] mergedCats:', mergedCats);
			setCats(mergedCats);
			setLoaded(true);
		})();
	}, []);

	// Save cats to storage
	useEffect(() => {
		if (!loaded) return;
		(async () => {
			try {
				await window.storage.set('mewgenics-v14', JSON.stringify({ cats }));
				logIfEnabled('[cats] saved to storage:', cats);
			} catch {}
		})();
	}, [cats, loaded]);

	// --- Handlers ---
	const resetForm = useCallback(
		() => setForm({ ...emptyForm, room: activeRoom }),
		[emptyForm, activeRoom]
	);

	const handleAdd = useCallback(() => {
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
	}, [form, editIdx, cats, resetForm]);

	const handleEdit = useCallback(
		(gi) => {
			setForm({ ...cats[gi] });
			setEditIdx(gi);
			setShowForm(true);
		},
		[cats]
	);

	const handleDelete = useCallback(
		(gi) => setCats(cats.filter((_, i) => i !== gi)),
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

	// --- Render ---
	// Handler for uploaded .sav file
	const handleUploadSav = useCallback(async (file) => {
		setSavLoading(true);
		setSavError(null);
		try {
			const { extractSaveFile } =
				await import('./data-grabber/javascript-with-wasm/extractSaveFile.js');
			const extractedCats = await extractSaveFile(file);
			if (!extractedCats.length) {
				setSavError('No housed cats found in save file.');
				return;
			}
			setCats(extractedCats);
			setLoaded(true);
			setActiveRoom([...new Set(extractedCats.map((c) => c.room))][0] || '');
			try {
				await window.storage.set(
					'mewgenics-v14',
					JSON.stringify({ cats: extractedCats })
				);
				logIfEnabled('[sav] saved extractedCats:', extractedCats);
			} catch {}
		} catch (err) {
			logIfEnabled('[extractSaveFile] Error:', err);
			logIfEnabled('[extractSaveFile] Error:', err);
			setSavError(`Error reading save file: ${err.message}`);
		} finally {
			setSavLoading(false);
		}
	}, []);

	// Handler for uploaded JSON
	const handleUploadJson = useCallback((uploadedCats) => {
		setCats(uploadedCats);
		setLoaded(true);
		// Optionally, set activeRoom to first room in uploaded data
		const newRooms = [...new Set(uploadedCats.map((c) => c.room))];
		setActiveRoom(newRooms[0] || '');
		// Save to storage for persistence
		(async () => {
			try {
				await window.storage.set(
					'mewgenics-v14',
					JSON.stringify({ cats: uploadedCats })
				);
				logIfEnabled('[json] saved uploadedCats:', uploadedCats);
			} catch {}
		})();
	}, []);

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
					hoveredCatId={hoveredCatId}
					setHoveredCatId={setHoveredCatId}
					handleAdd={handleAdd}
					handleEdit={handleEdit}
					handleDelete={handleDelete}
					handleSort={handleSort}
					resetForm={resetForm}
					onUploadJson={handleUploadJson}
					onUploadSav={handleUploadSav}
					savLoading={savLoading}
					savError={savError}
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
						getAge={(cat) => {
							if (
								typeof cat.saveDay === 'number' &&
								typeof cat.birthday === 'number'
							) {
								return cat.saveDay - cat.birthday;
							}
							return null;
						}}
					/>
				</div>
			</div>
		</div>
	);
}

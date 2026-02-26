import { useState, useCallback } from 'react';
import { TableTooltipPopup } from '../utils/utils.jsx';
import {
	STAT_ICONS,
	STATS,
	SEX_ICON,
	SEX_COLOR,
	OTHER_INFO_ICONS,
} from '../config/config.jsx';

function CopySavePathButton() {
	const [showPopup, setShowPopup] = useState(false);
	const [fadeOut, setFadeOut] = useState(false);
	const savePath = '%APPDATA%/Glaiel Games/Mewgenics';

	const handleCopy = async () => {
		try {
			await navigator.clipboard.writeText(savePath);
			setShowPopup(true);
			setFadeOut(false);
			setTimeout(() => setFadeOut(true), 900); // Start fade out after 900ms
			setTimeout(() => setShowPopup(false), 1300); // Hide after fade
		} catch (e) {
			alert('Failed to copy');
		}
	};

	return (
		<div style={{ position: 'absolute', top: '100%', width: 'fit-content' }}>
			<button
				onClick={handleCopy}
				style={{
					background: '#374151',
					color: '#fff',
					border: 'none',
					fontStyle: 'italic',
					borderRadius: 6,
					padding: '4px 10px',
					fontSize: 13,
					cursor: 'pointer',
					marginTop: 2,
					fontWeight: 500,
					opacity: 0.85,
					transition: 'background 0.2s',
				}}
			>
				📁 Copy Save Path
			</button>
			<div
				style={{
					position: 'absolute',
					left: '50%',
					top: '110%',
					transform: 'translateX(-50%)',
					background: '#374151',
					color: '#fff',
					borderRadius: 6,
					padding: '4px 12px',
					fontSize: 13,
					opacity: showPopup && !fadeOut ? 1 : 0,
					pointerEvents: 'none',
					boxShadow: '0 2px 8px rgba(0,0,0,0.18)',
					transition: 'opacity 0.4s',
					zIndex: 10,
				}}
			>
				Copied to clipboard!
			</div>
		</div>
	);
}

export function CatTable({
	cats,
	rooms,
	activeRoom,
	setActiveRoom,
	onUploadJson,
	onUploadSav,
	savLoading,
	savError,
}) {
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
	const tabStyle = (room) => ({
		padding: '10px 20px',
		background: activeRoom === room ? '#6366f1' : '#252547',
		color: activeRoom === room ? '#fff' : '#aaa',
		border: 'none',
		borderRadius: '8px 8px 0 0',
		cursor: 'pointer',
		fontWeight: activeRoom === room ? 700 : 500,
		fontSize: 14,
		transition: 'background 0.15s',
	});
	const aggroColor = (v) => (v <= 3 ? '#86efac' : v <= 6 ? '#ccc' : '#f87171');
	// Always sort rooms alphabetically for tab rendering
	const sortedRooms = [...rooms].sort((a, b) => a.localeCompare(b));

	return (
		<>
			{/* Header */}
			<div
				style={{
					display: 'flex',
					alignItems: 'center',
					justifyContent: 'space-between',
					marginBottom: 24,
				}}
			>
				<div>
					<h1
						style={{
							fontSize: 28,
							fontWeight: 700,
							color: '#fff',
							margin: 0,
						}}
					>
						🐱 Mewgenics Cat Tracker
					</h1>
					<p style={{ color: '#888', margin: '4px 0 0', fontSize: 14 }}>
						{cats.length} total cats across {rooms.length} rooms
					</p>
				</div>
				<div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
					{/* Upload Save File Button */}
					<div
						style={{
							position: 'relative',
							display: 'flex',
							flexDirection: 'column',
							alignItems: 'center',
							justifyContent: 'center',
							gap: 4,
						}}
					>
						<label
							style={{
								display: 'flex',
								alignItems: 'center',
								background: savLoading ? '#1f2937' : '#374151',
								color: savLoading ? '#9ca3af' : '#fff',
								border: 'none',
								borderRadius: 8,
								padding: '10px 16px',
								cursor: savLoading ? 'not-allowed' : 'pointer',
								fontWeight: 600,
								fontSize: 14,
								marginRight: 0,
							}}
						>
							<span
								role="img"
								aria-label="Save File"
								style={{ marginRight: 6 }}
							>
								{savLoading ? '⏳' : '💾'}
							</span>
							{savLoading ? 'Reading...' : 'Upload Save File'}
							<input
								type="file"
								accept=".sav"
								disabled={savLoading}
								style={{ display: 'none' }}
								onChange={(e) => {
									const file = e.target.files?.[0];
									if (file) {
										if (!file.name.endsWith('.sav')) {
											alert('Please upload a .sav file for the database.');
										} else {
											onUploadSav?.(file);
										}
									}
									e.target.value = '';
								}}
							/>
						</label>
						<CopySavePathButton />
					</div>
					{savError && (
						<span style={{ color: '#f87171', fontSize: 12, maxWidth: 220 }}>
							{savError}
						</span>
					)}

					{/* Upload JSON Button */}
					<label
						style={{
							display: 'flex',
							alignItems: 'center',
							background: '#374151',
							color: '#fff',
							border: 'none',
							borderRadius: 8,
							padding: '10px 16px',
							cursor: 'pointer',
							fontWeight: 600,
							fontSize: 14,
							marginRight: 0,
						}}
					>
						<span role="img" aria-label="Upload" style={{ marginRight: 6 }}>
							⬆️
						</span>{' '}
						Upload JSON
						<input
							type="file"
							accept=".json,application/json"
							style={{ display: 'none' }}
							onChange={async (e) => {
								const file = e.target.files && e.target.files[0];
								if (!file) return;
								if (!file.name.endsWith('.json')) {
									alert('Please upload a .json file for the JSON button.');
									e.target.value = '';
									return;
								}
								try {
									const text = await file.text();
									let data = JSON.parse(text);
									if (!Array.isArray(data)) data = data.cats || [];
									onUploadJson && onUploadJson(data);
								} catch (err) {
									alert('Invalid JSON file.');
								}
								e.target.value = '';
							}}
						/>
					</label>
					<button
						onClick={() => {
							const dataStr = JSON.stringify(cats, null, 2);
							const blob = new Blob([dataStr], { type: 'application/json' });
							const url = URL.createObjectURL(blob);
							const a = document.createElement('a');
							a.href = url;
							a.download = 'mewgenics_cats.json';
							document.body.appendChild(a);
							a.click();
							document.body.removeChild(a);
							URL.revokeObjectURL(url);
						}}
						style={{
							background: '#374151',
							color: '#fff',
							border: 'none',
							borderRadius: 8,
							padding: '10px 20px',
							cursor: 'pointer',
							fontWeight: 600,
							fontSize: 14,
						}}
					>
						{'⬇️ Download JSON'}
					</button>
					<button
						onClick={() => {
							resetForm();
							setEditIdx(null);
							setShowForm(!showForm);
						}}
						style={{
							background: showForm ? '#444' : '#6366f1',
							color: '#fff',
							border: 'none',
							borderRadius: 8,
							padding: '10px 20px',
							cursor: 'pointer',
							fontWeight: 600,
							fontSize: 14,
						}}
					>
						{showForm ? 'Cancel' : '+ Add Cat'}
					</button>
				</div>
			</div>

			{/* Room Tabs */}
			<div
				style={{
					display: 'flex',
					alignItems: 'end',
					gap: 4,
					borderBottom: '2px solid #333',
				}}
			>
				{sortedRooms.map((room) => (
					<div key={room} style={{ position: 'relative' }}>
						<button onClick={() => setActiveRoom(room)} style={tabStyle(room)}>
							{room}{' '}
							<span style={{ marginLeft: 8, fontSize: 12, opacity: 0.6 }}>
								({cats.filter((c) => c.room === room).length})
							</span>
						</button>
					</div>
				))}
			</div>

			{/* Add/Edit Form */}
			{showForm && (
				<div
					style={{
						background: '#252547',
						borderRadius: '0 0 12px 12px',
						padding: 20,
						marginBottom: 20,
						border: '1px solid #333',
						borderTop: 'none',
					}}
				>
					<div
						style={{
							display: 'flex',
							gap: 12,
							flexWrap: 'wrap',
							alignItems: 'end',
						}}
					>
						<div>
							<label
								style={{
									fontSize: 12,
									color: '#aaa',
									display: 'block',
									marginBottom: 4,
								}}
							>
								Name
							</label>
							<input
								value={form.name}
								onChange={(e) => setForm({ ...form, name: e.target.value })}
								placeholder="Cat name"
								style={{
									background: '#1a1a2e',
									border: '1px solid #444',
									borderRadius: 6,
									padding: '8px 12px',
									color: '#fff',
									width: 140,
								}}
							/>
						</div>
						<div>
							<label
								style={{
									fontSize: 12,
									color: '#aaa',
									display: 'block',
									marginBottom: 4,
								}}
							>
								Sex
							</label>
							<select
								value={form.sex}
								onChange={(e) => setForm({ ...form, sex: e.target.value })}
								style={{
									background: '#1a1a2e',
									border: '1px solid #444',
									borderRadius: 6,
									padding: '8px 12px',
									color: '#fff',
								}}
							>
								<option value="male">♂ Male</option>
								<option value="female">♀ Female</option>
								<option value="herm">⚥ Herm</option>
							</select>
						</div>
						<div>
							<label
								style={{
									fontSize: 12,
									color: '#aaa',
									display: 'block',
									marginBottom: 4,
								}}
							>
								🏠 Room
							</label>
							<select
								value={form.room}
								onChange={(e) => setForm({ ...form, room: e.target.value })}
								style={{
									background: '#1a1a2e',
									border: '1px solid #444',
									borderRadius: 6,
									padding: '8px 12px',
									color: '#fff',
								}}
							>
								{rooms.map((r) => (
									<option key={r} value={r}>
										{r}
									</option>
								))}
							</select>
						</div>
						{STATS.map((s) => (
							<div key={s}>
								<label
									style={{
										fontSize: 12,
										color: '#aaa',
										display: 'block',
										marginBottom: 4,
									}}
								>
									{STAT_ICONS[s]} {s}
								</label>
								<input
									type="number"
									min={1}
									max={10}
									value={form[s]}
									onChange={(e) => setForm({ ...form, [s]: e.target.value })}
									style={{
										background: '#1a1a2e',
										border: '1px solid #444',
										borderRadius: 6,
										padding: '8px 12px',
										color: '#fff',
										width: 60,
									}}
								/>
							</div>
						))}
						<div>
							<label
								style={{
									fontSize: 12,
									color: '#aaa',
									display: 'block',
									marginBottom: 4,
								}}
							>
								{OTHER_INFO_ICONS.libido} Libido
							</label>
							<input
								type="number"
								min={1}
								max={10}
								value={form.libido}
								onChange={(e) => setForm({ ...form, libido: e.target.value })}
								style={{
									background: '#1a1a2e',
									border: '1px solid #444',
									borderRadius: 6,
									padding: '8px 12px',
									color: '#fff',
									width: 60,
								}}
							/>
						</div>
						<div>
							<label
								style={{
									fontSize: 12,
									color: '#aaa',
									display: 'block',
									marginBottom: 4,
								}}
							>
								{OTHER_INFO_ICONS.aggression} Aggro
							</label>
							<input
								type="number"
								min={1}
								max={10}
								value={form.aggression}
								onChange={(e) =>
									setForm({ ...form, aggression: e.target.value })
								}
								style={{
									background: '#1a1a2e',
									border: '1px solid #444',
									borderRadius: 6,
									padding: '8px 12px',
									color: '#fff',
									width: 60,
								}}
							/>
						</div>
						<div>
							<label
								style={{
									fontSize: 12,
									color: '#aaa',
									display: 'block',
									marginBottom: 4,
								}}
							>
								{OTHER_INFO_ICONS.loves} Loves
							</label>
							<input
								value={form.loves}
								onChange={(e) => setForm({ ...form, loves: e.target.value })}
								style={{
									background: '#1a1a2e',
									border: '1px solid #444',
									borderRadius: 6,
									padding: '8px 12px',
									color: '#fff',
									width: 120,
								}}
							/>
						</div>
						<div>
							<label
								style={{
									fontSize: 12,
									color: '#aaa',
									display: 'block',
									marginBottom: 4,
								}}
							>
								{OTHER_INFO_ICONS.hates} Hates
							</label>
							<input
								value={form.hates}
								onChange={(e) => setForm({ ...form, hates: e.target.value })}
								style={{
									background: '#1a1a2e',
									border: '1px solid #444',
									borderRadius: 6,
									padding: '8px 12px',
									color: '#fff',
									width: 120,
								}}
							/>
						</div>
						<div>
							<label
								style={{
									fontSize: 12,
									color: '#aaa',
									display: 'block',
									marginBottom: 4,
								}}
							>
								{OTHER_INFO_ICONS.mutations} Mutations
							</label>
							<input
								value={form.mutations}
								onChange={(e) =>
									setForm({ ...form, mutations: e.target.value })
								}
								style={{
									background: '#1a1a2e',
									border: '1px solid #444',
									borderRadius: 6,
									padding: '8px 12px',
									color: '#fff',
									width: 120,
								}}
							/>
						</div>
						{editIdx !== null && (
							<button
								onClick={() => {
									if (!form.name.trim()) return;
									const entry = { ...form, name: form.name.trim() };
									entry.id = entry.name
										.toLowerCase()
										.replace(/[^a-z0-9_.]/g, (c) =>
											c === ' ' ? '_' : c === '.' ? '.' : ''
										);
									STATS.forEach((s) => (entry[s] = Number(entry[s])));
									entry.libido = Number(entry.libido);
									entry.aggression = Number(entry.aggression);
									const u = [...cats];
									u[editIdx] = entry;
									// TODO: Add callback to update cats in App.jsx
									setEditIdx(null);
									resetForm();
									setShowForm(false);
								}}
								style={{
									background: '#16a34a',
									color: '#fff',
									border: 'none',
									borderRadius: 6,
									padding: '8px 20px',
									cursor: 'pointer',
									fontWeight: 600,
									height: 38,
								}}
							>
								Save
							</button>
						)}
					</div>
				</div>
			)}

			{/* Table */}
			<div
				style={{
					overflowX: 'auto',
					overflowY: 'auto',
					maxHeight: '510px',
					border: '1px solid #333',
					borderTop: 'none',
				}}
			>
				<table
					style={{ width: '100%', borderCollapse: 'collapse', fontSize: 14 }}
				>
					<thead>
						<tr style={{ background: '#252547' }}>
							{[
								{ key: 'name', label: 'Name' },
								{ key: 'partnerRoom', label: '💞' },
								{ key: 'age', label: 'Age' },
								{ key: 'sex', label: 'Sex' },
								...STATS.map((s) => ({
									key: s,
									label: `${STAT_ICONS[s]} ${s}`,
								})),
								{ key: 'total', label: 'Total' },
								{ key: 'libido', label: OTHER_INFO_ICONS.libido },
								{ key: 'aggression', label: OTHER_INFO_ICONS.aggression },
								{ key: 'loves', label: OTHER_INFO_ICONS.loves },
								{ key: 'hates', label: OTHER_INFO_ICONS.hates },
								{ key: 'mutations', label: OTHER_INFO_ICONS.mutations },
								{ key: 'actions', label: '' },
							].map((col) => (
								<th
									key={col.key}
									onClick={
										col.key !== 'actions' && col.key !== 'partnerRoom'
											? () => handleSort(col.key)
											: undefined
									}
									style={{
										padding: '12px 12px',
										textAlign: col.key === 'name' ? 'left' : 'center',
										cursor:
											col.key !== 'actions' && col.key !== 'partnerRoom'
												? 'pointer'
												: 'default',
										userSelect: 'none',
										fontWeight: 600,
										color: sortCol === col.key ? '#6366f1' : '#aaa',
										fontSize: 13,
										borderBottom: '2px solid #333',
										whiteSpace: 'nowrap',
										position: 'relative',
									}}
								>
									{col.label}
									{sortCol === col.key && (
										<span
											style={{
												marginLeft: 4,
												position: 'absolute',
												right: '0',
												top: '50%',
												transform: 'translateY(-50%)',
											}}
										>
											{sortAsc ? '▲' : '▼'}
										</span>
									)}
								</th>
							))}
						</tr>
					</thead>
					<tbody>
						{sorted.length === 0 && (
							<tr>
								<td
									colSpan={14}
									style={{ padding: 40, textAlign: 'center', color: '#666' }}
								>
									No cats in this room.
								</td>
							</tr>
						)}
						{sorted.map((cat, i) => {
							const gi = cats.indexOf(cat);
							const total = totalStat(cat);
							const age = getAge(cat);
							const isHovered = hoveredCatId === cat.id;
							const rowBg = isHovered
								? '#2a2a5a'
								: i % 2 === 0
									? '#1a1a2e'
									: '#1f1f3a';

							// Check if partner is in another room
							let partnerInOtherRoom = false;
							if (cat.loves) {
								const partner = cats.find(
									(c) => c.name === cat.loves || c.id === cat.loves
								);
								if (
									partner &&
									partner.room &&
									cat.room &&
									partner.room !== cat.room
								) {
									partnerInOtherRoom = true;
								}
							}

							return (
								<tr
									key={cat.id + i}
									style={{
										background: rowBg,
										borderBottom: '1px solid #2a2a4a',
										transition: 'background 0.1s',
									}}
									onMouseEnter={() => setHoveredCatId(cat.id)}
									onMouseLeave={() => setHoveredCatId(null)}
								>
									<TableTooltipPopup cat={cat} allCats={cats} />
									<td
										style={{
											padding: '10px 12px',
											textAlign: 'center',
											fontSize: 18,
										}}
									>
										{partnerInOtherRoom ? '🕵️‍♂️' : ''}
									</td>
									<td
										style={{
											padding: '10px 12px',
											textAlign: 'center',
											fontWeight: 600,
											color:
												age !== null
													? age <= 1
														? '#fbbf24'
														: '#38bdf8'
													: '#888',
											fontSize: age !== null && age <= 1 ? '0.95em' : '1em',
										}}
										title={
											age !== null
												? `${age} day${age === 1 ? '' : 's'} old`
												: 'Unknown'
										}
									>
										{age !== null ? age : '—'}
									</td>
									<td
										style={{
											padding: '10px 12px',
											textAlign: 'center',
											color: SEX_COLOR[cat.sex],
										}}
									>
										{SEX_ICON[cat.sex] || cat.sex}
									</td>
									{STATS.map((s) => (
										<td
											key={s}
											style={{
												padding: '10px 12px',
												textAlign: 'center',
												fontVariantNumeric: 'tabular-nums',
												fontWeight: cat[s] >= 7 ? 800 : 400,
												color: cat[s] >= 7 ? '#4ade80' : '#ccc',
												fontSize: cat[s] >= 7 ? '1.05em' : '1em',
											}}
										>
											{cat[s]}
										</td>
									))}
									<td
										style={{
											padding: '10px 12px',
											textAlign: 'center',
											fontWeight: 600,
											color: '#a78bfa',
										}}
									>
										{total}
									</td>
									<td
										style={{
											padding: '10px 12px',
											textAlign: 'center',
											fontSize: 12,
											color: '#ccc',
										}}
									>
										{cat.libido}
									</td>
									<td
										style={{
											padding: '10px 12px',
											textAlign: 'center',
											fontSize: 12,
											color: aggroColor(cat.aggression),
										}}
									>
										{cat.aggression}
									</td>
									<td
										style={{
											padding: '10px 12px',
											textAlign: 'center',
											fontSize: 12,
											color: '#a7f3d0',
											whiteSpace: 'nowrap',
										}}
									>
										{cat.loves || '—'}
									</td>
									<td
										style={{
											padding: '10px 12px',
											textAlign: 'center',
											fontSize: 12,
											color: '#fca5a5',
											whiteSpace: 'nowrap',
										}}
									>
										{cat.hates || '—'}
									</td>
									<td
										style={{
											padding: '10px 12px',
											textAlign: 'center',
											fontSize: 12,
											color: '#93c5fd',
											whiteSpace: 'nowrap',
										}}
									>
										{cat.mutations || '—'}
									</td>
									<td
										style={{
											padding: '10px 8px',
											textAlign: 'center',
											whiteSpace: 'nowrap',
										}}
									>
										<button
											onClick={() => handleEdit(gi)}
											style={{
												background: 'none',
												border: 'none',
												color: '#6366f1',
												cursor: 'pointer',
												fontSize: 13,
												marginRight: 8,
											}}
										>
											✏️
										</button>
										<button
											onClick={() => handleDelete(gi)}
											style={{
												background: 'none',
												border: 'none',
												color: '#ef4444',
												cursor: 'pointer',
												fontSize: 13,
											}}
										>
											🗑️
										</button>
									</td>
								</tr>
							);
						})}
					</tbody>
				</table>
			</div>
		</>
	);
}

import React from 'react';
import { TableTooltipPopup } from '../utils/utils.jsx';
import { STAT_ICONS, STATS, SEX_ICON, SEX_COLOR } from '../config/config.jsx';

export function CatTable({
	cats,
	rooms,
	activeRoom,
	setActiveRoom,
	showForm,
	setShowForm,
	form,
	setForm,
	editIdx,
	setEditIdx,
	sortCol,
	sortAsc,
	copied,
	setCopied,
	hoveredCatId,
	setHoveredCatId,
	handleAdd,
	handleEdit,
	handleDelete,
	handleSort,
	resetForm,
}) {
	const totalStat = (cat) => STATS.reduce((sum, s) => sum + cat[s], 0);
	const roomCats = cats.filter((c) => c.room === activeRoom);
	const sorted = [...roomCats].sort((a, b) => {
		if (!sortCol) return 0;
		if (sortCol === 'total')
			return sortAsc
				? totalStat(a) - totalStat(b)
				: totalStat(b) - totalStat(a);
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

	return (
		<>
			{/* Header */}
			<div
				style={{
					display: 'flex',
					alignItems: 'center',
					justifyContent: 'space-between',
					marginBottom: 16,
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
				<div style={{ display: 'flex', gap: 10 }}>
					<button
						onClick={() => {
							const header = [
								'Name',
								'ID',
								'Sex',
								...STATS,
								'Total',
								'Libido',
								'Aggro',
								'Loves',
								'Hates',
								'Mutations',
								'Room',
								'Stray',
								'P1',
								'P2',
								'GP1',
								'GP2',
								'GP3',
								'GP4',
							].join(' | ');
							const div = header.replace(/[^|]/g, '-');
							const rows = cats.map((c) =>
								[
									c.name,
									c.id,
									c.sex,
									...STATS.map((s) => c[s]),
									totalStat(c),
									c.libido,
									c.aggression,
									c.loves || '—',
									c.hates || '—',
									c.mutations || '—',
									c.room,
									c.stray ? 'yes' : 'no',
									c.parent1 || '—',
									c.parent2 || '—',
									c.grandparent1 || '—',
									c.grandparent2 || '—',
									c.grandparent3 || '—',
									c.grandparent4 || '—',
								].join(' | ')
							);
							navigator.clipboard.writeText(
								`Mewgenics Cat Roster (${cats.length} cats)\nBase stats only. Stats ~1-10, 7+ strong. Libido/Aggro 1-10.\nRooms: ${rooms.join(', ')}\n\n${header}\n${div}\n${rows.join('\n')}`
							);
							setCopied(true);
							setTimeout(() => setCopied(false), 2000);
						}}
						style={{
							background: copied ? '#16a34a' : '#374151',
							color: '#fff',
							border: 'none',
							borderRadius: 8,
							padding: '10px 20px',
							cursor: 'pointer',
							fontWeight: 600,
							fontSize: 14,
						}}
					>
						{copied ? '✅ Copied!' : '📋 Copy All'}
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
				{rooms.map((room) => (
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
								💕 Libido
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
								😾 Aggro
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
								❤️ Loves
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
								💔 Hates
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
								🧬 Mutations
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
						<button
							onClick={handleAdd}
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
							{editIdx !== null ? 'Save' : 'Add'}
						</button>
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
								{ key: 'sex', label: 'Sex' },
								...STATS.map((s) => ({
									key: s,
									label: `${STAT_ICONS[s]} ${s}`,
								})),
								{ key: 'total', label: 'Total' },
								{ key: 'libido', label: '💕' },
								{ key: 'aggression', label: '😾' },
								{ key: 'loves', label: '❤️' },
								{ key: 'hates', label: '💔' },
								{ key: 'mutations', label: '🧬' },
								{ key: 'actions', label: '' },
							].map((col) => (
								<th
									key={col.key}
									onClick={
										col.key !== 'actions'
											? () => handleSort(col.key)
											: undefined
									}
									style={{
										padding: '12px 12px',
										textAlign: col.key === 'name' ? 'left' : 'center',
										cursor: col.key !== 'actions' ? 'pointer' : 'default',
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
							const isHovered = hoveredCatId === cat.id;
							const rowBg = isHovered
								? '#2a2a5a'
								: i % 2 === 0
									? '#1a1a2e'
									: '#1f1f3a';
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

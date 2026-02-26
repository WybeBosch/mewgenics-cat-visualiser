import {
	STATS,
	STAT_ICONS,
	OTHER_INFO_ICONS,
} from '../../../config/config.jsx';

export function TableEditRow({
	showForm,
	form,
	setForm,
	rooms,
	editIdx,
	setEditIdx,
	cats,
	resetForm,
	setShowForm,
}) {
	// Individual column components
	function NameColumn({ form, setForm }) {
		return (
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
		);
	}

	function SexColumn({ form, setForm }) {
		return (
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
		);
	}

	function RoomColumn({ form, setForm, rooms }) {
		return (
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
		);
	}

	function StatColumns({ form, setForm }) {
		return (
			<>
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
			</>
		);
	}

	function LibidoColumn({ form, setForm }) {
		return (
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
		);
	}

	function AggroColumn({ form, setForm }) {
		return (
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
					onChange={(e) => setForm({ ...form, aggression: e.target.value })}
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
		);
	}

	function LovesColumn({ form, setForm }) {
		return (
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
		);
	}

	function HatesColumn({ form, setForm }) {
		return (
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
		);
	}

	function MutationsColumn({ form, setForm }) {
		return (
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
					onChange={(e) => setForm({ ...form, mutations: e.target.value })}
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
		);
	}

	function SaveButton({
		editIdx,
		form,
		cats,
		setEditIdx,
		resetForm,
		setShowForm,
	}) {
		return (
			editIdx !== null && (
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
			)
		);
	}

	return (
		<>
			{showForm && (
				<div
					className="table-edit-row"
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
						<NameColumn form={form} setForm={setForm} />
						<SexColumn form={form} setForm={setForm} />
						<RoomColumn form={form} setForm={setForm} rooms={rooms} />
						<StatColumns form={form} setForm={setForm} />
						<LibidoColumn form={form} setForm={setForm} />
						<AggroColumn form={form} setForm={setForm} />
						<LovesColumn form={form} setForm={setForm} />
						<HatesColumn form={form} setForm={setForm} />
						<MutationsColumn form={form} setForm={setForm} />
						<SaveButton
							editIdx={editIdx}
							form={form}
							cats={cats}
							setEditIdx={setEditIdx}
							resetForm={resetForm}
							setShowForm={setShowForm}
						/>
					</div>
				</div>
			)}
		</>
	);
}

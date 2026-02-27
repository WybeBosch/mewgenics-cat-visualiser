import { useState, useEffect, useCallback } from 'react';

// Optional JSON preload file copied to web root by Vite static copy plugin.
// This file may not exist in all environments (e.g. web deploy), so load it at runtime.
import { logIfEnabled } from './utils/utils.jsx';

export function useMewgenicsCatsLogic() {
	const [cats, setCats] = useState([]);
	const [sourceMeta, setSourceMeta] = useState(null);
	const [activeRoom, setActiveRoom] = useState('');
	const [loaded, setLoaded] = useState(false);
	const [savLoading, setSavLoading] = useState(false);
	const [savError, setSavError] = useState(null);
	const [hoveredCatId, setHoveredCatId] = useState(null);

	const formatDateText = useCallback((value) => {
		if (value === null || value === undefined || value === '') return '';

		const parsedValue =
			typeof value === 'number'
				? value
				: typeof value === 'string' && /^\d+$/.test(value)
					? Number(value)
					: value;

		const date = new Date(parsedValue);
		if (Number.isNaN(date.getTime())) return String(value);
		return date.toLocaleString();
	}, []);

	const getSourceMetaDateText = useCallback(
		(meta) => {
			if (!meta) return 'Loaded now';

			const fileDateText = formatDateText(meta.fileModifiedAt);
			if (fileDateText) return fileDateText;

			const scriptDateText = formatDateText(meta.scriptStartTime);
			if (scriptDateText) return scriptDateText;

			const loadedDateText = formatDateText(meta.loadedAt);
			if (loadedDateText) return loadedDateText;

			return 'Loaded now';
		},
		[formatDateText]
	);

	const getSourceLabel = useCallback((sourceType) => {
		switch (sourceType) {
			case 'preload-json':
				return '[local .JSON]';
			case 'upload-json':
				return '[.JSON]';
			case 'upload-sav':
				return '[.SAV]';
			default:
				return '[data]';
		}
	}, []);

	const dataTimeLineText =
		cats.length === 0
			? 'No data loaded yet'
			: `${getSourceLabel(sourceMeta?.sourceType)} - Data Time: ${getSourceMetaDateText(sourceMeta)}`;

	// Compute rooms from cats
	const rooms = Array.from(new Set(cats.map((c) => c.room)));

	// Keep activeRoom valid
	useEffect(() => {
		if (!rooms.includes(activeRoom)) setActiveRoom(rooms[0] || '');
	}, [rooms]);

	// Load cats from storage and JSON, merge mutations, use newer source
	useEffect(() => {
		let cancelled = false;
		(async () => {
			let jsonCats = [];
			let jsonSourceMeta = null;
			let jsonTimestamp = '';
			let storageCats = [];
			let storageSourceMeta = null;
			let storageTimestamp = '';
			try {
				// Optional preload JSON (safe when missing)
				const preloadJsonUrl = `${import.meta.env.BASE_URL}mewgenics_cats.json`;
				const response = await fetch(preloadJsonUrl, { cache: 'no-store' });
				if (!response.ok) {
					if (response.status !== 404) {
						logIfEnabled(
							`[cats] preload fetch failed: ${response.status} ${response.statusText}`
						);
					}
					throw new Error('No preload JSON found');
				}
				const data = await response.json();
				jsonCats = Array.isArray(data) ? data : data.cats || [];
				if (jsonCats.length > 0 && jsonCats[0].script_start_time) {
					jsonTimestamp = jsonCats[0].script_start_time;
				}
				jsonSourceMeta = {
					sourceType: 'preload-json',
					scriptStartTime: jsonTimestamp || '',
					loadedAt: new Date().toISOString(),
				};
			} catch (err) {
				logIfEnabled(
					'[cats] optional preload JSON not used:',
					err?.message || err
				);
			}
			try {
				// Load storage
				const storageRaw = await window.storage.get('mewgenics-v14');
				if (storageRaw) {
					const parsed = JSON.parse(storageRaw);
					storageCats = Array.isArray(parsed.cats) ? parsed.cats : [];
					storageSourceMeta = parsed.sourceMeta || null;
					if (storageCats.length > 0 && storageCats[0].script_start_time) {
						storageTimestamp = storageCats[0].script_start_time;
					}
					if (!storageSourceMeta) {
						storageSourceMeta = {
							sourceType: 'legacy-storage',
							scriptStartTime: storageTimestamp || '',
							loadedAt: new Date().toISOString(),
						};
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
			if (!cancelled) {
				logIfEnabled('[cats] mergedCats:', mergedCats);
				setCats(mergedCats);
				setSourceMeta(useJson ? jsonSourceMeta : storageSourceMeta);
				setLoaded(true);
			}
		})();
		return () => {
			cancelled = true;
		};
	}, []);

	// Save cats to storage
	useEffect(() => {
		if (!loaded) return;
		(async () => {
			try {
				await window.storage.set(
					'mewgenics-v14',
					JSON.stringify({ cats, sourceMeta })
				);
				logIfEnabled('[cats] saved to storage:', cats);
			} catch {}
		})();
	}, [cats, loaded, sourceMeta]);

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
			const nextSourceMeta = {
				sourceType: 'upload-sav',
				fileModifiedAt:
					typeof file?.lastModified === 'number' ? file.lastModified : '',
				scriptStartTime: extractedCats[0]?.script_start_time || '',
				loadedAt: new Date().toISOString(),
			};
			setCats(extractedCats);
			setSourceMeta(nextSourceMeta);
			setLoaded(true);
			setActiveRoom([...new Set(extractedCats.map((c) => c.room))][0] || '');
			try {
				await window.storage.set(
					'mewgenics-v14',
					JSON.stringify({ cats: extractedCats, sourceMeta: nextSourceMeta })
				);
				logIfEnabled('[sav] saved extractedCats:', extractedCats);
			} catch {}
		} catch (err) {
			logIfEnabled('[extractSaveFile] Error:', err);
			setSavError(`Error reading save file: ${err.message}`);
		} finally {
			setSavLoading(false);
		}
	}, []);

	// Handler for uploaded JSON
	const handleUploadJson = useCallback((uploadedCats, file) => {
		const nextSourceMeta = {
			sourceType: 'upload-json',
			fileModifiedAt:
				typeof file?.lastModified === 'number' ? file.lastModified : '',
			scriptStartTime: uploadedCats[0]?.script_start_time || '',
			loadedAt: new Date().toISOString(),
		};
		setCats(uploadedCats);
		setSourceMeta(nextSourceMeta);
		setLoaded(true);
		const newRooms = [...new Set(uploadedCats.map((c) => c.room))];
		setActiveRoom(newRooms[0] || '');
		(async () => {
			try {
				await window.storage.set(
					'mewgenics-v14',
					JSON.stringify({ cats: uploadedCats, sourceMeta: nextSourceMeta })
				);
				logIfEnabled('[json] saved uploadedCats:', uploadedCats);
			} catch {}
		})();
	}, []);

	// Utility: get cat age
	const getAge = useCallback((cat) => {
		if (typeof cat.saveDay === 'number' && typeof cat.birthday === 'number') {
			return cat.saveDay - cat.birthday;
		}
		return null;
	}, []);

	return {
		cats,
		setCats,
		rooms,
		activeRoom,
		setActiveRoom,
		dataTimeLineText,
		loaded,
		savLoading,
		savError,
		hoveredCatId,
		setHoveredCatId,
		handleUploadSav,
		handleUploadJson,
		getAge,
	};
}

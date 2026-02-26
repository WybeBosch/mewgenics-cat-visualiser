import { useState, useEffect, useCallback } from 'react';
import { logIfEnabled } from './utils/utils.jsx';

export function useMewgenicsCatsLogic() {
	const [cats, setCats] = useState([]);
	const [activeRoom, setActiveRoom] = useState('');
	const [loaded, setLoaded] = useState(false);
	const [savLoading, setSavLoading] = useState(false);
	const [savError, setSavError] = useState(null);
	const [hoveredCatId, setHoveredCatId] = useState(null);

	// Compute rooms from cats
	const rooms = Array.from(new Set(cats.map((c) => c.room)));

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
			setSavError(`Error reading save file: ${err.message}`);
		} finally {
			setSavLoading(false);
		}
	}, []);

	// Handler for uploaded JSON
	const handleUploadJson = useCallback((uploadedCats) => {
		setCats(uploadedCats);
		setLoaded(true);
		const newRooms = [...new Set(uploadedCats.map((c) => c.room))];
		setActiveRoom(newRooms[0] || '');
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

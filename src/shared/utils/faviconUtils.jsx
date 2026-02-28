import { useEffect } from 'react';
import { APP_EMOJIS } from '../config/config.jsx';

function toFaviconSvgDataUrl(emoji) {
	const svg = `<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 64 64'><text y='52' font-size='52'>${emoji}</text></svg>`;
	return `data:image/svg+xml,${encodeURIComponent(svg)}`;
}

function setEnvironmentFavicon() {
	const isLocal = import.meta.env.DEV;
	const faviconEmoji = isLocal ? APP_EMOJIS.local : APP_EMOJIS.default;
	const faviconHref = toFaviconSvgDataUrl(faviconEmoji);

	let link = document.querySelector("link[rel='icon']");
	if (!link) {
		link = document.createElement('link');
		link.rel = 'icon';
		document.head.appendChild(link);
	}

	link.type = 'image/svg+xml';
	link.href = faviconHref;
}

function useEnvironmentFavicon() {
	useEffect(() => {
		setEnvironmentFavicon();
	}, []);
}

export { setEnvironmentFavicon, useEnvironmentFavicon };

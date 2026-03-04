import type { Dispatch, SetStateAction } from 'react';

export default function TooltipCloseArea({
	selectedCatId,
	setSelectedCatId,
}: {
	selectedCatId: string | number | null;
	setSelectedCatId: Dispatch<SetStateAction<string | number | null>>;
}) {
	return (
		<>
			{selectedCatId !== null && (
				<rect
					className="close-area"
					x={0}
					y={0}
					width="100%"
					height="100%"
					fill="transparent"
					onClick={() => setSelectedCatId(null)}
				/>
			)}
		</>
	);
}

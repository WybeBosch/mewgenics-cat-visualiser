import { Heading } from './partials/Heading';
import { ButtonUploadSave } from './partials/ButtonUploadSave';
import { ButtonUploadJson } from './partials/ButtonUploadJson';
import { ButtonDownloadJson } from './partials/ButtonDownloadJson';

export function Header({
	cats,
	rooms,
	getAge,
	onUploadJson,
	onUploadSav,
	savLoading,
	savError,
}) {
	return (
		<>
			<header
				className="header"
				style={{
					display: 'flex',
					alignItems: 'center',
					justifyContent: 'space-between',
					marginBottom: 24,
				}}
			>
				<Heading cats={cats} rooms={rooms} getAge={getAge} />
				<div
					className="button-bar"
					style={{
						display: 'flex',
						flexDirection: 'row',
						justifyContent: 'space-between',
						gap: '1.5rem',
					}}
				>
					<ButtonUploadSave
						onUploadSav={onUploadSav}
						savLoading={savLoading}
						savError={savError}
					/>
					<ButtonUploadJson onUploadJson={onUploadJson} />
					<ButtonDownloadJson cats={cats} />
				</div>
			</header>
		</>
	);
}

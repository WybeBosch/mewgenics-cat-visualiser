import { Heading } from './partials/Heading/Heading';
import { ButtonUploadSave } from './partials/ButtonUploadSave/ButtonUploadSave';
import { ButtonUploadJson } from './partials/ButtonUploadJson/ButtonUploadJson';
import { ButtonDownloadJson } from './partials/ButtonDownloadJson/ButtonDownloadJson';
import './Header.css';

export function Header({
	cats,
	rooms,
	getAge,
	dataTimeLineText,
	onUploadJson,
	onUploadSav,
	savLoading,
	savError,
}) {
	return (
		<>
			<header className="header">
				<Heading
					cats={cats}
					rooms={rooms}
					getAge={getAge}
					dataTimeLineText={dataTimeLineText}
				/>
				<div className="button-bar">
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

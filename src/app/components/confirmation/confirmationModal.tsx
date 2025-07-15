import {ReactNode, useEffect, useRef} from "react";

export default function ConfirmationModal({title, message, onAction, noButtonText, yesButtonText}: {
	title?: ReactNode | string,
	message?: ReactNode | string,
	onAction: (confirmed: boolean) => void,
	noButtonText: string,
	yesButtonText: string,
}) {
	const dialogRef = useRef<HTMLDialogElement>(null);

	useEffect(() => {
		if (dialogRef && dialogRef.current) {
			dialogRef.current.showModal();
		}
	}, [dialogRef]);

	return (<>
		<dialog className="modal" ref={dialogRef}>
			<div className="modal-box w-1/2 flex flex-col gap-3">
				<h3 className="font-Tomorrow font-bold text-xl">{title || "Are you Sure?"}</h3>
				<p className="">{message || ""}</p>
				<div className="flex flex-row gap-2 w-full">
					<button className="btn btn-secondary grow" onClick={() => {
						onAction(false);
					}}>{noButtonText}</button>
					<button className="btn btn-accent grow" onClick={() => {
						onAction(true);
					}}>{yesButtonText}</button>
				</div>
			</div>
			<form method="dialog" className="modal-backdrop">
				<button onClick={() => {
					onAction(false);
				}}>close</button>
			</form>
		</dialog>
	</>)
}
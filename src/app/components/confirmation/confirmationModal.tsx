import {ReactNode, useEffect, useRef} from "react";

/**
 * A confirmation modal.<br>
 * Directly using this is not recommended, use {@link confirmationPrompt} for easy handling of creation and responses.
 * @param components
 * @param components.title
 * @param components.message
 * @param components.onAction called when either button is pressed, or when the modal is closed, and returns that outcome.
 * @param components.noButtonText
 * @param components.yesButtonText
 * @constructor
 */
export function ConfirmationModal({title, message, onAction, noButtonText, yesButtonText}: {
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

	useEffect(() => {
		const dialog = dialogRef.current;
		if (!dialog) return;

		function onCancel(e: Event) {
			onAction(false);
		}
		dialog.addEventListener("cancel", onCancel);
		return () => {
			dialog.removeEventListener("cancel", onCancel);
		}
	}, [dialogRef, onAction]);

	return (<>
		<dialog className="modal" ref={dialogRef}>
			<div className="modal-box w-1/2 max-h-3/4 flex flex-col gap-3">
				<h3 className="font-Tomorrow font-bold text-xl">{title || "Are you Sure?"}</h3>
				{message || ""}
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

/**
 * An alert modal.<br>
 * Directly using this is not recommended, use {@link alertPrompt} for easy handling of creation and responses.
 * @param components
 * @param components.title
 * @param components.message
 * @param components.onAction returns void when the modal is closed.
 * @param components.okButtonText
 * @constructor
 */
export function AlertModal({title, message, onAction, okButtonText}: {
	title?: ReactNode | string,
	message?: ReactNode | string,
	onAction: () => void,
	okButtonText: string,
}) {
	const dialogRef = useRef<HTMLDialogElement>(null);

	useEffect(() => {
		if (dialogRef && dialogRef.current) {
			dialogRef.current.showModal();
		}
	}, [dialogRef]);

	useEffect(() => {
		const dialog = dialogRef.current;
		if (!dialog) return;

		function onCancel(e: Event) {
			onAction();
		}
		dialog.addEventListener("cancel", onCancel);
		return () => {
			dialog.removeEventListener("cancel", onCancel);
		}
	}, [dialogRef, onAction]);

	return (<>
	<dialog className="modal" ref={dialogRef}>
			<div className="modal-box w-1/2 max-h-3/4 flex flex-col gap-3">
				<h3 className="font-Tomorrow font-bold text-xl">{title || "Alert"}</h3>
				{message || ""}
				<div className="flex flex-row gap-2 w-full">
					<button className="btn btn-accent grow" onClick={() => {
						onAction();
					}}>{okButtonText}</button>
				</div>
			</div>
	</dialog>
	</>)
}
"use client";

import {useRef} from "react";

export function HideCreditBox({showCredit, setShowCreditAction}: {
	showCredit: boolean,
	setShowCreditAction: (hideCredit: boolean) => void;
}) {
	const dialogRef = useRef<HTMLDialogElement>(null);

	return (<>
		<fieldset className="flex flex-row gap-2 ml-5">
			<input type="checkbox" className="checkbox" checked={!showCredit} onChange={(e) => {
				if (e.target.checked) {
					dialogRef.current?.showModal();
				} else {
					setShowCreditAction(!showCredit);
				}
			}}/>
			<label className="label">Hide Watermark</label>
		</fieldset>

		<dialog className="modal" ref={dialogRef}>
			<div className="modal-box flex flex-col gap-2">
				<h2>Hide Watermark?</h2>
				<p>
					This will hide the watermark (<i>simplified-proxies.mm4096.com</i>) at the bottom of each card.
					<br/><br/>
					This action is discouraged, as it doesn&apos;t give Simplified Proxies any credit for your proxies,
					but you can choose to hide the watermark this time anyways.
					<br/>
					Showing the watermark signifies your support for Simplified Proxies, and is very appreciated!
				</p>
				<div className="flex flex-row gap-2">
					<button className="btn btn-outline grow" onClick={() => {
						dialogRef.current?.close();
					}}>Keep Watermark
					</button>
					<button className="btn btn-error btn-outline grow" onClick={() => {
						setShowCreditAction(!showCredit);
						dialogRef.current?.close();
					}}>Hide Watermark Anyways
					</button>
				</div>
			</div>
			<form method="dialog" className="modal-backdrop">
				<button>close</button>
			</form>
		</dialog>
	</>)
}
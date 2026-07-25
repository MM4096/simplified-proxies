"use client";

import {useEffect, useRef, useState} from "react";

export function HideCreditBox({showCredit, setShowCreditAction}: {
	showCredit: boolean,
	setShowCreditAction: (hideCredit: boolean) => void;
}) {
	const localStorageKey = "showWatermarkPopup";
	const [showWatermarkPopup, setShowWatermarkPopup] = useState<boolean>(true);
	const [isMounted, setIsMounted] = useState<boolean>(false);

	const dialogRef = useRef<HTMLDialogElement>(null);

	useEffect(() => {
		setIsMounted(true);
		setShowWatermarkPopup((localStorage.getItem(localStorageKey) || "1") === "1");
	}, []);

	useEffect(() => {
		if (!isMounted) return;
		localStorage.setItem(localStorageKey, showWatermarkPopup ? "1" : "0");
	}, [showWatermarkPopup, isMounted]);

	return (<>
		<label className="label">
			<input type="checkbox" className={`checkbox ${!showCredit && "checkbox-error"}`} checked={!showCredit} onChange={(e) => {
				if (e.target.checked && showWatermarkPopup) {
					dialogRef.current?.showModal();
				} else {
					setShowCreditAction(!showCredit);
				}
			}}/>
			Hide Watermark
		</label>

		<dialog className="modal" ref={dialogRef}>
			<div className="modal-box flex flex-col gap-2">
				<h2>Hide Watermark?</h2>
				<p>
					This will hide the watermark (<i>simplified-proxies.mm4096.com</i>) at the bottom of each card.
					<br/><br/>
					Showing the watermark signifies your support for Simplified Proxies, and is very appreciated.
				</p>

				<label className="label">
					<input type="checkbox" className="checkbox" checked={!showWatermarkPopup} onChange={(e) => {
						setShowWatermarkPopup(!e.target.checked);
					}}/>
					Don't show this message again
				</label>

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
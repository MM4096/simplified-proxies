"use client";

import {useEffect, useRef, useState} from "react";
import {
	changelog,
	compareChangelogVersion,
	getAllChangelogsPastVersion,
	getLatestChangelogVersion
} from "@/lib/changelog";

export function ChangelogComponent() {
	const dialogRef = useRef<HTMLDialogElement>(null);

	const [lastSavedVersion, setLastSavedVersion] = useState<string>("v0");

	useEffect(() => {
		const savedVersion = localStorage.getItem("lastSavedVersion");
		if (savedVersion) {
			setLastSavedVersion(savedVersion);
		}
	}, []);

	function updateLastSavedVersion() {
		localStorage.setItem("lastSavedVersion", getLatestChangelogVersion());
		setLastSavedVersion(getLatestChangelogVersion());
	}

	return (<>
		<div className={`indicator ${getAllChangelogsPastVersion(lastSavedVersion).length > 0 ? "mr-1" : ""}`}>
			{
				getAllChangelogsPastVersion(lastSavedVersion).length > 0 &&
				<span className="indicator-item badge badge-xs badge-primary"/>
			}
			<button className="index-link" onClick={() => {
				dialogRef.current?.showModal();
			}}>What&apos;s New
			</button>
		</div>

		<dialog className="modal" ref={dialogRef}>
			<div className="modal-box flex flex-col min-h-9/10 max-h-9/10">
				<div className="flex flex-col gap-2 flex-1 overflow-y-auto min-h-0">
					{
						changelog.map((item, index) => {
							return (
								<div tabIndex={0}
									 className={`collapse collapse-plus bg-base-100 border-base-300 border shrink-0`}
									 key={index}>
									<div className="collapse-title font-bold flex flex-row gap-2 items-center">{item.version}
										{
											compareChangelogVersion(item.version, lastSavedVersion) >= 1 && (<span className="badge badge-xs badge-primary">New</span>)
										}
									</div>
									<div className="collapse-content text-sm">
										{item.changes}
									</div>
								</div>)
						})
					}
				</div>
				<button className="btn btn-primary" onClick={() => {
					updateLastSavedVersion();
					dialogRef.current?.close();
				}}>Close
				</button>
			</div>
			<form method="dialog" className="modal-backdrop">
				<button onClick={() => {
					updateLastSavedVersion();
					dialogRef.current?.close();
				}}>close</button>
			</form>
		</dialog>
	</>)
}
"use client";

import {ComponentType, useEffect, useRef, useState} from "react";
import {Card} from "@/lib/card";

export type ImportProps = {
	cards: Card[],
	setCardsAction: (cards: Card[]) => void,
	closeDialogAction: () => void,
}

export function ImportComponent({cards, setCardsAction, InnerComponent}: {
	cards: Card[],
	setCardsAction: (cards: Card[]) => void,
	InnerComponent: ComponentType<ImportProps>
}) {
	const dialogRef = useRef<HTMLDialogElement>(null);

	const [isMounted, setIsMounted] = useState<boolean>(false);

	useEffect(() => {
		setIsMounted(true);
	}, []);

	return (<>
		<button className="btn btn-primary" onClick={() => {
			dialogRef?.current?.showModal();
		}}>Import Cards
		</button>
		<dialog className="modal w-full" ref={dialogRef}>
			<div className="modal-box min-w-[50vw] max-w-[100vw] md:max-w-[75vw] max-h-[90vh] overflow-y-auto">
				{/* TODO: Fix hydration warning */}
				<InnerComponent cards={cards} setCardsAction={setCardsAction} closeDialogAction={() => {
					dialogRef?.current?.close();
				}}/>
			</div>

			<form method="dialog" className="modal-backdrop">
				<button>close</button>
			</form>
		</dialog>
	</>)
}
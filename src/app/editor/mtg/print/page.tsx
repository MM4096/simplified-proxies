"use client";

import "../../../styles/editor.css"
import "../../../styles/print.css"
import "../../../styles/card/card.css"
import "../../../styles/card/mtg-card.css"
import {PrintPage} from "@/app/editor/components/printPage";

export default function MTGPrintPage() {
	return <PrintPage gameLocalStorageKey="mtg-cards" gameId="mtg"/>
}
"use client";

import "../../../styles/editor.css"
import "../../../styles/print.css"
import "../../../styles/card/card.css"
import "../../../styles/card/ptcg-card.css"
import {PrintPage} from "@/app/editor/components/printPage";

export default function PTCGPrintPage() {
	return <PrintPage gameLocalStorageKey="ptcg-cards" gameId="ptcg"/>
}
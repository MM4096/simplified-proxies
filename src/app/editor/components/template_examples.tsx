import {Card} from "@/lib/card";
import {useRef} from "react";

export function TemplateExamples({templates, appendCard}: {
	templates: Record<string, Card>,
	appendCard: (card: Card) => void,
}) {
	const templateDialogRef = useRef<HTMLDialogElement>(null);

	return (<>
		<button className="btn btn-outline" onClick={() => {
			templateDialogRef.current?.showModal();
		}}>
			Template Examples
		</button>

		<dialog className="modal" ref={templateDialogRef}>
			<div className="modal-box flex flex-col gap-2">
				<h2 className="custom-divider">Template Examples</h2>
				<p>
					Below are some example templates you can use to quickly create a card.
					<br/><br/>
					You can also use the &quot;Import Cards&quot; feature to import cards from Scryfall.
				</p>
				<div className="flex flex-col gap-2">
					{
						Object.entries(templates).map(([name, card], index) => {
							return (<button className="btn btn-outline" onClick={() => {
								appendCard(card);
								templateDialogRef.current?.close();
							}} key={index}>{name}</button>)
						})
					}
					<br/>
					<button className="btn btn-primary" onClick={() => {
						templateDialogRef.current?.close();
					}}>Close</button>
				</div>
			</div>
			<form method="dialog" className="modal-backdrop">
				<button>close</button>
			</form>
		</dialog>
	</>)
}
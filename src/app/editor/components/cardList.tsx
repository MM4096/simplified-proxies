import {confirmationPrompt} from "@/app/components/confirmation/confirmationFunctions";
import {Card} from "@/lib/card";

export function CardList({cards, setCards, editingIndex, setEditingIndex, className, newCard}: {
	cards: Card[];
	setCards: (cards: Card[]) => void;
	editingIndex: number | null;
	setEditingIndex: (index: number | null) => void;
	newCard: () => void;
	className?: string;
}) {
	if (cards.length === 0) return (
		<div className="card-list">
			<h2 className="custom-divider">Card List</h2>
			<p>No cards</p>
		</div>
	)

	return (<div className={`${className} card-list max-h-full overflow-y-auto`}>
		<h2 className="custom-divider">Card List</h2>
		<div className="flex flex-col gap-2 overflow-y-auto">
			{
				cards.map((card, index) => {
					return (<div
						className={`btn border border-black p-3 rounded-xl flex flex-row items-center text-left ${index === editingIndex && "bg-gray-300"}`}
						key={index}
						onClick={() => {
							setEditingIndex(index);
						}}>
						<button className="flex flex-row items-center text-left grow">
							<span className="grow">{card.card_name}</span>
						</button>


						<span className="text-xs mr-2">QTY:</span>
						<input className="input input-sm w-[15ch]" type="number" value={card.quantity || 1}
							   onChange={(e) => {
								   const value = parseInt(e.target.value);

								   if (value <= 0) {
									   setCards(cards.filter((_, i) => i !== index));
								   } else {
									   setCards([...cards.slice(0, index), {
										   ...card,
										   quantity: value
									   }, ...cards.slice(index + 1)]);
								   }
							   }}/>

						<button className="btn btn-sm hover:btn-error" onClick={async () => {
							if (await confirmationPrompt("Are you sure?", "Are you sure you want to delete this card? This action is irreversible.", "No", "Yes"))
								setCards(cards.filter((_, i) => i !== index));
						}}>Remove
						</button>
					</div>)
				})
			}
			<button
				className={`border border-black rounded-xl btn ${(editingIndex === null || editingIndex < 0) && "bg-gray-300"}`}
				onClick={newCard}>New Card
			</button>
		</div>
	</div>)
}
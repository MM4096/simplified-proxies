import {confirmationPrompt} from "@/app/components/confirmation/confirmationFunctions";
import {Card} from "@/lib/card";
import {BiTrash} from "react-icons/bi";
import {ReactNode, useState} from "react";

export function CardList({cards, setCards, editingIndex, setEditingIndex, className, newCard}: {
	cards: Card[];
	setCards: (cards: Card[]) => void;
	editingIndex: number | null;
	setEditingIndex: (index: number | null) => void;
	newCard: () => void;
	className?: string;
}) {
	const [filter, setFilter] = useState<string>("");

	function getFullDisplayName(card: Card): string | ReactNode {
		if (card.hasOwnProperty("reverse_card_name") && (card as Record<string, unknown>)["reverse_card_name"] !== "") {
			return `${card.card_name} // ${(card as Record<string, unknown>).reverse_card_name}`;
		}

		if (card.hasOwnProperty("flavor_name") && (card as Record<string, unknown>)["flavor_name"] !== "") {
			return (<>{(card as Record<string, unknown>)["flavor_name"]} (<i>{card.card_name}</i>)</>)
		}

		return card.card_name || ""
	}

	if (cards.length === 0) return (
		<div className="card-list">
			<h2 className="custom-divider">Card List</h2>
			<p>No cards</p>
		</div>
	)

	return (<div className={`${className} card-list max-h-full h-full overflow-y-auto md:w-1/5`}>
		<h2 className="custom-divider">Card List</h2>
		<input className="input w-full shrink-0 rounded-xl" type="text" placeholder="Filter cards..." value={filter}
			   onChange={(e) => {
				   setFilter(e.target.value);
			   }}
		/>
		<div className="flex flex-col gap-2 overflow-y-auto">
			{
				cards.map((card, index) => {
					if (!getFullDisplayName(card)?.toString().toLowerCase().includes(filter.toLowerCase())) {
						return null;
					}

					return (<div
						className={`btn border border-black rounded-xl flex flex-row items-center text-left wrap-normal ${index === editingIndex && "bg-gray-300"}`}
						key={index}
						onClick={() => {
							setEditingIndex(index);
						}}>
						<button className="flex flex-row items-center text-left grow overflow-x-hidden">
							<span className="text-ellipsis overflow-hidden whitespace-nowrap">
								{getFullDisplayName(card)}
							</span>
						</button>


						<span className="text-xs mr-2">QTY:</span>
						<input className="input input-sm shrink !max-w-[10ch]" type="number" value={card.quantity || 1}
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

						<button className="btn btn-sm m-0 hover:btn-error" onClick={async (e) => {
							if (e.shiftKey ||
								await confirmationPrompt("Are you sure?", "Are you sure you want to delete this card? This action is irreversible. (Holding down Shift while deleting a card bypasses this message)", "No", "Yes"))
								setCards(cards.filter((_, i) => i !== index));
						}}>
							<BiTrash/>
						</button>
					</div>)
				})
			}
			<button
				className={`border border-black rounded-xl btn ${(editingIndex === null || editingIndex < 0) && "bg-gray-300"}`}
				onClick={newCard}>New Card
			</button>

			<div className="grow"/>
			<i className="block md:hidden text-sm">
				Looking to import cards? Press Menu then Import Cards.
			</i>
		</div>
	</div>)
}
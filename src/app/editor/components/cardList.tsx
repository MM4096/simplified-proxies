export interface Card {
	card_name?: string;
	card_text?: string;
	quantity?: number
}

export function CardList({cards, setCards, editingIndex, setEditingIndex,}: {
	cards: Card[];
	setCards: (cards: Card[]) => void;
	editingIndex: number | null;
	setEditingIndex: (index: number | null) => void;
}) {
	if (cards.length === 0) return (
		<div className="card-list">
			<p>No cards</p>
		</div>
	)

	return (<div className="card-list max-h-full overflow-y-auto">
		{
			cards.map((card, index) => {
				return (<button className={`border border-black p-3 rounded-xl flex flex-row items-center text-left cursor-pointer ${index === editingIndex && "bg-gray-300"}`} key={index}
				onClick={() => {
					setEditingIndex(index);
				}}>
					<span className="grow">{card.card_name}</span>
					<span className="text-xs mr-2">QTY:</span>
					<input className="input input-sm w-[15ch]" type="number" value={card.quantity || 1}
					onChange={(e) => {
						const value = parseInt(e.target.value);

						if (value <= 0) {
							setCards(cards.filter((_, i) => i !== index));
						} else {
							setCards([...cards.slice(0, index), {...card, quantity: value}, ...cards.slice(index + 1)]);
						}
					}}/>
				</button>)
			})
		}
	</div>)
}
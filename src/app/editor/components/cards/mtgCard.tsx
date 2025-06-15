import "../../../styles/card/card.css";
import "../../../styles/card/mtg-card.css";
import {MTGCard} from "@/app/editor/mtg/page";
import {convertStringToIconObject} from "@/app/editor/components/cards/iconDatabase";

function getPowerToughnessText(power?: string, toughness?: string): string | null {

	if ((power === undefined || power === "") && (toughness === undefined || toughness === "")) {
		return null;
	}

	const parts: string[] = [];
	if (power !== undefined && power !== "") {
		parts.push(power);
	}
	if (toughness !== undefined && toughness !== "") {
		parts.push(toughness);
	}
	return parts.join(" / ");
}

function hasReverseFace(card: MTGCard): boolean {
	if (card.reverse_card_name || card.reverse_mana_cost || card.reverse_type_line || card.reverse_text) {
		return true;
	}
	return false;
}

export function MtgCard({card, isBlackWhite, id}: {
	card: MTGCard,
	isBlackWhite: boolean,
	id?: string,
}) {

	return (<div className="card" id={id} key={id}>
		<div className="card-title-container">
			<h2 className="card-title">{card.card_name}</h2>
			<div className="mana-cost" dangerouslySetInnerHTML={{
				__html: convertStringToIconObject(card.mana_cost || "", "mtg", isBlackWhite)
			}}/>
		</div>

		<div className="card-divider"/>
		<p className="type-line">{card.type_line?.replaceAll("{-}", "—")}</p>
		<div className="card-divider"/>

		<div className="card-text" dangerouslySetInnerHTML={{
			__html: convertStringToIconObject(card.card_text || "", "mtg", isBlackWhite)
		}}/>
		<div className="mb-3"/>

		<div className="flavor-text" dangerouslySetInnerHTML={{
			__html: `<i>${convertStringToIconObject(card.flavor_text || "", "mtg", isBlackWhite)}</i>`
		}}/>

		<div className="grow"/>

		<div className="bottom-container">
			<p className="notes">{card.notes}</p>
			{
				getPowerToughnessText(card.power, card.toughness) !== null && (
					<p className="power-toughness">{getPowerToughnessText(card.power, card.toughness)}</p>
				)
			}
		</div>

		{
			hasReverseFace(card) && (<>
			<div className="card-divider"/>
			<div className="card-reverse">
				<div className="card-title-container">
					<h2 className="card-title">{card.reverse_card_name}</h2>
					<div className="mana-cost" dangerouslySetInnerHTML={{
						__html: convertStringToIconObject(card.reverse_mana_cost || "", "mtg", isBlackWhite)
					}}/>
				</div>
				<div className="card-divider"/>
				<p className="type-line">{card.reverse_type_line?.replaceAll("{-}", "—")}</p>
				<div className="card-divider"/>

				<div className="card-text" dangerouslySetInnerHTML={{
					__html: convertStringToIconObject(card.reverse_text || "", "mtg", isBlackWhite)
				}}/>
				<div className="mb-3"/>

				<div className="grow"/>

				<div className="bottom-container">
					{
						getPowerToughnessText(card.reverse_power, card.reverse_toughness) !== null && (
							<p className="power-toughness">{getPowerToughnessText(card.reverse_power, card.reverse_toughness)}</p>
						)
					}
				</div>

			</div>
			</>)
		}

	</div>)
}
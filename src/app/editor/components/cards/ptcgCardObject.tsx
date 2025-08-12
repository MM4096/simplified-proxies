import "../../../styles/card/card.css";
import "../../../styles/card/ptcg-card.css";
import {convertStringToIconObject} from "@/app/editor/components/cards/iconDatabase";
import DOMPurify from "isomorphic-dompurify";
import {PTCGCard} from "@/lib/card";

function isPokemon(card: PTCGCard): boolean {
	function isEmpty(val: string | undefined): boolean {
		return val === undefined || val === "";
	}

	return !isEmpty(card.pokemon_hp) || !isEmpty(card.pokemon_type) || !isEmpty(card.pokemon_weakness) || !isEmpty(card.pokemon_resistance);
}

export function PTCGCardObject({card, isBlackWhite, id, includeCredit=true}: {
	card: PTCGCard,
	isBlackWhite: boolean,
	id?: string,
	includeCredit?: boolean,
}) {
	const isPokemonCard = isPokemon(card);
	const pokemonRetreatCost = parseInt(card.pokemon_retreat_cost || "0");
	let retreatCostText = "";
	if (pokemonRetreatCost > 0) {
		if (pokemonRetreatCost < 5) {
			for (let i = 0; i < pokemonRetreatCost; i++) {
				retreatCostText += "{c}";
			}
		} else {
			retreatCostText = pokemonRetreatCost.toString();
		}
	}

	return (<div className="card ptcg-card" id={id} key={id}>
		<div className="card-title-container">
			{
				(card.card_type?.toLowerCase().indexOf("energy") || -1) >= 0 ? (<h2 className="card-title" dangerouslySetInnerHTML={{
					__html: DOMPurify.sanitize(convertStringToIconObject(card.card_name || "", "ptcg", isBlackWhite))
				}}/>): (<h2 className="card-title">{card.card_name}</h2>)
			}
			{
				isPokemonCard ? (<div className="card-type">
					<span>{card.pokemon_hp}HP</span>
					<span dangerouslySetInnerHTML={{
						__html: DOMPurify.sanitize(convertStringToIconObject(card.pokemon_type || "", "ptcg", isBlackWhite))
					}}/>
				</div>) : (<p className="card-type">{card.card_type?.replaceAll("-", "—")}</p>)
			}
		</div>
		<div className="card-divider"/>

		{
			isPokemonCard && (<>
				<div className="pokemon-evolution-data p-1">
					<span>{card.pokemon_evolution_level}</span>
					{
						card.pokemon_evolves_from && (<>
							<span className="card-divider-left ml-2 pr-2"/>
							<span>Evolves from {card.pokemon_evolves_from}</span>
						</>)
					}
				</div>
				<div className="card-divider"/>
			</>)
		}

		{card.card_text && (<p className="card-text" dangerouslySetInnerHTML={{
			__html: DOMPurify.sanitize(convertStringToIconObject(card.card_text, "ptcg", isBlackWhite))
		}}/>)}

		{
			card.attacks_abilities && card.attacks_abilities.map((item, index) => {
				return (<div className="attack-ability-container" key={index}>
					<div className="attack-ability-title">
						<span className="attack-ability-cost"><i dangerouslySetInnerHTML={{
							__html: DOMPurify.sanitize(convertStringToIconObject(item.cost || "", "ptcg", isBlackWhite))
						}}/></span>
						<span className="card-divider-left ml-2 pr-2"/>
						<span className="attack-ability-name">{item.name}</span>
						{
							item.damage && (<>
								<span className="card-divider-left ml-2 pr-2"/>
								<span>{item.damage}</span>
							</>)
						}
					</div>
					<div className="attack-ability-text">
						<span dangerouslySetInnerHTML={{
							__html: DOMPurify.sanitize(convertStringToIconObject(item.text || "", "ptcg", isBlackWhite))
						}}/>
					</div>
					{
						index !== (card.attacks_abilities?.length || 1) - 1 && (<div className="card-divider"/>)
					}
				</div>)
			})
		}

		{/* Grow so additional rules is at the bottom */}
		<div className="grow"/>

		{
			card.additional_rules && (<>
				<div className="card-divider"/>
				<div className="additional-rules">
					<i>{card.additional_rules}</i>
				</div>
			</>)
		}

		{
			isPokemonCard && (<>
				<div className="card-divider"/>
				<div className="bottom-container">
					<span>Weakness: <span dangerouslySetInnerHTML={{
						__html: DOMPurify.sanitize(convertStringToIconObject(card.pokemon_weakness || "", "ptcg", isBlackWhite))
					}}/></span>

					<span className="card-divider-left">
						Resistance: <span dangerouslySetInnerHTML={{
						__html: DOMPurify.sanitize(convertStringToIconObject(card.pokemon_resistance || "", "ptcg", isBlackWhite))
					}}/></span>

					<span className="card-divider-left">
						Retreat Cost: <span dangerouslySetInnerHTML={{
						__html: DOMPurify.sanitize(convertStringToIconObject(retreatCostText, "ptcg", isBlackWhite))
					}}/></span>
				</div>
			</>)
		}
		{
			includeCredit && (<><div className="card-divider"/><p className="credit"/></>)
		}

	</div>)
}
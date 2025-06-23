import "../../../styles/card/card.css";
import "../../../styles/card/ptcg-card.css";
import {PTCGCard} from "@/app/editor/ptcg/page";
import {convertStringToIconObject} from "@/app/editor/components/cards/iconDatabase";

function isPokemon(card: PTCGCard): boolean {
	function isEmpty(val: string | undefined): boolean {
		return val === undefined || val === "";
	}

	return !isEmpty(card.pokemon_hp) || !isEmpty(card.pokemon_type) || !isEmpty(card.pokemon_weakness) || !isEmpty(card.pokemon_resistance);
}

export function PTCGCardObject({card, isBlackWhite, id}: {
	card: PTCGCard,
	isBlackWhite: boolean,
	id?: string,
}) {
	const isPokemonCard = isPokemon(card);
	const pokemonRetreatCost = parseInt(card.pokemon_retreat_cost || "0");
	let retreatCostText = "";
	if (pokemonRetreatCost > 0) {
		if (pokemonRetreatCost < 5) {
			for (let i = 0; i < pokemonRetreatCost; i++) {
				retreatCostText += "{c}";
			}
		}
		else {
			retreatCostText = pokemonRetreatCost.toString();
		}
	}

	return (<div className="card" id={id} key={id}>
		<div className="card-title-container card-divider">
			<h2 className="card-title">{card.card_name}</h2>
			{
				isPokemonCard ? (<div className="card-type">
					<span>{card.pokemon_hp}HP</span>
					<span dangerouslySetInnerHTML={{
						__html: convertStringToIconObject(card.pokemon_type || "", "ptcg", isBlackWhite)
					}}/>
				</div>) : (<p className="card-type">{card.card_type?.replaceAll("-", "—")}</p>)
			}
		</div>

		{
			isPokemonCard && (<div className="pokemon-evolution-data card-divider p-1">
				<span>{card.pokemon_evolution_level}</span>
				{
					card.pokemon_evolves_from && (<>
						<span className="card-divider-left ml-2 pr-2"/>
						<span>Evolves from {card.pokemon_evolves_from}</span>
					</>)
				}
			</div>)
		}

		{card.card_text && (<p className="card-text" dangerouslySetInnerHTML={{
			__html: convertStringToIconObject(card.card_text, "ptcg", isBlackWhite)
		}}/>)}

		{
			card.attacks_abilities && card.attacks_abilities.map((item, index) => {
				return (<div className="attack-ability-container" key={index}>
					<div className="attack-ability-title">
						<span className="attack-ability-cost"><i dangerouslySetInnerHTML={{
							__html: convertStringToIconObject(item.cost || "", "ptcg", isBlackWhite)
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
							__html: convertStringToIconObject(item.text || "", "ptcg", isBlackWhite)
						}}/>
					</div>
					{
						index !== (card.attacks_abilities?.length || 1) - 1 && (<div className="card-divider"/>)
					}
				</div>)
			})
		}

		{/* Grow so additional rules is at the bottom */}
		<div className="grow card-divider"/>

		<div className="additional-rules">
			<i>{card.additional_rules}</i>
		</div>

		{
			isPokemonCard && (<>
				<div className="card-divider"/>
				<div className="bottom-container">
					<span>Weakness: <span dangerouslySetInnerHTML={{
						__html: convertStringToIconObject(card.pokemon_weakness || "", "ptcg", isBlackWhite)
					}}/></span>

					<span className="card-divider-left">
						Resistance: <span dangerouslySetInnerHTML={{
						__html: convertStringToIconObject(card.pokemon_resistance || "", "ptcg", isBlackWhite)
					}}/></span>

					<span className="card-divider-left">
						Retreat Cost: <span dangerouslySetInnerHTML={{
						__html: convertStringToIconObject(retreatCostText, "ptcg", isBlackWhite)
					}}/></span>
				</div>
			</>)
		}

	</div>)
}
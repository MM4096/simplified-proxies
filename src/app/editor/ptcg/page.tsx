"use client";

import {Card} from "@/app/editor/components/cardList";
import {EditorPage} from "@/app/editor/components/editorPage";
import {PTCGInput} from "@/app/editor/components/inputs";
import {AttacksAbilitiesList} from "@/app/editor/ptcg/components/attacksAbilitiesList";
import {ReactNode} from "react";
import {ImportPTCG} from "@/app/editor/ptcg/components/import";

export interface PTCGCard extends Card {
	card_type?: string,
	additional_rules?: string,
	attacks_abilities?: AttackOrAbility[],

	pokemon_hp?: string,
	pokemon_evolution_level?: string,
	pokemon_evolves_from?: string,
	pokemon_weakness?: string,
	pokemon_resistance?: string,
	pokemon_retreat_cost?: string,
	pokemon_type?: string,
}

export interface AttackOrAbility {
	name?: string,
	text?: string,
	cost?: string,
	damage?: string,
}

export default function PTCGEditorPage() {
	return (<EditorPage gameName="Pokemon Trading Card Game" gameLocalStorageKey="ptcg-cards" gameId="ptcg"
						importCardsAction={({setCards, cards}): ReactNode => {
							return (<ImportPTCG cards={cards} setCardsAction={setCards}/>)
						}}
						cardInputsAction={({onChange, card}) => {
							return (<>

								<PTCGInput card={card} valKey="card_name" setValue={onChange} title="Card Name"
										   placeholder="Pikachu ex"/>

								<PTCGInput card={card} valKey="card_type" setValue={onChange} title="Card Type"
										   placeholder="Pokemon"/>

								<AttacksAbilitiesList attacksAndAbilities={(card as PTCGCard).attacks_abilities || []}
													  setAttacksAndAbilities={(value) => {
														  // @ts-expect-error type mismatch still works
														  onChange("attacks_abilities", value)
													  }}/>

								<PTCGInput card={card} valKey="card_text" setValue={onChange} title="Card Text"
										   placeholder="Heal 30 damage from one of your Pokemon"
										   isTextarea={true}/>

								<PTCGInput card={card} valKey="additional_rules" setValue={onChange}
										   title="Additional Rules"
										   placeholder="Pokemon ex rule: When your Pokemon ex is Knocked Out, your opponent takes 2 Prize cards."
										   isTextarea={true}/>

								<div className="collapse collapse-arrow bg-base-100 border flex-none">
									<input type="checkbox"/>
									<div className="collapse-title">Pokemon Options</div>
									<div className="collapse-content">

										<PTCGInput card={card} valKey="pokemon_hp" setValue={onChange} title="HP"
												   placeholder="190"/>

										<PTCGInput card={card} valKey="pokemon_evolution_level" setValue={onChange}
												   title="Evolution Level" placeholder="Basic"/>

										<PTCGInput card={card} valKey="pokemon_evolves_from" setValue={onChange}
												   title="Evolves From" placeholder="N/A"/>

										<PTCGInput card={card} valKey="pokemon_weakness" setValue={onChange}
												   title="Weakness"
												   placeholder="{f} x2"/>

										<PTCGInput card={card} valKey="pokemon_resistance" setValue={onChange}
												   title="Resistance" placeholder=""/>

										<PTCGInput card={card} valKey="pokemon_retreat_cost" setValue={onChange}
												   title="Retreat Cost" placeholder="3"/>

										<PTCGInput card={card} valKey="pokemon_type" setValue={onChange}
												   title="Pokemon Type" placeholder="{p}"/>
									</div>

								</div>

							</>)
						}}
	/>)
}
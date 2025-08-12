"use client";

import {EditorPage} from "@/app/editor/components/editorPage";
import {PTCGInput} from "@/app/editor/components/inputs";
import {AttacksAbilitiesList} from "@/app/editor/ptcg/components/attacksAbilitiesList";
import {ReactNode} from "react";
import {ImportPTCG} from "@/app/editor/ptcg/components/import";
import {PTCGCard} from "@/lib/card";

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
						demoCard={{
							card_name: "Demo Card",
							card_type: "Unknown",
							card_text: "This is a demo card. Symbols are as follows: \\{a}: {a}, \\{c}: {c}, \\{d}: {d}, \\{f}: {f}, \\{g}: {g}, \\{l}: {l}, \\{m}: {m}, \\{p}: {p}, \\{r}: {r}, \\{w}: {w}, \\{y}: {y}, \\{n}: {n}\nTo make a Pokemon, use \"Pokemon Options\".",
							attacks_abilities: [
								{
									name: "Basics",
									text: "All cards can have attacks/abilities. Just expand \"Attacks and Abilities\" to start!",
									cost: "{n}"
								},
								{
									name: "Sample Ability",
									cost: "Ability",
									text: "For abilities, write \"Ability\" in the Cost field and don't fill in \"Damage\"."
								},
								{
									name: "Sample Attack",
									cost: "{r}{a}{c}{d}",
									damage: "300+",
									text: "For attacks, the Cost field can be a list of symbols."
								}
							],
							additional_rules: "Additional rules (such as ex or AceSpec rules) go here"

							// Can't figure out whether to make it a Pokémon or not.
							// pokemon_hp: "100",
							// pokemon_evolution_level: "Stage 3",
							// pokemon_evolves_from: "Demo",
							// pokemon_weakness: "{r}x2",
							// pokemon_resistance: "{w}-30",
							// pokemon_retreat_cost: "3",
						} as PTCGCard}
	/>)
}
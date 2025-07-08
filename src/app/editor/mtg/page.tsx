"use client";

import {Card} from "@/app/editor/components/cardList";
import {EditorPage} from "@/app/editor/components/editorPage";
import {MTGInput} from "@/app/editor/components/inputs";
import {ReactNode} from "react";
import {ImportMTG} from "@/app/editor/mtg/components/import";

export interface MTGCard extends Card {
	mana_cost?: string;
	type_line?: string;
	flavor_text?: string;
	power?: string;
	toughness?: string;
	reverse_card_name?: string;
	reverse_mana_cost?: string;
	reverse_type_line?: string;
	reverse_text?: string;
	reverse_power?: string;
	reverse_toughness?: string;
	notes?: string;
}

export default function MTGEditorPage() {
	return (<EditorPage gameName="Magic: The Gathering" gameLocalStorageKey="mtg-cards" gameId="mtg"
						importCardsAction={({setCards, cards}): ReactNode => {
							return (<ImportMTG cards={cards} setCardsAction={setCards}/>)
						}}
						cardInputsAction={({onChange, card}): ReactNode => {
							return (<>
								<MTGInput card={card} valKey="card_name" setValue={onChange} title="Card Name"
										  placeholder="Sakura Tribe-Elder"/>

								<MTGInput card={card} valKey="mana_cost" setValue={onChange} title="Mana Cost"
										  placeholder="{1}{g}"/>

								<MTGInput card={card} valKey="type_line" setValue={onChange} title="Type Line"
										  placeholder="Creature {-} Snake Shaman"/>

								<MTGInput card={card} valKey="card_text" setValue={onChange} title="Card Text"
										  placeholder="Sacrifice this creature: Search your library for a basic land card, put that card onto the battlefield tapped, then shuffle."
										  isTextarea={true}/>

								<MTGInput card={card} valKey="flavor_text" setValue={onChange} title="Flavor Text"
										  placeholder="There were no tombstones in orochi territory. Slain warriors were buried with a tree sapling, so they would become a part of the forest after death."
										  isTextarea={true}/>

								<div className="flex flex-row gap-2">
									<MTGInput card={card} valKey="power" setValue={onChange} title="Power"
											  placeholder=""/>
									<MTGInput card={card} valKey="toughness" setValue={onChange} title="Toughness"
											  placeholder=""/>
								</div>
								<p className="label text-xs">If Planeswalker loyalty or Battle Defense is needed, just
									filling
									out &apos;Power&apos; will work.</p>

								<div className="collapse bg-base-100 border flex-none">
									<input type="checkbox"/>
									<div className="collapse-title">Dual-Faced Cards</div>
									<div className="collapse-content">
										<MTGInput card={card} valKey="reverse_card_name" setValue={onChange}
												  title="Name"
												  placeholder=""/>
										<MTGInput card={card} valKey="reverse_mana_cost" setValue={onChange}
												  title="Mana Cost"
												  placeholder=""/>
										<MTGInput card={card} valKey="reverse_type_line" setValue={onChange}
												  title="Type Line"
												  placeholder=""/>
										<MTGInput card={card} valKey="reverse_text" setValue={onChange}
												  title="Card Text"
												  placeholder="" isTextarea={true}/>

										<div className="flex flex-row gap-2">
											<MTGInput card={card} valKey="reverse_power" setValue={onChange}
													  title="Power"
													  placeholder=""/>
											<MTGInput card={card} valKey="reverse_toughness" setValue={onChange}
													  title="Toughness"
													  placeholder=""/>
										</div>
										<p className="label text-xs">If Planeswalker loyalty or Battle Defense is
											needed, just
											filling
											out &apos;Power&apos; will work.</p>
									</div>
								</div>

								{/*<input type="text" name="notes" placeholder=""*/}
								{/*	   className="input"/>*/}
								<MTGInput card={card} valKey="notes" setValue={onChange} title="Notes"
										  placeholder="" isTextarea={true}/>

							</>)
						}}/>)
}
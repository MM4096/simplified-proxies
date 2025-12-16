"use client";

import {EditorPage} from "@/app/editor/components/editorPage";
import {MTGInput} from "@/app/editor/components/inputs";
import {ReactNode} from "react";
import {ImportMTG} from "@/app/editor/mtg/components/import";
import {getEnumKeys} from "@/lib/enum";
import {BiInfoCircle} from "react-icons/bi";
import {ExperimentalBadge} from "@/app/components/experimental";
import {MTGCard, MTGCardTemplate} from "@/lib/card";

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
									<div className="collapse-title">Dual-Faced Cards <p className="text-xs">(click to expand)</p></div>
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

								<div className="flex flex-row gap-2 w-full">
									<MTGInput card={card} valKey="notes" setValue={onChange} title="Notes"
											  placeholder="" isTextarea={true}/>
									<fieldset className="fieldset">
										<div className="flex flex-row gap-2 items-center">
											<legend className="fieldset-legend">Card Template</legend>
											<div className="tooltip">
												<div className="tooltip tooltip-content w-max">Modify the layout of this card.
													<br/><br/><b>OPTIONS:</b><br/>
													<ul>
														<li><b>None</b>: No additional templating.</li>
														<li><b>Mana Counter</b>: Replaces all content of the card with a mana counter.</li>
														<li><b>Token Counter</b>: Adds a table to track tokens in different states.</li>
														<li><b>Half Size</b>: Puts 2 copies of this card in the space of one card.</li>
														<li>All Others: Styles matching card types</li>
													</ul>
												</div>
												<BiInfoCircle/>
											</div>
											<ExperimentalBadge/>
										</div>
										<select className="select"
												value={(card as MTGCard).card_template || MTGCardTemplate.NONE}
												onChange={(e) => {
													onChange("card_template", e.target.value)
												}}>
											{
												getEnumKeys(MTGCardTemplate).map((key, idx) => {
													return (<option key={idx} value={MTGCardTemplate[key]}>
														{MTGCardTemplate[key]}
													</option>)
												})
											}
										</select>
									</fieldset>
								</div>
							</>)
						}}
						demoCard={{
							card_name: "Demo Card",
							mana_cost: "{1}{w}{u}{b}{r}{g}",
							type_line: "Mysterious {-} Card",
							card_text: "Mess around with the different fields of this card! A list of all available symbols can be found on <a href='https://scryfall.com/docs/api/colors#mana-costs-and-other-symbology' class='link' target='_blank'>Scryfall</a>, all forward slashes (/) in mana symbols are optional (i.e. {wbp} is the same as {w/b/p}). This field supports HTML formatting! <b>Bold text</b> <i>Italic Text</i>\nPress \"Import Cards\" to import from a decklist, and \"Preview and Print Proxies\" to see and print your proxies.",
							power: "1", toughness: "1",
							reverse_card_name: "Reverse Cards",
							reverse_type_line: "Mysterious {-} Card Two",
							reverse_mana_cost: "{1}{w}{u}{b}{r}{g}",
							reverse_text: "Can be created by expanding the \"<i>Dual-Faced Cards</i>\" panel"
						} as MTGCard}/>)
}
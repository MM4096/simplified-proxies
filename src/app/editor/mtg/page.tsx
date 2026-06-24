"use client";

import {EditorPage} from "@/app/editor/components/editorPage";
import {MTGInput} from "@/app/editor/components/inputs";
import {ReactNode} from "react";
import {ImportMTG} from "@/app/editor/mtg/components/import";
import {getEnumKeys} from "@/lib/enum";
import {BiInfoCircle} from "react-icons/bi";
import {MTGCard, MTGCardTemplate} from "@/lib/card";
import {ImportComponent} from "@/app/editor/components/importComponent";

export default function MTGEditorPage() {
	return (<EditorPage gameName="Magic: The Gathering" gameLocalStorageKey="mtg-cards" gameId="mtg"
	                    importCardsAction={({setCards, cards}): ReactNode => {
							return <ImportComponent cards={cards} setCardsAction={setCards} InnerComponent={ImportMTG}/>
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

								<MTGInput card={card} valKey="flavor_name" setValue={onChange} title="Flavor Name"
			                              placeholder="Steve, Elder of the Sakura Tribe"
			                              isTextarea={false}/>

								<div className="flex flex-row gap-2">
									<MTGInput card={card} valKey="power" setValue={onChange} title="Power"
				                              placeholder=""/>
									<MTGInput card={card} valKey="toughness" setValue={onChange} title="Toughness"
				                              placeholder=""/>
								</div>
								<p className="opacity-0 md:opacity-100 label text-xs">If Planeswalker loyalty or Battle
									Defense is needed, just
									filling
									out &apos;Power&apos; will work.</p>

								<div className="collapse bg-base-100 border flex-none collapse-arrow max-w-full">
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
										<MTGInput card={card} valKey="reverse_flavor_text" setValue={onChange}
					                              title="Flavor Text"
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
												<div className="tooltip tooltip-content w-max">Modify the layout of this
													card.
													<br/><br/><b>OPTIONS:</b><br/>
													<ul>
														<li><b>None</b>: No additional templating.</li>
														<li><b>Mana Counter</b>: Replaces all content of the card with a
															mana counter.
														</li>
														<li><b>Token Counter</b>: Adds a table to track tokens in
															different states.
														</li>
														<li><b>Half Size</b>: Puts 2 copies of this card in the space of
															one card.
														</li>
														<li>All Others: Styles matching card types</li>
													</ul>
												</div>
												<BiInfoCircle/>
											</div>
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
							flavor_name: "Demo Card V2",
							mana_cost: "{1}{w}{u}{b}{r}{g}",
							type_line: "Mysterious {-} Card",
							card_text: "Mess around with the different fields of this card! A list of all available symbols can be found on <a href='https://scryfall.com/docs/api/colors#mana-costs-and-other-symbology' class='link' target='_blank'>Scryfall</a>, all forward slashes (/) in mana symbols are optional (i.e. {wbp} is the same as {w/b/p}). This field supports HTML formatting! <b>Bold text</b> <i>Italic Text</i>\nPress \"Import Cards\" to import from a decklist, and \"Preview and Print Proxies\" to see and print your proxies.",
							power: "1", toughness: "1",
						} as MTGCard}
	                    templateCards={{
							"Aftermath Split": {
								card_name: "Aftermath Card",
								mana_cost: "{c}{w}{u}{b}{r}{g}",
								type_line: "Sorcery",
								card_text: "This is a card with an Aftermath template. The Aftermath half can be changed through the \"Dual-Faced Cards\" section.",

								reverse_card_name: "Aftermath Half",
								reverse_mana_cost: "{15}",
								reverse_type_line: "Instant",
								reverse_text: "Aftermath\nThis is the aftermath half",

								card_template: MTGCardTemplate.SPLIT_AFTERMATH,
							} as MTGCard,
							"Planeswalker": {
								card_name: "Planeswalker Card",
								mana_cost: "{c}{w}{u}{b}{r}{g}",
								type_line: "Planeswalker {-} You",
								card_text: "+1: Each loyalty ability starts with a <i>+x:</i> and is formatted.\n-X: Loyalty abilities can use non-typical values.\n-{c}: Such as this!<br/>Use HTML breaks (&lt;br&gt;) to create line breaks in an ability without starting a new ability.\nUse a full linebreak at the end to add additional rules text.<br/>Fill in <i>Power</i> to set starting loyalty.",
								power: "5",

								card_template: MTGCardTemplate.PLANESWALKER,
							} as MTGCard,
							"Spacecraft": {
								card_name: "Spacecraft Card",
								mana_cost: "{c}{w}{u}{b}{r}{g}",
								type_line: "Artifact {-} Spacecraft",
								card_text: "Station\n1+ | Each station threshold starts with \"<i>x+ | </i>\" (note the spaces around the vertical line).\nLinebreaks don't interrupt sections.\n2+ | Spacecraft can have any number of sections, but each section <i>must</i> start with a number.\n999+ | Flying, Vigilance, Haste, First Strike, Lifelink",
								power: "1", toughness: "1",

								card_template: MTGCardTemplate.SPACECRAFT,
							} as MTGCard,
							"Saga": {
								card_name: "The Saga of Darth Plagueis the Wise",
								mana_cost: "{b}{b}{b}{r}{r}{r}",
								type_line: "Legendary Enchantment Creature {-} Time Lord Saga",
								card_text: "I {-} Each chapter starts with \"<i>x {-}</i>\" ({-} can be represented with an em-dash character, or \{-\})\nII, III, V {-} Multiple chapter symbols can be added with \"<i>x, y, z, ... {-}</i>\". Each chapter\'s text can only span one line.\nIV {-} Chapters can be out of order.\nText for Saga Creatures can be added at the very end.",
								power: "9", toughness: "10",

								card_template: MTGCardTemplate.SAGA,
							} as MTGCard,
							"Level-Up": {
								card_name: "Level-Up Card",
								mana_cost: "{c}{w}{u}{b}{r}{g}",
								type_line: "Creature {-} Time Lord",
								card_text: "Level up {c}{w}{u}{b}{r}{g}\nLEVEL 1-2\n2/2\nEach level starts with LEVEL x-y, followed by its power and toughness on a new line.\nLEVEL 3-4\n3/3\nLEVEL 5+\n5/5\nThe power and toughness of the card itself (without leveling up) appears at the bottom.",

								power: "1", toughness: "1",

								card_template: MTGCardTemplate.LEVEL_UP,
							} as MTGCard,
							"Rooms": {
								card_name: "Room 1",
								mana_cost: "{c}{w}{u}",
								type_line: "Enchantment {-} Room",
								card_text: "The other room can be set-up via \"Dual-Faced Cards\"",

								reverse_card_name: "Room 2",
								reverse_mana_cost: "{b}{r}{g}",
								reverse_type_line: "Enchantment {-} Room",
								reverse_text: "This room can be set-up via \"Dual-Faced Cards\"",

								card_template: MTGCardTemplate.ROOMS
							} as MTGCard,
							"Adventure / Omen / Prepare": {
								card_name: "Main Card",
								mana_cost: "{c}{w}{u}{b}{r}{g}",
								type_line: "Artifact",
								card_text: "Set up the attached spell via \"Dual-Faced Cards\".",

								reverse_card_name: "Other Side",
								reverse_mana_cost: "{0}",
								reverse_type_line: "Instant {-} Adventure",
								reverse_text: "Target permanent.",

								card_template: MTGCardTemplate.ADVENTURE,
							} as MTGCard,
							"Class": {
								card_name: "Class Card",
								mana_cost: "{c}{w}{u}{b}{r}{g}",
								type_line: "Enchantment {-} Class",
								card_text: "Whenever you target a permanent, draw a card.\n{c}{w}{u}{b}{r}{g}: Level 2\nEach level section starts with \"<i>COST: Level x</i>\".\nLine breaks in class text are OK.\n{w}{u}{b}{r}{g}, Pay 2 life, {t}: Level 3\nLevel up costs can only end with a mana symbol.",

								card_template: MTGCardTemplate.CLASS,
							} as MTGCard,
						}}
	/>)
}
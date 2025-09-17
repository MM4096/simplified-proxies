import "../../../styles/card/card.css";
import "../../../styles/card/mtg-card.css";
import {convertStringToIconObject, LINEBREAK} from "@/app/editor/components/cards/iconDatabase";
import DOMPurify from "isomorphic-dompurify";
import Image from "next/image";
import {MTGCard, MTGCardTemplate} from "@/lib/card";
import {TbCaretUpDownFilled, TbCaretUpFilled} from "react-icons/tb";

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

function applyTemplatingStyles(text: string, template: MTGCardTemplate): string {
	const parts: string[] = text.split(LINEBREAK);
	const sections: string[] = [];
	switch (template) {
		case MTGCardTemplate.PLANESWALKER:
			for (let i = 0; i < parts.length; i++) {
				const this_part: string = parts[i];
				// include both − and -, first is from scryfall, second is a generic negative symbol
				if (this_part.startsWith("+") || this_part.startsWith("-") || this_part.startsWith("−") || this_part.startsWith("0")) {
					const colon_split: string[] = this_part.split(": ");
					colon_split[0] = `<span class="number-badge">${colon_split[0]}</span>`;
					const first_elem = colon_split.shift();
					parts[i] = `<span class="flex flex-row">${first_elem}<p>${colon_split.join(": ")}</p></span>`
				}
			}

			return parts.join(LINEBREAK + `<div class="card-divider"></div>` + LINEBREAK);

		case MTGCardTemplate.SPACECRAFT:

			// keep track for next section
			let station_count: string = "";
			for (let i = 0; i < parts.length; i++) {
				const this_part: string = parts[i];
				if (this_part.startsWith("STATION")) {
					station_count = this_part.replaceAll("STATION", "").trim();
					continue;
				}

				if (station_count !== "") {
					let extra = "";
					let first_elem = true;
					// look ahead for other parts and merge into this one
					while (i < parts.length) {
						if (parts[i].startsWith("STATION")) {
							break;
						}
						if (first_elem) {
							first_elem = false;
						} else {
							extra += "<span class='paragraph-break'></span>";
						}
						extra += `${parts[i]}`;
						i++;
					}
					i--;
					sections.push(`<span class="flex flex-row"><span class="number-badge">${station_count}</span><p>${extra}</p></span>`);
					station_count = "";
					continue;
				}

				if (sections.length == 0) {
					sections.push(this_part);
				} else {
					sections[sections.length - 1] += `<span class="paragraph-break"></span>${this_part}`
				}
			}

			return sections.join(LINEBREAK + `<div class="card-divider"></div>` + LINEBREAK);

		default:
			return text;
	}
}

export function MTGCardObject({card, isBlackWhite, includeCredit = true, id}: {
	card: MTGCard,
	isBlackWhite: boolean,
	id?: string,
	includeCredit?: boolean,
}) {

	if (card.card_template === MTGCardTemplate.MANA_COUNTER) {
		return <div className="card mtg-card" id={id} key={id}>
			<div className="mana-counter">
				<div>
					<Image src="/images/mtg/icons/black-white/w.svg" width={300} height={300} alt="White"/>
				</div>
				<div>
					<Image src="/images/mtg/icons/black-white/u.svg" width={300} height={300} alt="Blue"/>
				</div>
				<div>
					<Image src="/images/mtg/icons/black-white/b.svg" width={300} height={300} alt="Black"/>
				</div>
				<div>
					<Image src="/images/mtg/icons/black-white/r.svg" width={300} height={300} alt="Red"/>
				</div>
				<div>
					<Image src="/images/mtg/icons/black-white/g.svg" width={300} height={300} alt="Green"/>
				</div>
				<div>
					<Image src="/images/mtg/icons/black-white/c.svg" width={300} height={300} alt="Colorless"/>
				</div>
			</div>
		</div>
	}

	const this_card = (<div className="card mtg-card" id={id} key={id}>
		<div className="card-title-container">
			<h2 className="card-title">{hasReverseFace(card) ? (<TbCaretUpFilled/>) : null}{card.card_name}</h2>
			<div className="mana-cost" dangerouslySetInnerHTML={{
				__html: DOMPurify.sanitize(convertStringToIconObject(card.mana_cost || "", "mtg", isBlackWhite))
			}}/>
		</div>

		<div className="card-divider"/>
		<p className="type-line">{card.type_line?.replaceAll("{-}", "—")}</p>
		<div className="card-divider"/>

		<div className="card-text" dangerouslySetInnerHTML={{
			__html: DOMPurify.sanitize(applyTemplatingStyles(convertStringToIconObject(card.card_text || "", "mtg", isBlackWhite), card.card_template || MTGCardTemplate.NONE))
		}}/>

		{
			card.flavor_text && (<>
				<div className="mb-3"/>

				<div className="flavor-text" dangerouslySetInnerHTML={{
					__html: `<i>${DOMPurify.sanitize(convertStringToIconObject(card.flavor_text || "", "mtg", isBlackWhite))}</i>`
				}}/>
			</>)
		}

		<div className="grow !p-0"/>

		<div className="bottom-container">
			<div className="flex flex-col grow">
				<p className="notes grow">{card.notes}</p>
				{
					includeCredit && (<p className="credit"/>)
				}
			</div>
			{
				getPowerToughnessText(card.power, card.toughness) !== null && (
					<p className="power-toughness">{getPowerToughnessText(card.power, card.toughness)}</p>
				)
			}
		</div>

		{
			card.card_template == MTGCardTemplate.TOKEN_COUNTER && (<table className="token-1-box">
				<thead>
				<tr>
					<td></td>
					<td>Is summoning sick</td>
					<td>Not summoning sick</td>
				</tr>
				</thead>

				<tbody>
				<tr>
					<td className="left-label">Tapped</td>
					<td/>
					<td/>
				</tr>
				<tr>
					<td className="left-label">Untapped</td>
					<td/>
					<td/>
				</tr>
				</tbody>
			</table>)
		}

		{
			hasReverseFace(card) && (<>
				<div className="card-divider"/>
				<div className="card-reverse">
					<div className="card-title-container">
						<h2 className="card-title"><TbCaretUpDownFilled/>{card.reverse_card_name}</h2>
						<div className="mana-cost" dangerouslySetInnerHTML={{
							__html: DOMPurify.sanitize(convertStringToIconObject(card.reverse_mana_cost || "", "mtg", isBlackWhite))
						}}/>
					</div>
					<div className="card-divider"/>
					<p className="type-line">{card.reverse_type_line?.replaceAll("{-}", "—")}</p>
					<div className="card-divider"/>

					<div className="card-text" dangerouslySetInnerHTML={{
						__html: DOMPurify.sanitize(convertStringToIconObject(card.reverse_text || "", "mtg", isBlackWhite))
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

	if (card.card_template === MTGCardTemplate.HALF_SIZE) {
		return (<div className="double-card">
			{this_card}
			{this_card}
		</div>)
	}

	return this_card;
}
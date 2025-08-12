import "../../../styles/card/card.css";
import "../../../styles/card/mtg-card.css";
import {convertStringToIconObject} from "@/app/editor/components/cards/iconDatabase";
import DOMPurify from "isomorphic-dompurify";
import Image from "next/image";
import {MTGCard, MTGCardTemplate} from "@/lib/card";

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

export function MTGCardObject({card, isBlackWhite, includeCredit = true, id}: {
	card: MTGCard,
	isBlackWhite: boolean,
	id?: string,
	includeCredit?: boolean,
}) {

	if (card.card_template === MTGCardTemplate.MANA_COUNTER) {
		return <div className="card mtg-card mana-counter" id={id} key={id}>
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
	}

	return (<div className="card mtg-card" id={id} key={id}>
		<div className="card-title-container">
			<h2 className="card-title">{card.card_name}</h2>
			<div className="mana-cost" dangerouslySetInnerHTML={{
				__html: DOMPurify.sanitize(convertStringToIconObject(card.mana_cost || "", "mtg", isBlackWhite))
			}}/>
		</div>

		<div className="card-divider"/>
		<p className="type-line">{card.type_line?.replaceAll("{-}", "—")}</p>
		<div className="card-divider"/>

		<div className="card-text" dangerouslySetInnerHTML={{
			__html: DOMPurify.sanitize(convertStringToIconObject(card.card_text || "", "mtg", isBlackWhite))
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
			card.card_template == MTGCardTemplate.TOKEN_1 && (<table className="token-1-box">
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
						<h2 className="card-title">{card.reverse_card_name}</h2>
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
}
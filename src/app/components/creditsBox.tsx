"use client";

import {useRef} from "react";
import Link from "next/link";
import Image from "next/image";

export function CreditsBox() {
	const dialogRef = useRef<HTMLDialogElement>(null);

	return (<>
		<button className="index-link" onClick={() => {
			dialogRef.current?.showModal();
		}}>Credits
		</button>

		<dialog className="modal" ref={dialogRef}>
			<div className="modal-box flex flex-col gap-2">
				<h2 className="custom-divider">Credits</h2>

				<p><b>Simplified Proxies</b> is created by <b>mm4096</b><br/>All uncredited content is under the
					copyright of mm4096.</p>

				<p>The GitHub icon is under the copyright of GitHub.</p>

				<div className="collapse bg-base-100 border-base-300 border">
					<input type="checkbox"/>
					<div className="collapse-title font-bold text-xl">Magic: The Gathering</div>
					<div className="collapse-content">
						All mana symbols are under the copyright of Wizards of the Coast and are used under the <Link
						href="https://company.wizards.com/en/legal/fancontentpolicy" className="link">Fan Art
						Policy</Link>.
						<br/><br/>
						The &quot;Import Cards&quot; feature uses the Scryfall API, and the colored mana icons are from
						Scryfall as well. (<Link href="https://scryfall.com" className="link">scryfall.com</Link>).
						<br/><br/>
						The black and white mana icons are colored mana icons modified by mm4096.
						<br/><br/>
						<small>Scryfall and Wizards of the Coast do not produce or endorse Simplified Proxies in any
							way.</small>
					</div>
				</div>

				<div className="collapse bg-base-100 border-base-300 border">
					<input type="checkbox"/>
					<div className="collapse-title font-bold text-xl">Pokemon Trading Card Game</div>
					<div className="collapse-content">
						Colored Energy symbols (except &quot;<i>Free</i>&quot;) are created by <b>Biochao</b> via <Link
						href="https://www.deviantart.com/biochao/art/Pokemon-Trading-Card-Game-Energy-Symbols-906732898"
						className="link">devianart</Link>
						<br/><br/>
						The black and white Energy symbols are colored Energy symbols modified by mm4096.
						The &quot;<i>Free</i>&quot; (<Image src="/images/ptcg/icons/standard/n.png" width={32}
															height={32} alt="{n}" className="symbol"/>) Energy symbol is
						created by mm4096.
						<br/><br/>
						The &quot;Import Cards&quot; feature uses the Pokemon TCG API. (<Link
						href="https://pokemontcg.io/" className="link">pokemontcg.io/</Link>).
						<br/><br/>
						<small>Pokemon TCG API, The Pokemon Company and Nintendo do not produce or endorse Simplified
							Proxies in any
							way.</small>
					</div>
				</div>

				<button className="btn" onClick={() => {
					dialogRef.current?.close();
				}}>Close
				</button>
			</div>

			<form method="dialog" className="modal-backdrop">
				<button>close</button>
			</form>
		</dialog>
	</>)
}
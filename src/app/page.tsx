import "./styles/index.css"

import Link from "next/link";
import {BiBug, BiInfoCircle, BiLogoGithub} from "react-icons/bi";
import {CreditsBox} from "@/app/components/creditsBox";
import {ChangelogComponent} from "@/app/components/changelogComponent";
import {NewBadge} from "@/app/components/tags/badges";
import {secretCarouselPercentage} from "@/lib/index/sCarouselLinks";
import {IndexCarouselContainer} from "@/app/components/carousels/indexCarouselContainer";

const carouselTime: number = 5000;

export default function Home() {
	return (<>
		<IndexCarouselContainer carouselTime={carouselTime}>
			<div
				className="flex flex-col items-center h-full justify-center text-center child-w-full gap-2 index-contents">
				<h1>Simplified Proxies</h1>
				<p>Create custom cards and print-friendly proxies for Magic: The Gathering</p>
				<div className="mb-5"/>


				<Link href="/editor/mtg" className="btn btn-primary mtg-editor">
					Traditional Editor
					<span className="tooltip">
						<span className="tooltip-content">Powerful and Complex.<br/>Everything in the Simplified Editor, plus the ability to edit any card.</span>
						<BiInfoCircle/>
					</span>
				</Link>
				<Link href="/editor/mtg/simplified" className="btn btn-primary mtg-simplified-editor">
					Simplified Editor <NewBadge/>
					<span className="tooltip">
						<span className="tooltip-content">Quick and Simple.<br/>Create proxies from a decklist. Supports Moxfield and Archidekt links.</span>
						<BiInfoCircle/>
					</span>
				</Link>
			</div>
		</IndexCarouselContainer>

		<div className="links-box invisible md:visible">
			<ChangelogComponent/>
			<CreditsBox/>
			<Link href="https://github.com/MM4096/simplified-proxies/issues" target="_blank"
			      className="index-link"><BiBug/>Report Bugs</Link>
			<Link href="https://github.com/mm4096/simplified-proxies" target="_blank"
			      className="index-link github-link"><BiLogoGithub/>Github</Link>
		</div>
		<div className="links-box visible md:invisible">
			<CreditsBox/>
		</div>
	</>);
}

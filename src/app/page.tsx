import "./styles/index.css"

import Link from "next/link";
import {Carousel} from "@/app/components/carousels/images/carousel";
import {BiBug, BiLogoGithub} from "react-icons/bi";
import {CreditsBox} from "@/app/components/creditsBox";
import {ChangelogComponent} from "@/app/components/changelogComponent";
import {CardCarousel} from "@/app/components/carousels/cards/cardCarousel";

export default function Home() {
	return (<>
		<div className="index">

			<div className="flex flex-col items-center justify-center gap-4 mtg-panel carousel">
				<Carousel time={3000}
						  standardPaths={{
							  prefix: "/images/index/carousel/mtg/actual",
							  paths: ["deflecting-swat", "explore", "jace-the-perfected-mind", "sakura-tribe-elder", "sol-ring"],
							  suffix: ".png",
						  }} className="w-1/3"/>
				{/*<Carousel time={3000}*/}
				{/*		  standardPaths={{*/}
				{/*			  prefix: "/images/index/carousel/mtg/proxy",*/}
				{/*			  paths: ["deflecting-swat", "explore", "jace-the-perfected-mind", "sakura-tribe-elder", "sol-ring"],*/}
				{/*			  suffix: ".png",*/}
				{/*		  }} className="w-1/3"/>*/}
				<CardCarousel jsonPath="public/data/index/mtg-carousel.json" time={3000} gameId="mtg" className="w-1/3"/>
			</div>

			<div className="flex flex-col items-center h-full justify-center text-center child-w-full gap-2 index-contents">
				<h1>Simplified Proxies</h1>
				<p>Make print-friendly proxies for Magic: The Gathering and Pokemon Trading Card Game</p>
				<div className="mb-5"/>
				<Link href="/editor/mtg" className="btn btn-primary mtg-editor">Magic: The Gathering Editor</Link>
				<Link href="/editor/ptcg" className="btn btn-primary ptcg-editor">Pokemon Trading Card Game Editor</Link>
			</div>

			<div className="flex flex-col items-center justify-center gap-4 ptcg-panel carousel">
				<Carousel time={3000}
						  standardPaths={{
							  prefix: "/images/index/carousel/ptcg/actual",
							  paths: ["arven", "budew", "gardevoir-ex", "legacy-energy", "tm-fluorite"],
							  suffix: ".png",
						  }} className="w-1/3"/>
				<Carousel time={3000}
						  standardPaths={{
							  prefix: "/images/index/carousel/ptcg/proxy",
							  paths: ["arven", "budew", "gardevoir-ex", "legacy-energy", "tm-fluorite"],
							  suffix: ".png",
						  }} className="w-1/3"/>
			</div>

		</div>

		<div className="links-box invisible md:visible">
			<ChangelogComponent/>
			<CreditsBox/>
			<Link href="https://github.com/MM4096/simplified-proxies/issues" target="_blank" className="index-link"><BiBug/>Report Bugs</Link>
			<Link href="https://github.com/mm4096/simplified-proxies" target="_blank" className="index-link github-link"><BiLogoGithub/>Github</Link>
		</div>
		<div className="links-box visible md:invisible">
			<CreditsBox/>
		</div>
	</>);
}

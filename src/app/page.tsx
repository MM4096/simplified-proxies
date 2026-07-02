import "./styles/index.css"
3
import Link from "next/link";
import {Carousel} from "@/app/components/carousels/images/carousel";
import {BiBug, BiLogoGithub} from "react-icons/bi";
import {CreditsBox} from "@/app/components/creditsBox";
import {ChangelogComponent} from "@/app/components/changelogComponent";
import {CardCarousel} from "@/app/components/carousels/cards/cardCarousel";
import {NewBadge} from "@/app/components/tags/new";
import {carouselLinksLeft, carouselLinksRight} from "@/lib/index/carouselLinks";

const carouselTime: number = 5000;

export default function Home() {
	return (<>
		<div className="index">

			<div className="flex flex-col items-center justify-center gap-4 mtg-panel carousel">
				<Carousel time={carouselTime}
						  standardPaths={{
							  prefix: "/images/index/carousel/mtg/actual",
							  paths: carouselLinksLeft,
							  suffix: ".jpg",
						  }} className="w-1/3"/>
				<CardCarousel jsonPath="public/data/index/carousel-left.json" time={carouselTime} gameId="mtg" className="w-1/3"/>
			</div>

			<div className="flex flex-col items-center h-full justify-center text-center child-w-full gap-2 index-contents">
				<h1>Simplified Proxies</h1>
				<p>Make print-friendly proxies for Magic: The Gathering and Pokemon Trading Card Game</p>
				<div className="mb-5"/>
				<Link href="/editor/mtg" className="btn btn-primary mtg-editor">Traditional Editor</Link>
				<Link href="/editor/mtg/simplified" className="btn btn-primary mtg-simplified-editor">Simplified Editor <NewBadge/></Link>
			</div>

			<div className="flex flex-col items-center justify-center gap-4 mtg-panel carousel">
				<Carousel time={carouselTime}
						  standardPaths={{
							  prefix: "/images/index/carousel/mtg/actual",
							  paths: carouselLinksRight,
							  suffix: ".jpg",
						  }} className="w-1/3"/>
				<CardCarousel jsonPath="public/data/index/carousel-right.json" time={carouselTime} gameId="mtg" className="w-1/3"/>
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

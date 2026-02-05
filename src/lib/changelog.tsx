import {ReactNode} from "react";
import {ExperimentalBadge} from "@/app/components/tags/experimental";
import {MTGBadge} from "@/app/components/tags/games/mtg";

export type ChangelogEntry = {
	date: string,
	changes: string[] | ReactNode[] | string | ReactNode,
	version: string,
}
export type Changelog = ChangelogEntry[];

export const changelog: Changelog = [
	{
		date: "2026-02-06",
		version: "v1.8",
		changes: (<>
			<ul className="list-disc">
				<li><MTGBadge/> Added options for importing directly from Archidekt and Moxfield!</li>
			</ul>
		</>)
	},
	{
		date: "2025-12-16",
		version: "v1.7.1",
		changes: (<>
			<ul className="list-disc">
				<li>(MTG) Fixed a bug that causes DFCs to be cropped when shrinked while printing.</li>
			</ul>
		</>)
	},
	{
		date: "2025-11-12",
		version: "v1.7",
		changes: (<>
			<ul className="list-disc">
				<li>(PTCG) Importing is now handled on the server, reducing load for you!</li>
				<li>(PTCG) Optimized import system so it no longer takes several minutes to import a deck.</li>
			</ul>
			<br/>
			<p><b>KNOWN BUG: </b>Importing Technical Machines have some hilarious results.</p>
		</>)
	},
	{
		date: "2025-10-03",
		version: "v1.6.1",
		changes: (<>
			<ul className="list-disc">
				<li>(MTG) DFCs no longer require a double slash between front and back faces.<br/><i>(i.e. typing <b>Commit memory</b> will import <b>Commit // Memory</b>)</i></li>
			</ul>
		</>)
	},
	{
		date: "2025-09-27",
		version: "v1.6",
		changes: (<>
			<ul className="list-disc">
				<li>(MTG) Added Dungeons. These can only be imported by entering their respective names during import and enabling <i>Automatically apply templates</i>.</li>
			</ul>
		</>)
	},
	{
		date: "2025-09-27",
		version: "v1.5",
		changes: (<>
			<ul className="list-disc">
				<li>(MTG) Added several DFC templates such as <i>Aftermath</i>, <i>Fuse</i>, and <i>Rooms</i></li>
			</ul>
		</>)
	},
	{
		date: "2025-09-18",
		version: "v1.4",
		changes: (<>
			<ul className="list-disc">
				<li>(MTG) Added Planeswalker template</li>
				<li>(MTG) Added Spacecraft template</li>
			</ul>
		</>)
	},
	{
		date: "2025-09-16",
		version: "v1.3.1",
		changes: (<>
			<ul className="list-disc">
				<li>Added options to shrink cards while printing</li>
			</ul>
		</>)
	},
	{
		date: "2025-09-15",
		version: "v1.3",
		changes: (<>
			<ul className="list-disc">
				<li>(MTG) Added options to style reminder text from imported cards</li>
				<li>(MTG) Added options to not import basic lands from the provided list</li>
				<li>Added options to unround corners while printing proxies</li>
				<li>Added an automatic linebreak between paragraphs</li>
			</ul>
		</>)
	},
	{
		date: "2025-08-22",
		version: "v1.2.1",
		changes: (<>
			<ul className="list-disc">
				<li>(MTG) &quot;Mana Counter&quot; template now properly displays borders while printing</li>
			</ul>
		</>)
	},
	{
		date: "2025-08-15",
		version: "v1.2",
		changes: (<>
			<b>(MTG): Import cards are now handled on server</b><br/>
			This decreases internet usage on your device while maintaining functionality.<br/><br/>
			<i>This feature cannot currently be implemented for the PTCG Editor, as the 60-second timeout for API routes can be reached pretty easily.</i>
		</>)
	},
	{
		date: "2025-08-13",
		changes: "(MTG): Fixed minor template layout issues",
		version: "v1.1.1",
	},
	{
		date: "2025-08-12",
		changes: (<><b>(MTG): Added Templates <ExperimentalBadge/></b><br/>
			Supported templates:
			<ul className="list-disc">
				<li><b>Mana Counter</b>: Converts the card into a counter for floating mana</li>
				<li><b>Token Counter</b>: Adds a table to track the quantity and states of tokens</li>
				<li><b>Half Size</b>: Places two copies of this card in the space of one card (halves the size of this
					card and duplicates it)
				</li>
			</ul>
		</>),
		version: "v1.1"
	},
	{
		date: "2025-07-31",
		changes: "Initial release",
		version: "v1.0"
	}
]

export function compareChangelogVersion(a: string, b: string): number {
	return a.localeCompare(b)
}

export function compareChangelog(a: ChangelogEntry, b: ChangelogEntry): number {
	return compareChangelogVersion(a.version, b.version)
}

export function getChangelog(version: string): ChangelogEntry {
	return changelog.find(entry => entry.version === version) || {date: "", changes: "", version: ""}
}

export function sortChangelogs(changelogs: Changelog): Changelog {
	return changelogs.sort(compareChangelog)
}

export function getAllChangelogsPastVersion(version: string): ChangelogEntry[] {
	const retArr: ChangelogEntry[] = []
	for (let i = 0; i < changelog.length; i++) {
		if (compareChangelogVersion(changelog[i].version, version) > 0) {
			retArr.push(changelog[i])
		}
	}
	return sortChangelogs(retArr)
}

export function getLatestChangelogVersion(): string {
	let latest: string = "v0"
	for (let i = 0; i < changelog.length; i++) {
		if (compareChangelogVersion(changelog[i].version, latest) > 0) {
			latest = changelog[i].version
		}
	}
	return latest
}
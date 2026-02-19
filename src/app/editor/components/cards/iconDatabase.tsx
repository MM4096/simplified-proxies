const STANDARD_PATH = "standard";
const BLACK_WHITE_PATH = "black-white";

const IMAGE_BASE_PATH = "/images";

export const LINEBREAK = `<span class="paragraph-break"></span>`

export function getIconPath(code: string, game: "mtg" | "ptcg", isBlackWhite: boolean = false): string {
	code = code.replaceAll(" ", "").replaceAll("/", "").replaceAll("..", "").replaceAll("\\", "");
	return `${IMAGE_BASE_PATH}/${game}/icons/${isBlackWhite ? BLACK_WHITE_PATH : STANDARD_PATH}/${code}.svg`
}

export function getIcon(code: string, game: "mtg" | "ptcg", isBlackWhite: boolean = false): string {
	code = code.toLowerCase();
	code = code.replaceAll(" ", "").replaceAll("/", "");

	const basePath = getIconPath(code, game, isBlackWhite);
	return `<img src="${basePath}" alt="${code}" class="mana-symbol" />`
}

export function convertStringToIconObject(inputString: string | null, game: "mtg" | "ptcg", isBlackWhite: boolean = false): string {
	if (inputString === null) {
		return "";
	}

	inputString = inputString.replaceAll("{-}", "—")
	inputString = inputString.replaceAll("{--}", "<div class='card-divider h-0'></div>")

	if (game === "ptcg") {
		inputString = inputString.replaceAll("Dragon", "{a}").replaceAll("Colorless", "{c}")
			.replaceAll("Darkness", "{d}").replaceAll("Fighting", "{f}")
			.replaceAll("Grass", "{g}").replaceAll("Lightning", "{l}")
			.replaceAll("Metal", "{m}").replaceAll("Psychic", "{p}")
			.replaceAll("Fire", "{r}").replaceAll("Water", "{w}")
			.replaceAll("Fairy", "{y}").replaceAll("Free", "{n}");
		inputString = inputString.replaceAll("okemon", "okémon")
	}

	let matches: RegExpMatchArray | string[] | null = inputString?.match(/\{.*?}/g);

	let codes: string = inputString;
	// add custom paragraph breaks
	codes = codes.replaceAll("\r\n", "\n").replaceAll("\\n", "\n").replaceAll("\n", LINEBREAK);
	// make all items unique
	const set = new Set(matches);
	matches = [...set];

	if (!matches || matches.length == 0) {
		return codes;
	}


	for (let i = 0; i < matches.length; i++) {
		let match = matches[i];
		match = match.replaceAll("{", "");
		match = match.replaceAll("}", "");
		match = match.replaceAll(" ", "");
		if (match === "") {
			continue;
		}

		codes = codes.replaceAll(`\\${matches[i]}`, "THISTEXTSHOULDNEVERBEPLACEDINTOATEXTBOX!~?");
		codes = codes.replaceAll(matches[i], getIcon(match, game, isBlackWhite))
			.replaceAll("THISTEXTSHOULDNEVERBEPLACEDINTOATEXTBOX!~?", `{${match}}`);
	}
	codes = codes.replaceAll("\\{", "{").replaceAll("\\}", "}");

	return codes;
}

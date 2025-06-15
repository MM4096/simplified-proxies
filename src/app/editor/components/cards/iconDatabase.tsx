const STANDARD_PATH = "standard";
const BLACK_WHITE_PATH = "black-white";

const IMAGE_BASE_PATH = "/images"

export function getIconPath(code: string, game: "mtg" | "ptcg", isBlackWhite: boolean = false): string {
	return `${IMAGE_BASE_PATH}/${game}/icons/${isBlackWhite ? BLACK_WHITE_PATH : STANDARD_PATH}/${code}.png`
}

export function getIcon(code: string, game: "mtg" | "ptcg", isBlackWhite: boolean = false): string {
	code = code.toLowerCase();
	code = code.replaceAll(" ", "").replaceAll("/", "");

	const basePath = getIconPath(code, game, isBlackWhite);
	const fallbackPath = getIconPath(code, game, false);

	// return (<img src={basePath} alt={code} className="mana-symbol" onError={() => {
	// 	if (this.src !== fallbackPath && !this.dataset.fallback) {
	// 		this.dataset.fallback = true;
	// 		this.src = fallbackPath;
	// 	}
	// }}/>)
	return `<img src="${basePath}" alt="${code}" class="mana-symbol" onerror="if (this.src !== '${fallbackPath}' && !this.dataset.fallback) {  this.dataset.fallback='true'; this.src='${fallbackPath}';}" />`
}

export function convertStringToIconObject(string: string | null, game: "mtg" | "ptcg", isBlackWhite: boolean = false): string {
	string = string || "";
	string = string.replaceAll("{-}", "—")

	const matches = string.match(/(?<!\\)\{.*?}/g);

	let codes = string;

	if (matches === null) {
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
		codes = codes.replaceAll(matches[i], getIcon(match, game, isBlackWhite));
		codes = codes.replaceAll("THISTEXTSHOULDNEVERBEPLACEDINTOATEXTBOX!~?", `{${match}}`);
	}

	return codes;
}

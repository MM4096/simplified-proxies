

import {MTGCard, PTCGCard} from "@/lib/card";

export function PTCGInput({card, valKey, setValue, title, placeholder, isTextarea = false}: {
	card: PTCGCard,
	valKey: keyof Omit<PTCGCard, "attacks_abilities">,
	setValue: (key: string, value: string) => void,

	title: string,
	placeholder: string,

	isTextarea?: boolean,
}) {
	if (isTextarea) {
		return (<fieldset className="fieldset">
			<legend className="fieldset-legend">{title}</legend>
			<textarea placeholder={placeholder} className="textarea" value={card[valKey] || ""}
				   onChange={(e) => {
					   setValue(valKey, e.target.value)
				   }}/>
		</fieldset>)
	}
	else {
		return (<fieldset className="fieldset">
			<legend className="fieldset-legend">{title}</legend>
			<input type="text" placeholder={placeholder} className="input" value={card[valKey] || ""}
				   onChange={(e) => {
					   setValue(valKey, e.target.value)
				   }}/>
		</fieldset>)
	}
}

export function MTGInput({card, valKey, setValue, title, placeholder, isTextarea = false}: {
	card: MTGCard,
	valKey: keyof MTGCard,
	setValue: (key: string, value: string) => void,

	title: string,
	placeholder: string,

	isTextarea?: boolean,
}) {
	if (isTextarea) {
		return (<fieldset className="fieldset">
			<legend className="fieldset-legend">{title}</legend>
			<textarea placeholder={placeholder} className="textarea" value={card[valKey] || ""}
					  onChange={(e) => {
						  setValue(valKey, e.target.value)
					  }}/>
		</fieldset>)
	}
	else {
		return (<fieldset className="fieldset">
			<legend className="fieldset-legend">{title}</legend>
			<input type="text" placeholder={placeholder} className="input" value={card[valKey] || ""}
				   onChange={(e) => {
					   setValue(valKey, e.target.value)
				   }}/>
		</fieldset>)
	}
}
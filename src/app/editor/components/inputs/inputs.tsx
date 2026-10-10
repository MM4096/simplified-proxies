"use client";

import {BiInfoCircle} from "react-icons/bi";

function TooltipCircle({settingName, tooltipText, onTooltipClick}: {
	settingName: string,
	tooltipText: string,
	onTooltipClick: (value: string) => void
}) {
	return (<button className="cursor-pointer" onClick={() => onTooltipClick(settingName + ": " + tooltipText)}>
		<BiInfoCircle/>
	</button>)
}

export function CheckboxInput({text, value, setValueAction, tooltipText, onTooltipAction}: {
	text: string,
	value: boolean,
	setValueAction: (value: boolean) => void,
	onTooltipAction: (value: string) => void,
	tooltipText?: string,
}) {
	return (<label className="label label-sm text-sm">
		<input type="checkbox" className="checkbox checkbox-sm" checked={value}
		       onChange={(e) => {
				   setValueAction(e.target.checked);
			   }}
		/>
		<span>{text}</span>
		{
			tooltipText && (<TooltipCircle settingName={text} tooltipText={tooltipText} onTooltipClick={onTooltipAction}/>)
		}
	</label>)
}

export function EnumInput({text, tooltipText, value, setValueAction, options, onTooltipAction}: {
	text: string,
	tooltipText?: string,
	value: string | number,
	setValueAction: (value: string) => void,
	options: { value: string | number, text: string }[],
	onTooltipAction: (value: string) => void,
}) {
	return (<label className="label label-sm text-sm">
		<select className="select select-sm" value={value} onChange={(e) => {
			setValueAction(e.target.value);
		}}>
			{
				options.map((option) => {
					return (<option key={option.value} value={option.value}>{option.text}</option>)
				})
			}
		</select>
		{
			tooltipText && (<TooltipCircle settingName={text} tooltipText={tooltipText} onTooltipClick={onTooltipAction}/>)
		}
	</label>)
}

export function StringInput({text, value, setValueAction, placeholder, tooltipText, onTooltipAction}: {
	text: string,
	value: string,
	setValueAction: (value: string) => void,
	onTooltipAction: (value: string) => void,
	placeholder?: string,
	tooltipText?: string,
}) {
	return (<label className="label label-sm text-sm">
		<input className="input input-sm" value={value} onChange={(e) => {
			setValueAction(e.target.value);
		}} placeholder={placeholder}/>
		{
			tooltipText && (<TooltipCircle settingName={text} tooltipText={tooltipText} onTooltipClick={onTooltipAction}/>)
		}
	</label>)
}
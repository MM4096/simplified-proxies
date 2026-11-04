import {CheckboxInput, EnumInput, StringInput} from "@/app/editor/components/inputs/inputs";
import {FlavorTextBehavior, MTGAPIImportType, ReminderTextBehavior} from "@/lib/mtg/mtgTypes";
import {ReactElement} from "react";

export function AdditionalSettings({
									   overwrite,
									   setOverwrite,
									   requestBody,
									   setAdditionalSettingText,
									   setRequestValue,
									   additionalSettingText
								   }: {
	overwrite: boolean,
	setOverwrite: (value: boolean) => void,
	requestBody: MTGAPIImportType
	additionalSettingText: string,
	setAdditionalSettingText: (text: string) => void,
	setRequestValue: (key: keyof MTGAPIImportType, value: any) => void,
}) {
	const childComponents: Array<ReactElement> = [
		(<CheckboxInput text="Overwrite Existing Cards" value={overwrite} setValueAction={setOverwrite}
		                tooltipText="If checked, will replace all cards in the selected project with the imported cards."
		                onTooltipAction={setAdditionalSettingText} className={overwrite ? "checkbox-error" : ""}/>),
		(<CheckboxInput text="Import Basic Lands" value={requestBody.importBasicLands || false}
		                tooltipText="Whether to import basic lands. Plains, Mountain, Swamp, Island, and Forest are considered basic lands."
		                setValueAction={
							(value) => setRequestValue("importBasicLands", value)
						}
		                onTooltipAction={setAdditionalSettingText}
		/>),
		(<EnumInput
			tooltipText="How reminder text should be handled. (Reminder text is anything in brackets, like this.)"
			value={requestBody.reminderTextBehavior || 0}
			setValueAction={(value) => setRequestValue("reminderTextBehavior", value)}
			options={[{
				value: ReminderTextBehavior.NORMAL,
				text: "Render reminder text as normal text",
			}, {
				value: ReminderTextBehavior.ITALIC,
				text: "Italicize reminder text",
			}, {
				value: ReminderTextBehavior.HIDDEN,
				text: "Exclude reminder text",
			}]}
			onTooltipAction={setAdditionalSettingText} text="Reminder Text Behavior"/>),
		(<EnumInput value={requestBody.flavorTextBehavior || 0}
		            tooltipText="Flavor names are reprints with different names (e.g. Vivi&apos;s Thunder Magic is Lightning Bolt.)"
		            setValueAction={(value) => setRequestValue("flavorTextBehavior", value)}
		            options={[{
						value: FlavorTextBehavior.NAME,
						text: "Import only flavor/alternative names",
					}, {
						value: FlavorTextBehavior.BOTH,
						text: "Import both flavor names and flavor text",
					}, {
						value: FlavorTextBehavior.NONE,
						text: "Exclude flavor names and flavor text",
					}]}
		            onTooltipAction={setAdditionalSettingText} text="Flavor Text Behavior"/>),
		(<CheckboxInput text="Split DFCs into separate cards" value={requestBody.splitDFCs || false}
		                setValueAction={(value) => setRequestValue("splitDFCs", value)}
		                tooltipText="If checked, all DFCs will be imported as two cards, one for each side."
		                onTooltipAction={setAdditionalSettingText}/>),
		(<CheckboxInput text="Automatically apply templates" value={requestBody.importTemplates || false}
		                setValueAction={(value) => setRequestValue("importTemplates", value)}
		                tooltipText="Whether to automatically apply templates based on detected card types."
		                onTooltipAction={setAdditionalSettingText}/>),
		(<StringInput value={requestBody.importNote || ""} placeholder="Import Notes (optional)"
		              setValueAction={(value) => setRequestValue("importNote", value)}
		              tooltipText="Any note you want to add to all the cards"
		              onTooltipAction={setAdditionalSettingText} text="Import Notes"/>),
		(<CheckboxInput text="Suppress Warnings" value={requestBody.suppressWarnings || false}
		                setValueAction={(value) => setRequestValue("suppressWarnings", value)}
		                tooltipText="If checked, will automatically accept all autocorrect suggestions and ignore all warnings."
		                onTooltipAction={setAdditionalSettingText}
		                className={requestBody.suppressWarnings ? "checkbox-warning" : ""}/>),
		(<CheckboxInput text="Include Log" value={requestBody.includeMessages || false}
		                setValueAction={(value) => setRequestValue("includeMessages", value)}
		                tooltipText="If checked, will return and display any logs produced."
		                onTooltipAction={setAdditionalSettingText}/>),
	]

	return (<>
		<div className="w-full flex flex-col md:flex-row overflow-x-hidden flex-wrap">
			{
				childComponents.map((child, index) => {
					return (<div key={index} className="w-full md:w-1/2 lg:w-1/3 xl:w-1/4 p-1">
						{child}
					</div>)
				})
			}
		</div>

		<div className="divider"/>

		<p className="text-sm italic">{additionalSettingText != "" ? additionalSettingText : "Click on an info circle to learn more about a setting."}</p>
	</>)
}
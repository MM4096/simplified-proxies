export function CardTextareaInput({text, setTextAction}: {
	text: string,
	setTextAction: (text: string) => void,
}) {
	return (<>
		<p>Paste a list of cards below. Card names must be exact (except symbols and capitalization)
			and must match one of the following formats:</p>
		<div className="flex flex-col md:flex-row w-full">
			<div className="border p-2 grow md:w-max">
				<p>Plains</p>
				<p>Deflecting Swat</p>
				<p>Deflecting Swat</p>
				<p>sakura tribe elder</p>
				<p>jace the perfected mind</p>
				<p>commit // memory</p>
			</div>
			<div className="border p-2 grow md:w-max">
				<p>2 Plains</p>
				<p>2 Deflecting Swat</p>
				<p>4 sakura tribe elder</p>
				<p>10 jace the perfected mind</p>
				<p>1 Commit</p>
			</div>
			<div className="border p-2 grow md:w-max">
				<p>2x Plains</p>
				<p>2x Deflecting Swat</p>
				<p>4x sakura tribe elder</p>
				<p>10x jace the perfected mind</p>
				<p>1x Memory</p>
			</div>
		</div>
		<fieldset className="fieldset">
			<legend className="fieldset-legend"></legend>
			<textarea className="textarea w-full" placeholder="Paste your card data here"
			          value={text}
			          onChange={(e) => {
						  setTextAction(e.target.value);
					  }}/>
		</fieldset>
	</>)
}
import {AttackOrAbility} from "@/app/editor/ptcg/page";

export function AttacksAbilitiesList({attacksAndAbilities, setAttacksAndAbilities}: {
	attacksAndAbilities: AttackOrAbility[],
	setAttacksAndAbilities: (attacksAndAbilities: AttackOrAbility[]) => void,
}) {

	function editVal(index: number, key: string, value: string) {
		const newAttacksAndAbilities = [...attacksAndAbilities];
		newAttacksAndAbilities[index][key as keyof AttackOrAbility] = value;
		setAttacksAndAbilities(newAttacksAndAbilities);
	}

	return (<div className="collapse bg-base-100 border flex-none">
		<input type="checkbox"/>
		<div className="collapse-title">Attacks and Abilities</div>
		<div className="collapse-content flex flex-col gap-2">
			{
				attacksAndAbilities.map((item, index) => {
					return <div key={index} className="collapse bg-base-300 border flex-none">
						<div className="collapse-title">{item.name || index}</div>
						<input type="checkbox"/>
						<div className="collapse-content">

							<fieldset className="fieldset">
								<legend className="fieldset-legend">Name</legend>
								<input type="text" value={item.name || ""} placeholder="Name" className="input"
									   onChange={(e) => {
										   editVal(index, "name", e.target.value);
									   }}/>
							</fieldset>
							<fieldset className="fieldset">
								<legend className="fieldset-legend">Cost or <i>ABILITY</i></legend>
								<input type="text" value={item.cost || ""} placeholder="Cost (or ABILITY)" className="input"
									   onChange={(e) => {
										   editVal(index, "cost", e.target.value);
									   }}/>
							</fieldset>
							<fieldset className="fieldset">
								<legend className="fieldset-legend">Damage</legend>
								<input type="text" value={item.damage || ""} placeholder="Damage (optional)" className="input"
									   onChange={(e) => {
										   editVal(index, "damage", e.target.value);
									   }}/>
								<label className="label">Optional</label>
							</fieldset>

							<fieldset className="fieldset">
								<legend className="fieldset-legend">Text</legend>
								<textarea value={item.text || ""} placeholder="Text" className="textarea"
										  onChange={(e) => {
											  editVal(index, "text", e.target.value);
										  }}/>
							</fieldset>

							<button className="btn btn-secondary" onClick={() => {
								setAttacksAndAbilities([...attacksAndAbilities.slice(0, index), ...attacksAndAbilities.slice(index + 1)]);
							}}>Delete
							</button>

						</div>
					</div>
				})
			}
			<button className="btn btn-primary" onClick={() => {
				setAttacksAndAbilities([...attacksAndAbilities, {
					name: "",
					cost: "",
					damage: "",
					text: ""
				}]);
			}}>Add New
			</button>
		</div>
	</div>)
}
"use client";

import {useEffect, useRef, useState} from "react";
import {alertPrompt, confirmationPrompt} from "@/app/components/confirmation/confirmationFunctions";

export function ProjectsBox({localStorageKey, setProjectAction, selectedProject}: {
	localStorageKey: string,

	setProjectAction: (project: string) => void,
	selectedProject: string | null,
}) {
	const selectProjectDialogRef = useRef<HTMLDialogElement>(null);
	const newProjectDialogRef = useRef<HTMLDialogElement>(null);
	const addCardsFromProjectDialogRef = useRef<HTMLDialogElement>(null);

	const [newProjectName, setNewProjectName] = useState<string>("");
	const [copyProjectName, setCopyProjectName] = useState<string>("");
	const [copyToProject, setCopyToProject] = useState<string | null>(null);
	const [isMounted, setIsMounted] = useState<boolean>(false);

	useEffect(() => {
		setIsMounted(true);
	}, []);

	function getAllProjects() {
		if (!isMounted) return {};
		const projectStorage = localStorage.getItem(localStorageKey);
		if (!projectStorage) return {};
		return JSON.parse(projectStorage) as Record<string, any[]>;
	}

	function deleteCurrentProject() {
		if (!selectedProject) return;
		const projects = getAllProjects();

		if (!projects.hasOwnProperty(selectedProject)) return;

		delete projects[selectedProject];
		localStorage.setItem(localStorageKey, JSON.stringify(projects));
		setProjectAction("");
		selectProjectDialogRef?.current?.close();
	}

	function getProjectNames() {
		let retProjects: string[] = [];
		const projects = getAllProjects();
		retProjects = Object.keys(projects);

		if (selectedProject && !retProjects.includes(selectedProject)) {
			retProjects.push(selectedProject);
		}
		return retProjects.sort() as string[];
	}

	function copyCards() {
		let projects = getAllProjects();
		if (!projects.hasOwnProperty(copyProjectName || "UNSAVED")) return;
		if (!projects.hasOwnProperty(copyToProject || "UNSAVED")) return;

		projects[copyToProject || "UNSAVED"] = [...projects[copyToProject || "UNSAVED"], ...projects[copyProjectName || "UNSAVED"] || []];
		localStorage.setItem(localStorageKey, JSON.stringify(projects));
		setProjectAction(selectedProject || "UNSAVED");
	}

	return (<>

		<button className="btn btn-outline" onClick={() => {
			selectProjectDialogRef?.current?.showModal();
		}}>
			{
				selectedProject ? `Project: ${selectedProject}` : `Select Project`
			}
		</button>

		<dialog className="modal" ref={selectProjectDialogRef}>
			<div className="modal-box gap-3 flex flex-col">
				<h3 className="font-bold text-xl custom-divider">Select a Project</h3>
				<p>Changing projects replaces the current cards with the ones from the selected project.</p>

				<div className="flex flex-row gap-2 w-full">
					{
						isMounted ? (
							<ProjectSelect selectedProject={selectedProject} setProjectAction={setProjectAction}
							               getProjectsNamesAction={getProjectNames}/>) : (<>Loading...</>)
					}

					<button className="btn-error btn-outline btn" onClick={async () => {
						const result = await confirmationPrompt("Delete Project", "Are you sure you want to delete this project? This action cannot be undone.", "Cancel", "Delete Project");
						if (result) {
							deleteCurrentProject();
						}
					}}>Delete this Project
					</button>
				</div>

				<button className="btn-outline btn" onClick={() => {
					addCardsFromProjectDialogRef?.current?.showModal();
					selectProjectDialogRef?.current?.close();
				}}>Add Cards From Project
				</button>

				<div className="flex flex-row gap-2 w-full">
					<button className="btn btn-accent grow" onClick={() => {
						selectProjectDialogRef?.current?.close();
					}}>Close
					</button>
					<button className="btn btn-primary grow" onClick={() => {
						newProjectDialogRef?.current?.showModal();
					}}>
						New Project
					</button>
				</div>

			</div>
			<form method="dialog" className="modal-backdrop">
				<button>close</button>
			</form>
		</dialog>

		<dialog className="modal" ref={newProjectDialogRef}>
			<div className="modal-box gap-3 flex flex-col">
				<h3 className="font-bold text-xl custom-divider">New Project</h3>
				<p>This creates a new, blank project.</p>
				<input type="text" className="input input-bordered w-full" placeholder="Project Name"
				       value={newProjectName} onChange={(e) => {
					setNewProjectName(e.target.value);
				}}/>

				<div className="flex flex-row gap-2 w-full">
					<button className="btn btn-accent" onClick={() => {
						newProjectDialogRef?.current?.close();
					}}>Cancel
					</button>
					<button className="btn btn-primary" onClick={async () => {
						if (newProjectName.length === 0) return;
						const projects = getProjectNames();
						if (projects.includes(newProjectName)) {
							await alertPrompt("Name Conflict", `You already have a project named ${newProjectName}. Please choose a different name.`, "OK");
							return;
						}
						setProjectAction(newProjectName);
						newProjectDialogRef?.current?.close();
					}}>Create Project
					</button>
				</div>

			</div>
			<form method="dialog" className="modal-backdrop">
				<button>close</button>
			</form>
		</dialog>

		<dialog className="modal" ref={addCardsFromProjectDialogRef}>
			<div className="modal-box gap-3 flex flex-col">
				<h3 className="font-bold text-xl custom-divider">Add Cards From Project</h3>
				<p>Appends all the cards from a project to another project.</p>

				<label className="flex flex-row gap-2 w-full items-center">
					<span className="shrink-0">Add cards from:</span>
					<ProjectSelect selectedProject={copyProjectName} setProjectAction={setCopyProjectName}
					               getProjectsNamesAction={getProjectNames}
					               currentProject={selectedProject || "UNSAVED"}/>
				</label>


				<label className="flex flex-row gap-2 w-full items-center">
					<span className="shrink-0">Add cards to:</span>
					<ProjectSelect selectedProject={copyToProject} setProjectAction={setCopyToProject}
					               getProjectsNamesAction={getProjectNames}
					               currentProject={selectedProject || "UNSAVED"}/>
				</label>

				<br/>

				<label className="italic text-sm">This will copy all cards
					from &quot;{copyProjectName || "UNSAVED"}&quot; to &quot;{copyToProject || "UNSAVED"}&quot;</label>

				<div className="flex flex-row gap-2 w-full">
					<button className="btn btn-accent grow" onClick={() => {
						addCardsFromProjectDialogRef?.current?.close();
					}}>Cancel
					</button>
					<button className="btn btn-primary grow" onClick={() => {
						copyCards();
						addCardsFromProjectDialogRef?.current?.close();
					}}>Add Cards
					</button>
				</div>
			</div>
			<form method="dialog" className="modal-backdrop">
				<button>close</button>
			</form>
		</dialog>

	</>)
}

function ProjectSelect({selectedProject, setProjectAction, getProjectsNamesAction, currentProject}: {
	selectedProject: string | null,
	setProjectAction: (project: string) => void,
	getProjectsNamesAction: () => string[],
	currentProject?: string,
}) {
	return (<select className="select select-bordered w-full" onChange={(e) => {
		setProjectAction(e.target.value);
	}} value={selectedProject || ""}>
		{
			getProjectsNamesAction().map((project) => {
				let projectText = project;
				if (project === currentProject) {
					projectText += " (Selected Project)"
				}
				return <option key={project}
				               value={project === "UNSAVED" ? "" : project}>{projectText}</option>
			})
		}
		{
			getProjectsNamesAction().length === 0 &&
			<option key="0" value="" disabled={true}>No Projects</option>
		}
	</select>)
}
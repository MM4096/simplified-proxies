"use client";

import {useEffect, useRef, useState} from "react";

export function ProjectsBox({localStorageKey, setProjectAction, selectedProject}: {
	localStorageKey: string,

	setProjectAction: (project: string) => void,
	selectedProject: string | null,
}) {
	const selectProjectDialogRef = useRef<HTMLDialogElement>(null);
	const newProjectDialogRef = useRef<HTMLDialogElement>(null);

	const [newProjectName, setNewProjectName] = useState<string>("");
	const [isMounted, setIsMounted] = useState<boolean>(false);

	useEffect(() => {
		setIsMounted(true);
	}, []);

	function deleteCurrentProject() {
		const projectStorage = localStorage.getItem(localStorageKey);
		if (!projectStorage || !selectedProject) return;

		const projects = JSON.parse(projectStorage);
		delete projects[selectedProject];
		localStorage.setItem(localStorageKey, JSON.stringify(projects));
		setProjectAction("");
		selectProjectDialogRef?.current?.close();
	}

	function getProjectNames() {
		let retProjects: string[] = [];
		try {
			const projectsStorage = localStorage.getItem(localStorageKey);
			if (!projectsStorage || Array.isArray(JSON.parse(projectsStorage))) {
				// old format || doesn't exist
			} else {
				retProjects = Object.keys(JSON.parse(projectsStorage));
			}
		} catch {
		}

		if (selectedProject && !retProjects.includes(selectedProject)) {
			retProjects.push(selectedProject);
		}
		return retProjects.sort() as string[];
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
						isMounted ? (<select className="select select-bordered w-full" onChange={(e) => {
							setProjectAction(e.target.value);
							selectProjectDialogRef?.current?.close();
						}} value={selectedProject || ""}>
							{
								getProjectNames().map((project) => {
									return <option key={project} value={project === "UNSAVED" ? "" : project}>{project}</option>
								})
							}
							{
								getProjectNames().length === 0 &&
								<option key="0" value="" disabled={true}>No Projects</option>
							}
						</select>) : (<>Loading...</>)
					}


					<button className="btn-error btn-outline btn" onClick={() => {
						const result = prompt("Are you sure you want to delete this project? This action is irreversible.\n\nTo continue, type \"DELETE\" in the box below.");
						if (result === "DELETE") {
							deleteCurrentProject();
						}
					}}>Delete this Project</button>
				</div>

				<div className="flex flex-row gap-2 w-full">
					<button className="btn btn-accent" onClick={() => {
						selectProjectDialogRef?.current?.close();
					}}>Close
					</button>
					<button className="btn btn-primary" onClick={() => {
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
				<p>This duplicates your current cards to the created project.</p>
				<input type="text" className="input input-bordered w-full" placeholder="Project Name"
					   value={newProjectName} onChange={(e) => {
					setNewProjectName(e.target.value);
				}}/>

				<div className="flex flex-row gap-2 w-full">
					<button className="btn btn-accent" onClick={() => {
						newProjectDialogRef?.current?.close();
					}}>Cancel
					</button>
					<button className="btn btn-primary" onClick={() => {
						if (newProjectName.length === 0) return;
						const projects = getProjectNames();
						if (projects.includes(newProjectName)) {
							alert("Project already exists");
							return;
						}
						setProjectAction(newProjectName);
						newProjectDialogRef?.current?.close();
					}}>Add Project
					</button>
				</div>

			</div>
			<form method="dialog" className="modal-backdrop">
				<button>close</button>
			</form>
		</dialog>

	</>)
}
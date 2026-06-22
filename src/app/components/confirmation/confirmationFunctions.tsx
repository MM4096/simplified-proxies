import {createRoot} from "react-dom/client";
import {AlertModal, ConfirmationModal} from "@/app/components/confirmation/confirmationModal";
import {ReactNode} from "react";

export async function confirmationPrompt(title: string, message: string | ReactNode,
                                         noButtonText: string = "Cancel",
                                         yesButtonText: string = "Confirm"): Promise<boolean> {
	return new Promise<boolean>((resolve) => {
		const container: HTMLDivElement = document.createElement("div");
		document.body.appendChild(container);

		const root = createRoot(container);

		const handleResult = (confirmed: boolean) => {
			root.unmount();
			document.body.removeChild(container);
			resolve(confirmed);
		}

		root.render(<ConfirmationModal title={title} message={message} noButtonText={noButtonText}
		                               yesButtonText={yesButtonText} onAction={((result) => {
			handleResult(result);
		})}/>);
	})
}

export async function alertPrompt(title: string, message: string | ReactNode, okButtonText: string = "OK"): Promise<void> {
	return new Promise<void>((resolve) => {
		const container: HTMLDivElement = document.createElement("div");
		document.body.appendChild(container);

		const root = createRoot(container);

		const handleResult = () => {
			root.unmount();
			document.body.removeChild(container);
			resolve();
		}

		root.render(<AlertModal onAction={() => handleResult()} okButtonText={okButtonText} message={message}
		                        title={title}/>)
	})
}
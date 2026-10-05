import {createRoot} from "react-dom/client";
import {AlertModal, ConfirmationModal} from "@/app/components/confirmation/confirmationModal";
import {ReactNode} from "react";

/**
 * Creates a prompt to ask the user for confirmation.<br>
 * Creates (then deletes) {@link ConfirmationModal} in root.<br>
 * To create only an alert, use {@link alertPrompt}
 * @param title
 * @param message
 * @param noButtonText
 * @param yesButtonText
 * @returns a promise of which button the user selects (`true` or `false`), or `false` if they cancel.
 */
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

/**
 * Creates an alert.<br>
 * Creates (then deletes) {@link AlertModal} in root.<br>
 * To create a prompt with options, use {@link confirmationPrompt}
 * @param title
 * @param message
 * @param okButtonText
 */
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
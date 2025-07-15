import {createRoot} from "react-dom/client";
import ConfirmationModal from "@/app/components/confirmation/confirmationModal";

export async function confirmationPrompt(title: string, message: string, noButtonText: string = "Cancel", yesButtonText: string = "Confirm"): Promise<boolean> {
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
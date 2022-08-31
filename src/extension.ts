import * as vscode from 'vscode';
import axios from 'axios';

type ZekirResponse = {
	content: string;
	description: string;
	reference: string;
	count: string;
	category: string;
};

export function activate(context: vscode.ExtensionContext) {

	const config = vscode.workspace.getConfiguration('hisn-al-muslim');
	const intervalInSec: number = (config.get('interval', 30) as number) * 60 * 1000;
	const notificationType = config.get('notificationType', 'side') as 'side' | 'modal';


	const azkarCommand = vscode.commands.registerCommand('zekir.azkar', async () => {

		setInterval(async () => {
			const response = await axios.get('https://azkar-api.nawafhq.repl.co/zekr?t&json');
			const zekir = response.data as ZekirResponse;

			if (notificationType === 'side') {
				vscode.window.showInformationMessage(zekir.content);
			}

			if (notificationType === 'modal') {
				vscode.window.showInformationMessage(zekir.content,
					{
						modal: true,
						detail: zekir.description
					});
			}

		}, intervalInSec);

	});

	context.subscriptions.push(azkarCommand);

}


export function deactivate() { }

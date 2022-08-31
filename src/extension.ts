import * as vscode from 'vscode';
import axios from 'axios';

interface ZekrResponse {
	content: string;
	description: string;
	reference: string;
	count: string;
	category: string;
};

const getRandomZekr = async () => {
	const response = await axios.get('https://azkar-api.nawafhq.repl.co/zekr?t&json');
	const zekr = response.data as ZekrResponse;

	return zekr;
};

const showNotification = async (notificationType: 'side' | 'modal') => {

	const zekr = await getRandomZekr();

	if (notificationType === 'side') {
		vscode.window.showInformationMessage(zekr.content);
	}

	if (notificationType === 'modal') {
		vscode.window.showInformationMessage(zekr.content,
			{
				modal: true,
				detail: zekr.description
			});
	}
};


export function activate(context: vscode.ExtensionContext) {

	const config = vscode.workspace.getConfiguration('hisn-al-muslim');
	const intervalInSec: number = (config.get('interval', 30) as number) * 60 * 1000;
	const notificationType = config.get('notificationType', 'side') as 'side' | 'modal';


	const azkarCommand = vscode.commands.registerCommand('zekir.azkar', async () => {

		showNotification(notificationType);

		setInterval(async () => {
			showNotification(notificationType);
		}, intervalInSec);

	});

	context.subscriptions.push(azkarCommand);

}


export function deactivate() { }

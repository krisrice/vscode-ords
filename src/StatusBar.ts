import * as vscode from 'vscode';
import { ordsResults } from './ORDSsqlExtention';

export class StatusBar{
	private static myStatusBarItem : vscode.StatusBarItem;


	public static getStatusBar():vscode.StatusBarItem{
		if ( ! StatusBar.myStatusBarItem  ){
			StatusBar.myStatusBarItem = vscode.window.createStatusBarItem(vscode.StatusBarAlignment.Right, 100);
		}
		return StatusBar.myStatusBarItem;
	}
	public static show(msg:string){

			StatusBar.myStatusBarItem.text = msg;
			StatusBar.myStatusBarItem.show();

	}
	public static hide(){
		StatusBar.myStatusBarItem.hide();

	}

	public static updateStatusTextEditor():void{
		var lastRun = ordsResults.get(vscode.window.activeTextEditor.document.uri.path);
		if (lastRun) {
			StatusBar.show("Last Ran:"+ lastRun.when);
		} else {
			StatusBar.hide();
		}


	}
		
}
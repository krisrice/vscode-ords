import * as vscode from 'vscode';
var showdown  = require('showdown');

export class ConnectionsPanel {
    private static currentPanel: ConnectionsPanel | undefined;
    private static outputChannel :  vscode.OutputChannel | undefined;
    private readonly _panel: vscode.WebviewPanel;
    public static readonly viewType = 'ORDSConnectionView';
    private _disposables: vscode.Disposable[] = [];
    
    public static log(msg:string){
        ConnectionsPanel.createOrShow();
        ConnectionsPanel.currentPanel.log(msg)
    }
	
    private constructor(panel: vscode.WebviewPanel) {
        this._panel = panel;
        ConnectionsPanel.outputChannel = vscode.window.createOutputChannel("ORDS Connections")

        // Listen for when the panel is disposed
        // This happens when the user closes the panel or when the panel is closed programatically
        this._panel.onDidDispose(() => this.dispose(), null, this._disposables);
        // Handle messages from the webview
        this._panel.webview.onDidReceiveMessage(message => {
            switch (message.command) {
                case 'alert':
                    vscode.window.showErrorMessage(message.text);
                    return;
            }
        }, null, this._disposables);
    }
    public static createOrShow() {
        //honor placement
        //const column = vscode.window.activeTextEditor ? vscode.window.activeTextEditor.viewColumn : undefined;
        // If we already have a panel, show it.
        var currCol=1;
        vscode.window.visibleTextEditors.forEach(e=>{
            currCol = e.viewColumn>currCol?e.viewColumn:currCol;
        })

        if (ConnectionsPanel.currentPanel) {
            ConnectionsPanel.currentPanel._panel.reveal(currCol+1,true);
            return;
        }
        // Otherwise, create a new panel.
        const panel = vscode.window.createWebviewPanel(ConnectionsPanel.viewType, 
            "ORDS Connections", 
            vscode.ViewColumn.Beside, 
            {
                // Enable javascript in the webview
                enableScripts: true,
                enableFindWidget: true,
            });
        panel.webview.html = "<hmtl><body>Oracle REST Data Services Connections<br/><input type='text'><!--##NEXT##--></body></html>";
        ConnectionsPanel.currentPanel = new ConnectionsPanel(panel);
    }

    public sendJSON(){
        //this._panel.postMessage({ command: 'refactor' });
    }
    public log(text: string) {
        if (text) {
            var converter = new showdown.Converter();            
            var msg = { command: 'results' , data : converter.makeHtml(text) };
            var posted = this._panel.webview.postMessage(msg);
                }
    }
    public dispose() {
        ConnectionsPanel.currentPanel = undefined;
        // Clean up our resources
        this._panel.dispose();
        while (this._disposables.length) {
            const x = this._disposables.pop();
            if (x) {
                x.dispose();
            }
        }
    }
}

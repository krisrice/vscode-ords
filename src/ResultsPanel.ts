import * as vscode from 'vscode';
var showdown  = require('showdown');

export class ResultsPanel {
    private static currentPanel: ResultsPanel | undefined;
    private static outputChannel :  vscode.OutputChannel | undefined;
    private readonly _panel: vscode.WebviewPanel;
    public static readonly viewType = 'ORDSView';
    private _disposables: vscode.Disposable[] = [];
    
    public static log(msg:string){
        ResultsPanel.createOrShow();
        ResultsPanel.currentPanel.log(msg)
    }
	
    private constructor(panel: vscode.WebviewPanel) {
        this._panel = panel;
        ResultsPanel.outputChannel = vscode.window.createOutputChannel("ORDS Output")

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

        if (ResultsPanel.currentPanel) {
            ResultsPanel.currentPanel._panel.reveal(currCol+1,true);
            return;
        }
        // Otherwise, create a new panel.
        const panel = vscode.window.createWebviewPanel(ResultsPanel.viewType, 
            "ORDS Output", 
            vscode.ViewColumn.Beside, 
            {
                // Enable javascript in the webview
                enableScripts: true,
                enableFindWidget: true,
            });
        panel.webview.html = `
        <!DOCTYPE html>
        <html lang="en">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">        
        <script>       
        function removeElement(id) {
            var elem = document.getElementById(id);
            return elem.parentNode.removeChild(elem);
        }
        // Handle the message inside the webview
        window.addEventListener('message', event => {

            const message = event.data; // The JSON data our extension sent
            console.log('Got message');
            console.log(JSON.stringify(message));

            switch (message.command) {

                case 'results':
                    var r = document.createElement("div");
                    r.innerHTML = message.data;
                    var resultsDiv = document.getElementById('results');
                    resultsDiv.appendChild(r);     
                    break;
            }
        });
        </script>
        </head><body>
        Oracle REST Data Services - REST enabled SQL<br/><div id="results"><!--##NEXT##--></div>
        </body></html>`;
        ResultsPanel.currentPanel = new ResultsPanel(panel);
    }

    public log(text: string) {
        if (text) {
            var converter = new showdown.Converter();            
            //this._panel.webview.html = this._panel.webview.html.replace("<!--##NEXT##-->",converter.makeHtml(text)+"<!--##NEXT##-->");
            var msg = { command: 'results' , data : converter.makeHtml(text) };
            var posted = this._panel.webview.postMessage(msg);
            console.log(posted)

        }
    }
    public dispose() {
        ResultsPanel.currentPanel = undefined;
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

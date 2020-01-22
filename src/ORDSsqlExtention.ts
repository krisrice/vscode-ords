import * as path from 'path';
import * as vscode from 'vscode';
import { ORDS } from './ORDS';
import { ResultsDecorator } from './ResultsDecorator';
import { SSL_OP_DONT_INSERT_EMPTY_FRAGMENTS } from 'constants';
import { ResultsPanel } from './ResultsPanel';
import { ConnectionsPanel } from './ConnectionsPanel';

import {ORDSTree} from './tree/ORDSTree';
import { StatusBar } from './StatusBar';
import { ORDSConfiguration } from './ORDSConfiguration';

export var ordsResults = new Map();

export function activate(context: vscode.ExtensionContext) {
    vscode.window.onDidChangeActiveTextEditor(editor => {
		if (editor) {
            ResultsDecorator.decorate(editor);
        }
	}, null, context.subscriptions);
 

    //
    context.subscriptions.push(vscode.commands.registerCommand('ords.runhighlight', () => {
        run(context);
    }));

    context.subscriptions.push(vscode.commands.registerCommand('ords.editEntry', () => {
        ConnectionsPanel.createOrShow();
    }));


    context.subscriptions.push(vscode.commands.registerCommand('onCommand:ords.runfile', () => {
        // if (CatCodingPanel.currentPanel) {
        //     CatCodingPanel.currentPanel.doRefactor();
        // }
    }));
    	// ORDS Tree View
    new ORDSTree(context);
    let sb = StatusBar.getStatusBar();
    // create a new status bar item that we can now manage
    context.subscriptions.push(sb);

    // register some listener that make sure the status bar 
    // item always up-to-date
    context.subscriptions.push(vscode.window.onDidChangeActiveTextEditor(StatusBar.updateStatusTextEditor));
    context.subscriptions.push(vscode.window.onDidChangeTextEditorSelection(StatusBar.updateStatusTextEditor));

    vscode.languages.registerHoverProvider('oracle-sql', {
        provideHover(document, position, token) {
            return new vscode.Hover('I am a hover!');
        }
    });
    vscode.languages.registerCodeLensProvider
} 

export async function run(context: vscode.ExtensionContext){
        var editor = vscode.window.activeTextEditor;
            if (!editor) {
                return; // No open text editor
            }
            var selection = editor.selection;

            var text = editor.document.getText(selection);
            if ( !selection || text ==""){
                text = editor.document.getText()
            }
            ResultsPanel.createOrShow(/*context.extensionPath,editor*/);
            var ordsConfigs = ORDSConfiguration.getConfigs();
            var urls = [];
            var ordsConfig = [];
            ordsConfig = vscode.workspace.getConfiguration().get("ords.endpoint");
            ordsConfig.forEach(function (e){
                urls.push({
                    label: e.url ,
                    description: e.url,
                    conf:e
                });

            });
            urls[0].picked=true;
              vscode.window.showQuickPick(urls, 
                        {  ignoreFocusOut:true,
                            placeHolder: 'Choose ORDS URLs'
                        })
                    .then(selection=>{
                        let conf = selection.conf;

                        var regex = /^(?<protocol>.+?\/\/)(?<username>.+?):(?<password>.+?)@(?<address>.+)$/;
                        var found = conf.url.match(regex);

                        // check for url/username/password from settings
                        if ( ( conf.url && conf.username && conf.password) ||
                             (conf.url && found.length==5)){
                            var ords = new ORDS(ORDSConfiguration.getConfig(conf.url),text,editor);
                            ords.run();
                        } else {
                                vscode.window.showInputBox({   
                                            ignoreFocusOut:true,
                                            prompt: "DB Password", 
                                            password: true })                                            
                                .then((info) => {
                                    if (info !== undefined && info.length > 0) {
                                        vscode.window.setStatusBarMessage(info);
                                    } else {
                                        vscode.window.setStatusBarMessage("no value provided");
                                    }
                                    var c = ORDSConfiguration.getConfig(selection.conf[0].url);
                                    c.setPassword(info);
                                    var ords = new ORDS(c,text,editor);
                                    ords.run();
         
                                })
                            }
                    });

            

    
}
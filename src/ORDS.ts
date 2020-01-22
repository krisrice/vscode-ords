import { window, ProgressLocation } from 'vscode';
var request = require('request');
var rp = require('request-promise-native');

import { ordsResults } from './ORDSsqlExtention';
import { ResultsPanel } from "./ResultsPanel";
import { ResultsFormatter } from "./ResultsFormatter";
import { Statement } from "./sql/Statement";
import { StatusBar } from './StatusBar';

import * as vscode from 'vscode';
import { ResultsDetails } from './ResultsDetails';
import { ORDSConfiguration } from './ORDSConfiguration';


export class ORDS {
    private _url: string;
    private _username: string;
    private _password: string;
    private _sql:  Statement;
    private _editor: vscode.TextEditor;
    private _docURI: string;
    private self: ORDS;
    
    public constructor(config : ORDSConfiguration, sql: string | Statement, editor?: vscode.TextEditor) {
        this._url = config.getURI();
        this._username = config.getUsername();
        this._password = config.getPasswd();
        if ( sql instanceof Statement ){
            this._sql = sql;
        } else {
            this._sql = new Statement(sql);
        }
        this._docURI = editor?editor.document.uri.path:null;
        this._editor = editor;
        this.self = this;
    }

    public rp(callback?) {        
        var self = this;
        var after = callback?callback:(function (error, response, body) {
            if (error) {
                ResultsPanel.log(error);
            }
            self.results(error, response, body, self._docURI);
            console.log(error);
        });

        var options = {
            url: this._url,
            method: 'POST',
            rejectUnauthorized: false,
            body: this._sql.toJSON(),
            time: true,
            auth: {
                user: this._username,
                password: this._password
            },
            headers: { "Content-Type": "application/json" }
        };

        return rp(options);
    }
    
    public run() {      
        StatusBar.show("Running....")
        var self = this;
        var after = (function (error, response, body) {
            if (error) {
                ResultsPanel.log("```\n"+JSON.stringify(error) + "\n```");
            }
            self.results(error, response, body, self._docURI);
            console.log(error);
            StatusBar.show("Finished")
        });
        
        request.post({
            url: this._url,
            method: 'POST',
            rejectUnauthorized: false,  /// hack for dbtools ssl is jacked somehow
            body: this._sql.toJSON(),
            time: true,
            auth: {
                user: this._username,
                password: this._password
            },
            headers: { "Content-Type": "application/json" }
        }, after);
    }
    public results(error, response, body, docuri) {
        var title =  (new Date()).toLocaleTimeString() +" Elapsed time:" + response.elapsedTime + "ms";

        var rd = new ResultsDetails(title,"");

        try {
            JSON.parse(body);
        }
        catch (e) {
            ResultsPanel.log(body);
        }
        ordsResults.set(docuri, { results: JSON.parse(body), 
                                    when : new Date()});

            JSON.parse(body).items.forEach(function (e) {
            
                if (e.errorDetails) {
                    rd.addChild(new ResultsDetails(e.statementId + "-ERROR","\n " + e.statementText + "\n"+ e.errorDetails + " \n"));
                }
                else {
                    if (e.statementType == 'query' ) {
    
                        if (e.resultSet && e.resultSet.items) {
                            console.table(e.resultSet.items);
                            rd.addChild(new ResultsDetails(e.statementId + "-Query Results",ResultsFormatter.formatResultsHTML(e.resultSet.items)));
                        }else {
                            rd.addChild(new ResultsDetails(e.statementId + "-Extension ERROR!!!!",JSON.stringify(e)));
                            console.table(e);
                        }
                    }else{
                        rd.addChild(new ResultsDetails(e.statementId + "-" + e.statementType ,
                        "` "+e.statementType + ">>" + e.statementText.substring(0, 50).replace(/\n/g, " ") + "...` \n"+
                        "\n" +
                        "<pre> "+ e.response.join("\n").trim() + " </pre>"));
                    }
                }
            });

            /*
            5OP373 / Zoom: Craig.Stephen PW: 8675309 Numeric Zoom: 650 506 8329
            */
            ResultsPanel.log(rd.toHTML());

    }

}

import { MarkdownString } from 'vscode';
import { ordsResults } from './ORDSsqlExtention';
import * as vscode from 'vscode';
import { ResultsFormatter } from "./ResultsFormatter";

export class ResultsDecorator {
    private static errorDecorationType = vscode.window.createTextEditorDecorationType({
        borderWidth: '1px',
        borderStyle: 'dashed',
        borderColor: 'red',
        overviewRulerColor: 'red',
        overviewRulerLane: vscode.OverviewRulerLane.Full,
        light: {
            // this color will be used in light color themes
            borderColor: 'darkred'
        },
        dark: {
            // this color will be used in dark color themes
            borderColor: 'lightred'
        }
    });
    private static resultsDecorationType = vscode.window.createTextEditorDecorationType({
        borderWidth: '0px',
        borderStyle: 'dashed',
        borderColor: 'blue',
        borderRadius: "25px",
        overviewRulerColor: 'blue',
        overviewRulerLane: vscode.OverviewRulerLane.Full,
        light: {
            // this color will be used in light color themes
            borderColor: 'black'
        },
        dark: {
            // this color will be used in dark color themes
            borderColor: 'blue'
        }
    });
    public static decorate(editor: vscode.TextEditor) {
        var lastRun = ordsResults.get(editor.document.uri.path).results;
        const results: vscode.DecorationOptions[] = [];
        const errors: vscode.DecorationOptions[] = [];
        if (lastRun) {
            lastRun.items.forEach(function (e) {
                var start = new vscode.Position(e.statementPos.startLine - 1, 0);
                var end = new vscode.Position(e.statementPos.endLine - 1, Number.MAX_VALUE);
                var lineMsg = "### Line:" + (e.statementPos.startLine) + " - " + (e.statementPos.startLine == e.statementPos.endLine ? e.statementPos.endLine : e.statementPos.endLine - 1) +"\n";
                const md = new vscode.MarkdownString();

                if (e.errorDetails) {
                    md.appendMarkdown(lineMsg);
                    md.appendCodeblock( e.errorDetails );

                    const decoration = { range: new vscode.Range(start, end), hoverMessage: md};
                    errors.push(decoration);

                }
                else if (e.statementType == 'query' && !e.errorDetails) {
                    if (e.resultSet && e.resultSet.items) {
                        var table = ResultsFormatter.formatResultsMarkdown(e.resultSet.items);
                        md.appendMarkdown(lineMsg);

                        md.appendMarkdown(table);
                        const decoration = { range: new vscode.Range(start, end),
                                             hoverMessage: md };
                        results.push(decoration);
                    }
                }else {
                    if (e.response ) {
                        md.appendMarkdown(lineMsg);

                        md.appendCodeblock(e.response.join(''));
                        const decoration = { range: new vscode.Range(start, end), hoverMessage: md };
                        results.push(decoration);
                    }
                }
            });
            editor.setDecorations(ResultsDecorator.errorDecorationType, errors);
            editor.setDecorations(ResultsDecorator.resultsDecorationType, results);
        }
    }
}

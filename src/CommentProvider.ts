import { ordsResults } from './ORDSsqlExtention';
import * as vscode from 'vscode';

class CommentProvider implements vscode.FoldingRangeProvider {
    // This method must return a list of the foldable ranges
    provideFoldingRanges(document: vscode.TextDocument, context: vscode.FoldingContext, token: vscode.CancellationToken): vscode.ProviderResult<vscode.FoldingRange[]> {
        var lastRun = ordsResults.get(document.uri.path).results;
        let ret: vscode.FoldingRange[] = [];
        if (lastRun) {
            lastRun.items.forEach(function (e) {
                var start = e.statementPos.startLine;
                var end = (e.statementPos.startLine == e.statementPos.endLine ? e.statementPos.endLine : e.statementPos.endLine - 1);
                if (start != end) {
                    ret.push(new vscode.FoldingRange(start, end));
                }
            });
        }
        return ret;
    }
    ;
}

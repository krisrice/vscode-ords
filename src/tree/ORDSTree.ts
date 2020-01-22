import * as vscode from 'vscode';
import * as path from 'path';
import { loadavg } from 'os';
import { ORDS } from '../ORDS';
import { ResultsPanel } from '../ResultsPanel';
import { SharedQueries } from '../sql/SharedQueries';
import { StatusBar } from '../StatusBar';
import { ORDSConfiguration } from '../ORDSConfiguration';


export class ORDSTree {

	constructor(context: vscode.ExtensionContext) {
		loadTable();
	}
}

function loadTable(){
   const view = vscode.window.createTreeView('ordsView', { treeDataProvider: new DBTreeProvider()});

   vscode.commands.registerCommand('ordsView.reveal', async () => {
		  await view.reveal(DBTreeNodeRoot[0], { focus: true, select: false, expand: false });
   });

}
//	{id:"/tables",label:"Tables", sqlid: "tables",sql:"select u.table_name name,'table' icon,u.*  from user_tables u",children:[],collapsibleState:1},

const DBTreeNodeRoot = [
	{id:"/tables",label:"Tables", sqlid: "tables",children:[],collapsibleState:1},
	{id:"/views",label:"Views", sql:"select u.view_name name,u.* from user_views u",children:[],collapsibleState:1},
	{id:"/packages",label:"Packages", sql:"select u.object_name name,u.* from user_objects u where object_type = 'PACKAGE'",children:[],collapsibleState:1},
	{id:"/procedures",label:"Procedures", sql:"select u.object_name name,u.* from user_objects u where object_type = 'PROCEDURE'",children:[],collapsibleState:1},
];

var ordsConfigs = ORDSConfiguration.getConfigs();
var root=[];
ordsConfigs.forEach(function (e){
	var node = {
		label		: e.getLabel()?e.getLabel():e.getURI(),
		description	: e.getURI(),
		conf		: e,
		children	: [],
		ordsConfig	: e,
		collapsibleState:1
	};

	DBTreeNodeRoot.forEach(n=>{
		var cloned = JSON.parse(JSON.stringify(n));
		node.children.push(
			{id 		: e.getURI() + cloned.id,
			 label		: cloned.label,
			 sqlid 		: cloned.sqlid,
			 sql 		: cloned.sql,
			 children	: cloned.children,
			 parent		: node,
			 collapsibleState:cloned.collapsibleState
			}
		);
	})
	root.push(node);
});


export interface DBTreeNode {
	id: string;
	children? : DBTreeNode[];
	sql?: string;
	sqlid?:string;
	label:string;
	parent?:DBTreeNode;
	iconPath?: string | vscode.Uri | { light: string | vscode.Uri; dark: string | vscode.Uri } | vscode.ThemeIcon;
	details?;
	tooltip?;
	ordsConfig?:ORDSConfiguration;
}

/*
*/

function getORDSRoot(node:DBTreeNode) : ORDSConfiguration {
	return node.ordsConfig?node.ordsConfig:getORDSRoot(node.parent);
}

 function load(node:DBTreeNode): DBTreeNode[] {
	 if ( node.sql || SharedQueries.getSQL(node.sqlid)){
		var sql = SharedQueries.getSQL(node.sqlid)?SharedQueries.getSQL(node.sqlid):node.sql;
		var ordsConf = getORDSRoot(node);
		var ords = new ORDS(ordsConf,sql);
		StatusBar.show("Running Tree Query");

		return ords.rp().then(function (body) {
			console.log(body)
			JSON.parse(body).items[0].resultSet.items.forEach(function (e) {
				node.children.push({
					id: node.id + "#" + e.name,
					label:e.name,
					parent:node,
					children:[],
					sql:"",
					details:e
				});
				});
				StatusBar.hide();
			return node.children;
		}).catch(function (err) {
			ResultsPanel.log(err);
		});
	} else {
		return node.children;
	}
}


class DBTreeProvider implements vscode.TreeDataProvider<DBTreeNode>{
	public getTreeItem(element: DBTreeNode): vscode.TreeItem {
		if ( element&&element.details&&element.details.status&&element.details.status!='VALID'){
			element.iconPath={
				light: path.join(__filename, '..', '..','..', 'media', 'thumbs-down.svg'),
				dark: path.join(__filename, '..', '..', '..','media', 'thumbs-down.svg')
			};
		}else if ( element&&element.details&&element.details.icon){
			element.iconPath={
				light: path.join(__filename, '..', '..','..', 'media', element.details.icon + '.svg'),
				dark: path.join(__filename, '..', '..', '..','media', element.details.icon + '.svg'),
			};
		}

		return element;
	}


	public getChildren(element?: DBTreeNode): DBTreeNode[] | Thenable<DBTreeNode[]> {
		return element?load(element):root;
	}


	public getParent(element: DBTreeNode): DBTreeNode {
		return element.parent?element.parent:null;

	}

}

import * as vscode from 'vscode';


export class ORDSConfiguration {
    private _uri :string;
	private _label :string;
	private _username :string;
	private _passwd :string;

	private constructor(uri:string,label:string,username:string,passwd:string) {
		this._uri = uri;
        this._label = label;
        this._username = username;
        this._passwd = passwd;
    }
    public getURI():string {
        return this._uri;
    }
    public getLabel():string {
        return this._label;
    }
    public getUsername():string {
        return this._username;
    }
    public getPasswd():string {
        return this._passwd;
    }
    public setPassword(passwd: string) {
        this._passwd = passwd
    }

    public isValid(): boolean {
        var regex = /^(?<protocol>.+?\/\/)(?<username>.+?):(?<password>.+?)@(?<address>.+)$/;
        var found = this._uri.match(regex);

        // check for url/username/password from settings
        if ( ( this._uri && this._username && this._passwd) ||  (this._uri && found.length==5) ) {
            return true;
        }
        return false;
    }
    public static getConfig(uri:string): ORDSConfiguration {
        var ret;
        ORDSConfiguration.getConfigs().forEach(config => {
            if  ( config.getURI() == uri ) { 
                ret = config;
            }            
        });
        return ret;
    }
    public static getConfigs(): ORDSConfiguration [] {

            var ordsConfigs = [];
            var ordsSettings = [];
                ordsSettings = vscode.workspace.getConfiguration().get("ords.endpoint");
            ordsSettings.forEach(function (e){
                ordsConfigs.push(new ORDSConfiguration(e.url,e.label,e.username,e.password));
			});
        
            return ordsConfigs;
        }			
}



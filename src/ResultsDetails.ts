import { TextDecoder } from "util";

export class ResultsDetails {
	private _summary :string;
	private _detail :string;
	private _children : ResultsDetails[];

	public constructor(summary:string,detail:string) {
		this._summary = summary;
		this._detail = detail;
	}

	public addChild(child:ResultsDetails){
		if (! this._children){
			this._children = [];
		}
		this._children.push(child);
	}

	public toHTML() : string {
		var id =   '_' + Math.random().toString(36).substr(2, 9);

		var ret = "<details id='"+id +"'open><summary>" + this._summary+"&nbsp;<span onclick='javascript:removeElement(\""+id +"\");'>X</span></summary><p>";
		if ( this._children ) {
			this._children.forEach(child=>{
				ret = ret + child.toHTML();
			});
		}
		ret = ret + this._detail;
		ret = ret + "</p></details>";

		return ret;

	}

}
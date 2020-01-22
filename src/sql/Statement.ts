
export const bindType = {
	"NUMBER":"NUMBER",
	"NUMERIC":"NUMERIC",
	"DECIMAL":"DECIMAL",
	"DEC":"DEC",
	"INTEGER":"INTEGER",
	"INT":"INT",
	"SMALLINT":"SMALLINT",	
	"FLOAT":"FLOAT",
	"DOUBLE_PRECISION":"DOUBLE PRECISION",
	"REAL":"REAL",
	"BINARY_FLOAT":"BINARY_FLOAT",
	"BINARY_DOUBLE":"BINARY_DOUBLE",
	"CHAR":"CHAR",
	"CHARACTER":"CHARACTER",
	"VARCHAR":"VARCHAR",
	"VARCHAR2":"VARCHAR2",
	"CHAR_VARYING":"CHAR VARYING",
	"CHARACTER_VARYING":"CHARACTER VARYING",
	"NCHAR":"NCHAR",
	"NATIONAL_CHAR":"NATIONAL CHAR",
	"NATIONAL_CHAR_VARYING":"NATIONAL CHAR VARYING",
	"NATIONAL_CHARACTER":"NATIONAL CHARACTER",
	"NATIONAL_CHARACTER_VARYING":"NATIONAL CHARACTER VARYING",
	"NVARCHAR":"NVARCHAR",
	"NVARCHAR2":"NVARCHAR2",
	"NCHAR_VARYING":"NCHAR VARYING",
	"DATE":"DATE",
	"TIMESTAMP":"TIMESTAMP",
	"TIMESTAMP_WITH_LOCAL_TIME_ZONE":"TIMESTAMP WITH LOCAL TIME ZONE",
	"TIMESTAMP_WITH_TIME_ZONE":"TIMESTAMP WITH TIME ZONE",
	"INTERVALYM":"INTERVALYM",
	"INTERVAL_YEAR_TO_MONTH":"INTERVAL YEAR TO MONTH",
	"INTERVAL_YEAR_2_TO_MONTH":"INTERVAL YEAR(2) TO MONTH",
	"INTERVALDS":"INTERVALDS",
	"INTERVAL_DAY_TO_SECOND":"INTERVAL DAY TO SECOND",
	"INTERVAL_DAY_2_TO_SECOND_6":"INTERVAL DAY(2) TO SECOND(6)",
	"ROWID":"ROWID",
	"RAW":"RAW",
	"LONG RAW":"LONG RAW",
	"CLOB":"CLOB",
	"NCLOB":"NCLOB",
	"LONG":"LONG"
}
export class Bind {
	private _index :number;
	private _value :string;
	private _type  :string;

	constructor(index: number,value:string,type?:string) {
		this._index = index;
		this._value = value;
		this._type = type?type:bindType.VARCHAR2;
	}
	public toJSON(){
		return 	{"index":this._index,"data_type":this._type,"value":this._value}
	}
}

export class Statement {
	private _sql:  string;
	private _binds: Bind[];

	constructor(sql: string,binds?:Bind[]) {
		this._sql = sql;
		this._binds = binds?binds:[];
		return this;
	}

	public addBind(value:string){
		this._binds.push(new Bind(this._binds.length,value))
		return this;
	}
	public toJSON():string{
		var ret = {"statementText": this._sql,
					"binds":[]}
		this._binds.forEach((b)=>{
			var i =1;
			if ( b instanceof Bind) {
				ret.binds.push(b.toJSON())
			} else {
				ret.binds.push(
					{"index":i,
					"data_type":bindType.VARCHAR2,
					"value":b
					}
				)
			}
			i++;
		})

		return JSON.stringify(ret)

	}
}

/*
Sample output

{ 
	  "statementText": "SELECT ?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,? FROM dual",
	  "binds":[ 
	{"index":1,"data_type":"NUMBER","value":123},
	{"index":2,"data_type":"NUMERIC","value":123},
	{"index":3,"data_type":"DECIMAL","value":123},
	{"index":4,"data_type":"DEC","value":123},
	{"index":5,"data_type":"NUMBER","value":123},
	{"index":6,"data_type":"INTEGER","value":123},
	{"index":7,"data_type":"INT","value":123},
	{"index":8,"data_type":"SMALLINT","value":123},
	{"index":9,"data_type":"FLOAT","value":123},
	{"index":10,"data_type":"DOUBLE PRECISION","value":123},
	{"index":11,"data_type":"REAL","value":123},
	{"index":12,"data_type":"BINARY_FLOAT","value":123},
	{"index":13,"data_type":"BINARY_DOUBLE","value":123},
	{"index":14,"data_type":"CHAR","value":"abc"},
	{"index":15,"data_type":"CHARACTER","value":"abc"},
	{"index":16,"data_type":"VARCHAR","value":"abc"},
	{"index":17,"data_type":"VARCHAR2","value":"abc"},
	{"index":18,"data_type":"CHAR VARYING","value":"abc"},
	{"index":19,"data_type":"CHARACTER VARYING","value":"abc"},
	{"index":20,"data_type":"NCHAR","value":"abc"},
	{"index":21,"data_type":"NATIONAL CHAR","value":"abc"},
	{"index":22,"data_type":"NATIONAL CHARACTER","value":"abc"},
	{"index":23,"data_type":"NVARCHAR","value":"abc"},
	{"index":24,"data_type":"NVARCHAR2","value":"abc"},
	{"index":25,"data_type":"NCHAR VARYING","value":"abc"},
	{"index":26,"data_type":"NATIONAL CHAR VARYING","value":"abc"},
	{"index":27,"data_type":"NATIONAL CHARACTER VARYING","value":"abc"},
	{"index":28,"data_type":"DATE","value":"01-Jan-2016"},
	{"index":29,"data_type":"TIMESTAMP","value":"1997-01-31 09:26:50.124"},
	{"index":30,"data_type":"TIMESTAMP","value":"1997-01-31 09:26:50.124"},
	{"index":31,"data_type":"TIMESTAMP WITH LOCAL TIME ZONE","value":"1997-01-31 09:26:50.124"},
	{"index":32,"data_type":"TIMESTAMP WITH TIME ZONE","value":"1997-01-31 09:26:50.124"},
	{"index":33,"data_type":"INTERVALYM","value":"09-10"},

	{"index":34,"data_type":"INTERVAL YEAR TO MONTH","value":"10-10"},
	{"index":35,"data_type":"INTERVAL YEAR(2) TO MONTH","value":"10-10"},
	{"index":36,"data_type":"INTERVALDS","value":"11 10:10:10"},
	{"index":37,"data_type":"INTERVAL DAY TO SECOND","value":"08 10:10:10"},
	{"index":38,"data_type":"INTERVAL DAY(2) TO SECOND(6)","value":"07 10:10:10"},
	{"index":39,"data_type":"ROWID","value":1},
	{"index":40,"data_type":"RAW","value":"AB"},
	{"index":41,"data_type":"LONG RAW","value":"AB"},
	{"index":42,"data_type":"CLOB","value":"clobvalue"},
	{"index":43,"data_type":"NCLOB","value":"clobvalue"},
	{"index":45,"data_type":"LONG","value":"A"},
	{"index":46,"data_type":"VARCHAR","value":"abc"},
	{"index":47,"data_type":"BINARY_DOUBLE","value":123}
	]
	}
*/
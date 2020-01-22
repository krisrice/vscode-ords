export class SharedQueries{

	public static queries = {
		"tables":"select u.table_name name,'table' icon,u.*  from user_tables u",
		"columns":"select u.COLUMN_NAME name,'column' icon,u.*  from user_tab_cols u where table_name = ?"
	};

	public static getSQL(key:string):string{
		return this.queries[key]?this.queries[key]:null;
	}
}
export class ResultsFormatter {

	public static  formatResultsMarkdown(data){
		if ( data && data.length>0){

			var table = "";
			var largestRow;
			var maxCols =0; 
			// get row with most columns
			for ( i in data) {
				var item = data[i]
				if ( Object.keys(item).length > maxCols){
				largestRow = item;
				maxCols= Object.keys(item).length
				}
			}   
			//keys == col names
			var keys = Object.keys(largestRow);
			var header = "";
			keys.forEach(col=>{
				table = table + "| "+col;
				header = header + "|----------";

			})
			table = table + " |\n";
			table = table + header+ " |\n";

			for ( var i in data) {
				var item = data[i];
				var row = "";
				for(var k in keys){
					var key = keys[k]
					if (item.hasOwnProperty(key)) {
						row = row + "| " + item[key] 
					} else {
						row= row + " | ";
					}                
				}
				table =  table + row + " |\n"
			}
			return table;
		} else {
			return "No Rows";
		}
	} 


	public static  formatResultsHTML(data){ 
		if ( data && data.length>0){
			var out = ''; 
			out = '<table border=1 width="100%"><tr>';
			var maxCols =0; 
			var largestRow;
			for ( i in data) {
				var item = data[i]
				if ( Object.keys(item).length > maxCols){
				largestRow = item;
				maxCols= Object.keys(item).length
				}
			}   

			var keys = Object.keys(largestRow);

			for(var h in largestRow){
				out = out + '<th>' + h + '</th>';
			}   

			out = out + '</tr>';

			for ( var i in data) {
				item = data[i]

				out = out + '<tr>'
				for(var k in keys){
					var key = keys[k]
					out = out + '<td>'
					if (item.hasOwnProperty(key)) {
						out = out + item[key] 
					} else {
						out = out + '&nbsp;'
					}
					out = out +  '</td>';


				}
				out = out + '</tr>';
			}   
			out = out + '</table>';
			return out;
		} else {
			return "No Rows";
		}
	}

}
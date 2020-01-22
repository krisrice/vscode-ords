# ORDS Rest SQL 

#TODO

## Add Formatter
Request URL: https://10.246.131.41/ords/pdb1/pdbadmin/_sdw/_services/formatter/
	Content-Type: application/sql
	body in 
	body , reponse

## Add Insight
Request URL: https://10.246.131.41/ords/pdb1/pdbadmin/_sdw/_services/insight/
	body: {"input":"select u. from user_tables u","position":9}
    response: {"items":[{"keyword":"ACTIVITY_TRACKING","type":"COLUMN"},{"keyword":"AVG_SPACE_FREELIST_BLOCKS","type":"COLUMN"},{"keyword":"BACKED_UP","type":"COLUMN"},{"keyword":"BLOCKS","type":"COLUMN"},{"keyword":"BUFFER_POOL","type":"COLUMN"},{"keyword":"CACHE","type":"COLUMN"},{"keyword":"CELL_FLASH_CACHE","type":"COLUMN"},{"keyword":"CLUSTERING","type":"COLUMN"},{"keyword":"CLUSTER_NAME","type":"COLUMN"},{"keyword":"CLUSTER_OWNER","type":"COLUMN"}]}



## Demo

## Build installable
- `npm install` - installs locally required npms
- `npm i vsce`  - installs vsce which is a builder for the vscode plugin
- `vsce package` - produces ` vscode-ords-0.0.1.vsix`
- `code --install-extension vscode-ords-0.0.1.vsix` - installs in to code

ref: https://github.com/Microsoft/vscode-go/wiki/Building,-Debugging-and-Sideloading-the-extension-in-Visual-Studio-Code

## Running the example

- Open this example in VS Code 1.25+
- `npm install`
- `npm run watch` or `npm run compile`
- `F5` to start debugging

##
## Development

- open this folder in VS Code
		This will open a vscode for editing the files
- Press `F5`
    This uses the launch.json to start a new instance of VS code with the extension loaded for debugging

## Connections
- Go into Settings
- Enter ORDS in search field
- Click Edit in Settings.json 
- Add/Edit in the ords config such as

```
{
    "ords.endpoint": [

        {
            "url": "http://KLRICE:klrice@localhost:9090/ords/klrice/_/sql",
            "label": "klrice-local",
            "username": "KLRICE",
            "password": "klrice"
        },
        {
            "url": "http://localhost:9090/ords/klrice/_/sql",
            "label": "not-klrice",
            "username": "KLRICE",
            "password": "klrice"
        },
        {
            "url": "http://localhost:9090/ords/klrice/_/sql",
            "username": "KLRICE",
            "label": "klrice-nopasswd"
        },
    ]
}
```


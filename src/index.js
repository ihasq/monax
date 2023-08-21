import * as monaco from "monaco-editor/esm/vs/editor/editor.main.js"

// read url parameters
const paramList = Object.create(null);
const paramBody = location.search.slice(1);
decodeURI(paramBody).split("&").forEach(index => {
	const pair = index.split("=");
	paramList[pair[0]] = (pair[1] === ("true" || "false"))? JSON.parse(pair[1].toLowerCase()) : (isNaN(Number(pair[1])))? pair[1] : Number(pair[1])
});
const fileProperty = {
	fileHandle: null,
	file: null,
	fileData: null,
	fileWritable: null
};
// file properties


// Hover on each property to see its docs!
const editorSurface = monaco.editor.create(document.getElementById("container"), Object.assign({
	language: "plaintext",
	automaticLayout: true,
	fontSize: 15,
	fontFamily: "monospace",
	lineNumbersWidth: 12
}, paramList));

const customFunction = {
	new() {
		fileProperty.fileHandle = null;
		editorSurface.getModel().setValue("");
		document.title = "Monax"
	},
	async open() {
		[fileProperty.fileHandle] = await window.showOpenFilePicker({
			types: [
				{
					description: "Text files",
					accept: {
						"text/javascript": [".js"],
					},
				},
			],
			excludeAcceptAllOption: true,
			multiple: false,
		});
		fileProperty.file = await fileProperty.fileHandle.getFile();
		fileProperty.fileData = await fileProperty.file.text();
		const model = editorSurface.getModel();
		monaco.editor.setModelLanguage(model, fileProperty.file.type.slice(fileProperty.file.type.search("/") + 1))
		model.setValue(fileProperty.fileData);
		document.title = fileProperty.file.name + " - Monax";
	},
	async save() {
		fileProperty.fileWritable = await fileProperty.fileHandle.createWritable();
		const blob = new Blob([editorSurface.getValue()])
		await fileProperty.fileWritable.write(blob);
		await fileProperty.fileWritable.close();
	},
};


// add some features
[
	// files
	{
		id: "custom-fn-new",
		label: "New",
		keybindings: [
			monaco.KeyMod.CtrlCmd | monaco.KeyCode.KeyN,
			monaco.KeyMod.chord(
				monaco.KeyMod.CtrlCmd | monaco.KeyCode.KeyN,
			),
		],

		precondition: null,
		keybindingContext: null,
		contextMenuGroupId: "file",
		contextMenuOrder: 1.5,
		run: customFunction.new
	},
	{
		id: "custom-fn-open",
		label: "Open",
		keybindings: [
			monaco.KeyMod.CtrlCmd | monaco.KeyCode.KeyO,
			monaco.KeyMod.chord(
				monaco.KeyMod.CtrlCmd | monaco.KeyCode.KeyO,
			),
		],

		precondition: null,
		keybindingContext: null,
		contextMenuGroupId: "file",
		contextMenuOrder: 1.5,
		run: customFunction.open
	},
	{
		id: "custom-fn-save",
		label: "Save",
		keybindings: [
			monaco.KeyMod.CtrlCmd | monaco.KeyCode.KeyS,
			monaco.KeyMod.chord(
				monaco.KeyMod.CtrlCmd | monaco.KeyCode.KeyS,
			),
		],

		precondition: null,
		keybindingContext: null,
		contextMenuGroupId: "file",
		contextMenuOrder: 1.5,

		run: customFunction.save
	},
	{
		id: "custom-fn-saveAs",
		label: "Save As",
		keybindings: [
			monaco.KeyMod.CtrlCmd | monaco.KeyCode.KeyA,
			monaco.KeyMod.chord(
				monaco.KeyMod.CtrlCmd | monaco.KeyCode.KeyA,
			),
		],

		precondition: null,
		keybindingContext: null,
		contextMenuGroupId: "file",
		contextMenuOrder: 1.5,

		run: async () => {
			fileProperty.fileHandle = await window.showSaveFilePicker();
			console.log(fileProperty.fileHandle)
			await customFunction.save()
		}
	},
	// tweet
	{
		id: "custom-fn-tweet",
		label: "Share on X",

		precondition: null,
		keybindingContext: null,
		contextMenuGroupId: "tweet",
		contextMenuOrder: 1.5,

		run: () => open(encodeURI(("https://twitter.com/intent/tweet?text=" + editorSurface.getValue())))
	},
	// tweet
	{
		id: "custom-fn-about",
		label: "About Monax",

		precondition: null,
		keybindingContext: null,
		contextMenuGroupId: "about",
		contextMenuOrder: 1.5,

		run: () => open(encodeURI(("./?" + decodeURI(paramBody) + `&value=		


               MONAX - MONAco eXtended

                    version 0.0.1
          by ihasq and microsoft monaco team
    Monax is open source and freely distributable



		`.replace(/\t/g, ""))))
	}

].forEach(index => editorSurface.addAction(index));
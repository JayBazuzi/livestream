// Copyright Titanium I.T. LLC.
"use strict";

const rot13 = require("./logic/rot13");

module.exports = class App {

	static create(commandLine) {
		return new App(commandLine);
	}

	constructor(commandLine) {
		this._commandLine = commandLine;
	}

	run() {
		const input = this._commandLine.parseArgs();
		if (!input) { return; }
		const output = rot13.transform(input);
		this._commandLine.writeOutput(output + "\n");
	}

};
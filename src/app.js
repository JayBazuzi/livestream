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

	parseArgs() {
		const args = this._commandLine.args();
		if (args.length === 0) {
			this._commandLine.writeOutput("Usage: run text_to_transform\n");
			return null;
		}
		if (args.length !== 1) {
			this._commandLine.writeOutput("too many arguments\n");
			return null;
		}

		return args[0];
	}

	run() {
		const input = this.parseArgs();
		if (!input) { return; }
		const output = rot13.transform(input);
		this._commandLine.writeOutput(output + "\n");
	}

};
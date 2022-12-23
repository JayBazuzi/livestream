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

	getUserIntent() {
		const args = this._commandLine.args();
		if (args.length === 0) {
			this._commandLine.writeOutput("Usage: run text_to_transform\n");
			return null;
		}
		if (args.length !== 1) {
			this._commandLine.writeOutput("too many arguments\n");
			return null;
		}

		this.input = args[0];
	}

	reportResultToUser() {
		if (!this.output) { return; }
		this._commandLine.writeOutput(this.output + "\n");
	}

	transform() {
		if (!this.input) { return; }
		this.output = rot13.transform(this.input);
	}

	run() {
		this.getUserIntent();
		this.transform();
		this.reportResultToUser();
	}

};
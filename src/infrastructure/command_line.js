// Copyright Titanium I.T. LLC.
"use strict";

module.exports = class CommandLine {

	static create() {
		return new CommandLine(process);
	}

	static createNull({ args = [] } = {}) {
		return new CommandLine(new NullProcess(args));
	}

	constructor(proc) {
		this._process = proc;
	}

	args() {
		return this._process.argv.slice(2);
	}

	_writeOutput(text) {
		this._process.stdout.write(text);
		this._lastOutput = text;
	}

	getLastOutput() {
		return this._lastOutput;
	}

	parseArgs() {
		const args = this.args();
		if (args.length === 0) {
			this._writeOutput("Usage: run text_to_transform\n");
			return null;
		}
		if (args.length !== 1) {
			this._writeOutput("too many arguments\n");
			return null;
		}

		return args[0];
	}

	reportResults(output) {
		this._writeOutput(output + "\n");
	}

};


class NullProcess {

	constructor(args) {
		this._args = args;
	}

	get argv() {
		return [ "null_process_node", "null_process_script.js", ...this._args ];
	}

	get stdout() {
		return {
			write() {}
		};
	}

}
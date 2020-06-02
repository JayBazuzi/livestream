// Copyright Titanium I.T. LLC.
"use strict";

const assert = require("./util/assert");
const CommandLine = require("./infrastructure/command_line");
const Server = require("./server");

const USAGE = "Usage: run PORT\n";

describe("Server", function() {

	describe("Command-line processing", function() {

		it("Provides usage and exits with error when no command-line arguments provided", async function() {
			const { exitCode, stderr } = await startServerAsync({ args: [] });

			assert.equal(exitCode, 1, "exit code");
			assert.deepEqual(stderr, USAGE);
		});

		it("Provides usage and exits with error when too many command-line arguments provided", async function() {
			const { exitCode, stderr } = await startServerAsync({ args: ["too", "many"] });

			assert.equal(exitCode, 1, "exit code");
			assert.deepEqual(stderr, USAGE);
		});

	});

});

async function startServerAsync({ args = [ "4242" ] }) {
	const commandLine = CommandLine.createNull({ args  });
	const app = Server.create(commandLine);

	const exitCode = await app.startAsync();
	return { exitCode, stdout: commandLine.getLastStdout(), stderr: commandLine.getLastStderr() };
}
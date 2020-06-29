// Copyright Titanium I.T. LLC.
"use strict";

const assert = require("./util/assert");
const CommandLine = require("./infrastructure/command_line");
const HttpServer = require("./infrastructure/http_server");
const HttpRequest = require("./infrastructure/http_request");
const Server = require("./rot13_server");
const rot13Router = require("./routing/rot13_router");

const USAGE = "Usage: run PORT\n";

describe("ROT-13 Server", function() {

	it("starts server", async function() {
		const { commandLine, httpServer } = await startServerAsync({ args: [ "5000" ]});
		assert.equal(httpServer.isStarted, true, "should start server");
		assert.equal(commandLine.getLastStdout(), "Server started on port 5000\n");
	});

	it("logs requests", async function() {
		const { commandLine, httpServer } = await startServerAsync();
		await httpServer.simulateRequestAsync();
		assert.equal(commandLine.getLastStdout(), "Received request\n");
	});

	it("routes requests", async function() {
		const { httpServer } = await startServerAsync();

		const actualResponse = await httpServer.simulateRequestAsync(HttpRequest.createNull());
		const expectedResponse = await rot13Router.routeAsync(HttpRequest.createNull());
		assert.deepEqual(actualResponse, expectedResponse);
	});


	describe("Command-line processing", function() {

		it("Provides usage and exits with error when no command-line arguments provided", async function() {
			const { commandLine } = await startServerAsync({ args: [] });
			assert.deepEqual(commandLine.getLastStderr(), USAGE);
		});

		it("Provides usage and exits with error when too many command-line arguments provided", async function() {
			const { commandLine } = await startServerAsync({ args: ["too", "many"] });
			assert.deepEqual(commandLine.getLastStderr(), USAGE);
		});

	});

});

async function startServerAsync({ args = [ "4242" ] } = {}) {
	const commandLine = CommandLine.createNull({ args  });
	const httpServer = HttpServer.createNull();
	const app = Server.create(commandLine, httpServer);

	await app.startAsync();

	return {
		commandLine,
		httpServer,
	};
}
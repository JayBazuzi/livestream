// Copyright Titanium I.T. LLC.
"use strict";

const HttpRequest = require("./http_request");
const HttpServer = require("./http_server");
const testHelper = require("../util/test_helper");
const assert = require("../util/assert");

const PORT = 5001;

describe("HTTP Request", function() {

	it("provides URL", async function() {
		await createRequestAsync({ url: "/my-url" }, (request) => {
			assert.equal(request.url, "/my-url");
		});
	});

	it("provides method (and normalizes case)", async function() {
		await createRequestAsync({ method: "POst" }, (request) => {
			assert.equal(request.method, "POST");
		});
	});

	it("provides headers (and normalizes case)", async function() {
		const headers = {
			myHEADER1: "myValue1",
			MYHeader2: "myValue2",
		};
		await createRequestAsync({ headers }, (request) => {
			assert.deepEqual(request.headers, {
				connection: "close",
				host: `localhost:${PORT}`,
				myheader1: "myValue1",
				myheader2: "myValue2",
			});
		});
	});

	it("has immutable headers", async function() {
		const headers = { header: "value" };
		await createRequestAsync({ headers }, (request) => {
			delete request.headers.header;
			assert.deepEqual(request.headers, {
				connection: "close",
				host: `localhost:${PORT}`,
				header: "value",
			});
		});
	});

	it("provides body", async function() {
		const body = [ "chunk 1", "chunk 2" ];
		await createRequestAsync({ body }, async (request) => {
			assert.equal(await request.readBodyAsync(), "chunk 1chunk 2");
		});
	});

	it("fails fast if body is read twice", async function() {
		await createRequestAsync({}, async (request) => {
			await request.readBodyAsync();
			await assert.throwsAsync(
				() => request.readBodyAsync(),
				"Can't read request body because it's already been read",
			);
		});
	});


	describe("nullability", function() {

		it("provides defaults", async function() {
			const request = HttpRequest.createNull();

			assert.equal(request.url, "/null-request-url", "url");
			assert.equal(request.method, "GET", "method");
			assert.deepEqual(request.headers, {});
			assert.equal(await request.readBodyAsync(), "");
		});

		it("can configure URL", function() {
			const request = HttpRequest.createNull({ url: "/my-url" });
			assert.equal(request.url, "/my-url");
		});

		it("can configure method (and normalizes case)", function() {
			const request = HttpRequest.createNull({ method: "pOsT" });
			assert.equal(request.method, "POST");
		});

		it("can configure headers (and normalizes case)", function() {
			const headers = {
				myHEADER1: "myValue1",
				MYHeader2: "myValue2",
			};
			const request = HttpRequest.createNull({ headers });
			assert.deepEqual(request.headers, {
				myheader1: "myValue1",
				myheader2: "myValue2",
			});
		});

		it("can configure body", async function() {
			const request = HttpRequest.createNull({ body: "my body" });
			assert.equal(await request.readBodyAsync(), "my body");
		});

		it("fails fast when body is read twice, just like real request", async function() {
			const request = HttpRequest.createNull();
			await request.readBodyAsync();
			await assert.throwsAsync(
				() => request.readBodyAsync(),
				"Can't read request body because it's already been read",
			);
		});

	});
});

async function createRequestAsync(options, fnAsync) {
	await new Promise(async (resolve, reject) => {
		async function onRequestAsync(request) {
			try {
				await fnAsync(request);
			}
			catch(err) {
				reject(err);
			}
		}

		const server = HttpServer.create();
		await server.startAsync({ port: PORT, onRequestAsync });
		await testHelper.requestAsync({ port: PORT, ...options });
		await server.stopAsync();
		resolve();
	});
}

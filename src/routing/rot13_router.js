// Copyright Titanium I.T. LLC.
"use strict";

const ensure = require("../util/ensure");
const rot13Response = require("./rot13_response");
const rot13 = require("../logic/rot13");
const HttpRequest = require("../infrastructure/http_request");

const REQUEST_TYPE = { text: String };

exports.routeAsync = async function(request) {
	ensure.signature(arguments, [ HttpRequest ]);

	if (request.url !== "/rot13/transform") return rot13Response.notFound();
	if (request.method !== "POST") return rot13Response.methodNotAllowed();
	if (request.headers["content-type"] !== "application/json") {
		return rot13Response.badRequest("invalid content-type header");
	}

	const jsonString = await request.readBodyAsync();
	let json;
	try {
		json = JSON.parse(jsonString);
		ensure.typeMinimum(json, REQUEST_TYPE, "request");
	}
	catch (err) {
		return rot13Response.badRequest(err.message);
	}

	const input = json.text;
	const output = rot13.transform(input);

	return rot13Response.ok(output);
};
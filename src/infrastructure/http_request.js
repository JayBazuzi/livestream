// Copyright Titanium I.T. LLC.
"use strict";

const ensure = require("../util/ensure");
const EventEmitter = require("events");

module.exports = class HttpRequest {

	static create(nodeRequest) {
		ensure.signature(arguments, [ Object ]);
		return new HttpRequest(nodeRequest);
	}

	static createNull(options) {
		return new HttpRequest(new NullNodeRequest(options));
	}

	constructor(nodeRequest) {
		this._request = nodeRequest;
	}

	get url() {
		return this._request.url;
	}

	get method() {
		return this._request.method;
	}

	get headers() {
		return { ...this._request.headers };
	}

	async readBodyAsync() {
		return await new Promise((resolve, reject) => {
			ensure.signature(arguments, []);
			if (this._request.readableEnded) return reject(new Error("Can't read request body because it's already been read"));

			let body = "";
			this._request.on("error", reject);    // this event is not tested
			this._request.on("data", (chunk) => {
				body += chunk;
			});
			this._request.on("end", () => {
				resolve(body);
			});
		});
	}

};


class NullNodeRequest extends EventEmitter {

	constructor({
		url = "/null-request-url",
		method = "GET",
		headers = {},
		body = "",
	} = {}) {
		ensure.signature(arguments, [[ undefined, {
			url: [ undefined, String ],
			method: [ undefined, String ],
			headers: [ undefined, Object ],
			body: [ undefined, String ],
		}]]);

		super();
		this.url = url;
		this.method = method.toUpperCase();
		this.headers = normalizeHeaders(headers);
		this._body = body;
		this.readableEnded = false;
	}

	on(event, fn) {
		super.on(event, fn);
		if (event === "end") {
			setImmediate(() => {
				this.emit("data", this._body);
				this.emit("end");
				this.readableEnded = true;
			});
		}
	}

}

function normalizeHeaders(headers) {
	const normalizedEntries = Object.entries(headers).map(([ name, value ]) => [ name.toLowerCase(), value ]);
	return Object.fromEntries(normalizedEntries);
}
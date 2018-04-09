if (typeof Background !== 'function') {
	Background = function (chrome, $, window) {
		this.chrome = chrome;
		this.$ = $;
		this.window = window;
		this.init();
	};
	Background.prototype = {
		constructor: Background,
		init: function () {
			var self = this;
			this.initMessageListener();
		},
		initMessageListener: function () {
			var self = this;
			this.chrome.runtime.onMessage.addListener(function (message, sender, response) {
				if (!self[message.method]) {
					return;
				}
				var tab = sender;
				message.args = message.args || [];
				message.args.push(tab);
				message.args.push(response);
				self[message.method].apply(self, message.args || []);
				return true;
			});
		},
		sendMessageToTab: function (method, args, cb, tabId) {
			args = (args === null || typeof args === "undefined") ? [] : args;
			args = Array.isArray(args) ? args : [args];
			cb = typeof cb === "undefined" ? null : cb;
			if (typeof tabId === "undefined" || typeof method === "undefined") {
				throw new Error(
					"Missing required parameter " +
					(typeof tabId === "undefined" ? "'tabId'" : "'method'")
				);
			}
			this.chrome.tabs.sendMessage(tabId, {
				method: method,
				args: args
			}, cb);
		}
	}
}
var background = new Background(chrome, jQuery, window);

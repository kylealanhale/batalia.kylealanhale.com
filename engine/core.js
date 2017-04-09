(function ($) {
	if (!$) {
		document.write('This script requires jQuery');
		return;
	}
	
	var batalia = {
		scheduler: {
			add: function (name, interval) {
				setInterval(function () {
					$(batalia.scheduler).trigger(name);
				}, interval);
			}
		}
	};
	
	String.prototype.times = function (count) {
		var text = '';
		while (text.length < count * this.length) text += this;
		return text;
	};

	$(document).data('batalia', batalia);
})(window.jQuery);

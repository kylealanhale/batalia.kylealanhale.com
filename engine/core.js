(function ($) {
	if (!$) {
		document.write('This script requires jQuery');
		return;
	}

	(function() {
	    var vendors = ['webkit', 'moz'];
	    for (var x = 0; x < vendors.length && !window.requestAnimationFrame; ++x) {
	        window.requestAnimationFrame = window[vendors[x]+'RequestAnimationFrame'];
	        window.cancelAnimationFrame = window[vendors[x]+'CancelAnimationFrame'] || window[vendors[x]+'CancelRequestAnimationFrame'];
	    }

	    var lastTime = 0;
	    if (!window.requestAnimationFrame) window.requestAnimationFrame = function(callback, element) {
            var currTime = new Date().getTime();
            var timeToCall = Math.max(0, 16 - (currTime - lastTime));
            var id = window.setTimeout(function() { callback(currTime + timeToCall); },
              timeToCall);
            lastTime = currTime + timeToCall;
            return id;
        };
	    if (!window.cancelAnimationFrame) window.cancelAnimationFrame = function(id) {clearTimeout(id);};
	    if (!window.performance) window.performance = {now: function () {return new Date().getTime();}};
	}());

	var batalia = {
		Scheduler: function (frequency, action) {
			var then = 0;
			var delta = 0;
			var threshold = 1 / frequency;
			var cancellationToken;

			this.start = function () {
				(function tick(now) {
					cancellationToken = requestAnimationFrame(tick);
					delta = (now - then) / 1000;
					if (delta >= threshold) {
						action();
						then = now;
					}
				})(performance.now());
			};
			this.stop = function () {
				cancelAnimationFrame(cancellationToken);
			};
		}
	};
	
	String.prototype.times = function (count) {
		var text = '';
		while (text.length < count * this.length) text += this;
		return text;
	};

	$(document).data('batalia', batalia);
})(window.jQuery);

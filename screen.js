(function ($) {
	if (!$) {
		document.write('This script requires jQuery');
		return;
	}
	
	var batalia = $(document).data('batalia');
	
	var screen = batalia.screen = new (function () {
		var screenWidth = 80;
		var screenHeight = 25;
		var glyphWidth = 8;
		var glyphHeight = 16;
		
		var element = this.element = $('#screen');
		
		var buffer;
		var mode;
		var buildBuffer = function (cols, rows) {
			mode = cols;
			buffer = [];
			for (var ri = 0; ri < rows; ri++) {
				buffer[ri] = [];
				for (var ci = 0; ci < cols; ci++) {
					buffer[ri][ci] = '';
				}
			}
		};
		var currentZoom = 1;
		var setZoom = function () {
			var pixelWidth = screenWidth * glyphWidth;
			var pixelHeight = screenHeight * glyphHeight;
			
			var aspectRatio = pixelHeight / pixelWidth;
			var resolution = (1 / (Math.min(glyphWidth, glyphHeight)));
			
			var currentWidth = $(window).width();
			var currentHeight = $(window).height();
			
			var zoom;
			
			if (currentWidth * aspectRatio < currentHeight) zoom = currentWidth / pixelWidth;
			else zoom = currentHeight / pixelHeight;
			
			zoom = zoom - (zoom % resolution);
			
			if (zoom == currentZoom) return;
			
			currentZoom = zoom;
			
			var compats = ['webkit', 'moz', 'ms', 'o', ''];
			for (var index in compats) {
				var name = compats[index];
				if (name) name = '-' + name + '-';
				element.css(name + 'transform', 'scale(' + zoom + ')');
			}
		};
		
		
		var getGlyph = function (row, column) {
			return $('#glyph-' + row + '-' + column);
		};
		
		this.color = '#fff';
		this.x = 0;
		this.y = 0;
		this.actors = [];
		
		this.draw = function (character, x, y, owner) {
			if (x || x === 0) this.x = x;
			if (y || y === 0) this.y = y;
			
			var glyph = getGlyph(this.y, this.x)
				.html(character)
				.css('color', this.color);
			if (owner) glyph.data('owner', owner);
			else glyph.removeData('owner');
		};
		this.write = function (string, owner) {
			var chars = string.toString().split('');
			for (var index in chars) {
				this.draw(chars[index], this.x, this.y, owner);
				this.x++;
				if (this.x > screenWidth - 1) {
					this.x = 0;
					this.y++;
				}
				if (this.y > screenHeight - 1) throw 'Screen overflow';
			}
		};
		
		this.redraw = function () {
			var rows = buffer.length;
			var cols = buffer[0].length;
			for (var ri = 0; ri < rows; ri++) {
				for (var ci = 0; ci < cols; ci++) {
					var glyph = getGlyph(ri, ci);
					if (!glyph.length) glyph = $('<div class="glyph" id="glyph-' + ri + '-' + ci + '">').appendTo(element);
					glyph
						.css({
							left: ci * glyphWidth,
							top: ri * glyphHeight
						})
						.html(buffer[ri][ci]);
					glyph.removeData('owner');
				}
			}
		};
		this.getOwner = function (x, y) {
			var glyph = getGlyph(y, x);
			var owner = glyph.data('owner');
			return owner;
		};
		this.setMode = function (mode) {
			var acceptableModes = [40, 80];
			if (acceptableModes.indexOf(mode) < 0) throw 'Invalid mode: ' + mode;
			
			buildBuffer(mode, 25);
			this.actors = [];
			this.redraw();
		};
		this.start = function () {
			this.setMode(80);
		};
		
		setZoom();
		$(window).resize(setZoom);
	});	
	var keys = batalia.keys = {};
	
	$(document)
		.keyup(function (event) {
			if (keys[event.keyCode] !== undefined) {
				event.stopPropagation();
				event.preventDefault();
				keys[event.keyCode] = false;
				return false;
			}
			return true;
		})
		.keydown(function (event) {
			if (keys[event.keyCode] !== undefined) {
				event.stopPropagation();
				event.preventDefault();
				keys[event.keyCode] = true;
				return false;
			}
			return true;
		});
})(window.jQuery);

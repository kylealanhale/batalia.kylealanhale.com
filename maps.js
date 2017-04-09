(function ($) {
	if (!$) {
		document.write('This script requires jQuery');
		return;
	}
	
	var batalia = $(document).data('batalia');
	
	var parts = batalia.parts;
	
	var Shape = batalia.Shape, Rectangle = batalia.Rectangle;
	var MapShape = function () {
		batalia.CompoundShape.prototype.constructor.apply(this, arguments);
	};
	$.extend(MapShape.prototype, batalia.CompoundShape.prototype, {
		color: '#fff'
	});
	
	batalia.maps = [
		// Empty map
		{
			generate: function () {return new MapShape();}
		},
		// Notches
		{
			generate: function () {
				var pieces = [];
				var count = 21;
				for (var i = 0; i < count; i++) {
					var row = Math.floor(i / 7);
					var column = i % 7;
					var distance = (column < 3 ? 11 : column > 3 ? 13 : 12);
					pieces.push(new Rectangle({
						top: 2 + (6 * row),
						left: distance + (9 * column),
						width: 2,
						height: 5
					}));
				}
				return new MapShape({pieces: pieces});
			}
		},
		// Boxes
		{
			generate: function () {
				var pieces = [];
				var count = 30;
				for (var i = 0; i < count; i++) {
					var row = Math.floor(i / 5);
					var column = i % 5;
					var distance = (column < 3 ? 10 : 9);
					pieces.push(new Rectangle({
						top: 2 + (3 * row),
						left: distance + (13 * column),
						width: (column == 2 ? 8 : 9),
						height: 2
					}));
				}
				return new MapShape({pieces: pieces});
			}
		},
		// Target
		{
			generate: function () {
				return new MapShape({
					pieces: [
						// Outer left
						new Rectangle({
							top: 2,
							left: 7,
							width: 9,
							height: 3
						}),
						new Rectangle({
							top: 17,
							left: 7,
							width: 9,
							height: 3
						}),
						new Shape({
							top: 4,
							left: 7,
							width: 4,
							height: 14,
							data: parts.dV + ' '.times(2) + parts.dCTL +
								(parts.dV + ' '.times(2) + parts.dV).times(12) +
								parts.dV + ' '.times(2) + parts.dCBL
						}),
						// Outer right
						new Rectangle({
							top: 2,
							left: 63,
							width: 9,
							height: 3
						}),
						new Rectangle({
							top: 17,
							left: 63,
							width: 9,
							height: 3
						}),
						new Shape({
							top: 4,
							left: 68,
							width: 4,
							height: 14,
							data: parts.dCTR + ' '.times(2) + parts.dV +
								(parts.dV + ' '.times(2) + parts.dV).times(12) +
								parts.dCBR + ' '.times(2) + parts.dV
						}),
						// Inner verticle
						new Rectangle({
							top: 2,
							left: 34,
							width: 8,
							height: 6
						}),
						new Rectangle({
							top: 12,
							left: 34,
							width: 8,
							height: 6
						}),
						// Inner horizontal
						new Rectangle({
							top: 8,
							left: 16,
							width: 14,
							height: 4
						}),
						new Rectangle({
							top: 8,
							left: 46,
							width: 14,
							height: 4
						})
					]
				});
			}
		},
		// Fine concentric boxes
		{
			generate: function () {
				return new MapShape({
					pieces: [
						// Outer left
						new Rectangle({
							top: 2,
							left: 5,
							width: 32,
							height: 2
						}),
						new Rectangle({
							top: 18,
							left: 5,
							width: 32,
							height: 2
						}),
						new Shape({
							top: 3,
							left: 5,
							width: 3,
							height: 16,
							data: parts.dV + ' ' + parts.dCTL +
								(parts.dV + ' ' + parts.dV).times(14) +
								parts.dV + ' ' + parts.dCBL
						}),
						// Outer right
						new Rectangle({
							top: 2,
							left: 40,
							width: 35,
							height: 2
						}),
						new Rectangle({
							top: 18,
							left: 40,
							width: 35,
							height: 2
						}),
						new Shape({
							top: 3,
							left: 72,
							width: 3,
							height: 16,
							data: parts.dCTR + ' ' + parts.dV +
								(parts.dV + ' ' + parts.dV).times(14) +
								parts.dCBR + ' ' + parts.dV
						}),
						// Middle top
						new Rectangle({
							top: 5,
							left: 11,
							width: 3,
							height: 5
						}),
						new Rectangle({
							top: 5,
							left: 66,
							width: 3,
							height: 5
						}),
						new Shape({
							top: 5,
							left: 13,
							width: 54,
							height: 2,
							data: parts.dH.times(54) +
								parts.dCTL + parts.dH.times(52) + parts.dCTR
						}),
						// Middle bottom
						new Rectangle({
							top: 12,
							left: 11,
							width: 3,
							height: 5
						}),
						new Rectangle({
							top: 12,
							left: 66,
							width: 3,
							height: 5
						}),
						new Shape({
							top: 15,
							left: 13,
							width: 54,
							height: 2,
							data: parts.dCBL + parts.dH.times(52) + parts.dCBR +
								parts.dH.times(54)
						}),
						// Inner left
						new Rectangle({
							top: 8,
							left: 17,
							width: 20,
							height: 2
						}),
						new Rectangle({
							top: 12,
							left: 17,
							width: 20,
							height: 2
						}),
						new Shape({
							top: 9,
							left: 17,
							width: 3,
							height: 4,
							data: parts.dV + ' ' + parts.dCTL +
								(parts.dV + ' ' + parts.dV).times(2) +
								parts.dV + ' ' + parts.dCBL
						}),
						// Inner right
						new Rectangle({
							top: 8,
							left: 40,
							width: 21,
							height: 2
						}),
						new Rectangle({
							top: 12,
							left: 40,
							width: 21,
							height: 2
						}),
						new Shape({
							top: 9,
							left: 58,
							width: 3,
							height: 4,
							data: parts.dCTR + ' ' + parts.dV +
								(parts.dV + ' ' + parts.dV).times(2) +
								parts.dCBR + ' ' + parts.dV
						}),
					]
				})
			}
		},
		// Chunky concentric boxes
		{
			generate: function () {
				return new MapShape({
					pieces: [
						// Large horizontal
						new Rectangle({
							top: 3,
							left: 10,
							width: 26,
							height: 3
						}),
						new Rectangle({
							top: 3,
							left: 42,
							width: 29,
							height: 3
						}),
						new Rectangle({
							top: 15,
							left: 10,
							width: 26,
							height: 3
						}),
						new Rectangle({
							top: 15,
							left: 42,
							width: 29,
							height: 3
						}),
						// Large vertical
						new Rectangle({
							top: 3,
							left: 10,
							width: 6,
							height: 7
						}),
						new Rectangle({
							top: 3,
							left: 65,
							width: 6,
							height: 7
						}),
						new Rectangle({
							top: 11,
							left: 65,
							width: 6,
							height: 7
						}),
						new Rectangle({
							top: 11,
							left: 10,
							width: 6,
							height: 7
						}),
						// Small horizontal
						new Rectangle({
							top: 7,
							left: 30,
							width: 18,
							height: 2
						}),
						new Rectangle({
							top: 12,
							left: 30,
							width: 18,
							height: 2
						}),
						// Small vertical
						new Rectangle({
							top: 8,
							left: 19,
							width: 3,
							height: 6
						}),
						new Rectangle({
							top: 8,
							left: 59,
							width: 3,
							height: 6
						}),
						// Cleanup
						new Shape({
							top: 3,
							left: 15,
							width: 1,
							height: 3,
							data: parts.dH + ' ' + parts.dCTL
						}),
						new Shape({
							top: 3,
							left: 65,
							width: 1,
							height: 3,
							data: parts.dH + ' ' + parts.dCTR
						}),
						new Shape({
							top: 15,
							left: 65,
							width: 1,
							height: 3,
							data: parts.dCBR + ' ' + parts.dH
						}),
						new Shape({
							top: 15,
							left: 15,
							width: 1,
							height: 3,
							data: parts.dCBL + ' ' + parts.dH
						})
					]
				})
			}
		},
		// Stonehenge
		{
			generate: function () {
				return new MapShape({
					pieces: [
						// Center
						new Rectangle({
							top: 9,
							left: 17,
							width: 45,
							height: 4
						}),
						new Rectangle({
							top: 10,
							left: 20,
							width: 39,
							height: 2
						}),
						// Corners horizontal
						new Rectangle({
							top: 2,
							left: 8,
							width: 9,
							height: 3
						}),
						new Rectangle({
							top: 2,
							left: 63,
							width: 9,
							height: 3
						}),
						new Rectangle({
							top: 17,
							left: 8,
							width: 9,
							height: 3
						}),
						new Rectangle({
							top: 17,
							left: 63,
							width: 9,
							height: 3
						}),
						// Corners vertical
						new Rectangle({
							top: 4,
							left: 8,
							width: 4,
							height: 5
						}),
						new Rectangle({
							top: 4,
							left: 68,
							width: 4,
							height: 5
						}),
						new Rectangle({
							top: 13,
							left: 8,
							width: 4,
							height: 5
						}),
						new Rectangle({
							top: 13,
							left: 68,
							width: 4,
							height: 5
						}),
						// Center top
						new Rectangle({
							top: 2,
							left: 31,
							width: 18,
							height: 3
						}),
						new Rectangle({
							top: 4,
							left: 37,
							width: 6,
							height: 4
						}),
						// Center bottom
						new Rectangle({
							top: 17,
							left: 31,
							width: 18,
							height: 3
						}),
						new Rectangle({
							top: 14,
							left: 37,
							width: 6,
							height: 4
						}),
						// Cleanup
						new Shape({
							top: 4,
							left: 8,
							width: 4,
							height: 1,
							data: parts.dV + ' '.times(2) + parts.dCTL
						}),
						new Shape({
							top: 4,
							left: 68,
							width: 4,
							height: 1,
							data: parts.dCTR + ' '.times(2) + parts.dV
						}),
						new Shape({
							top: 17,
							left: 8,
							width: 4,
							height: 1,
							data: parts.dV + ' '.times(2) + parts.dCBL
						}),
						new Shape({
							top: 17,
							left: 68,
							width: 4,
							height: 1,
							data: parts.dCBR + ' '.times(2) + parts.dV
						}),
						new Shape({
							top: 4,
							left: 37,
							width: 6,
							height: 1,
							data: parts.dCTR + ' '.times(4) + parts.dCTL
						}),
						new Shape({
							top: 17,
							left: 37,
							width: 6,
							height: 1,
							data: parts.dCBR + ' '.times(4) + parts.dCBL
						})
					]
				})
			}
		},
		// Crazy thing
		{
			generate: function () {
				return new MapShape({
					pieces: [
						// Left shape
						new Rectangle({  // TL
							top: 2,
							left: 4,
							width: 7,
							height: 2
						}),
						new Rectangle({  // BL
							top: 18,
							left: 4,
							width: 7,
							height: 2
						}),
						new Shape({  // Left straight
							top: 3,
							left: 4,
							width: 3,
							height: 16,
							data: parts.dV + ' ' + parts.dCTL +
								(parts.dV + ' ' + parts.dV).times(14) +
								parts.dV + ' ' + parts.dCBL
						}),
						new Rectangle({  // Middle
							top: 5,
							left: 10,
							width: 5,
							height: 12
						}),
						new Rectangle({  // TR
							top: 2,
							left: 14,
							width: 7,
							height: 2
						}),
						new Rectangle({  // BR
							top: 18,
							left: 14,
							width: 7,
							height: 2
						}),
						new Shape({  // Right straight
							top: 3,
							left: 18,
							width: 3,
							height: 16,
							data: parts.dCTR + ' ' + parts.dV +
								(parts.dV + ' ' + parts.dV).times(14) +
								parts.dCBR + ' ' + parts.dV
						}),
						
						// Middle shape
						new Shape({  // Top cap
							top: 2,
							left: 24,
							width: 32,
							height: 1,
							data: parts.dCTL + parts.dH.times(30) + parts.dCTR
						}),
						new Shape({  // Top side left
							top: 3,
							left: 24,
							width: 1,
							height: 6,
							data: parts.dV.times(6)
						}),
						new Shape({  // Top side right
							top: 3,
							left: 55,
							width: 1,
							height: 6,
							data: parts.dV.times(6)
						}),
						new Shape({  // Top hook left
							top: 9,
							left: 24,
							width: 11,
							height: 1,
							data: parts.dCBL + parts.dH.times(9) + parts.dCBR
						}),
						new Shape({  // Top hook right
							top: 9,
							left: 45,
							width: 11,
							height: 1,
							data: parts.dCBL + parts.dH.times(9) + parts.dCBR
						}),
						new Rectangle({  // Middle
							top: 4,
							left: 38,
							width: 4,
							height: 14
						}),
						new Shape({  // Bottom hook left
							top: 11,
							left: 24,
							width: 11,
							height: 1,
							data: parts.dCTL + parts.dH.times(9) + parts.dCTR
						}),
						new Shape({  // Bottom hook right
							top: 11,
							left: 45,
							width: 11,
							height: 1,
							data: parts.dCTL + parts.dH.times(9) + parts.dCTR
						}),
						new Shape({  // Bottom side left
							top: 12,
							left: 24,
							width: 1,
							height: 7,
							data: parts.dV.times(7)
						}),
						new Shape({  // Bottom side right
							top: 12,
							left: 55,
							width: 1,
							height: 7,
							data: parts.dV.times(7)
						}),
						new Shape({  // Bottom cap
							top: 19,
							left: 24,
							width: 32,
							height: 1,
							data: parts.dCBL + parts.dH.times(30) + parts.dCBR
						}),
						
						
						// Right shape
						new Rectangle({  // TL
							top: 2,
							left: 59,
							width: 7,
							height: 2
						}),
						new Rectangle({  // BL
							top: 18,
							left: 59,
							width: 7,
							height: 2
						}),
						new Shape({  // Left straight
							top: 3,
							left: 59,
							width: 3,
							height: 16,
							data: parts.dV + ' ' + parts.dCTL +
								(parts.dV + ' ' + parts.dV).times(14) +
								parts.dV + ' ' + parts.dCBL
						}),
						new Rectangle({  // Middle
							top: 5,
							left: 65,
							width: 5,
							height: 12
						}),
						new Rectangle({  // TR
							top: 2,
							left: 69,
							width: 7,
							height: 2
						}),
						new Rectangle({  // BR
							top: 18,
							left: 69,
							width: 7,
							height: 2
						}),
						new Shape({  // Right straight
							top: 3,
							left: 73,
							width: 3,
							height: 16,
							data: parts.dCTR + ' ' + parts.dV +
								(parts.dV + ' ' + parts.dV).times(14) +
								parts.dCBR + ' ' + parts.dV
						}),
					]
				})
			}
		},
		// Lattice
		{
			generate: function () {
				var pieces = [];
				var addVertical = function (x, y) {
					var height = (y < 5 ? 6 : 7);
					pieces.push(new Shape({
						top: y,
						left: x,
						width: 2,
						height: height,
						data: parts.dCTL + parts.dCTR + parts.dV.times(2 * (height - 2)) + parts.dCBL + parts.dCBR
					}));
				};
				var addHorizontal = function (x, y) {
					var width = 14
					pieces.push(new Shape({
						top: y,
						left: x,
						width: width,
						height: 2,
						data: parts.dCTL + parts.dH.times(width - 2) + parts.dCTR + parts.dCBL + parts.dH.times(width - 2) + parts.dCBR
					}));
				};
				
				addVertical(5, 2);
				addVertical(39, 2);
				addVertical(73, 2);
				addVertical(25, 7);
				addVertical(53, 7);
				addVertical(5, 12);
				addVertical(39, 12);
				addVertical(73, 12);
				
				addHorizontal(19, 4);
				addHorizontal(47, 4);
				addHorizontal(5, 9);
				addHorizontal(33, 9);
				addHorizontal(61, 9);
				addHorizontal(19, 15);
				addHorizontal(47, 15);
				
				return new MapShape({pieces: pieces});
			}
		},
		// Horizontal slats
		{
			generate: function () {
				var pieces = [];
				var width = 70;
				for (var i = 0; i < 6; i++) {
					pieces.push(new Rectangle({
						top: 2 + (3 * i),
						left: 5 + (2 * i),
						width: 70 - (4 * i),
						height: 2
					}));
				}
				return new MapShape({pieces: pieces});
			}
		},
		// Vertical slats
		{
			generate: function () {
				var pieces = [];
				var height = 18;
				for (var i = 0; i < 14; i++) {
					pieces.push(new Rectangle({
						top: 2,
						left: 6 + (5 * i),
						width: 2,
						height: height
					}));
				}
				return new MapShape({pieces: pieces});
			}
		},
		// Hourglass slats
		{
			generate: function () {
				var pieces = [];
				var height = 18;
				var left;
				var add = function (adjustment) {
					pieces.push(new Rectangle({
						top: 2 + Math.abs(adjustment),
						left: left + (4 * adjustment),
						width: 2,
						height: height - (2 * Math.abs(adjustment))
					}));
				}
				left = 5;
				for (var i = 0; i <= 8; i++) {
					add(i);
				}
				left = 73;
				for (var i = -8; i <= 0; i++) {
					add(i);
				}
				return new MapShape({pieces: pieces});
			}
		},
		// Middle closed square
		{
			position: [
				[20, 9],
				[56, 12]
			],
			generate: function () {
				return new MapShape({
					pieces: [
						// Top of box
						new Shape({
							top: 8,
							left: 18,
							height: 1,
							width: 43,
							data: parts.dCTL + parts.dH.times(41) + parts.dCTR
						}),
						// Bottom of box
						new Shape({
							top: 13,
							left: 18,
							height: 1,
							width: 43,
							data: parts.dCBL + parts.dH.times(41) + parts.dCBR
						}),
						// Left enclosure
						new Shape({
							top: 9,
							left: 18,
							height: 4,
							width: 1,
							data: parts.dV.times(4)
						}),
						// Right enclosure
						new Shape({
							top: 9,
							left: 60,
							height: 4,
							width: 1,
							data: parts.dV.times(4)
						}),
						// Top beam
						new Shape({
							top: 0,
							left: 39,
							height: 9,
							width: 1,
							data: parts.dIT + parts.dV.times(7) + parts.dIB
						}),
						// Bottom beam
						new Shape({
							top: 13,
							left: 39,
							height: 8,
							width: 1,
							data: parts.dIT + parts.dV.times(7)
						}),
						// Red foot
						new Shape({
							top: 21,
							left: 39,
							height: 1,
							width: 1,
							color: '#ff55ff',
							data: parts.dIB
						})
					]
				})
			}
		},
		// Middle open square
		{
			generate: function () {
				return new MapShape({
					pieces: [
						// Top of box
						new Shape({
							top: 8,
							left: 18,
							height: 1,
							width: 43,
							data: parts.dCTL + parts.dH.times(41) + parts.dCTR
						}),
						// Bottom of box
						new Shape({
							top: 13,
							left: 18,
							height: 1,
							width: 43,
							data: parts.dCBL + parts.dH.times(41) + parts.dCBR
						}),
						// Top beam
						new Shape({
							top: 0,
							left: 39,
							height: 9,
							width: 1,
							data: parts.dIT + parts.dV.times(7) + parts.dIB
						}),
						// Bottom beam
						new Shape({
							top: 13,
							left: 39,
							height: 8,
							width: 1,
							data: parts.dIT + parts.dV.times(7)
						}),
						// Red foot
						new Shape({
							top: 21,
							left: 39,
							height: 1,
							width: 1,
							color: '#ff55ff',
							data: parts.dIB
						})
					]
				})
			}
		}
	];
})(window.jQuery);

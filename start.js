(function ($) {
	if (!$) {
		document.write('This script requires jQuery');
		return;
	}
	
	var batalia = $(document).data('batalia');
	
	var Start = batalia.Start = function () {
		var steps = {
			splash: {
				show: function () {
					this.element = $('<div id="splash"></div>').appendTo(batalia.screen.element);
				},
				after: 'menu',
				auto: 3000,
				cleanup: function () {
					this.element.remove();
				}
			},
			menu: {
				show: function () {
					batalia.screen.start();
					var text = new batalia.CompoundShape({
						pieces: [
							new batalia.Shape({
								top: 10,
								left: 32,
								width: 15,
								height: 2,
								color: '#fff',
								data: ' BATALIA menu\n' +
									'\u002d'.times(14) +
									'\n' +
									'\n' +
									'2) Play BATALIA'
							}),
							new batalia.Shape({
								top: 12,
								left: 32,
								width: 15,
								height: 1,
								color: '#f5f',
								data: '1) Instructions'
							})
						]
					});
					text.draw();
				},
				after: {
					// 1
					49: 'story',
					// 2
					50: 'start'
				}
			},
			story: {
				show: function () {
					batalia.screen.start();
					var text = new batalia.CompoundShape({
						pieces: [
							new batalia.Shape({
								top: 0,
								left: 34,
								width: 20,
								height: 1,
								color: '#f5f',
								data: 'BATALIA'
							}),
							new batalia.Shape({
								top: 3,
								left: 20,
								width: 40,
								height: 4,
								color: '#fff',
								data: ('Traveling throughout the galaxy carrying' +
									'illegal contraband you and your partner\n' +
									'have succesfully evaded the galatic\n' +
									'police.........until.........now!!!!!\n' +
									'\n' +
									'You\'re caught in the act and the penalty' +
									'for this illegal action is known across\n' +
									'the universe.\n' +
									'\n' +
									'You must fight to the death with your\n' +
									'co-pilot in the dreaded labyrinth where\n' +
									'two men enter and only one man survives!\n' +
									'There is no escape!!!\n' +
									'May the best man win.\n' +
									'And the other, well,').toUpperCase()
							}),
							new batalia.Shape({
								top: 19,
								left: 20,
								width: 40,
								height: 4,
								color: '#f5f',
								data: ('you will die!!!!!').toUpperCase()
							}),
							new batalia.Shape({
								top: 21,
								left: 32,
								width: 40,
								height: 4,
								color: '#fff',
								data: ('press any key').toUpperCase()
							}),
						]
					});
					text.draw();
				},
				after: 'instructions'
			},
			instructions: {
				show: function () {
					batalia.screen.start();
					var text = new batalia.CompoundShape({
						pieces: [
							new batalia.Shape({
								top: 0,
								left: 33,
								width: 20,
								height: 1,
								color: '#f5f',
								data: 'MOVEMENT KEYS'
							}),
							new batalia.Shape({
								top: 2,
								left: 24,
								width: 40,
								height: 4,
								color: '#fff',
								data: ('Player 1\n' +
									'\u002d'.times(8) + '\n' +
									' A\u002dUp\n' +
									' Z\u002dDown\n' +
									' X\u002dLeft\n' +
									' C\u002dRight\n' +
									' Space Bar\u002dFire\n' +
									'\n'.times(5) +
									'ESC\u002dEscape').toUpperCase()
							}),
							new batalia.Shape({
								top: 2,
								left: 42,
								width: 40,
								height: 4,
								color: '#fff',
								data: ('Player 2\n' +
									'\u002d'.times(8) + '\n' +
									'Cursor Up\u002dUp\n' +
									'Cursor Down\u002dDown\n' +
									'Cursor Left\u002dLeft\n' +
									'Cursor Right\u002dRight\n' +
									'+\u002dFire\n' +
									'Insert\u002dFire\n').toUpperCase()
							}),
							new batalia.Shape({
								top: 21,
								left: 32,
								width: 40,
								height: 4,
								color: '#fff',
								data: ('press any key').toUpperCase()
							}),
						]
					});
					text.draw();
				},
				after: 'objective'
			},
			objective: {
				show: function () {
					batalia.screen.start();
					var text = new batalia.CompoundShape({
						pieces: [
							new batalia.Shape({
								top: 0,
								left: 34,
								width: 20,
								height: 1,
								color: '#f5f',
								data: 'OBJECTIVE'
							}),
							new batalia.Shape({
								top: 4,
								left: 20,
								width: 40,
								height: 4,
								color: '#fff',
								data: ('Your objective is quite simple.   The\nfirst one to reach 10 hit-points wins!!').toUpperCase()
							}),
							new batalia.Shape({
								top: 9,
								left: 20,
								width: 40,
								height: 4,
								color: '#f5f',
								data: ('Let the games begin!!!!!').toUpperCase()
							}),
							new batalia.Shape({
								top: 22,
								left: 33,
								width: 40,
								height: 4,
								color: '#fff',
								data: 'Press any key'
							}),
						]
					});
					text.draw();
				},
				after: 'start'
			},
			start: {
				show: function () {
					new batalia.Game;
				}
			}
		};
		var present = function (first) {
			var show = function (name) {
				var step = steps[name];
				if (step.after) {
					var next;
					var proceeded = false;
					var proceed = function (event) {
						if (proceeded) return true;
						
						var returnValue = true;
						if (event && !(event.metaKey || event.shiftKey || event.altKey || event.ctrlKey)) {
							event.stopPropagation();
							event.preventDefault();
							returnValue = false;
						}
						if (next) $(document).unbind('click', proceed);
						else if (step.after[event.keyCode]) next = step.after[event.keyCode];
						else return returnValue;
						
						proceeded = true;
						$(document).unbind('keydown', proceed);
						if (step.cleanup) step.cleanup();
						show(next);
						
						return returnValue;
					};
					if (step.after.constructor == String) {
						next = step.after;
						$(document).click(proceed);
						if (step.auto) setTimeout(proceed, step.auto);
					}
					$(document).keyup(proceed);
				}
				step.show();
			};
			show(first);
		};
		
		present('splash');
	};
	new Start;
	
	$(document).removeData('batalia');
})(window.jQuery);

(function ($) {
	if (!$) {
		document.write('This script requires jQuery');
		return;
	}
	
	var batalia = $(document).data('batalia');
	batalia.Game = function () {
		var instance = this;
		
		batalia.currentGame = instance;
		instance.inProgress = false;
		
		var goal = 10;
		var waitTime = 500;  // milliseconds between rounds
		var currentRound = 0;
		
		var players = instance.players = [
			new batalia.Player({
				name: 'Player 1',
				color: '#ff55ff',
				defaultLeft: 2,
				defaultTop: 1,
				isWaiting: true,
				keys: {
					up: 65,
					down: 90,
					left: 88,
					right: 67,
					fire: 32
				},
				labelPosition: 4
			}),
			new batalia.Player({
				name: 'Player 2',
				color: '#fff',
				defaultLeft: 75,
				defaultTop: 20,
				isWaiting: true,
				keys: {
					up: 38,
					down: 40,
					left: 37,
					right: 39,
					fire: [96, 187]
				},
				labelPosition: 59
			})
		];
		
		
		var startRound = function () {
			currentRound++;
			instance.inProgress = true;
			var arena = new batalia.Arena();
			arena.draw();
			
			var map = batalia.maps[Math.floor(Math.random() * batalia.maps.length)];
			map.generate().draw();
			
			if (map.position) {
				for (var index in map.position) {
					var player = players[index];
					player.left = map.position[index][0];
					player.top = map.position[index][1];
				}
			}
			else {
				for (var index in players) {
					var player = players[index];
					player.top = player.defaultTop;
					player.left = player.defaultLeft;
				}
			}
			
			for (var index in players) {
				players[index].reset();
				players[index].draw();
			}
		};
		var endGame = function (winner) {
			$(document).unbind('keydown', escape);
			for (var index in players) players[index].reset(true);
			
			batalia.screen.start();
			
			if (winner) {
				$.extend(batalia.screen, {
					x: 27,
					y: 9,
					color: '#fff'
				});
				batalia.screen.write('The winner was ' + winner.name.toLowerCase());
				
			}
			$.extend(batalia.screen, {
				x: 30,
				y: 11,
				color: '#f55'
			});
			batalia.screen.write('Play again (y/n)?');
			
			var yes = 89;
			var no = 78;
			var restart = function (event) {
				var handled = false;
				if (event.keyCode == yes) {
					handled = true;
					new batalia.Game;
				}
				else if (event.keyCode == no) {
					handled = true;
					new batalia.Start;
				}
				if (handled) $(document).unbind('keyup', restart);
			};
			$(document).keyup(restart);
		};
		var proceed = function () {
			var done = false;
			for (var index in players) {
				if (players[index].points == goal) {
					done = true;
					break;
				}
			}
			instance.inProgress = !done;
			
			batalia.screen.start();
			if (done) endGame(players[index]);
			else setTimeout(startRound, currentRound ? waitTime : 0);
		};
		
		var escape = function (event) {
			if (event.keyCode == 27) {
				endGame();
				event.stopPropagation();
				event.preventDefault();
				return false;
			}
			return true;
		};
		$(document).keydown(escape);
		for (var index in players) $(players[index]).bind('batalia:next', proceed);
		proceed();
	};
})(window.jQuery);

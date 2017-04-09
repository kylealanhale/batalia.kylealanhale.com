(function ($) {
    if (!$) {
        document.write('This script requires jQuery');
        return;
    }
    
    var batalia = $(document).data('batalia');
    
    var parts = batalia.parts = {
        dV: '\u00ba',  // doubleVertical
        dH: '\u00cd',  // doubleHorizontal
        dCTL: '\u00c9',  // doubleCornerTopLeft
        dCTR: '\u00bb',  // doubleCornerTopRight
        dCBR: '\u00bc',  // doubleCornerBottomRight
        dCBL: '\u00c8',  // doubleCornerBottomLeft
        dIT: '\u00cb',  // doubleIntersectionTop
        dIB: '\u00ca',  // doubleIntersectionBottom
        oD: '\u2122',  // oDiaeresis
        sIL: '\u00c3',  // singleIntersectionLeft
        sIR: '\u00b4',  // singleIntersectionRight
        b: '\u00f9'  // bottom
    };
    
    var sounds = {};
    var makeSound = function (name) {
        var store = [];
        var add = function () {
            var audio = new Audio();
            if (audio.canPlayType('audio/mpeg')) audio.src = 'sounds/' + name + '.mp3';
            else audio.src = 'sounds/' + name + '.ogg';
            store.push(audio);
        };
        add();
        store[0].load();
        sounds[name] = {
            play: function () {
                var before = store.length;
                if (!store.length) add();
                var audio = store.pop();
                var after = store.length;
                var reload = function () {
                    $(audio).unbind('ended', reload);
                    store.push(audio);
                };
                $(audio).bind('ended', reload);
                audio.play();
            }
        };
    };
    makeSound('fire');
    makeSound('hit');
    
    
    
    var Shape = batalia.Shape = function (attributes) {
        for (var key in attributes) {
            this[key] = attributes[key];
        }
    };
    $.extend(Shape.prototype, {
        width: 0,
        height: 0,
        top: 0,
        left: 0,
        color: null,
        data: '',
        drawn: false,
        draw: function (clearInsteadOfDraw) {
            clearInsteadOfDraw = clearInsteadOfDraw === true;
            
            batalia.screen.x = this.left;
            batalia.screen.y = this.top;
            if (this.color) batalia.screen.color = this.color;
            
            if (batalia.screen.actors.indexOf(this) < 0) batalia.screen.actors.push(this);
            this.drawn = true;
            
            var parts = this.data.split('');
            for (var index in parts) {
                index = parseInt(index);
                var character = parts[index];
                var crlf = false;
                if (character == '\n') {
                    crlf = true;
                }
                else {
                    batalia.screen.draw(
                        clearInsteadOfDraw ? '' : parts[index],
                        null,
                        null,
                        clearInsteadOfDraw ? undefined : this);
                    crlf = ((batalia.screen.x - this.left) == this.width - 1);
                }
                if (crlf) {
                    batalia.screen.x = this.left;
                    batalia.screen.y++
                }
                else batalia.screen.x++;
            };
        },
        clear: function () {
            this.draw(true);
        },
        destroy: function (data) {
            var index = batalia.screen.actors.indexOf(this);
            if (index >= 0) {
                if (this.drawn) this.clear();
                batalia.screen.actors.splice(index, 1);
            }
        },
        intersects: function (shape, left, top) {
            if (top === undefined) top = this.top;
            if (left === undefined) left = this.left;
            
            var one = {
                top: top,
                left: left,
                bottom: top + this.height - 1,
                right: left + this.width - 1
            };
            var two = {
                top: shape.top,
                left: shape.left,
                bottom: shape.top + shape.height - 1,
                right: shape.left + shape.width - 1
            };
            
            return !(one.bottom < two.top ||
                one.top > two.bottom ||
                one.right < two.left ||
                one.left > two.right);
        }
    });
    
    
    
    var CompoundShape = batalia.CompoundShape = function () {
        Shape.prototype.constructor.apply(this, arguments);
        for (var index in this.pieces) {
            var piece = this.pieces[index];
            if (!piece.color) piece.color = this.color;
        }
    };
    $.extend(CompoundShape.prototype, Shape.prototype, {
        pieces: [],
        draw: function (children) {
            if (children || children === undefined) {
                for (var index in this.pieces) {
                    this.pieces[index].draw();
                }
            }
            Shape.prototype.draw.apply(this);
        },
        clear: function (children) {
            if (children || children === undefined) {
                for (var index in this.pieces) {
                    this.pieces[index].clear();
                }
            }
            Shape.prototype.clear.apply(this);
        },
        destroy: function (children) {
            if (children || children === undefined) {
                for (var index in this.pieces) {
                    this.pieces[index].destroy();
                }
            }
            Shape.prototype.destroy.apply(this);
        },
        intersects: function (shape) {
            for (var index in this.pieces) {
                if (this.pieces[index].intersects(shape)) return true;
            }
            return false;
        }
    });
    
    var Rectangle = batalia.Rectangle = function () {
        Shape.prototype.constructor.apply(this, arguments);
        this.data = parts.dCTL + parts.dH.times(this.width - 2) + parts.dCTR +
            (parts.dV + ' '.times(this.width - 2) + parts.dV).times(this.height - 2) +
            parts.dCBL + parts.dH.times(this.width - 2) + parts.dCBR;
    };
    $.extend(Rectangle.prototype, Shape.prototype);
    
    
    var Player = batalia.Player = function () {
        var instance = this;
        
        instance.keys = {
            left: null,
            right: null,
            up: null,
            down: null,
            fire: null
        };
        
        Shape.prototype.constructor.apply(this, arguments);
        
        var registerKey = function (code) {
            batalia.keys[code] = false;
        }
        for (var key in instance.keys) {
            var keyCode = instance.keys[key];
            if (keyCode.constructor == Array) {
                for (var index in keyCode) {
                    registerKey(keyCode[index]);
                }
            }
            else registerKey(keyCode);
        }
        
        var move = function (direction, distance) {
            var top = instance.top + (direction == 'top' ? distance : 0);
            var left = instance.left + (direction == 'left' ? distance : 0);
            
            if (batalia.currentGame) for (var index in batalia.currentGame.players) {
                batalia.currentGame.players[index].isTouchingPlayer = false;
            }
            for (var offset = 0; offset < 3; offset++) {
                var shape = batalia.screen.getOwner(left + offset, top);
                if (shape === undefined || shape == instance) continue;
                
                if (shape.constructor == Player) instance.isTouchingPlayer = shape.isTouchingPlayer = true;
                else return;
            }
            instance.clear();
            instance[direction] += distance;
            instance.draw();
        };
        
        var fire = function () {
            if (instance.isFiring || instance.isWaiting) return;
            instance.artillery = new Artillery(instance);
            instance.artillery.fire();
        };
        
        var counter = 0;
        var controller = function () {
            if (instance.isWaiting || !batalia.currentGame || !batalia.currentGame.inProgress) {
                return;
            }
            
            for (var index in batalia.keys) {
                var keyCode = parseInt(index);
                var pressed = batalia.keys[index];
                if (pressed) {
                    if (keyCode == instance.keys.left)
                        move('left', -1);
                    else if (keyCode == instance.keys.right)
                        move('left', 1);
                    else if (keyCode == instance.keys.up)
                        move('top', -1);
                    else if (keyCode == instance.keys.down)
                        move('top', 1);
                    else if (keyCode == instance.keys.fire || (
                        instance.keys.fire &&
                        instance.keys.fire.indexOf &&
                        instance.keys.fire.indexOf(keyCode) >= 0))
                            fire();
                }
            }
            if (instance.isTouchingPlayer) {
                counter++;
                if (counter == 1) instance.draw();
                else if (counter == 2) instance.clear()
                else counter = 0;
            }
            else instance.draw();
        };
        instance.uncontrol = function () {
            $(batalia.scheduler).unbind('player', controller);
        };
        $(batalia.scheduler).bind('player', controller);
    };
    $.extend(Player.prototype, Shape.prototype, {
        name: 'Player',
        width: 3,
        height: 1,
        labelPosition: 0,
        keys: {},
        points: 0,
        artillery: null,
        isTouchingPlayer: false,
        isFiring: false,
        isHit: false,
        isWaiting: false,
        data: parts.sIL + parts.oD + parts.sIR,
        hit: function (target) {
            var instance = this;
            instance.isWaiting = true;
            
            target.isWaiting = true;
            target.isHit = true;
            
            instance.points++;
            $(instance).trigger('batalia:next');
        },
        draw: function () {
            $.extend(batalia.screen, {
                x: this.labelPosition,
                y: 22,
                color: this.color
            });
            batalia.screen.write(this.name.toUpperCase() + '> ' + this.points);
            Shape.prototype.draw.apply(this, arguments);
        },
        reset: function (complete) {
            this.clear();
            this.isFiring = false;
            this.isWaiting = false;
            this.isHit = false;
            this.isTouchingPlayer = false;
            
            if (complete) {
                this.uncontrol();
                this.points = 0;
            }
        }
    });
    batalia.scheduler.add('player', 33);
    
    
    
    var Arena = batalia.Arena = function () {
        var attributes = (arguments.length ? arguments[0] : {});
        attributes.pieces = [
            new Shape({
                height: 1,
                width: 80,
                data: parts.dCTL + parts.dH.times(78) + parts.dCTR
            }),
            new Shape({
                top: 1,
                height: 20,
                width: 1,
                data: parts.dV.times(20)
            }),
            new Shape({
                top: 1,
                left: 79,
                height: 20,
                width: 1,
                data: parts.dV.times(20)
            }),
            new Shape({
                top: 21,
                height: 1,
                width: 80,
                data: parts.dCBL + parts.dH.times(78) + parts.dCBR
            })
        ];
        attributes.color = '#FF55FF';
        CompoundShape.prototype.constructor.apply(this, [attributes]);
    };
    $.extend(Arena.prototype, CompoundShape.prototype);
    
    
    
    var Bullet = function () {
        Shape.prototype.constructor.apply(this, arguments);
    };
    $.extend(Bullet.prototype, Shape.prototype, {
        height: 1,
        width: 1,
        relativeTop: 0,
        relativeLeft: 0,
        color: '#fff',
        data: parts.b,
        live: true,
        destroy: function () {
            this.live = false;
            this.drawn = false;
            Shape.prototype.destroy.apply(this, arguments);
        }
    });
    batalia.scheduler.add('bullet', 22);
    
    
    
    var Artillery = batalia.Artillery = function (owner) {
        this.owner = owner;
        var attributes = {};
        attributes.pieces = [
            new Bullet({relativeTop: -1}),
            new Bullet({relativeLeft: 2}),
            new Bullet({relativeTop: 1}),
            new Bullet({relativeLeft: -2})
        ];
        CompoundShape.prototype.constructor.apply(this, [attributes]);
    };
    $.extend(Artillery.prototype, CompoundShape.prototype, {
        owner: null,
        fire: function () {
            var instance = this;
            
            instance.owner.isFiring = true;
            sounds.fire.play();
            
            var x = instance.owner.left + 1;
            var y = instance.owner.top;
            
            var times = 0;
            var move = function () {
                var dead = 0;
                
                for (var index in instance.pieces) {
                    var bullet = instance.pieces[index];
                    if (!bullet.live) {
                        dead++;
                        continue;
                    }
                    
                    if (times > 0) bullet.clear();
                    var newTop = y + (bullet.relativeTop ? (bullet.relativeTop + ((bullet.relativeTop < 0 ? -1 : 1) * times)) : 0);
                    var newLeft = x + (bullet.relativeLeft ? (bullet.relativeLeft + ((bullet.relativeLeft < 0 ? -1 : 1) * times)) : 0);
                    
                    var shape = batalia.screen.getOwner(newLeft, newTop);
                    
                    if (shape !== undefined && shape.drawn && shape != instance.owner) {  // Hit
                        bullet.live = false;
                        bullet.destroy();
                        
                        if (shape.constructor == Player && !shape.isHit) {
                            sounds.hit.play();
                            instance.owner.hit(shape);
                            instance.destroy();
                            if (shape.artillery) shape.artillery.destroy();
                        }
                    }
                    
                    if (bullet.live) {
                        bullet.top = newTop;
                        bullet.left = newLeft;
                        bullet.draw();
                    }
                }
                
                times++;
                
                if (dead == instance.pieces.length) {
                    $(batalia.scheduler).unbind('bullet', move);
                    instance.owner.isFiring = false;
                    instance.owner.artillery = null;
                    instance.destroy(false);
                }
            };
            $(batalia.scheduler).bind('bullet', move);
        }
    });
})(window.jQuery);

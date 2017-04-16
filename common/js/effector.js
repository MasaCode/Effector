function Effector(option) {
    this.initializeAnimationFrame();
    this.initialize(option);
    return this;
}

Effector.prototype = {
    elements: [],
    option: null,
    elementLength: 0,
    effectLength: 0,
    step: 0.01,
    interval: 15.0,
    intervalId: 0,
    isAllTogether: true,
    startedAt: 0,
    elementIndex: 0,
    nodeIndex: 0,
    isEffectInitialized: false,
    delay: 0,

    initialize: function (option) {
        if (typeof option.delay !== 'number' || option.delay < 0) {
            console.log(new Error('Delay is not vaild...'));
            return;
        }
        this.option = option;
        this.elementLength = option.elements.length;
        this.effectLength = this.interval * (1 / this.step);
        this.delay = option.delay;
        var isValid = true;
        for (var i = 0; i < this.elementLength; i++) {
            var obj = {};
            obj.useCustomDirection = (typeof option.elements[i].useCustomDirection === 'boolean') ? option.elements[i].useCustomDirection : false;
            var toLength, fromLength;
            var isValidDestination = (Array.isArray(option.elements[i].to)) ? true : false;
            var isValidFrom = (Array.isArray(option.elements[i].from)) ? true : false;
            if (isValidDestination) toLength = option.elements[i].to.length;
            if (isValidFrom) fromLength = option.elements[i].from.length;
            var nodes = document.querySelectorAll(option.elements[i].selector);
            var nodeLength = nodes.length;
            for (var j = 0; j < nodeLength; j++) {
                nodes[j].initPos = this.getPosition(nodes[j]);
                if (isValidDestination) {
                    nodes[j].to = option.elements[i].to[j];
                    if (j + 1 === toLength) {
                        isValidDestination = false;
                    }
                }
                if (isValidFrom) {
                    nodes[j].from = option.elements[i].from[j];
                    if (j + 1 === fromLength) {
                        isValidFrom = false;
                    }
                }
                nodes[j].style.cssText = ''.concat(
                    'opacity : 0.0;'
                );
            }
            if (typeof this[option.elements[i].func] !== 'function') {
                isValid = false;
                break;
            }
            obj.func = option.elements[i].func.toLowerCase();
            obj.showTogether = (typeof option.elements[i].showTogether === 'boolean') ? option.elements[i].showTogether : true;
            obj.nodes = nodes;
            this.elements.push(obj);
        }

        if (!isValid) {
            console.log(new Error('Effect Function is invalid'));
        }

        window.setTimeout(this.start.bind(this), this.delay);
    },

    initializeAnimationFrame: function () {
        window.requestAnimFrame = (function(){
            return  window.requestAnimationFrame       ||
                window.webkitRequestAnimationFrame ||
                window.mozRequestAnimationFrame    ||
                function( callback ){
                    window.setTimeout(callback, 1000 / 60);
                };
        })();
    },

    getPosition: function (element) {
        var x = 0, y = 0;
        var width = window.innerWidth;
        var height = window.innerHeight;
        while (element) {
            if (element.tagName == 'BODY') {
                var xScroll = element.scrollLeft || document.documentElement.scrollLeft;
                var yScroll = element.scrollTop || document.documentElement.scrollTop;
                x += (element.offsetLeft - xScroll + element.clientLeft);
                y += (element.offsetTop - yScroll + element.clientTop);
            } else {
                x += (element.offsetLeft - element.scrollLeft + element.clientLeft);
                y += (element.offsetTop - element.scrollTop + element.clientTop);
            }
            element = element.offsetParent;
        }
        x = (x / width) * 100.00;
        y = (y / height) * 100.00;

        return {x: x, y: y};
    },

    getDirection: function (direction, isDistination, size) {
        direction = direction.toLowerCase();
        size = {x: (size.x / window.innerWidth) * 100, y: (size.y / window.innerHeight) * 100};
        var adjustment = (isDistination) ? {x: 0, y: 0} : size;

        switch (direction) {
            case 'topleft' :
                return {x: 0 - adjustment.x, y: 0 - adjustment.y};
            case 'middleleft' :
                return {x: 0 - adjustment.x, y: 50 - (size.y / 2.0)};
            case 'bottomleft' :
                return {x: 0 - adjustment.x, y: 100};
            case 'bottommiddle' :
                return {x: 50 - (size.x / 2.0), y: 100};
            case 'bottomright' :
                return {x: 100, y: 100};
            case 'middleright' :
                return {x: 100, y: 50 - (size.y / 2.0)};
            case 'topright' :
                return {x: 100, y: 0 - adjustment.y};
            case 'topmiddle' :
                return {x: 50 - (size.x / 2.0), y: 0 - adjustment.y};
            case  'center' :
                return {x: 50 - (size.x / 2.0), y: 50 - (size.y / 2.0)};
            default:
                return {x: 0, y: 0};
        }
    },

    calcPosition: function (playback, to, from) {
        var x = (to.x >= from.x) ? to.x * playback : (from.x - from.x * playback);
        var y = (to.y >= from.y) ? to.y * playback : (from.y - from.y * playback);

        return {x: x, y: y};
    },

    start: function () {
        this.startedAt = 0;
        this.elementIndex = 0;
        this.update();
    },

    stop: function () {
        clearInterval(this.intervalId);
        this.intervalId = 0;
        this.isEffectInitialized = false;
    },

    reset: function (elements) {
        var length = elements.length;
        for (var elIndex = 0; elIndex < length; elIndex++) {
            elements[elIndex].style.cssText = '';
        }
    },

    update: function () {
        var isDone = false;
        this.startedAt += (this.interval / this.effectLength);
        if (this.elements[this.elementIndex].showTogether) {
            var nodeLength = this.elements[this.elementIndex].nodes.length;
            for (var i = 0; i < nodeLength; i++) {
                this[this.elements[this.elementIndex].func](this.startedAt, this.elements[this.elementIndex].nodes[i]);
            }
        } else {
            this[this.elements[this.elementIndex].func](this.startedAt, this.elements[this.elementIndex].nodes[this.nodeIndex]);
        }
        this.isEffectInitialized = true;

        if (this.startedAt > 1.0) {
            if (this.elements[this.elementIndex].showTogether) {
                this.reset(this.elements[this.elementIndex].nodes);
                this.elementIndex++;
            } else {
                this.reset([this.elements[this.elementIndex].nodes[this.nodeIndex]])
                this.nodeIndex++;
                if (this.nodeIndex >= this.elements[this.elementIndex].nodes.length) {
                    this.elementIndex++;
                    this.nodeIndex = 0;
                }
            }

            if (this.elementIndex >= this.elementLength) {
                this.stop();
                cancelAnimationFrame(this.intervalId);
                isDone = true;
            } else {
                this.startedAt = 0;
                this.isEffectInitialized = false;
            }
        }

        if(!isDone) this.intervalId = window.requestAnimationFrame(this.update.bind(this));
    },

    fadein: function (playback, element) {
        if (!this.isEffectInitialized) {
            element.style.opacity = 0.0;
            return;
        }
        element.style.opacity = playback;
    },

    slidein: function (playback, element) {
        if (!this.isEffectInitialized) {
            if (!this.elements[this.elementIndex].useCustomDirection) {
                var size = {x: element.offsetWidth, y: element.offsetHeight};
                element.from = this.getDirection(element.from, false, size);
                element.to = element.initPos;
            }
            element.style.cssText += ''.concat(
                'position : absolute;', 'left : ' + element.from.x + '%;', 'top : ' + element.from.y + '%;', 'opacity : 1.0;'
            );
            return;
        }
        var pos = this.calcPosition(playback, element.to, element.from);
        element.style.cssText += ''.concat(
            'left : ' + pos.x + '%;', 'top : ' + pos.y + '%;'
        );
    },

    easeoutquad: function (playback, element) {
        playback = playback * (2 - playback);
        this.slidein(playback, element);
    },

    easeinquad: function (playback, element) {
        playback = playback * playback;
        this.slidein(playback, element);
    },

    easeinoutquad: function (playback, element) {
        playback = playback < 0.5 ? 2 * playback * playback : -1 + (4 - 2 * playback) * playback;
        this.slidein(playback, element);
    },

    bounce: function (playback, element) {
        var bounce = 1.20;
        var turnpoint = 1.10;
        playback = playback * bounce * (2 - playback);
        if (playback > turnpoint) {
            playback = 1 - (bounce - playback);
        } else if (playback > 1.0) {
            playback -= (playback - 1) * 2;
        }
        this.slidein(playback, element);
    },

    backslidein: function (playback, element) {
         x = 1.5;
        playback = Math.pow(playback, 2) * ((1 + x) * playback - x);
        this.slidein(playback, element);
    },

    elastic: function (playback, element) {
        x = 1.5;
        playback = Math.pow(2, 10 * (playback - 1)) * Math.cos(20 * Math.PI * x / 3 * playback);
        this.slidein(playback, element);
    },
};


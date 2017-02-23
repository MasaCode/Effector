function Effector(option) {
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

    initialize: function (option) {
        this.option = option;
        this.elementLength = option.elements.length;
        this.effectLength = this.interval * (1 / this.step);
        var isValid = true;
        for (var i = 0; i < this.elementLength; i++) {
            var obj = {};
            var toLength, fromLength;
            var isValidDestination = (Array.isArray(option.elements[i].to) && Array.isArray(option.elements[i].from)) ? true : false;
            if (isValidDestination) {
                toLength = option.elements[i].to.length;
                fromLength = option.elements[i].from.length;
            }
            var nodes = document.querySelectorAll(option.elements[i].selector);
            var nodeLength = nodes.length;
            for (var j = 0; j < nodeLength; j++) {
                nodes[j].initPos = this.getPosition(nodes[j]);
                nodes[j].style.opacity = 0.0;
                if (isValidDestination) {
                    nodes[j].from = option.elements[i].from[j];
                    nodes[j].to = option.elements[i].to[j];
                    if (j + 1 === toLength || j + 1 === fromLength) {
                        isValidDestination = false;
                    }
                }
            }
            if (typeof this[option.elements[i].func] !== 'function') {
                isValid = false;
                break;
            }
            obj.func = option.elements[i].func;
            obj.showTogether = (typeof option.elements[i].showTogether === 'boolean') ? option.elements[i].showTogether : true;
            obj.nodes = nodes;
            this.elements.push(obj);
        }

        if (!isValid) {
            console.log('Effect Function is invalid');
        }

        this.start();
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

    start: function () {
        this.startedAt = 0;
        this.elementIndex = 0;
        this.intervalId = setInterval(this.update.bind(this), this.interval);
    },

    stop: function () {
        clearInterval(this.intervalId);
        this.intervalId = 0;
        this.isEffectInitialized = false;
    },

    update: function () {
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
                this.elementIndex++;
            } else {
                this.nodeIndex++;
                if(this.nodeIndex >= this.elements[this.elementIndex].nodes.length){
                    this.elementIndex++;
                    this.nodeIndex = 0;
                }
            }

            if(this.elementIndex >= this.elementLength){
                this.stop();
            }else{
                this.startedAt = 0;
                this.isEffectInitialized = false;
            }
        }
    },

    fadein: function (playback, element) {
        if (!this.isEffectInitialized) {
            element.style.opacity = 0.0;
        }
        element.style.opacity = playback;
    },
};


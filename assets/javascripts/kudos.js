window.Kudos = function Kudos(config){
    this.init = function init(config){
        var instance = this;
        this.kudosCount = 0;
        this.inText  = "Don't Move";
        this.outText  = "Kudos";
        this.element = null;
        this.id = null;
        this.className = null;
        this.name = null;

        for (property in config){
            if (instance.hasOwnProperty(property) && property !== 'prototype'){
                instance[property] = config[property];
            }
        }

        if(!this.element){
            this.element = $(Kudos.HTML);
        }

        this.fillingElement = this.element.find('div.filling');

        this.element.addClass(this.className);
        this.element.attr('id',this.id);

        if(this._isAlreadyKudoed()){
            this.element.addClass('completed');
            if(typeof !isNaN(parseFloat(this._isAlreadyKudoed())) && isFinite(this._isAlreadyKudoed())){
                this.kudosCount = this._isAlreadyKudoed();
            }

        } else{
            this._bindEvents();
        }

        this._setCount();

        return this
    }

    this.init(config)
}

window.Kudos.HTML =
    '<figure class="kudo able" id="">\
        <a href="#kudo">\
            <div class="filling">&nbsp;</div>\
            <div class="num">1,172</div>\
            <div class="txt">Kudos</div>\
        </a>\
    </figure>\
    '
// set this to send kudos POST requests to this URL
window.Kudos.KudoURL = null;

window.Kudos.prototype = {
    send: function send(){
        var kudo = this;
        if(window.Kudos.KudoURL){
            $.ajax({
              url: window.Kudos.KudoURL,
              data: {id: kudo.id},
              type: "POST",
              dataType: "json"
            })
        }
    },

    destroy: function(){
        this.name = null;
        this.timer = null;
        this.element && this.element.remove();
        this.id = null;
        for (property in config){
            if (instance.hasOwnProperty(property) && property !== 'prototype'){
                instance[property] = null;
            }
        }
    },

    render: function(element){
        if(element){
            element.append(this.element);
        }
        return this;
    },

    markAsCompleted: function(){
        this.element.addClass('completed').removeClass('activated');
        this.element.off();
        this.kudosCount = this.kudosCount + 1;
        if(window.localStorage){
            window.localStorage[this.id] = this.kudosCount;
        }
        this.element.find('div.num').text(this.kudosCount).show();
        this.element.find('div.txt').text(this.outText);
        return this;
    },

    _bindEvents: function(){
        var kudos = this;

        var hoverIn = function(){
            kudos.element.addClass('activated');
            kudos.element.find('div.num').hide();
            kudos.element.find('div.txt').text(kudos.inText);
        }

        var hoverOut = function(){
            kudos.element.removeClass('activated');
            kudos.element.find('div.num').show();
            kudos.element.find('div.txt').text(kudos.outText);
        }

        this.element.on('mouseenter',hoverIn);
        this.element.on('mouseleave',hoverOut);
        this.fillingElement.on('transitionend webkitTransitionEnd oTransitionEnd otransitionend', function(e) {
            if(kudos.element.hasClass('activated')){
                kudos.markAsCompleted();
                kudos.send();
            }
        });
    },

    _setCount: function(){
        this.element.find('div.num').text(this.kudosCount);
    },

    _isAlreadyKudoed: function(){
        if(window.localStorage && !!localStorage[this.id]){
            return localStorage[this.id]
        }
    }
}

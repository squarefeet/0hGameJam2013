function MouseHandler() {
    var _leftBtnValue = 1,
        _rightBtnValue = 3,
        _leftMousedownListeners = [],
        _rightMousedownListeners = [],
        _leftMouseupListeners = [],
        _rightMouseupListeners = [],
        that = this;

    this.prevX = 0;
    this.prevY = 0;
    this.centerX = window.innerWidth / 2 | 0;
    this.centerY = window.innerHeight / 2 | 0;
    this.x = +this.centerX;
    this.y = +this.centerY;

    this.left = 0;
    this.right = 0;


    document.addEventListener( 'contextmenu', function( e ) {
        e.preventDefault();
    }, false);

    document.addEventListener( 'mousedown', function( e ) {
        e.preventDefault();

        if( e.which === _leftBtnValue ) {
            that.left = 1;
            for(var i = 0; i < _leftMousedownListeners.length; ++i) {
                _leftMousedownListeners[i]();
            }
        }
        else if( e.which === _rightBtnValue ) {
            that.right = 1;
            for(var i = 0; i < _rightMousedownListeners.length; ++i) {
                _rightMousedownListeners[i]();
            }
        }



    }, false );


    document.addEventListener( 'mousemove', function( e ) {
        that.prevX = that.x;
        that.prevY = that.y;
        that.x = e.pageX;
        that.y = e.pageY;
    }, false );


    document.addEventListener( 'mouseup', function( e ) {
        e.preventDefault();
        if( e.which === _leftBtnValue ) {
            that.left = 0;
            for(var i = 0; i < _leftMouseupListeners.length; ++i) {
                _leftMouseupListeners[i]();
            }
        }
        else if( e.which === _rightBtnValue ) {
            that.right = 0;
            for(var i = 0; i < _rightMouseupListeners.length; ++i) {
                _rightMouseupListeners[i]();
            }
        }

    }, false );


    this.onResize = function() {
        that.centerX = window.innerWidth / 2;
        that.centerY = window.innerHeight / 2;
    };


    this.addLeftMouseDownListener = function( fn ) {
        _leftMousedownListeners.push( fn );
    };

    this.addRightMouseDownListener = function( fn ) {
        _rightMousedownListeners.push( fn );
    };

    this.addLeftMouseUpListener = function( fn ) {
        _leftMouseupListeners.push( fn );
    };

    this.addRightMouseUpListener = function( fn ) {
        _rightMouseupListeners.push( fn );
    };
}
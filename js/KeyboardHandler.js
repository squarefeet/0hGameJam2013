function KeyboardHandler() {
	var _pressedKeys = [],
		_keydownListeners = {},
		_keyupListeners = {},
		_meta = false,
		_shift = false,
		_alt = false,
		_altGraph = false,
		_ctrl = false;

	document.addEventListener( 'keydown', function(e) {
		var charcode = String.fromCharCode( e.keyCode ).toLowerCase(),
			key = e.keyCode,
			listeners = _keydownListeners[ charcode ];

		for( var i in CONFIG.keyMap ) {
			if(key === CONFIG.keyMap[i]) {
				if( CONFIG.keyMapPreventDefaults.indexOf( i ) > -1 ) {
					e.preventDefault();
				}

				charcode = i;
				break;
			}
		}

		_meta = e.metaKey;
		_shift = e.shiftKey;
		_alt = e.altKey;
		_altGraph = e.altGraphKey;
		_ctrl = e.ctrlKey;

		// Force lowercase
		_pressedKeys[ key ] = 1;

		// if( _meta || _ctrl ) e.preventDefault();
		if( listeners ) {
			for( var i = 0; i < listeners.length; ++i ) {
				listeners[i]();
			}
		}
	}, false );


	document.addEventListener( 'keyup', function(e) {
		var charcode = String.fromCharCode( e.keyCode ).toLowerCase(),
			key = charcode.charCodeAt( 0 ),
			listeners = _keyupListeners[ charcode ];

		_meta = e.metaKey;
		_shift = e.shiftKey;
		_alt = e.altKey;
		_altGraph = e.altGraphKey;
		_ctrl = e.ctrlKey;

		_pressedKeys[ key ] = 0;

		// if( _meta || _ctrl ) e.preventDefault();
		if( listeners ) {
			for( var i = 0; i < listeners.length; ++i ) {
				listeners[i]();
			}
		}
	}, false );


	this.isPressed = function( key ) {
		var found = false;

		key = key.split('+');

		for( var i = 0; i < key.length; ++i ) {
			found = false;

			if(
				(key[i] === 'meta' && _meta) ||
				(key[i] === 'shift' && _shift) ||
				(key[i] === 'alt' && _alt) ||
				(key[i] === 'altGraph' && _altGraph) ||
				(key[i] === 'ctrl' && _ctrl)
			) {
				found = true;
			}

			else if( _pressedKeys[ key [ i ].charCodeAt(0) ] ) {
				found = true;
			}

			if(!found) return false;
		}

		return true;
	};


	this.addKeyDownListener = function( key, fn ) {
		if( !_keydownListeners[ key ] ) {
			 _keydownListeners[ key ] = [];
		}

		_keydownListeners[ key ].push( fn );
	};

	this.addKeyUpListener = function( key, fn ) {
		if( !_keyupListeners[ key ] ) {
			 _keyupListeners[ key ] = [];
		}

		_keyupListeners[ key ].push( fn );
	};

}
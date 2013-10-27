// Fuck it. No time!




var mouseHandler = new MouseHandler(),

	keyHandler = new KeyboardHandler(),

	layerManager = new LayerManager({
		layers: {
	        background: {
	            updatePosition: false,
	            updateRotation: true
	        },
	        middleground: {
	            updatePosition: true,
	            updateRotation: true
	        }
	    },
	    layerOrder: [ 'background', 'middleground' ],
	    fov: 75,
	    far: 50000
	}),

	cameraControls = new CameraControls(_.extend( {
	    mouseHandler: mouseHandler,
	    keyboardHandler: keyHandler,
	    targetCameras: layerManager.getAllCameras()
	}, CONFIG.cameraControls )),

	// Create renderer instance.
	renderer = new Renderer({
	    width: window.innerWidth / CONFIG.resolutionScaling,
	    height: window.innerHeight / CONFIG.resolutionScaling,
	    elementWidth: window.innerWidth,
	    elementHeight: window.innerHeight,

	    gammaInput: true,
	    gammaOutput: true,
	    physicallyBasedShading: true,
	    clearAlpha: 0.1
	}),

	dt,
	enemies = [],
	score = 0,
	scoreEl = document.getElementById('score'),
	projectiles = {
		store: [],
		get: function() {
			if( this.store.length ) {
				return this.store.pop();
			}
		},
		release: function( obj ) {
			obj.position.set( Number.NEGATIVE_INFINITY, Number.NEGATIVE_INFINITY, Number.NEGATIVE_INFINITY );
			this.store.push( obj );
		}
	};


function fire() {
	var p = projectiles.get(),
		player = layerManager.getAllCameras()[1];

	p.position.copy( player.position );
	p.quaternion.copy( player.quaternion );

	var timer = setInterval( function() {
		p.translateZ( -20 );
		if( checkCollision( p ) ) {
			clearInterval( timer );
			projectiles.release( p );
		}
	}, 16 );


	setTimeout(function() {
		clearInterval( timer );
		projectiles.release( p );
	}, 3000 );
}


function makeProjectiles() {
	for( var i = 0, p; i < 100; ++i ) {
		p = new THREE.Mesh(
			new THREE.CubeGeometry( 1, 1, 1 ),
			new THREE.MeshBasicMaterial({
				color: 0xffffff
			})
		);
		layerManager.addObject3dToLayer( 'middleground', p );
		projectiles.release( p );
	}


	mouseHandler.addLeftMouseDownListener( fire );
}



function checkCollision( obj ) {
	for( var i = 0; i < enemies.length; ++i ) {
		if( obj.position.distanceTo( enemies[i].position ) < 20 ) {
			++score;
			enemies[i].visible = false;
			return true;
		}
	}

}

function makeEnemies() {
	var enemy = new THREE.Mesh(
		new THREE.CubeGeometry( 10, 10, 10 ),
		new THREE.MeshBasicMaterial({
			color: 0xffffff
		})
	);

	enemies.push( enemy );

	enemy.position.set(
		1000 - Math.random() * 2000,
		1000 - Math.random() * 2000,
		1000 - Math.random() * 2000
	);

	layerManager.addObject3dToLayer( 'middleground', enemy );
}


function updateScore() {
	scoreEl.textContent = 'Score: ' + score;
}



function init() {
	// Initialize the renderer
	renderer.setLayerManager( layerManager );
	renderer.addToDOM();
	renderer.addStats( new Stats() );
	renderer.addPreRenderTickFunction( cameraControls.tick );

	renderer.addPreRenderTickFunction( updateScore );

	for( var i = 0; i < 1000; ++i ) {
		makeEnemies();
	}

	makeProjectiles();

	bindKeys();

	renderer.addToDOM();

	renderer.start();
}



function bindKeys() {
	var controls = CONFIG.controls,
		cam = cameraControls,
		handler = keyHandler;

	// Down
	handler.addKeyDownListener( controls.FORWARD, function() {
		cam.setForward( true );
	});

	handler.addKeyDownListener( controls.BACKWARD, function() {
		cam.setBackward( true );
	});

	handler.addKeyDownListener( controls.LEFT, function() {
		cam.setLeft( true );
	});

	handler.addKeyDownListener( controls.RIGHT, function() {
		cam.setRight( true );
	});

	handler.addKeyDownListener( controls.ROLL_LEFT, function() {
		cam.setRollLeft( true );
	});

	handler.addKeyDownListener( controls.ROLL_RIGHT, function() {
		cam.setRollRight( true );
	});


	// Up
	handler.addKeyUpListener( controls.FORWARD, function() {
		cam.setForward( false );
	});

	handler.addKeyUpListener( controls.BACKWARD, function() {
		cam.setBackward( false );
	});

	handler.addKeyUpListener( controls.LEFT, function() {
		cam.setLeft( false );
	});

	handler.addKeyUpListener( controls.RIGHT, function() {
		cam.setRight( false );
	});

	handler.addKeyUpListener( controls.ROLL_LEFT, function() {
		cam.setRollLeft( false );
	});

	handler.addKeyUpListener( controls.ROLL_RIGHT, function() {
		cam.setRollRight( false );
	});
}
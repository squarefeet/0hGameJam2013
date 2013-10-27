function Renderer( opts ) {

	var options = {
		width: window.innerWidth,
		height: window.innerHeight,
		elementWidth: window.innerWidth,
		elementHeight: window.innerHeight,
		parent: document.body,

		// Renderer settings
		antialias: true,
		alpha: true,
		precision: 'highp',
		stencil: true,
		preserveDrawingBuffer: false,
		clearColor: 0x000000,
		clearAlpha: 0.1,
		maxLights: 4,
		faceCulling: 0,
		autoClear: false,
		gammaInput: false,
		gammaOutput: false,
		physicallyBasedShading: false
	};

	if( typeof opts === 'object' ) {
		for( var i in opts ) {
			options[ i ] = opts[ i ];
		}
	}

	// Nullify opts for GC.
	opts = null;
	i = null;


	// Some useful variables...
	var isRendering = 0,
		deltaTime = 0,
		layerManager = null,
		statsInstance = null,
		postProcesses = null,
		preTicks = [],
		numPreTicks = 0;




	// Setup the renderer
	var renderer = new THREE.WebGLRenderer({
		antialias: 				options.antialias,
		alpha: 					options.alpha,
		precision: 				options.precision,
		stencil: 				options.stencil,
		preserveDrawingBuffer: 	options.preserveDrawingBuffer,
		maxLights: 				options.maxLights,
	});

	renderer.setFaceCulling( options.faceCulling );
	renderer.setClearColor( options.clearColor );
	renderer.setSize( options.width, options.height );
	renderer.domElement.style.width = options.elementWidth + 'px';
	renderer.domElement.style.height = options.elementHeight + 'px';
	renderer.autoClear = options.autoClear;
	renderer.gammaInput = options.gammaInput;
	renderer.gammaOutput = options.gammaOutput;
	renderer.physicallyBasedShading = options.physicallyBasedShading;

	// Setup the clock
	var clock = new THREE.Clock(),
		cumulativeDt = 0,
		layers = null,
		numLayers = 0,
		renderTarget, composer;


	// Utilities
	var setLayerManager = function( manager ) {
		layerManager = manager;
		layers = layerManager.getLayers();
		numLayers = layers.length;
	};

	var addStats = function( stats ) {
		var el = stats.domElement,
			style = el.style;

		style.position = 'absolute';
		style.top = '0px';
		style.left = '0px';
		style.zIndex = '999999';
		options.parent.appendChild( el );

		statsInstance = stats;
	};

	var addToDOM = function() {
		options.parent.appendChild( renderer.domElement );
	};

	var addPreRenderTickFunction = function( fn ) {
		if( typeof fn === 'function' ) {
			preTicks.push( fn );
			numPreTicks = preTicks.length;
		}
	};


	// Create start/stop/animate
	var start = function() {
		if( isRendering === 0 && layerManager !== null ) {
			isRendering = 1;
			requestAnimationFrame( animate );
		}
	};

	var stop = function() {
		if( isRendering === 1 ) {
			isRendering = 0;
		}
	};

	var animate = function() {
		if( isRendering === 0 ) return;

		requestAnimationFrame( animate );
		render();
	};



	var render = function( ) {
		var layers = layerManager.getLayers(),
			i = 0, il = layers.length,
			layer, scene, camera;

		deltaTime = clock.getDelta();

		if( statsInstance ) {
			statsInstance.update();
		}

		if( !options.autoClear ) {
			renderer.clear(true, true, true);
		}

		for( i; i < numPreTicks; ++i ) {
			preTicks[i]( deltaTime );
		}




		for( i = 0; i < il; ++i ) {
			layer = layers[i];

			renderer.render( layer.scene, layer.camera );

			if( !options.autoClear ) {
				renderer.clear( false, true, false );
			}
		}

        layers = null;
        i = null;
        il = null;
        layer = null;
        scene = null;
        camera = null;
	};



	var enablePostProcessing = function() {
		// Get window width & height values, find the largest,
		// then round that largest value to the nearest
		// power of two.
		var w = window.innerWidth,
			h = window.innerHeight,
			max = Math.max( w, h );

		max = utils.roundToNearestPowerOfTwo( max );

		renderTarget = new THREE.WebGLRenderTarget( max, max, {
			minFilter: THREE.LinearFilter,
        	magFilter: THREE.LinearFilter,
        	format: THREE.RGBAFormat,
        	stencilBuffer: true,
        	depthBuffer: true
    	});

    	layerManager.createComposerLayer();
	};


	// Expose certain functions
	this.start = start;
	this.stop = stop;
	this.setLayerManager = setLayerManager;
	this.addStats = addStats;
	this.addToDOM = addToDOM;
	this.addPreRenderTickFunction = addPreRenderTickFunction;
	this.enablePostProcessing = enablePostProcessing;
}

Renderer.prototype.setBloomLevel = function( level ) {
    this.bloomLevel = level;
    this.bloomPass.materialCopy.uniforms.opacity.value = level;
};

Renderer.prototype.renderHit = function() {
    this.setBloomLevel( 5 );
    this.rampBloom = true;
};
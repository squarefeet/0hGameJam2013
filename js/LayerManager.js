function LayerManager( opts ) {

	var options = {
		layers: null,
		layerOrder: [],

		fov: 75,
		aspect: window.innerWidth / window.innerHeight,
		near: 0.1,
		far: 100000
	};

	if( opts ) {
		for( var i in opts ) {
			options[i] = opts[i];
		}
	}


	// Mark opts for GC.
	opts = null;
	i = null;


	// Useful variables...
	var layers = {},
		store = {},
		particleWeaponColliders = [],
		geometryWeaponColliders = [],
		gameObjectColliders = [],
		targetableObjects = [],
		layerCache = [];


	// Layer creator
	var createLayer = function( name, settings ) {
		var layer = {};

		layer.scene = new THREE.Scene();
		layer.camera = new THREE.PerspectiveCamera(
			options.fov,
			options.aspect,
			options.near,
			options.far
		);
		layer.tick = null;

		if( settings ) {
			layer.camera.__updatePosition = !!settings.updatePosition;
			layer.camera.__updateRotation = !!settings.updateRotation;
		}

		layers[ name ] = layer;
		store[ name ] = [];
	};

	var createComposerLayer = function() {
		var composerScene = new THREE.Scene(),
			composerCamera = new THREE.PerspectiveCamera(
				options.fov,
				1,
				options.near,
				options.far
			),
			composerQuad = new THREE.PlaneGeometry();
	};

	var addFogToLayer = function( layerName, color, dropoff ) {
		layers[ layerName ].scene.fog = new THREE.FogExp2( color, dropoff );
	};


	// Utils...
	var addObject3dToLayer = function( layerName, obj ) {
		store[ layerName ].push( obj );
		layers[ layerName ].scene.add( obj );
	};

	var addObjectToLayer = function( layerName, obj ) {
		var obj3d = obj.renderables,
			s = store[ layerName ],
			l = layers[ layerName ].scene;

		for( var i = 0; i < obj3d.length; ++i ) {
			s.push( obj3d[ i ] );
			l.add( obj3d[ i ] );
		}

		if( obj.collideWithParticleWeapons ) {
			particleWeaponColliders.push( obj );
		}
		if( obj.collideWithGeometryWeapons ) {
			geometryWeaponColliders.push( obj );
		}
		if( obj.collideWithGameObjects ) {
			gameObjectColliders.push( obj );
		}
		if( obj.targetable ) {
			targetableObjects.push( obj );
		}

		obj3d = null;
		i = null;
		s = null;
		l = null;
	};

	var addCollider = function( obj ) {
		if( obj.collideWithParticleWeapons ) {
			particleWeaponColliders.push( obj );
		}
		if( obj.collideWithGeometryWeapons ) {
			geometryWeaponColliders.push( obj );
		}
		if( obj.collideWithGameObjects ) {
			gameObjectColliders.push( obj );
		}
		if( obj.targetable ) {
			targetableObjects.push( obj );
		}
	};

	var getRenderablesForLayer = function( layerName ) {
		return store[ layerName ];
	};

	var getLayers = function() {
		return layerCache;
	};

	var getLayerWithName = function( layerName ) {
		return layers[ layerName ];
	};

	var getStoreWithName = function( layerName ) {
		return store[ layerName ];
	};

	var getAllCameras = function() {
		var cams = [];

		for( var i in layers ) {
			cams.push( layers[i].camera );
		}

		return cams;
	};


	var getParticleWeaponColliders = function() {
		return particleWeaponColliders;
	};
	var getGeometryWeaponColliders = function() {
		return geometryWeaponColliders;
	};
	var getGameObjectColliders = function() {
		return gameObjectColliders;
	};
	var getTargetableObjects = function() {
		return targetableObjects;
	};


	// Camera helpers
	var setCameraPositionForLayer = function( layerName, x, y, z ) {
		var camera = layers[ layerName ].camera;
		camera.position.x = x;
		camera.position.y = y;
		camera.position.z = z;
	};

	var setCameraRotationForLayer = function( layerName, x, y, z, w ) {
		var camera = layers[ layerName ].camera;

		// if( camera.useQuaternion ) {
			camera.quaternion.x = x;
			camera.quaternion.y = y;
			camera.quaternion.z = z;
			camera.quaternion.w = w;
		// }
		// else {
		// 	camera.rotation.x = x;
		// 	camera.rotation.y = y;
		// 	camera.rotation.z = z;
		// }
	};

	var setCameraLookAtForLayer = function( layerName, vector ) {
		layers[ layerName ].camera.lookAt( vector );
	};


	var deallocateAll = function() {
		for( var i = 0; i < options.layerOrder.length; ++i ) {
			var scene = layers[ options.layerOrder[i] ].scene;

			scene.traverse(function( child ) {
				console.log(child);
			});
		}
	};


	for( var i in options.layers) {
		createLayer( i, options.layers[ i ] );
	}

	for( var i = 0; i < options.layerOrder.length; ++i ) {
		layerCache.push( layers[ options.layerOrder[i] ] );
	}




	this.addObjectToLayer = addObjectToLayer;
	this.addObject3dToLayer = addObject3dToLayer;
	this.addFogToLayer = addFogToLayer;
	this.getRenderablesForLayer = getRenderablesForLayer;
	this.getLayers = getLayers;
	this.getLayerWithName = getLayerWithName;
	this.getStoreWithName = getStoreWithName;
	this.setCameraRotationForLayer = setCameraRotationForLayer;
	this.setCameraPositionForLayer = setCameraPositionForLayer;
	this.setCameraLookAtForLayer = setCameraLookAtForLayer;
	this.getAllCameras = getAllCameras;
	this.getParticleWeaponColliders = getParticleWeaponColliders;
	this.getGeometryWeaponColliders = getGeometryWeaponColliders;
	this.getGameObjectColliders = getGameObjectColliders;
	this.getTargetableObjects = getTargetableObjects;
	this.addCollider = addCollider;
}
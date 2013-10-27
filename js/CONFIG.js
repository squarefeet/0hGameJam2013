var CONFIG = {

    // Performance
    resolutionScaling: 1.5,

    frameRateLimit: 1/70,

    drawBoundingBoxes: false,

    keyMap: {
        'tab': 9
    },

    keyMapPreventDefaults: [ 'tab' ],

    target: {
        minSize: 50,
        maxSize: 1500
    },

	// Controls
	controls: {
		UP: 'r',
		DOWN: 'f',
		LEFT: 'a',
		RIGHT: 'd',
		ROLL_LEFT: 'q',
		ROLL_RIGHT: 'e',
		FORWARD: 'w',
		BACKWARD: 's',
		TARGET: 't',
		CHAT: 'y',
		TEAM_CHAT: 'u'
	},

    cameraControls: {
        positionVelocityIncrement: 10,
        positionVelocityDecrement: 0.99,

        rotationDamping: 50 * 0.016,

        rollVelocityIncrement: 0.05,
        rollVelocityDecrement: 0.95,

        maxPositionVelocity: 1000,
        maxRotationVelocity: 1000,
        maxRollVelocity: 2
    },

	// Should the ship automatically decelerate if !FORWARD && !BACKWARD keys
	// are pressed?
	automaticShipDeceleration: true,

	layerManager: {
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
	},


	assetLoader: {
		models: [

	    ],
		textures: [

	    ],

		parent: document.body,
	},


	layers: {

	},


};
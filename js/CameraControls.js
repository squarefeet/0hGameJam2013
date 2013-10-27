function CameraControls( opts ) {
	var options = {
		keyboardHandler: null,
		mouseHandler: null,
		targetCameras: null,

		positionVelocityIncrement: 10,
		positionVelocityDecrement: 0.99,

		rotationDamping: 50,

		rollVelocityIncrement: 0.05,
		rollVelocityDecrement: 0.95,

		maxPositionVelocity: 1000,
		maxRotationVelocity: 1000,
		maxRollVelocity: 2
	};

	if( opts ) {
		for( var i in opts ) {
			options[i] = opts[i];
		}
	}


	var mouseX = 0,
		mouseY = 0,
		prevX = 0,
		prevY = 0,
		centerX = window.innerWidth/2,
		centerY = window.innerHeight/2,
		forward = false,
		back = false,
		left = false,
		right = false,
		rollLeft = false,
		rollRight = false,
		rollRotation = 0,
		yaw = 0,
		pitch = 0,
		rotationVector = new THREE.Vector3(),
		rotationVectorLerp = new THREE.Vector3(),
		rotationQuaternion = new THREE.Quaternion(),
		positionVector = new THREE.Vector3(),
		cameraQuaternion = new THREE.Quaternion(),
		hasInput = !!(options.keyboardHandler && options.mouseHandler),
		controls = CONFIG.controls;

	// for(var i in this) {
	// 	if(typeof this[i] === 'function') {
	// 		this[i] = this[i].bind(this);
	// 	}
	// }


	var updateRotation = function( dt ) {
		var inc = options.rollVelocityIncrement,
			dec = options.rollVelocityDecrement,
			max = options.maxRollVelocity;

		if( rollLeft ) {
			rollRotation += inc;
		}
		else if( rollRight ) {
			rollRotation -= inc;
		}
		else {
			rollRotation *= dec;
		}


		if( rollRotation > max ) {
			rollRotation = max;
		}
		else if( rollRotation < -max ) {
			rollRotation = -max;
		}

		if( centerX && centerY ) {
			rotationVector.y = (-(mouseX - centerX) / centerX) / options.rotationDamping;
			rotationVector.x = (-(mouseY - centerY) / centerY) / options.rotationDamping;
		}

		// rotationVectorLerp.y = (prevX - mouseX) / (options.rotationDamping * 8);
		// rotationVectorLerp.x = (prevY - mouseY) / (options.rotationDamping * 8);
		// rotationVector.lerp( rotationVectorLerp, 0.05 );

		inc = null;
		dec = null;
		max = null;
	};



	var updatePosition = function( dt ) {
		var inc = options.positionVelocityIncrement,
			dec = options.positionVelocityDecrement,
			max = options.maxPositionVelocity;

		if( forward ) {
			positionVector.z -= inc;
		}
		else if( back ) {
			positionVector.z += inc;
		}
		else if( CONFIG.automaticShipDeceleration ) {
			positionVector.z *= dec;
		}

		if( left ) {
			positionVector.x -= inc;
		}
		else if( right ) {
			positionVector.x += inc;
		}
		else {
			positionVector.x *= dec;
		}


		if( positionVector.z > max ) {
			positionVector.z = max;
		}
		else if( positionVector.z < -max ) {
			positionVector.z = -max;
		}

		if( positionVector.x > max ) {
			positionVector.x = max;
		}
		else if( positionVector.x < -max ) {
			positionVector.x = -max;
		}

		positionVector.y *= dec;

		inc = null;
		dec = null;
		max = null;
	};


	var updateSingleCamera = function( cam, x, y, z ) {
		if( cam.__updatePosition ) {
			cam.translateX( x );
			cam.translateY( y );
			cam.translateZ( z );
		}
	};


	var updateCameras = function( dt ) {
		var velX = positionVector.x * dt,
			velY = positionVector.y * dt,
			velZ = positionVector.z * dt,
			roll = rollRotation * dt,
			cams = options.targetCameras,
			numCams = cams.length,
			i;

		rotationQuaternion.set(
			rotationVector.x * dt,
			rotationVector.y * dt,
			roll,
			1
		).normalize();

		cameraQuaternion.multiply( rotationQuaternion );

		for( i = 0; i < numCams; ++i ) {
			updateSingleCamera( cams[i], velX, velY, velZ );
		}

		velX = null;
		velY = null;
		velZ = null;
		roll = null;
		cams = null;
		numCams = null;
		i = null;
	};


	var handleInput = function() {
		var m = options.mouseHandler,
			k = options.keyboardHandler;

		mouseX = m.x;
		mouseY = m.y;
		centerX = m.centerX;
		centerY = m.centerY;
	};



	for( var i = 0; i < options.targetCameras.length; ++i ) {
		if( options.targetCameras[i].__updateRotation ) {
			options.targetCameras[i].quaternion = cameraQuaternion;
		}
	}




	this.tick = function( dt ) {
		if( hasInput ) {
			handleInput();
		}

		updateRotation( dt );
		updatePosition( dt );
		updateCameras( dt );

		prevX = mouseX;
		prevY = mouseY;
	};



	this.set = function() {};

	this.setForward = function( state ) {
		forward = state;
	};
	this.setBackward = function( state ) {
		back = state;
	};
	this.setLeft = function( state ) {
		left = state;
	};
	this.setRight = function( state ) {
		right = state;
	};
	this.setRollLeft = function( state ) {
		rollLeft = state;
	};
	this.setRollRight = function( state ) {
		rollRight = state;
	};
	this.setX = function( state ) {
		mouseX = state;
	};
	this.setY = function( state ) {
		mouseY = state;
	};
	this.setCenterX = function( state ) {
		centerX = state;
	};
	this.setCenterY = function( state ) {
		centerY = state;
	};


	this.getCameraRotation = function() {
		return cameraQuaternion;
	};

	this.getVelocity = function() {
		return positionVector;
	};

	this.getPositionForCamera = function( cameraIndex ) {
		return options.targetCameras[ cameraIndex ].position;
	};

	this.getForwardSpeedAsPercentage = function() {
		return positionVector.z / options.maxPositionVelocity;
	};

	this.getAbsoluteForwardSpeedAsPercentage = function() {
		return Math.abs(positionVector.z) / options.maxPositionVelocity;
	};
}
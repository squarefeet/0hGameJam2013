function AssetLoader( opts ) {
    this.options = {
        models: null,
        images: null,
        textures: null,
        fonts: null,
        sounds: null,
        parent: document.body,

        onModelsLoaded: null,
        onImagesLoaded: null,
        onTexturesLoaded: null,
        onFontsLoaded: null,
        onSoundsLoaded: null,
        onAllLoaded: null,

        events: null
    };

    if( opts ) {
        for( var i in opts ) {
            this.options[i] = opts[i];
        }
    }

    this.colladaLoader = new THREE.ColladaLoader();

    this.loaded = {
        models: {},
        images: {},
        textures: {},
        fonts: {},
        sounds: {}
    };

    this.domElement = document.createElement('div');

    this._makeLoaderElements();

    this.options.parent.appendChild( this.domElement );

    // Bind scope
    for(var i in this) {
        if( typeof this[i] === 'function' ) {
            this[i] = this[i].bind( this );
        }
    }
}


AssetLoader.prototype = {
    _makeLoaderElements: function() {
        var parent = this.domElement,
            loaderWrapper = document.createElement('div'),
            assetType = document.createElement('div'),
            assetCounter = document.createElement('p'),
            progressWrapper = document.createElement('div'),
            progressBar = document.createElement('div');

        loaderWrapper.className = 'loaderWrapper';
        assetCounter.className = 'assetCounter';
        progressWrapper.className = 'progressWrapper';
        progressBar.className = 'progressBar';

        progressWrapper.appendChild( progressBar );

        loaderWrapper.appendChild( assetCounter );
        loaderWrapper.appendChild( progressWrapper );
        this.domElement.appendChild( loaderWrapper );

        this.elements = {};
        this.elements.assetCounter = assetCounter;
        this.elements.progressBar = progressBar;
    },

    deallocateAll: function() {

    },

    loadAll: function() {

        var that = this,
            toLoad = [
                this.options.models,
                this.options.images,
                this.options.textures,
                this.options.fonts,
                this.options.sounds
            ],
            fns = [
                this.loadModels,
                this.loadImages,
                this.loadTextures,
                this.loadFonts,
                this.loadSounds
            ],
            i = 0,
            il = toLoad.length;

        function loadNext() {
            var fn = fns[i],
                assets = toLoad[i];

            ++i;

            if(i === il) {
                that.options.events.trigger( 'ASSET_LOADER:allLoaded', that.loaded );
            }
            else if(assets && assets.length) {
                setTimeout(function() {
                    fn.call(that, loadNext);
                }, 250);
            }
            else {
                loadNext();
            }
        }

        loadNext();

    },


    loadModels: function( cb ) {
        var models = this.options.models,
            that = this,
            i = 0, il = models.length,
            progressBar = that.elements.progressBar;

        function loadCollada( model ) {
            that.elements.assetCounter.innerHTML = '<span>Loading models...</span><span>' + i + '/' + il + '</span>';
            ++i;

            that.colladaLoader.load(
                model,
                function( collada ) {
                    var dae = collada.scene,
                        skin = collada.skins[ 0 ];

                    dae.updateMatrix();

                    that.loaded.models[ model ] = {
                        dae: dae,
                        skin: skin
                    };

                    if(i < il) {
                        setTimeout(function() {
                            loadCollada( models[i] );
                        }, 50);
                    }
                    else if( typeof cb === 'function' ) {
                        cb();
                    }
                    else if( typeof that.options.onModelsLoaded === 'function' ) {
                        that.options.events.trigger( 'ASSET_LOADER:modelsLoaded', that.loaded.models );
                    }

                    collada = null;
                },
                function( progress ) {
                    progressBar.style.width = ((100 / +progress.total) * progress.loaded) + '%';
                }
            );
        }

        loadCollada( models[i] );
    },

    loadImages: function( cb ) {

    },

    loadTextures: function( cb ) {
        var images = this.options.textures,
            that = this,
            i = 0, il = images.length,
            progressBar = that.elements.progressBar,
            emptyObj = {};


        function loadImage( image ) {
            that.elements.assetCounter.innerHTML = '<span>Loading textures...</span><span>' + i + '/' + il + '</span>';
            ++i;

            THREE.ImageUtils.loadTexture(
                image,
                emptyObj,
                function( tex ) {
                    that.loaded.textures[ image ] = tex;

                    if(i < il) {
                        setTimeout(function() {
                            loadImage( images[i] );
                        }, 50);
                    }
                    else if( typeof cb === 'function' ) {
                        cb();
                    }
                    else if( typeof that.onTexturesLoaded === 'function') {
                        that.options.events.trigger( 'ASSET_LOADER:texturesLoaded', that.loaded.textures );
                    }
                }
            );
        }

        loadImage( images[i] );
    },

    loadFonts: function() {

    },

    loadSounds: function() {

    }
};
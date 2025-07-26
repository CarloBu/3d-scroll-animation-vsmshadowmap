import * as THREE from 'three';

/**
 * Candy Style Materials
 */
const candyMaterials = {
	blue: new THREE.MeshPhongMaterial({
		color: '#218fb0',
		specular: '#ffffff',
		shininess: 1,
		emissive: '#0a1a1f',
		emissiveIntensity: 1,
		flatShading: false,
	}),
	orange: new THREE.MeshPhongMaterial({
		color: '#ff6d46',
		specular: '#ffffff',
		shininess: 1,
		emissive: '#330a0a',
		emissiveIntensity: 1,
		flatShading: false,
	}),
	pink: new THREE.MeshPhongMaterial({
		color: '#ff6d46',
		specular: '#ffffff',
		shininess: 1,
		emissive: '#331a0f',
		emissiveIntensity: 1,
		flatShading: false,
	}),
	lightBlue: new THREE.MeshPhongMaterial({
		color: '#61b4d1',
		specular: '#ffffff',
		shininess: 1,
		emissive: '#0f1a21',
		emissiveIntensity: 1,
		flatShading: false,
	}),
	// Frosted glass material for the cup with transmission
	frostedGlass: new THREE.MeshPhysicalMaterial({
		color: '#9deffe',
		metalness: 0,
		roughness: 100,
		transmission: 0.75,
		thickness: 0,
		opacity: 1,
		clearcoat: 1.0,
		clearcoatRoughness: 0.1,
		ior: 1.5,
		reflectivity: 0.25,
	}),
};

/**
 * Three.js Scene Manager
 */
class ThreeScene {
	constructor(canvas) {
		this.canvas = canvas;
		this.sizes = {
			width: window.innerWidth,
			height: window.innerHeight,
		};

		this.setupScene();
		this.setupCamera();
		this.setupRenderer();
		this.setupEventListeners();
	}

	/**
	 * Setup the Three.js scene
	 */
	setupScene() {
		this.scene = new THREE.Scene();
		this.scene.background = new THREE.Color('#7ca2b4');
	}

	/**
	 * Setup initial camera (will be replaced by GLB camera)
	 */
	setupCamera() {
		this.camera = new THREE.PerspectiveCamera(
			75,
			this.sizes.width / this.sizes.height,
			0.1,
			1000
		);
		this.camera.position.set(0, 0, 5); // Temporary position
	}

	/**
	 * Setup the renderer
	 */
	setupRenderer() {
		this.renderer = new THREE.WebGLRenderer({
			canvas: this.canvas,
			antialias: true,
		});
		this.renderer.setSize(this.sizes.width, this.sizes.height);
		this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
		this.renderer.shadowMap.enabled = true;
		this.renderer.shadowMap.type = THREE.VSMShadowMap; // Variance Shadow Maps for softer shadows
		this.renderer.outputColorSpace = THREE.SRGBColorSpace;
		this.renderer.toneMapping = THREE.ACESFilmicToneMapping;
		this.renderer.toneMappingExposure = 0.5;
	}

	/**
	 * Setup window resize event listener
	 */
	setupEventListeners() {
		window.addEventListener('resize', () => {
			this.sizes.width = window.innerWidth;
			this.sizes.height = window.innerHeight;

			this.updateCameraForAspectRatio();
			this.camera.updateProjectionMatrix();

			this.renderer.setSize(this.sizes.width, this.sizes.height);
			this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
		});
	}

	/**
	 * Update camera FOV based on aspect ratio to maintain horizontal field of view
	 */
	updateCameraForAspectRatio() {
		const aspect = this.sizes.width / this.sizes.height;
		this.camera.aspect = aspect;

		// If we have the original FOV stored (from GLB), use it as base
		const baseFov = this.camera.originalFov || 75;
		const baseAspect = 16 / 9; // Assume original was designed for 16:9

		// Calculate horizontal FOV from the original vertical FOV and aspect ratio
		const baseFovRad = (baseFov * Math.PI) / 180;
		const baseHorizontalFov =
			2 * Math.atan(Math.tan(baseFovRad / 2) * baseAspect);

		// Calculate the vertical FOV needed to maintain the same horizontal FOV
		const targetVerticalFovRad =
			2 * Math.atan(Math.tan(baseHorizontalFov / 2) / aspect);
		this.camera.fov = (targetVerticalFovRad * 180) / Math.PI;

		// Clamp FOV to reasonable limits
		this.camera.fov = Math.min(this.camera.fov, 150); // Increased max for narrow screens
		this.camera.fov = Math.max(this.camera.fov, 20); // Min 20 degrees
	}

	/**
	 * Apply materials to objects based on their names
	 * @param {THREE.Scene} scene - Scene to apply materials to
	 */
	applyMaterialsToObjects(scene) {
		scene.traverse((child) => {
			if (child.isMesh) {
				const name = child.name.toLowerCase();

				// Apply blue material to boxes and platforms
				if (
					name.includes('box1') ||
					name.includes('box2') ||
					name.includes('box3') ||
					name.includes('box4') ||
					name.includes('box5')
				) {
					child.material = candyMaterials.blue;
					child.castShadow = true;
					child.receiveShadow = true;
				}

				// Platforms receive shadows but don't cast (act as shadow receivers)
				else if (name.includes('platform1') || name.includes('platform2')) {
					child.material = candyMaterials.blue;
					child.castShadow = true;
					child.receiveShadow = true;
				}

				// Apply orange material to ball and cylinder - main shadow casters
				else if (name.includes('ball') || name.includes('cylinder')) {
					child.material = candyMaterials.orange;
					child.castShadow = true;
					child.receiveShadow = true;
				}

				// Apply frosted glass material to cup - creates blur behind mesh effect
				else if (name.includes('cup')) {
					child.material = candyMaterials.frostedGlass;
					child.castShadow = true;
					child.receiveShadow = true;
				}

				// Apply light blue material to wall - main shadow receiver
				else if (name.includes('wall')) {
					child.material = candyMaterials.lightBlue;
					child.castShadow = false;
					child.receiveShadow = true;
				}

				// Default shiny candy material for other objects
				else {
					child.material = new THREE.MeshPhongMaterial({
						color: child.material.color || '#cccccc',
						specular: '#ffffff',
						shininess: 80,
						emissive: '#1a1a1a',
						emissiveIntensity: 0.05,
						flatShading: false,
					});
					child.castShadow = true;
					child.receiveShadow = true;
				}
			}
		});
	}

	/**
	 * Set camera from GLB scene
	 * @param {THREE.Camera} gltfCamera - Camera from GLB file
	 */
	setCameraFromGLTF(gltfCamera) {
		this.camera = gltfCamera;
		// Store the original FOV for aspect ratio calculations
		if (!this.camera.originalFov) {
			this.camera.originalFov = this.camera.fov;
		}
		this.updateCameraForAspectRatio();
		this.camera.far = 3000; // Set far clipping plane to 3000
		this.camera.updateProjectionMatrix();
	}

	/**
	 * Render the scene
	 */
	render() {
		this.renderer.render(this.scene, this.camera);
	}

	/**
	 * Get postprocessing controls
	 * @returns {Object} Postprocessing controls
	 */
	getPostprocessingControls() {
		return {
			setContrast: (value) => {
				this.renderer.toneMappingExposure = value;
			},
			getContrast: () => this.renderer.toneMappingExposure,
		};
	}

	/**
	 * Get the scene
	 * @returns {THREE.Scene} The Three.js scene
	 */
	getScene() {
		return this.scene;
	}

	/**
	 * Get the camera
	 * @returns {THREE.Camera} The Three.js camera
	 */
	getCamera() {
		return this.camera;
	}

	/**
	 * Get the renderer
	 * @returns {THREE.WebGLRenderer} The Three.js renderer
	 */
	getRenderer() {
		return this.renderer;
	}
}

export default ThreeScene;

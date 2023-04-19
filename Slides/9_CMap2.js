import Slide from './Slide.js';

import * as THREE from '../CMapJS/Libs/three.module.js';
import {OrbitControls} from '../CMapJS/Libs/OrbitsControls.js';
import Renderer from '../CMapJS/Rendering/Renderer.js';
import RendererDarts from '../CMapJS/Rendering/RendererDarts.js';
import {Clock} from '../CMapJS/Libs/three.module.js';
import CMap1 from '../CMapJS/CMap/CMap1.js'
import CMap2 from '../CMapJS/CMap/CMap2.js'
import {octahedron_off} from '../Files/off_files.js'
import {loadCMap2} from '../CMapJS/IO/SurfaceFormats/CMap2IO.js';
import {glRenderer} from './parameters.js';

let ambiant_light_int = 0.4;
let point_light_int = 0.6;

export const slide_cmap2 = new Slide(
	function(DOM_input)
	{
		this.camera = new THREE.PerspectiveCamera(45, DOM_input.width / DOM_input.height, 0.01, 10.0);
		this.camera.position.set(0.7, 0.5, 1.5);


		const context_input = DOM_input.getContext('2d');
		const orbit_controls_input = new OrbitControls(this.camera, DOM_input);

		const cmap2 = loadCMap2("off", octahedron_off);


		const renderer = new Renderer(cmap2);
		renderer.vertices.create();
		renderer.edges.create();

		const rendererDarts = new RendererDarts(cmap2);
		rendererDarts.faces.create({wireframe: true});

		this.scene = new THREE.Scene()
		const ambiantLight = new THREE.AmbientLight(0xFFFFFF, ambiant_light_int);
		const pointLight = new THREE.PointLight(0xFFFFFF, point_light_int);
		pointLight.position.set(10,8,15);

		renderer.vertices.addTo(this.scene);
		renderer.edges.addTo(this.scene);
		this.scene.add(pointLight);
		this.scene.add(ambiantLight);
		rendererDarts.faces.addTo(this.scene)

		// this.group = new THREE.Group;
		// this.scene.add(this.group);


		this.clock = new Clock(true);
		this.time = 0;

		this.loop = function(){
			if(this.running){
				this.time += this.clock.getDelta();
				// this.group.setRotationFromAxisAngle(axis, Math.PI / 90 * this.time);

				glRenderer.setSize(DOM_input.width, DOM_input.height);
				glRenderer.render(this.scene, this.camera);
				context_input.clearRect(0, 0, DOM_input.width, DOM_input.height);
				context_input.drawImage(glRenderer.domElement, 0, 0)

				requestAnimationFrame(this.loop.bind(this));
			}
		}
	});
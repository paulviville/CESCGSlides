import Slide from './Slide.js';

import * as THREE from '../CMapJS/Libs/three.module.js';
import {OrbitControls} from '../CMapJS/Libs/OrbitsControls.js';
import Renderer from '../CMapJS/Rendering/Renderer.js';
import {Clock} from '../CMapJS/Libs/three.module.js';
import CMap0 from '../CMapJS/CMap/CMap0.js'
import {glRenderer} from './parameters.js';

let ambiant_light_int = 0.4;
let point_light_int = 0.6;

export const slide_cmap0 = new Slide(
	function(DOM_input)
	{
		this.camera = new THREE.PerspectiveCamera(45, DOM_input.width / DOM_input.height, 0.01, 10.0);
		this.camera.position.set(0, 0, 2);


		const context_input = DOM_input.getContext('2d');
		const orbit_controls_input = new OrbitControls(this.camera, DOM_input);

		const axis = new THREE.Vector3(0, 1, 0);
		const axis1 = new THREE.Vector3(0, 0, 1);
		const cmap0 = new CMap0;
		cmap0.createEmbedding(cmap0.vertex);
		const position = cmap0.addAttribute(cmap0.vertex, "position");
		for(let i = 0; i < 350; ++i) {
			const d = cmap0.newDart();
			const vid = cmap0.setEmbedding(cmap0.vertex, d, cmap0.newCell(cmap0.vertex));
			const r0 = new THREE.Vector3(0.35, 0, 0);
			const r1 = new THREE.Vector3(0, 0.15, 0);
			
			r1.applyAxisAngle(axis1, 2*Math.PI*Math.random())
			r0.add(r1);
			r0.applyAxisAngle(axis, 2*Math.PI*Math.random())
			position[vid] = new THREE.Vector3().add(r0);
		}


		const renderer = new Renderer(cmap0);
		renderer.vertices.create();


		this.scene = new THREE.Scene()
		const ambiantLight = new THREE.AmbientLight(0xFFFFFF, ambiant_light_int);
		const pointLight = new THREE.PointLight(0xFFFFFF, point_light_int);
		pointLight.position.set(10,8,15);

		renderer.vertices.addTo(this.scene);
		this.scene.add(pointLight);
		this.scene.add(ambiantLight);

		// this.group = new THREE.Group;
		// this.scene.add(this.group);


		this.clock = new Clock(true);
		this.time = 0;
		const axis2 = new THREE.Vector3(1, Math.random(), 1).normalize();

		this.loop = function(){
			if(this.running){
				this.time += this.clock.getDelta();
				this.scene.setRotationFromAxisAngle(axis2, Math.PI / 60 * this.time);

				glRenderer.setSize(DOM_input.width, DOM_input.height);
				glRenderer.render(this.scene, this.camera);
				context_input.clearRect(0, 0, DOM_input.width, DOM_input.height);
				context_input.drawImage(glRenderer.domElement, 0, 0)

				requestAnimationFrame(this.loop.bind(this));
			}
		}
	});
import Slide from './Slide.js';

import * as THREE from '../CMapJS/Libs/three.module.js';
import {OrbitControls} from '../CMapJS/Libs/OrbitsControls.js';
import Renderer from '../CMapJS/Rendering/Renderer.js';
import RendererDarts from '../CMapJS/Rendering/RendererDarts.js';
import {loadCMap2} from '../CMapJS/IO/SurfaceFormats/CMap2IO.js';
import {Clock} from '../CMapJS/Libs/three.module.js';

import {glRenderer, ambiantLightInt, pointLightInt} from './parameters.js';

import {cube_off} from '../Files/off_files.js'
import {cutAllEdges, quadrangulateAllFaces} from '../CMapJS/Utils/Subdivision.js';
import { catmullClark_inter} from '../CMapJS/Modeling/Subdivision/Surface/CatmullClark.js'
import catmullClark from '../CMapJS/Modeling/Subdivision/Surface/CatmullClark.js'


export const slide_subdivision = new Slide(
	function(DOM_Subdivision0, DOM_Subdivision1, DOM_Subdivision2, DOM_Subdivision3, DOM_Subdivision4)
	{
		this.camera = new THREE.PerspectiveCamera(45, DOM_Subdivision0.width / DOM_Subdivision0.height, 0.1, 1000.0);
		this.camera.position.set(0.9, 0.75, 1.95);
		const surfaceLayer = 0;
		const skelLayer = 1;
		const skelAdLayer = 2;
		const scafLayer = 3;
		const rawLayer = 4;
		const meshLayer = 6;

		const layer0 = 0;
		const layer1 = 1;
		const layer2 = 2;
		const layer3 = 3;
		const layer4 = 4;
		const layer5 = 5;

		const context0 = DOM_Subdivision0.getContext('2d');
		const context1 = DOM_Subdivision1.getContext('2d');
		const context2 = DOM_Subdivision2.getContext('2d');
		const context3 = DOM_Subdivision3.getContext('2d');
		const context4 = DOM_Subdivision4.getContext('2d');

		const controlsHorse0 = new OrbitControls(this.camera, DOM_Subdivision0);
		const controlsHorse1 = new OrbitControls(this.camera, DOM_Subdivision1);
		const controlsHorse2 = new OrbitControls(this.camera, DOM_Subdivision2);
		const controlsHorse3 = new OrbitControls(this.camera, DOM_Subdivision3);
		const controlsHorse4 = new OrbitControls(this.camera, DOM_Subdivision4);

		this.scene = new THREE.Scene()
		const ambiantLight = new THREE.AmbientLight(0xFFFFFF, ambiantLightInt);
		const pointLight = new THREE.PointLight(0xFFFFFF, pointLightInt);
		pointLight.position.set(10,8,15);

		ambiantLight.layers.enable(surfaceLayer);
		pointLight.layers.enable(surfaceLayer);
		ambiantLight.layers.enable(skelLayer);
		pointLight.layers.enable(skelLayer);
		ambiantLight.layers.enable(scafLayer);
		pointLight.layers.enable(scafLayer);
		ambiantLight.layers.enable(rawLayer);
		pointLight.layers.enable(rawLayer);
		ambiantLight.layers.enable(meshLayer);
		pointLight.layers.enable(meshLayer);

		this.scene.add(pointLight);
		this.scene.add(ambiantLight);

		this.group = new THREE.Group;
		this.scene.add(this.group);


		const cube0 = loadCMap2('off', cube_off);
		const vertex = cube0.vertex;

		const renderer = new Renderer(cube0);
		renderer.edges.create({layer: layer5, color: 0x0000bb});
		renderer.edges.addTo(this.group);

		const cube1 = loadCMap2('off', cube_off);
		const pos1 = cube1.getAttribute(vertex, "position")
		cutAllEdges(cube1, vd => {
			let vid = cube1.cell(vertex, vd);
			pos1[vid] = new THREE.Vector3();
			cube1.foreachDartOf(cube1.vertex, vd, d => {
				pos1[vid].add(pos1[cube1.cell(vertex, cube1.phi2[d])]);
			});
			pos1[vid].multiplyScalar(0.5);
		})

		const cube2 = loadCMap2('off', cube_off);
		const pos2 = cube2.getAttribute(vertex, "position")
		quadrangulateAllFaces(cube2, 
			vd => {
	
				let vid = cube2.cell(vertex, vd);
				pos2[vid] = new THREE.Vector3();
				cube2.foreachDartOf(vertex, vd, d => {
					pos2[vid].add(pos2[cube2.cell(vertex, cube2.phi2[d])]);
				});
				pos2[vid].multiplyScalar(0.5);
			},
			vd => {
				let vid = cube2.cell(vertex, vd);
				let nbEdges = 0;
				pos2[vid] = new THREE.Vector3();
				cube2.foreachDartOf(vertex, vd, d => {
					pos2[vid].add(pos2[cube2.cell(vertex, cube2.phi2[d])]);
					++nbEdges;
				});
				pos2[vid].multiplyScalar(1 / nbEdges);
			});

		const cube3 = loadCMap2('off', cube_off);
		catmullClark(cube3);
		const cube4 = loadCMap2('off', cube_off);
		catmullClark_inter(cube4)

		// const renderer2 = new Renderer(cube4);
		// renderer2.edges.create({layer: layer5, color: 0x0000bb});
		// renderer2.edges.addTo(this.group);

		const rendererDarts0 = new RendererDarts(cube0);
		rendererDarts0.faces.create({wireframe: true, layer: layer0});
		rendererDarts0.faces.addTo(this.group)

		const rendererDarts1 = new RendererDarts(cube1);
		rendererDarts1.faces.create({wireframe: true, layer: layer1});
		rendererDarts1.faces.addTo(this.group)

		const rendererDarts2 = new RendererDarts(cube2);
		rendererDarts2.faces.create({wireframe: true, layer: layer2});
		rendererDarts2.faces.addTo(this.group)

		const rendererDarts3 = new RendererDarts(cube3);
		rendererDarts3.faces.create({wireframe: true, layer: layer3});
		rendererDarts3.faces.addTo(this.group)

		const rendererDarts4 = new RendererDarts(cube4);
		rendererDarts4.faces.create({wireframe: true, layer: layer4});
		rendererDarts4.faces.addTo(this.group)




		const axis = new THREE.Vector3(0, 1, 0);
		this.clock = new Clock(true);
		this.time = 0;

		this.on = 1;
		this.pause = function(){
			this.on = 1 - this.on;
		};

		this.loop = function(){
			if(this.running){
				glRenderer.setSize(DOM_Subdivision0.width, DOM_Subdivision0.height);
				this.time += this.clock.getDelta() * this.on;
				this.group.setRotationFromAxisAngle(axis, Math.PI/2 + Math.PI / 50 * this.time);
				
				this.camera.layers.enable(layer5);
				this.camera.layers.enable(layer0);
				glRenderer.render(this.scene, this.camera);
				context0.clearRect(0, 0, DOM_Subdivision0.width, DOM_Subdivision0.height);
				context0.drawImage(glRenderer.domElement, 0, 0);
				this.camera.layers.disable(layer0);

				this.camera.layers.enable(layer1);
				glRenderer.render(this.scene, this.camera);
				context1.clearRect(0, 0, DOM_Subdivision0.width, DOM_Subdivision0.height);
				context1.drawImage(glRenderer.domElement, 0, 0);
				this.camera.layers.disable(layer1);

				this.camera.layers.enable(layer2);
				glRenderer.render(this.scene, this.camera);
				context2.clearRect(0, 0, DOM_Subdivision0.width, DOM_Subdivision0.height);
				context2.drawImage(glRenderer.domElement, 0, 0);
				this.camera.layers.disable(layer2);

				this.camera.layers.enable(layer3);
				glRenderer.render(this.scene, this.camera);
				context3.clearRect(0, 0, DOM_Subdivision0.width, DOM_Subdivision0.height);
				context3.drawImage(glRenderer.domElement, 0, 0);
				this.camera.layers.disable(layer3);

				this.camera.layers.enable(layer4);
				glRenderer.render(this.scene, this.camera);
				context4.clearRect(0, 0, DOM_Subdivision0.width, DOM_Subdivision0.height);
				context4.drawImage(glRenderer.domElement, 0, 0);
				this.camera.layers.disable(layer4);


				requestAnimationFrame(this.loop.bind(this));
			}
		}
	});
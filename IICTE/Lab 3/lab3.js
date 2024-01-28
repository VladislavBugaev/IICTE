import * as THREE from '../../js/three/three.module.js';
import {ARButton} from '../../js/three/ARButton.js';
import {Sphere} from '../../js/three/three.module.js';


document.addEventListener("DOMContentLoaded", () => {
	//основна функція
	const initialize = async() => {
		// створення сцени
		let scene = new THREE.Scene();
			scene.position.set(0, -0.5, -2);
		
	    let camera = new THREE.PerspectiveCamera();

		let renderer = new THREE.WebGLRenderer({
			antialias: true,
			alpha: true
		});
	    renderer.setSize(window.innerWidth, window.innerHeight);
	    renderer.setPixelRatio(window.devicePixelRatio);
		document.body.appendChild(renderer.domElement);

		
		
		function render() {
			// переміщення кульок по тору
			animate();
			renderer.render(scene, camera);
		}
		
		
		var light = new THREE.HemisphereLight(0xffffff, 0xbbbbff, 1);
        scene.add(light);
				
		// створення геометрії тору
		var torusGeometry = new THREE.TorusGeometry(0.5, 0.1, 16, 100);
		// створення матеріалу тору
		var torusMaterial = new THREE.MeshBasicMaterial({color: 0xffffff, transparent: true, opacity: 0.5});
		// створення мешу тору
		var torus = new THREE.Mesh(torusGeometry, torusMaterial);
		// встановлення властивості rotation мешу тору
		torus.rotation.x = Math.PI / 2;
		// додавання мешу тору до сцени
		scene.add(torus);

		// створення геометрії першої кульки
		var sphereGeometry1 = new THREE.SphereGeometry(0.02, 32, 32);
		// створення матеріалу першої кульки
		var sphereMaterial1 = new THREE.MeshBasicMaterial({color: 0xff0000});
		// створення мешу першої кульки
		var sphere1 = new THREE.Mesh(sphereGeometry1, sphereMaterial1);
		// додавання мешу першої кульки до сцени
		scene.add(sphere1);

		// створення геометрії другої кульки
		var sphereGeometry2 = new THREE.SphereGeometry(0.02, 32, 32);
		// створення матеріалу другої кульки
		var sphereMaterial2 = new THREE.MeshBasicMaterial({color: 0x0000ff});
		// створення мешу другої кульки
		var sphere2 = new THREE.Mesh(sphereGeometry2, sphereMaterial2);
		// додавання мешу другої кульки до сцени
		scene.add(sphere2);
		
		// створення об'єктів THREE.Sphere для кульок
		var sphere1Bound = new Sphere(sphere1.position, sphereGeometry1.parameters.radius);
		var sphere2Bound = new Sphere(sphere2.position, sphereGeometry2.parameters.radius);

		// функція, яка переміщає кульки по тору
		function animate() {
			// перевірка, чи перетинаються сфери кульок
			if (checkCollision()) {
				// встановити час в 0, щоб анімація розпочалась заново
				time = 0;
			}
			// отримання часу в секундах
			var time = performance.now() / 1000;
			// встановлення положення першої кульки за допомогою циліндричних координат
			sphere1.position.setFromCylindricalCoords(0.5, time, 0.05 * Math.sin(time * 5));
			// встановлення положення другої кульки за допомогою циліндричних координат
			sphere2.position.setFromCylindricalCoords(0.5, -time, 0.05 * Math.sin(-time * 5));
			// оновлення положення сфер кульок
			sphere1Bound.center.copy(sphere1.position);
			sphere2Bound.center.copy(sphere2.position);
		}
		
		// функція, яка перевіряє, чи перетинаються сфери кульок
		function checkCollision() {
			// повернути true, якщо сфери перетинаються, або false, якщо ні
			return sphere1Bound.intersectsSphere(sphere2Bound);
		}

		// повідомлення рушія Three.js про параметри використання WebXR
		renderer.xr.enabled = true;

		// перевірка запуску та завершення сесії WebXR
		renderer.xr.addEventListener("sessionstart", (evt) => {
			renderer.setAnimationLoop(() => {
				render();
			}); 
		});


		const arButton = ARButton.createButton(renderer, {
				optionalFeatures: ["dom-overlay"],
				domOverlay: {root: document.body},
			}
		);
		arButton.textContent = "Увійти до WebXR";
		document.body.appendChild(arButton);
	}
	
	

	initialize(); // розпочати роботу
});
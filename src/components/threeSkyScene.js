import React, { useRef, useEffect } from 'react';
import * as THREE from 'three';
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer';
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass';
import { UnrealBloomPass } from 'three/examples/jsm/postprocessing/UnrealBloomPass';
import starrySkyImage from '../images/equirectangular_starry_sky.webp';
import moonImage from '../images/moon.webp';

function setupPostProcessing(renderer, scene, camera) {
    const composer = new EffectComposer(renderer);
    composer.addPass(new RenderPass(scene, camera));

    const bloomPass = new UnrealBloomPass(
        new THREE.Vector2(window.innerWidth, window.innerHeight),
        0.4,
        1,
        0.75
    );
    composer.addPass(bloomPass);

    return composer;
}

const cameraParams = {
    desktop: {
        fov: 80,
        position: { x: 0, y: 1.5, z: 0 },
        lookAt: { x: 0, y: 0.5, z: -50 },
        maxTiltUp: THREE.MathUtils.degToRad(15),
        maxTiltDown: THREE.MathUtils.degToRad(-30),
    },
    mobile: {
        fov: 70,
        position: { x: 0, y: 2.5, z: 0 },
        lookAt: { x: 0, y: 2, z: -40 },
        maxTiltUp: THREE.MathUtils.degToRad(15),
        maxTiltDown: THREE.MathUtils.degToRad(-15),
    },
};

const objectParams = {
    desktop: {
        moon: { radius: 5 },
        starrySky: { radius: 500 },
    },
    mobile: {
        moon: { radius: 3.5 },
        starrySky: { radius: 400 },
    },
};

function addLighting(scene) {
    const sun = new THREE.DirectionalLight(0xffd27f, 2);
    sun.position.set(50, 100, -50);
    sun.target.position.set(100, 50, -180);
    sun.castShadow = true;

    sun.shadow.mapSize.width = 2048;
    sun.shadow.mapSize.height = 2048;
    sun.shadow.camera.near = 0.5;
    sun.shadow.camera.far = 500;
    sun.shadow.bias = -0.0001;

    scene.add(sun);
    scene.add(sun.target);

    const ambientLight = new THREE.AmbientLight(0xdfdfdf, 0.36);
    scene.add(ambientLight);

    const hemiLight = new THREE.HemisphereLight(0xffffcc, 0xdfdfdf, 0.8);
    scene.add(hemiLight);
}

function loadStarrySky(isMobile) {
    const skyRadius = isMobile ? objectParams.mobile.starrySky.radius : objectParams.desktop.starrySky.radius;
    const geometry = new THREE.SphereGeometry(skyRadius, 64, 64);
    const textureLoader = new THREE.TextureLoader();

    const starrySkyTexture = textureLoader.load(starrySkyImage);
    const material = new THREE.MeshBasicMaterial({
        map: starrySkyTexture,
        side: THREE.BackSide,
        toneMapped: false,
    });

    return new THREE.Mesh(geometry, material);
}

function loadMoon(isMobile) {
    const moonRadius = isMobile ? objectParams.mobile.moon.radius : objectParams.desktop.moon.radius;
    const geometry = new THREE.SphereGeometry(moonRadius, 64, 64);

    const textureLoader = new THREE.TextureLoader();
    const moonTexture = textureLoader.load(moonImage);
    moonTexture.anisotropy = 16;
    const material = new THREE.MeshStandardMaterial({
        map: moonTexture,
        roughness: 0.8,
        metalness: 0,
        emissive: 0xFFF6A4,
        emissiveIntensity: 0.5,
    });

    const moon = new THREE.Mesh(geometry, material);
    moon.position.set(-10, 15, -50); // Adjusted height
    moon.receiveShadow = true;
    return moon;
}

export default function ThreeSkyScene({isMobile}) {
    const containerRef = useRef(null);

    useEffect(() => {
        if (typeof window === 'undefined' || !containerRef.current) return;

        const renderer = new THREE.WebGLRenderer({ antialias: true });
        renderer.setSize(window.innerWidth, window.innerHeight);
        renderer.setPixelRatio(window.devicePixelRatio);
        renderer.toneMapping = THREE.ACESFilmicToneMapping;
        renderer.toneMappingExposure = 0.25;
        containerRef.current.appendChild(renderer.domElement);

        const scene = new THREE.Scene();
        const camera = new THREE.PerspectiveCamera(
            isMobile ? cameraParams.mobile.fov : cameraParams.desktop.fov,
            window.innerWidth / window.innerHeight,
            0.1,
            1000
        );

        camera.position.set(
            isMobile ? cameraParams.mobile.position.x : cameraParams.desktop.position.x,
            isMobile ? cameraParams.mobile.position.y : cameraParams.desktop.position.y,
            isMobile ? cameraParams.mobile.position.z : cameraParams.desktop.position.z
        );

        addLighting(scene);
        const starrySky = loadStarrySky(isMobile);
        const moon = loadMoon(isMobile);
        scene.add(starrySky);
        scene.add(moon);

        const maxTiltUp = isMobile ? cameraParams.mobile.maxTiltUp : cameraParams.desktop.maxTiltUp;
        const maxTiltDown = isMobile ? cameraParams.mobile.maxTiltDown : cameraParams.desktop.maxTiltDown;

        let targetRotationX = 0; // Vertical tilt (X-axis)
        let targetRotationY = 0; // Horizontal rotation (Y-axis)
        let lastAlpha = null;

        // Smoothing and sensitivity factors
        const dampingFactor = 0.15; // Smooth transitions
        const alphaNoiseThreshold = THREE.MathUtils.degToRad(0.3); // Horizontal sensitivity
        const betaNoiseThreshold = THREE.MathUtils.degToRad(0.2);  // Vertical sensitivity
        const rotationSpeedFactor = 1.2; // For large rotations

        const handleDeviceOrientation = (event) => {
            if (event.alpha !== null && event.beta !== null) {
                // Horizontal Rotation (Y-axis - alpha)
                const alpha = THREE.MathUtils.degToRad(event.alpha); // Horizontal rotation (Y-axis)
                if (lastAlpha !== null) {
                    let deltaAlpha = alpha - lastAlpha;

                    // Wrap-around correction for alpha
                    if (deltaAlpha > Math.PI) {
                        deltaAlpha -= 2 * Math.PI;
                    } else if (deltaAlpha < -Math.PI) {
                        deltaAlpha += 2 * Math.PI;
                    }

                    // Apply smoothing and threshold for alpha (Y-axis)
                    if (Math.abs(deltaAlpha) > alphaNoiseThreshold) {
                        targetRotationY += deltaAlpha * rotationSpeedFactor; // Sensitivity for large rotations
                        targetRotationY += deltaAlpha * dampingFactor;       // Smooth the motion
                    }
                }
                lastAlpha = alpha; // Update lastAlpha for the next frame

                // Vertical Tilt (X-axis - beta)
                const beta = THREE.MathUtils.degToRad(event.beta);   // Vertical tilt (X-axis)
                const clampedBeta = Math.max(
                    Math.min(beta - Math.PI / 2, maxTiltUp), // Clamp to max limits
                    maxTiltDown
                );

                // Apply smoothing and threshold for beta (X-axis)
                if (Math.abs(clampedBeta - targetRotationX) > betaNoiseThreshold) {
                    targetRotationX += (clampedBeta - targetRotationX) * dampingFactor;
                }
            }
        };

        const handleMouseMove = (event) => {
            const deltaX = (event.clientX / window.innerWidth - 0.5) * 2 * Math.PI;
            const deltaY = (event.clientY / window.innerHeight - 0.5) * Math.PI;

            targetRotationY = deltaX;
            targetRotationX = Math.max(Math.min(deltaY, maxTiltUp), maxTiltDown);
        };

        const limitVerticalTilt = () => {
            if (targetRotationX > maxTiltUp) targetRotationX = maxTiltUp;
            if (targetRotationX < maxTiltDown) targetRotationX = maxTiltDown;
        };

        console.log("sky scene isMobile:", isMobile);

        if (isMobile) {
            window.addEventListener('deviceorientation', handleDeviceOrientation);

            let lastTouchX = 0;
            let lastTouchY = 0;
            window.addEventListener('touchstart', (event) => {
                if (event.touches.length === 1) {
                    lastTouchX = event.touches[0].clientX;
                    lastTouchY = event.touches[0].clientY;
                }
            });
            window.addEventListener('touchmove', (event) => {
                
                if (event.touches.length === 1) {
                    const deltaX = event.touches[0].clientX - lastTouchX;
                    const deltaY = event.touches[0].clientY - lastTouchY;

                    targetRotationY += deltaX * 0.005;
                    targetRotationX += deltaY * 0.005;
                    limitVerticalTilt();

                    lastTouchX = event.touches[0].clientX;
                    lastTouchY = event.touches[0].clientY;
                }
            });
        } else {
            window.addEventListener('mousemove', handleMouseMove);
        }

        const composer = setupPostProcessing(renderer, scene, camera);

        function animate() {
            camera.rotation.x += (targetRotationX - camera.rotation.x) * 0.075;
            camera.rotation.y += (targetRotationY - camera.rotation.y) * 0.075;

            composer.render();
            requestAnimationFrame(animate);
        }
        animate();

        // Handle window resize
        const handleResize = () => {
            camera.aspect = window.innerWidth / window.innerHeight;
            camera.updateProjectionMatrix();
            renderer.setSize(window.innerWidth, window.innerHeight);
            composer.setSize(window.innerWidth, window.innerHeight);
        };
        window.addEventListener('resize', handleResize);

        // Cleanup on unmount
        return () => {
            console.log("Removing deviceorientation listener");
            window.removeEventListener('resize', handleResize);
            window.removeEventListener('mousemove', handleMouseMove);
            window.removeEventListener('deviceorientation', handleDeviceOrientation);
            if (containerRef.current) {
                containerRef.current.removeChild(renderer.domElement);
            }
            renderer.dispose();
        };
    }, [isMobile]); // Removed isMobile from dependencies

    return <div ref={containerRef} style={{ width: '100%', height: '100%' }} />;
}
"use client";
import { useEffect, useRef } from "react";
import * as THREE from "three";
import {
  EffectComposer,
  RenderPass,
  EffectPass,
  Effect,
  BlendFunction,
} from "postprocessing";

const CRT_SHADER = /* glsl */ `
  uniform float uTime;

  float hash21(vec2 p) {
    p = fract(p * vec2(234.34, 435.345));
    p += dot(p, p + 34.23);
    return fract(p.x * p.y);
  }

  void mainImage(const in vec4 inputColor, const in vec2 uv, out vec4 outputColor) {
    // Animated film grain
    float grain = hash21(uv + fract(uTime * vec2(0.17, 0.11))) * 0.11 - 0.06;

    // Horizontal scanlines
    float scanline = sin(uv.y * 900.0) * 0.025 + 0.025;

    // Vignette — darkens edges
    vec2 vigCoord = (uv - 0.5) * 2.0;
    float vig = smoothstep(0.35, 1.5, length(vigCoord * vec2(0.75, 1.0)));

    float totalAlpha = vig * 0.8 + scanline + abs(grain) * 0.4;
    // Slight green tint on grain to match the terminal palette
    vec3 color = vec3(0.0, max(grain, 0.0) * 0.2, 0.0);

    outputColor = vec4(color, clamp(totalAlpha, 0.0, 1.0));
  }
`;

class CRTEffect extends Effect {
  constructor() {
    super("CRTEffect", CRT_SHADER, {
      blendFunction: BlendFunction.NORMAL,
      uniforms: new Map([["uTime", new THREE.Uniform(0)]]),
    });
  }

  override update(
    _renderer: THREE.WebGLRenderer,
    _inputBuffer: THREE.WebGLRenderTarget,
    deltaTime: number
  ) {
    (this.uniforms.get("uTime") as THREE.Uniform<number>).value += deltaTime;
  }
}

export default function CRTOverlay() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: false });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setClearColor(0x000000, 0);

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(
      50,
      window.innerWidth / window.innerHeight,
      0.1,
      10
    );
    camera.position.z = 1;

    const composer = new EffectComposer(renderer);
    composer.addPass(new RenderPass(scene, camera));
    composer.addPass(new EffectPass(camera, new CRTEffect()));

    let animId: number;
    const clock = new THREE.Clock();

    const animate = () => {
      animId = requestAnimationFrame(animate);
      composer.render(clock.getDelta());
    };
    animate();

    const onResize = () => {
      const w = window.innerWidth;
      const h = window.innerHeight;
      renderer.setSize(w, h);
      composer.setSize(w, h);
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
    };
    window.addEventListener("resize", onResize);

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener("resize", onResize);
      composer.dispose();
      renderer.dispose();
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        width: "100%",
        height: "100%",
        pointerEvents: "none",
        zIndex: 50,
      }}
    />
  );
}

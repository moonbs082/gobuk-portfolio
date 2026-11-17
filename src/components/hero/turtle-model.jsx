import { useEffect, useMemo } from 'react';
import { MeshPhysicalMaterial, SphereGeometry } from 'three';
import useTurtleGeometry from '../../hooks/use-turtle-geometry.js';
import { EYES } from '../../utils/turtle-sdf.js';

/** 모델 높이의 가운데 (회전 중심을 몸 중앙으로 맞추기 위함) */
const MODEL_CENTER_Y = 1.8;

/**
 * TurtleModel 컴포넌트
 *
 * 프론트 더블 바이셉스 포즈를 취한 근육질 거북이 조형 (R3F Canvas 내부 전용).
 * 몸 전체를 하나의 매끈한 표면으로 만들고, 등딱지 · 배딱지를 따로 얹는다.
 * 메시는 워커에서 생성되며, 준비되기 전에는 아무것도 그리지 않는다.
 *
 * Props:
 * @param {function} onReady - 메시 준비 완료 시 실행 [Optional]
 *
 * Example usage:
 * <Canvas><TurtleModel onReady={ handleReady } /></Canvas>
 */
function TurtleModel({ onReady }) {
  const geometries = useTurtleGeometry();

  /** 메시가 준비되면 바깥(로딩 표시)에 알림 */
  useEffect(() => {
    if (geometries) onReady?.();
  }, [geometries, onReady]);

  const materials = useMemo(() => ({
    skin: new MeshPhysicalMaterial({
      color: '#5B6E3C',
      roughness: 0.62,
      sheen: 0.35,
      sheenColor: '#A3B47E',
      sheenRoughness: 0.6,
    }),
    shell: new MeshPhysicalMaterial({ color: '#3A2616', roughness: 0.4, clearcoat: 0.8, clearcoatRoughness: 0.35 }),
    plastron: new MeshPhysicalMaterial({ color: '#A88F55', roughness: 0.55, clearcoat: 0.25, clearcoatRoughness: 0.5 }),
    eye: new MeshPhysicalMaterial({ color: '#0D0D0D', roughness: 0.08, clearcoat: 1 }),
  }), []);

  const eyeGeometry = useMemo(() => new SphereGeometry(0.032, 24, 16), []);

  /** 언마운트 시 GPU 메모리 해제 */
  useEffect(() => () => {
    Object.values(materials).forEach((material) => material.dispose());
    eyeGeometry.dispose();
  }, [materials, eyeGeometry]);

  if (!geometries) return null;

  return (
    <group position={ [0, -MODEL_CENTER_Y, 0] }>
      <mesh geometry={ geometries.body } material={ materials.skin } castShadow receiveShadow />
      <mesh geometry={ geometries.shell } material={ materials.shell } castShadow receiveShadow />
      <mesh geometry={ geometries.plastron } material={ materials.plastron } castShadow receiveShadow />
      {EYES.map((position) => (
        <mesh key={ position.join() } geometry={ eyeGeometry } material={ materials.eye } position={ position } />
      ))}
    </group>
  );
}

export default TurtleModel;

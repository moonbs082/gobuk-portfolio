import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { MathUtils } from 'three';
import TurtleModel from './turtle-model.jsx';

/** 자동 회전 속도: 24초에 한 바퀴 */
const AUTO_SPEED = (Math.PI * 2) / 24;
/** 드래그를 놓은 뒤 관성이 줄어드는 정도 (클수록 빨리 멈춤) */
const DRAG_FRICTION = 4;

/**
 * SpinningTurtle 컴포넌트 (R3F Canvas 내부 전용)
 *
 * 거북이 모델의 회전 = 자동 회전 + 메뉴 동기화 회전 + 사용자 드래그 회전.
 * - 메뉴가 바뀌면 syncDeg 만큼 부드럽게 추가 회전한다.
 * - 드래그를 놓으면 관성으로 조금 더 돌다가 멈춘다.
 * - '움직임 줄이기' 설정 사용자는 자동 회전을 끈다.
 *
 * Props:
 * @param {number} syncDeg - 메뉴와 동기화할 추가 회전 각도(도) [Required]
 * @param {object} dragRef - 드래그 상태 ref ({ angle, velocity, isDragging }) [Required]
 * @param {function} onReady - 모델 메시 준비 완료 시 실행 [Optional]
 *
 * Example usage:
 * <SpinningTurtle syncDeg={ 90 } dragRef={ dragRef } onReady={ handleReady } />
 */
function SpinningTurtle({ syncDeg, dragRef, onReady }) {
  const groupRef = useRef(null);
  const autoAngle = useRef(0);
  const syncAngle = useRef(MathUtils.degToRad(syncDeg));
  const isReducedMotion = useRef(window.matchMedia('(prefers-reduced-motion: reduce)').matches);

  useFrame((state, delta) => {
    if (!groupRef.current) return;
    const drag = dragRef.current;

    if (!isReducedMotion.current && !drag.isDragging) autoAngle.current += AUTO_SPEED * delta;
    syncAngle.current = MathUtils.damp(syncAngle.current, MathUtils.degToRad(syncDeg), 5, delta);

    /** 손을 뗀 뒤 관성 회전 */
    if (!drag.isDragging && Math.abs(drag.velocity) > 0.001) {
      drag.angle += drag.velocity * delta;
      drag.velocity *= Math.exp(-DRAG_FRICTION * delta);
    }

    groupRef.current.rotation.y = autoAngle.current + syncAngle.current + drag.angle;
  });

  return (
    <group ref={ groupRef }>
      <TurtleModel onReady={ onReady } />
    </group>
  );
}

export default SpinningTurtle;

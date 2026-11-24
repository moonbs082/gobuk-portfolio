import { useEffect, useRef } from 'react';
import { Canvas } from '@react-three/fiber';
import Box from '@mui/material/Box';
import CameraZoom from './camera-zoom.jsx';
import PostureRig from './posture-rig.jsx';

/** 드래그 1px 당 회전량(라디안) */
const DRAG_SENSITIVITY = 0.012;
/** 카메라가 바라보는 높이 */
const CAMERA_TARGET = [0, 0.85, 0];
/** 기본 카메라 위치 (거리 배율 1) */
const CAMERA_POSITION = [0, 1.2, 4.7];
/** 휠 확대 · 축소 범위 (카메라 거리 배율: 작을수록 확대) */
const ZOOM_MIN = 0.4;
const ZOOM_MAX = 1.6;
/** 휠 한 칸(deltaY) 당 배율 변화량 */
const ZOOM_SENSITIVITY = 0.0012;

/**
 * PostureCanvas 컴포넌트
 * 운동 자세 3D 장면(WebGL 캔버스). 좌우로 드래그하면 마네킹을 돌려볼 수 있고,
 * 마우스 휠을 위로 올리면 확대, 아래로 내리면 축소된다.
 * three.js 용량이 크므로 Posture3DViewer 에서 lazy 로 불러온다.
 *
 * Props:
 * @param {object} pose - 운동 3D 자세 데이터 (exercise-poses.js) [Required]
 * @param {boolean} isPlaying - 동작 재생 여부 [Optional, 기본값: true]
 * @param {string} label - 화면 낭독기용 설명 [Optional, 기본값: '운동 자세 3D 모델']
 *
 * Example usage:
 * <PostureCanvas pose={ pose } isPlaying label="스쿼트 자세 3D 모델" />
 */
function PostureCanvas({ pose, isPlaying = true, label = '운동 자세 3D 모델' }) {
  const dragRef = useRef({ angle: 0, velocity: 0, isDragging: false, lastX: 0, lastTime: 0 });
  const containerRef = useRef(null);
  const zoomRef = useRef(1);

  /**
   * 마우스 휠: 위로 올리면 확대, 아래로 내리면 축소
   * - 페이지 스크롤을 막아야 하므로 passive: false 로 직접 등록한다.
   * - 이미 최대 확대/축소 상태면 막지 않아 페이지가 그대로 스크롤된다.
   */
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return undefined;

    const handleWheel = (event) => {
      const current = zoomRef.current;
      const next = Math.min(Math.max(current * Math.exp(event.deltaY * ZOOM_SENSITIVITY), ZOOM_MIN), ZOOM_MAX);
      if (next === current) return;
      event.preventDefault();
      zoomRef.current = next;
    };

    container.addEventListener('wheel', handleWheel, { passive: false });
    return () => container.removeEventListener('wheel', handleWheel);
  }, []);

  /** 드래그 시작 */
  const handlePointerDown = (event) => {
    const drag = dragRef.current;
    drag.isDragging = true;
    drag.velocity = 0;
    drag.lastX = event.clientX;
    drag.lastTime = performance.now();
    event.currentTarget.setPointerCapture(event.pointerId);
  };

  /** 드래그 중: 이동 거리만큼 회전 + 관성용 속도 기록 */
  const handlePointerMove = (event) => {
    const drag = dragRef.current;
    if (!drag.isDragging) return;
    const now = performance.now();
    const deltaAngle = (event.clientX - drag.lastX) * DRAG_SENSITIVITY;
    const deltaTime = Math.max((now - drag.lastTime) / 1000, 0.001);
    drag.angle += deltaAngle;
    drag.velocity = deltaAngle / deltaTime;
    drag.lastX = event.clientX;
    drag.lastTime = now;
  };

  /** 드래그 종료 (잠시 멈춘 뒤 놓으면 관성 없음) */
  const handlePointerUp = () => {
    const drag = dragRef.current;
    if (performance.now() - drag.lastTime > 80) drag.velocity = 0;
    drag.isDragging = false;
  };

  return (
    <Box
      ref={ containerRef }
      onPointerDown={ handlePointerDown }
      onPointerMove={ handlePointerMove }
      onPointerUp={ handlePointerUp }
      onPointerCancel={ handlePointerUp }
      sx={{
        position: 'absolute',
        inset: 0,
        cursor: 'grab',
        touchAction: 'pan-y',
        '&:active': { cursor: 'grabbing' },
      }}
    >
      <Canvas
        shadows
        dpr={ [1, 2] }
        camera={{ position: CAMERA_POSITION, fov: 34 }}
        gl={{ antialias: true, alpha: true }}
        onCreated={ ({ camera }) => camera.lookAt(...CAMERA_TARGET) }
        aria-label={ label }
        role="img"
        style={{ position: 'absolute', inset: 0 }}
      >
        <hemisphereLight args={ ['#ffffff', '#8a8a8a', 1.15] } />
        <directionalLight
          position={ [2.5, 5, 4] }
          intensity={ 2.2 }
          castShadow
          shadow-mapSize={ [1024, 1024] }
          shadow-bias={ -0.0004 }
          shadow-normalBias={ 0.02 }
          shadow-camera-left={ -2.5 }
          shadow-camera-right={ 2.5 }
          shadow-camera-top={ 2.5 }
          shadow-camera-bottom={ -2.5 }
        />
        <directionalLight position={ [-3, 2, -2] } intensity={ 0.7 } />

        {/* 바닥: 그림자 + 은은한 격자 */}
        <mesh rotation={ [-Math.PI / 2, 0, 0] } receiveShadow>
          <circleGeometry args={ [2.6, 48] } />
          <shadowMaterial opacity={ 0.18 } />
        </mesh>
        <gridHelper args={ [5, 20, '#c4c4c4', '#dddddd'] } position={ [0, 0.001, 0] } />

        <CameraZoom zoomRef={ zoomRef } basePosition={ CAMERA_POSITION } target={ CAMERA_TARGET } />
        <PostureRig pose={ pose } isPlaying={ isPlaying } dragRef={ dragRef } />
      </Canvas>
    </Box>
  );
}

export default PostureCanvas;

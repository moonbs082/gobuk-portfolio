import { useRef } from 'react';
import { Canvas } from '@react-three/fiber';
import Box from '@mui/material/Box';
import SpinningTurtle from './spinning-turtle.jsx';

/** 드래그 1px 당 회전량(라디안) */
const DRAG_SENSITIVITY = 0.012;

/**
 * Turtle3D 컴포넌트
 *
 * 3D 거북이 조형을 그리는 WebGL 캔버스 (조명 · 그림자 포함, 배경 투명).
 * 좌우로 드래그하면 직접 돌려볼 수 있다. (모바일에서는 세로 스크롤을 막지 않음)
 * three.js 용량이 크므로 TurtleStage 에서 lazy 로 불러온다.
 *
 * Props:
 * @param {number} syncDeg - 메뉴 회전과 동기화할 추가 회전 각도(도) [Optional, 기본값: 0]
 * @param {function} onReady - 모델 메시 준비 완료 시 실행 [Optional]
 *
 * Example usage:
 * <Turtle3D syncDeg={ step * 90 } onReady={ handleReady } />
 */
function Turtle3D({ syncDeg = 0, onReady }) {
  const dragRef = useRef({ angle: 0, velocity: 0, isDragging: false, lastX: 0, lastTime: 0 });

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
        camera={{ position: [0, 0.15, 7.45], fov: 34 }}
        gl={{ antialias: true, alpha: true }}
        aria-label="프론트 더블 바이셉스 포즈로 회전하는 근육질 거북이 3D 조형 (드래그로 회전 가능)"
        role="img"
        style={{ position: 'absolute', inset: 0 }}
      >
        {/* 기본 밝기 */}
        <hemisphereLight args={ ['#FFF4E8', '#2A120A', 0.7] } />
        {/* 키 라이트 (그림자) */}
        <directionalLight
          position={ [3, 5, 6] }
          intensity={ 2.4 }
          color="#FFF1E0"
          castShadow
          shadow-mapSize={ [1024, 1024] }
          shadow-bias={ -0.0004 }
          shadow-normalBias={ 0.02 }
        />
        {/* 보조광 */}
        <directionalLight position={ [-4, 1, 4] } intensity={ 0.6 } color="#FFB27A" />
        {/* 오렌지 · 레드 림 라이트 (윤곽 강조) */}
        <pointLight position={ [-3, 2.5, -3] } intensity={ 40 } color="#FF6B1A" />
        <pointLight position={ [3, 0.5, -3] } intensity={ 32 } color="#E5252E" />

        <SpinningTurtle syncDeg={ syncDeg } dragRef={ dragRef } onReady={ onReady } />
      </Canvas>
    </Box>
  );
}

export default Turtle3D;

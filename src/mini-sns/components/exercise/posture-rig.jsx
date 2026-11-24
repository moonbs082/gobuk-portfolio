import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import EquipmentPiece from './equipment-piece.jsx';
import MannequinBody from './mannequin-body.jsx';
import { applyArmIk, applyLegIk } from '../../utils/limb-ik.js';
import { EQUIPMENT_MATERIALS } from '../../utils/mannequin-materials.js';

/** 자세 데이터에서 각도를 읽어 움직이는 관절 */
const JOINTS = ['spine', 'head', 'lShoulder', 'rShoulder', 'lElbow', 'rElbow', 'lHip', 'rHip', 'lKnee', 'rKnee', 'lAnkle', 'rAnkle'];
const ZERO = [0, 0, 0];
/** 발목 관절에서 발바닥까지의 높이 */
const FOOT_SOLE = 0.07;
/** 시작 자세 → 끝 자세 → 시작 자세 한 번에 걸리는 시간(초) */
const CYCLE_SECONDS = 3.6;
/** 원기둥(기본 y축)을 x축 방향으로 눕히는 회전 */
const ALONG_X = [0, 0, Math.PI / 2];
const X_AXIS = new THREE.Vector3(1, 0, 0);
const Y_AXIS = new THREE.Vector3(0, 1, 0);

/** 프레임마다 재사용하는 임시 계산용 객체 */
const tempLeft = new THREE.Vector3();
const tempRight = new THREE.Vector3();
const tempMid = new THREE.Vector3();
const tempDir = new THREE.Vector3();
const tempQuat = new THREE.Quaternion();
const tempParentQuat = new THREE.Quaternion();
const tempAnkle = new THREE.Vector3();
const tempToe = new THREE.Vector3();
const tempGrip = new THREE.Vector3();
const tempPole = new THREE.Vector3();

/**
 * 시간에 따른 동작 진행도 (0 = 시작 자세, 1 = 끝 자세). 양 끝에서 잠깐 멈춘다.
 * @param {number} time - 누적 시간(초)
 * @returns {number}
 */
function getPhase(time) {
  const u = (time % CYCLE_SECONDS) / CYCLE_SECONDS;
  const wave = u < 0.5 ? u * 2 : 2 - u * 2;
  const k = Math.min(Math.max((wave - 0.12) / 0.76, 0), 1);
  return k * k * (3 - 2 * k);
}

/**
 * 두 [x, y, z] 값 사이 보간
 * @param {number[]} a - 시작 값 [Optional]
 * @param {number[]} b - 끝 값 [Optional]
 * @param {number} t - 진행도 0~1
 * @returns {number[]}
 */
function lerp3(a = ZERO, b = ZERO, t) {
  return [a[0] + (b[0] - a[0]) * t, a[1] + (b[1] - a[1]) * t, a[2] + (b[2] - a[2]) * t];
}

/**
 * PostureRig 컴포넌트 (R3F Canvas 내부 전용)
 * 마네킹 + 기구를 배치하고, 시작 ↔ 끝 자세를 오가며 운동 동작을 재생한다.
 * 손에 쥔 바벨 · 손잡이 · 덤벨과 발판은 매 프레임 손 · 발 위치를 따라 움직인다.
 *
 * Props:
 * @param {object} pose - 운동 3D 자세 데이터 (exercise-poses.js) [Required]
 * @param {boolean} isPlaying - 동작 재생 여부 [Optional, 기본값: true]
 * @param {object} dragRef - 드래그 회전 상태 ref ({ angle, velocity, isDragging }) [Required]
 *
 * Example usage:
 * <PostureRig pose={ pose } isPlaying dragRef={ dragRef } />
 */
function PostureRig({ pose, isPlaying = true, dragRef }) {
  const groupRef = useRef(null);
  const jointRefs = useRef({});
  const heldRef = useRef(null);
  const cableRef = useRef(null);
  const plateRef = useRef(null);
  const leftBellRef = useRef(null);
  const rightBellRef = useRef(null);
  const timeRef = useRef(0);

  const { start, end, held, cableAnchor, footPlate, equipment = [] } = pose;
  const isBar = held === 'barbell' || held === 'lat-bar' || held === 'v-handle';

  useFrame((_, delta) => {
    const group = groupRef.current;
    const joints = jointRefs.current;
    if (!group || !joints.root) return;

    /** 드래그 회전 + 놓은 뒤 관성 */
    const drag = dragRef.current;
    if (!drag.isDragging) {
      drag.angle += drag.velocity * delta;
      drag.velocity *= Math.pow(0.04, delta);
    }
    group.rotation.y = pose.viewAngle + drag.angle;

    if (isPlaying) timeRef.current += delta;
    const t = getPhase(timeRef.current);

    JOINTS.forEach((name) => {
      const [x, y, z] = lerp3(start[name], end[name], t);
      joints[name].rotation.set(x, y, z, 'XZY');
    });
    const [rx, ry, rz] = lerp3(start.rootRotation, end.rootRotation, t);
    joints.root.rotation.set(rx, ry, rz, 'XZY');

    /** 위치 계산 도우미: 관절의 위치를 이 그룹 기준 좌표로 */
    const toLocal = (node, out) => group.worldToLocal(node.getWorldPosition(out));

    if (pose.isGrounded) {
      /** 발바닥이 바닥(y=0)에 닿고, 두 발 가운데가 원점에 오도록 몸 위치를 맞춘다 */
      joints.root.position.set(0, 0, 0);
      group.updateMatrixWorld(true);
      const left = toLocal(joints.lAnkle, tempLeft);
      const right = toLocal(joints.rAnkle, tempRight);
      joints.root.position.set(-(left.x + right.x) / 2, FOOT_SOLE - Math.min(left.y, right.y), -(left.z + right.z) / 2);
    } else {
      const [px, py, pz] = lerp3(start.rootPosition, end.rootPosition, t);
      joints.root.position.set(px, py, pz);
    }
    group.updateMatrixWorld(true);

    /** 발 고정: 발목 위치 · 발끝 방향은 그대로 두고 골반 위치에 맞춰 다리 각도를 계산 */
    if (pose.legIk) {
      const { stance, toeOut } = pose.legIk;
      [['l', 1], ['r', -1]].forEach(([side, s]) => {
        tempAnkle.set(s * stance, FOOT_SOLE, 0);
        tempToe.set(s * Math.sin(toeOut), 0, Math.cos(toeOut));
        applyLegIk(group, { hip: joints[`${side}Hip`], knee: joints[`${side}Knee`], ankle: joints[`${side}Ankle`] }, tempAnkle, tempToe);
      });
    }

    /** 등에 얹는 바벨(스쿼트): 승모근 위에 고정하고, 두 손이 바를 쥐도록 팔 각도를 계산 */
    if (pose.barOnBack && heldRef.current) {
      const { position, gripWidth, elbowDir } = pose.barOnBack;
      group.updateMatrixWorld(true);
      group.worldToLocal(joints.spine.localToWorld(tempMid.set(...position)));
      group.getWorldQuaternion(tempParentQuat).invert();
      joints.spine.getWorldQuaternion(tempQuat).premultiply(tempParentQuat);
      heldRef.current.position.copy(tempMid);
      heldRef.current.quaternion.copy(tempQuat);

      tempDir.copy(X_AXIS).applyQuaternion(tempQuat);
      [['l', 1], ['r', -1]].forEach(([side, s]) => {
        tempGrip.copy(tempMid).addScaledVector(tempDir, s * gripWidth);
        tempPole.set(s * elbowDir[0], elbowDir[1], elbowDir[2]).applyQuaternion(tempQuat);
        applyArmIk(group, { shoulder: joints[`${side}Shoulder`], elbow: joints[`${side}Elbow`] }, tempGrip, tempPole);
      });
    }

    /** 바벨 · 손잡이: 두 손 가운데에 두고 두 손을 잇는 방향으로 */
    if (isBar && !pose.barOnBack && heldRef.current) {
      const left = toLocal(joints.lGrip, tempLeft);
      const right = toLocal(joints.rGrip, tempRight);
      tempMid.addVectors(left, right).multiplyScalar(0.5);
      tempDir.subVectors(left, right).normalize();
      heldRef.current.position.copy(tempMid);
      heldRef.current.quaternion.setFromUnitVectors(X_AXIS, tempDir);

      /** 케이블: 손잡이 ~ 도르래 */
      if (cableAnchor && cableRef.current) {
        tempDir.set(...cableAnchor).sub(tempMid);
        const length = tempDir.length();
        cableRef.current.position.copy(tempMid).addScaledVector(tempDir, 0.5);
        cableRef.current.quaternion.setFromUnitVectors(Y_AXIS, tempDir.normalize());
        cableRef.current.scale.set(1, length, 1);
      }
    }

    /** 덤벨: 각 손에 붙여 손 방향을 따른다 */
    if (held === 'dumbbells') {
      group.getWorldQuaternion(tempParentQuat).invert();
      [[joints.lGrip, leftBellRef.current], [joints.rGrip, rightBellRef.current]].forEach(([grip, bell]) => {
        if (!bell) return;
        toLocal(grip, bell.position);
        bell.quaternion.copy(tempParentQuat).multiply(grip.getWorldQuaternion(tempQuat));
      });
    }

    /** 발판: 두 발바닥 가운데에 붙는다 */
    if (footPlate && plateRef.current) {
      const left = toLocal(joints.lAnkle, tempLeft);
      const right = toLocal(joints.rAnkle, tempRight);
      tempDir.set(...footPlate.normal).normalize();
      plateRef.current.position.addVectors(left, right).multiplyScalar(0.5).addScaledVector(tempDir, 0.09);
      plateRef.current.quaternion.setFromUnitVectors(Y_AXIS, tempDir);
    }
  });

  /** 덤벨 한 개 (손잡이가 손의 x축 방향) */
  const renderDumbbell = (ref) => (
    <group ref={ ref }>
      <EquipmentPiece shape="cylinder" args={ [0.016, 0.016, 0.16, 12] } rotation={ ALONG_X } tone="metal" />
      <EquipmentPiece shape="cylinder" args={ [0.06, 0.06, 0.07, 6] } position={ [0.1, 0, 0] } rotation={ ALONG_X } tone="plate" />
      <EquipmentPiece shape="cylinder" args={ [0.06, 0.06, 0.07, 6] } position={ [-0.1, 0, 0] } rotation={ ALONG_X } tone="plate" />
    </group>
  );

  return (
    <group ref={ groupRef }>
      <MannequinBody jointRefs={ jointRefs } muscles={ pose.muscles } />

      { equipment.map((piece, index) => (
        <EquipmentPiece key={ `${piece.shape}-${index}` } { ...piece } />
      )) }

      { held === 'barbell' && (
        <group ref={ heldRef }>
          <EquipmentPiece shape="cylinder" args={ [0.015, 0.015, 2.0, 12] } rotation={ ALONG_X } tone="metal" />
          { [1, -1].map((s) => (
            <group key={ s }>
              <EquipmentPiece shape="cylinder" args={ [0.026, 0.026, 0.38, 12] } position={ [s * 0.8, 0, 0] } rotation={ ALONG_X } tone="metal" />
              <EquipmentPiece shape="cylinder" args={ [0.2, 0.2, 0.05, 32] } position={ [s * 0.66, 0, 0] } rotation={ ALONG_X } tone="plate" />
              <EquipmentPiece shape="cylinder" args={ [0.16, 0.16, 0.04, 32] } position={ [s * 0.71, 0, 0] } rotation={ ALONG_X } tone="pad" />
            </group>
          )) }
        </group>
      ) }

      { held === 'lat-bar' && (
        <group ref={ heldRef }>
          <EquipmentPiece shape="cylinder" args={ [0.016, 0.016, 1.1, 12] } rotation={ ALONG_X } tone="metal" />
          <EquipmentPiece shape="cylinder" args={ [0.024, 0.024, 0.16, 12] } position={ [0.45, 0, 0] } rotation={ ALONG_X } tone="pad" />
          <EquipmentPiece shape="cylinder" args={ [0.024, 0.024, 0.16, 12] } position={ [-0.45, 0, 0] } rotation={ ALONG_X } tone="pad" />
        </group>
      ) }

      { held === 'v-handle' && (
        <group ref={ heldRef }>
          <EquipmentPiece shape="cylinder" args={ [0.02, 0.02, 0.3, 12] } rotation={ ALONG_X } tone="pad" />
          <EquipmentPiece shape="box" args={ [0.05, 0.03, 0.14] } position={ [0, 0, 0.06] } tone="metal" />
        </group>
      ) }

      { held === 'dumbbells' && (
        <>
          { renderDumbbell(leftBellRef) }
          { renderDumbbell(rightBellRef) }
        </>
      ) }

      { cableAnchor && isBar && (
        <mesh ref={ cableRef } material={ EQUIPMENT_MATERIALS.cable }>
          <cylinderGeometry args={ [0.006, 0.006, 1, 6] } />
        </mesh>
      ) }

      { footPlate && (
        <group ref={ plateRef }>
          <EquipmentPiece shape="box" args={ footPlate.size } tone="frame" />
        </group>
      ) }
    </group>
  );
}

export default PostureRig;

import * as THREE from 'three';

/** 다리 · 팔 뼈 길이 (mannequin-body.jsx 의 관절 위치와 같아야 한다) */
const THIGH_LENGTH = 0.44;
const SHIN_LENGTH = 0.43;
const UPPER_ARM_LENGTH = 0.29;
/** 팔꿈치 → 손바닥(쥐는 지점) */
const FOREARM_LENGTH = 0.32;
/** 발바닥이 바닥에 평평할 때 발목 관절의 뼈 방향 (아래) */
const DOWN = new THREE.Vector3(0, -1, 0);

/** 계산용 임시 객체 (매 프레임 재사용) */
const rootPos = new THREE.Vector3();
const toTarget = new THREE.Vector3();
const pole = new THREE.Vector3();
const upperDir = new THREE.Vector3();
const jointPos = new THREE.Vector3();
const lowerDir = new THREE.Vector3();
const facing = new THREE.Vector3();
const axisX = new THREE.Vector3();
const axisY = new THREE.Vector3();
const axisZ = new THREE.Vector3();
const basis = new THREE.Matrix4();
const targetQuat = new THREE.Quaternion();
const groupQuatInv = new THREE.Quaternion();
const parentQuat = new THREE.Quaternion();

/**
 * 뼈 방향(관절의 -y 축)과 앞쪽 방향(관절의 +z 축)으로 회전값 만들기
 * @param {THREE.Vector3} boneDir - 뼈가 뻗는 방향 (단위 벡터)
 * @param {THREE.Vector3} forward - 관절의 앞쪽(+z)이 향할 방향
 * @param {THREE.Quaternion} out - 결과를 담을 객체
 * @returns {THREE.Quaternion}
 */
function quatFromBone(boneDir, forward, out) {
  axisY.copy(boneDir).negate();
  axisZ.copy(forward).addScaledVector(axisY, -axisY.dot(forward));
  if (axisZ.lengthSq() < 1e-8) axisZ.set(0, 0, 1);
  axisZ.normalize();
  axisX.crossVectors(axisY, axisZ);
  basis.makeBasis(axisX, axisY, axisZ);
  return out.setFromRotationMatrix(basis);
}

/**
 * 그룹 기준 회전값을 관절의 부모 기준(local) 회전값으로 바꿔 적용
 * @param {THREE.Object3D} node - 관절
 * @param {THREE.Quaternion} groupQuat - 그룹 기준 목표 회전
 */
function setGroupQuaternion(node, groupQuat) {
  node.parent.getWorldQuaternion(parentQuat);
  parentQuat.premultiply(groupQuatInv);
  node.quaternion.copy(parentQuat.invert().multiply(groupQuat));
  node.updateMatrixWorld(true);
}

/**
 * 두 마디 IK: 끝 지점을 목표 위치에 맞추고, 가운데 관절(무릎 · 팔꿈치)은 pole 방향으로 튀어나오게 한다.
 * @param {THREE.Object3D} group - 좌표 기준 그룹
 * @param {THREE.Object3D} upper - 첫 관절 (고관절 · 어깨)
 * @param {THREE.Object3D} middle - 가운데 관절 (무릎 · 팔꿈치)
 * @param {THREE.Vector3} target - 끝 지점 목표 위치 (group 기준)
 * @param {THREE.Vector3} poleDir - 가운데 관절이 향할 방향 (group 기준)
 * @param {number} upperLength - 첫 마디 길이
 * @param {number} lowerLength - 둘째 마디 길이
 * @param {number} facingSign - 관절 앞쪽(+z)을 pole 쪽(1) 또는 반대쪽(-1)으로
 */
function solveTwoBone(group, upper, middle, target, poleDir, upperLength, lowerLength, facingSign) {
  group.getWorldQuaternion(groupQuatInv).invert();
  group.worldToLocal(upper.getWorldPosition(rootPos));

  /** 첫 관절 ~ 목표 거리 (팔 · 다리 길이를 넘지 않게) */
  toTarget.subVectors(target, rootPos);
  const minDistance = Math.abs(upperLength - lowerLength) + 0.01;
  const distance = Math.min(Math.max(toTarget.length(), minDistance), upperLength + lowerLength - 1e-4);
  toTarget.normalize();

  /** 코사인 법칙으로 첫 마디가 벌어질 각도 */
  const cosUpper = (upperLength ** 2 + distance ** 2 - lowerLength ** 2) / (2 * upperLength * distance);
  const upperAngle = Math.acos(Math.min(Math.max(cosUpper, -1), 1));
  pole.copy(poleDir).addScaledVector(toTarget, -toTarget.dot(poleDir));
  if (pole.lengthSq() < 1e-8) pole.set(0, 0, 1);
  pole.normalize();

  upperDir.copy(toTarget).multiplyScalar(Math.cos(upperAngle)).addScaledVector(pole, Math.sin(upperAngle));
  jointPos.copy(rootPos).addScaledVector(upperDir, upperLength);
  lowerDir.subVectors(target, jointPos).normalize();

  facing.copy(poleDir).multiplyScalar(facingSign);
  setGroupQuaternion(upper, quatFromBone(upperDir, facing, targetQuat));
  setGroupQuaternion(middle, quatFromBone(lowerDir, facing, targetQuat));
}

/**
 * 다리 IK: 발목 위치와 발끝 방향을 고정한 채, 골반 위치에 맞춰 허벅지 · 정강이 · 발 각도를 계산한다.
 * (몸통 · 골반 위치를 먼저 정한 뒤 호출)
 * @param {THREE.Object3D} group - 좌표 기준 그룹 (바닥 · 기구와 같은 공간)
 * @param {object} leg - { hip, knee, ankle } 관절 group
 * @param {THREE.Vector3} anklePos - 고정할 발목 위치 (group 기준)
 * @param {THREE.Vector3} toeDir - 발끝 방향 (group 기준, 수평 단위 벡터)
 */
export function applyLegIk(group, { hip, knee, ankle }, anklePos, toeDir) {
  /** 무릎은 발끝 방향으로 굽는다 */
  solveTwoBone(group, hip, knee, anklePos, toeDir, THIGH_LENGTH, SHIN_LENGTH, 1);
  /** 발은 바닥에 평평하게, 발끝 방향 고정 */
  setGroupQuaternion(ankle, quatFromBone(DOWN, toeDir, targetQuat));
}

/**
 * 팔 IK: 손(쥐는 지점)을 목표 위치에 맞추고 팔꿈치는 elbowDir 쪽으로 향하게 한다.
 * (몸통 자세를 먼저 정한 뒤 호출)
 * @param {THREE.Object3D} group - 좌표 기준 그룹
 * @param {object} arm - { shoulder, elbow } 관절 group
 * @param {THREE.Vector3} gripPos - 손이 쥘 위치 (group 기준)
 * @param {THREE.Vector3} elbowDir - 팔꿈치가 향할 방향 (group 기준)
 */
export function applyArmIk(group, { shoulder, elbow }, gripPos, elbowDir) {
  /** 팔 앞쪽(이두)은 팔꿈치 반대편을 향한다 */
  solveTwoBone(group, shoulder, elbow, gripPos, elbowDir, UPPER_ARM_LENGTH, FOREARM_LENGTH, -1);
}

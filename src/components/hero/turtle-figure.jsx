/** 거북이 색상 */
const COLORS = {
  skin: '#4E9F5B',
  skinDark: '#2F6E3C',
  skinLight: '#7BC77A',
  outline: '#1B3D22',
  plastron: '#F0C35A',
  plastronLine: '#B8862B',
  shell: '#5A3A22',
  shellDark: '#3A2414',
  shellScute: '#7A5230',
  belt: '#16161A',
  tag: '#D9DDE2',
};

/**
 * TurtleFigure 컴포넌트
 *
 * 오리지널 마스코트 'GOBUK' — 근육질 사람 형태의 거북이가
 * 두 팔을 ㄱ자로 들어 올린 더블 바이셉스 자세로 서 있는 SVG 일러스트.
 * side 값에 따라 앞모습(배딱지·얼굴) 또는 뒷모습(등껍질)을 그린다.
 *
 * Props:
 * @param {string} side - 'front' 또는 'back' [Optional, 기본값: 'front']
 *
 * Example usage:
 * <TurtleFigure side="back" />
 */
function TurtleFigure({ side = 'front' }) {
  const isFront = side === 'front';
  const shortsId = `gobuk-shorts-${side}`;

  /** 한쪽 팔 (반대쪽은 좌우 반전해서 재사용) */
  const arm = (
    <g stroke={ COLORS.outline } strokeWidth="4" strokeLinejoin="round">
      {/* 위팔 + 이두근 */}
      <path
        d="M138 160 C112 124 70 128 50 148 L44 198 C80 206 112 204 138 200 Z"
        fill={ COLORS.skin }
      />
      <path d="M78 146 C92 136 112 138 124 152" fill="none" stroke={ COLORS.skinLight } strokeWidth="5" strokeLinecap="round" />
      {/* 아래팔 (위로 세움) */}
      <path d="M28 172 C22 132 24 102 32 72 L68 72 C74 102 72 136 68 176 Z" fill={ COLORS.skin } />
      {/* 팔꿈치 */}
      <circle cx="48" cy="180" r="22" fill={ COLORS.skin } />
      {/* 주먹 */}
      <rect x="26" y="32" width="48" height="46" rx="16" fill={ COLORS.skinDark } />
      <path d="M38 46 L38 58 M50 44 L50 58 M62 46 L62 58" stroke={ COLORS.outline } strokeWidth="3" strokeLinecap="round" />
    </g>
  );

  return (
    <svg
      viewBox="0 0 400 480"
      width="100%"
      height="100%"
      role="img"
      aria-label={ isFront ? '두 팔을 들어 근육을 자랑하는 거북이 마스코트 GOBUK' : '거북이 마스코트 GOBUK 의 등껍질' }
    >
      <defs>
        <linearGradient id={ shortsId } x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#FF6B1A" />
          <stop offset="100%" stopColor="#E5252E" />
        </linearGradient>
      </defs>

      {/* 앞모습일 때 몸 뒤로 살짝 보이는 등껍질 */}
      {isFront && (
        <ellipse cx="200" cy="250" rx="112" ry="120" fill={ COLORS.shell } stroke={ COLORS.shellDark } strokeWidth="6" />
      )}

      {/* 팔 (좌/우) */}
      { arm }
      <g transform="translate(400 0) scale(-1 1)">{ arm }</g>

      <g stroke={ COLORS.outline } strokeWidth="4" strokeLinejoin="round">
        {/* 목 */}
        <path d="M170 128 L230 128 L240 170 L160 170 Z" fill={ COLORS.skinDark } />
        {/* 역삼각형 상체 */}
        <path
          d="M116 168 C150 150 250 150 284 168 C294 212 268 290 256 330 L144 330 C132 290 106 212 116 168 Z"
          fill={ COLORS.skin }
        />
        {/* 어깨 (삼각근) */}
        <circle cx="126" cy="180" r="30" fill={ COLORS.skin } />
        <circle cx="274" cy="180" r="30" fill={ COLORS.skin } />
      </g>

      {isFront ? (
        <g>
          {/* 배딱지 (복근 느낌의 칸 나눔) */}
          <path
            d="M150 182 C180 172 220 172 250 182 C254 230 244 290 236 322 L164 322 C156 290 146 230 150 182 Z"
            fill={ COLORS.plastron }
            stroke={ COLORS.plastronLine }
            strokeWidth="4"
          />
          <path
            d="M200 180 L200 322 M153 216 L247 216 M154 252 L246 252 M158 288 L242 288"
            stroke={ COLORS.plastronLine }
            strokeWidth="4"
            strokeLinecap="round"
          />
          {/* 군번줄 */}
          <path d="M176 142 Q200 205 224 142" fill="none" stroke="#C9CDD3" strokeWidth="3" strokeDasharray="3 4" />
          <rect x="189" y="190" width="22" height="30" rx="5" fill={ COLORS.tag } stroke="#9AA0A8" strokeWidth="2" />
          <path d="M194 200 L206 200 M194 207 L204 207" stroke="#9AA0A8" strokeWidth="2" strokeLinecap="round" />
        </g>
      ) : (
        <g stroke={ COLORS.shellDark } strokeWidth="5" strokeLinejoin="round">
          {/* 등껍질 (뒷모습) */}
          <ellipse cx="200" cy="246" rx="118" ry="126" fill={ COLORS.shell } />
          <ellipse cx="200" cy="246" rx="118" ry="126" fill="none" stroke="#FF6B1A" strokeWidth="4" opacity="0.8" />
          <path d="M200 176 L232 196 L232 236 L200 256 L168 236 L168 196 Z" fill={ COLORS.shellScute } />
          <path d="M200 256 L232 276 L232 312 L200 332 L168 312 L168 276 Z" fill={ COLORS.shellScute } />
          <path d="M168 196 L130 186 L112 224 L130 262 L168 236 Z" fill={ COLORS.shellScute } />
          <path d="M232 196 L270 186 L288 224 L270 262 L232 236 Z" fill={ COLORS.shellScute } />
          <path d="M168 276 L132 270 L122 304 L150 334 L168 312 Z" fill={ COLORS.shellScute } />
          <path d="M232 276 L268 270 L278 304 L250 334 L232 312 Z" fill={ COLORS.shellScute } />
        </g>
      )}

      <g stroke={ COLORS.outline } strokeWidth="4" strokeLinejoin="round">
        {/* 벨트 */}
        <rect x="142" y="322" width="116" height="16" rx="4" fill={ COLORS.belt } />
        <rect x="190" y="320" width="20" height="20" rx="3" fill="#FF6B1A" />
        {/* 반바지 */}
        <path d="M142 336 L258 336 L272 402 L212 406 L200 374 L188 406 L128 402 Z" fill={ `url(#${shortsId})` } />
        {/* 다리 */}
        <path d="M138 400 L188 404 L182 452 L146 452 Z" fill={ COLORS.skin } />
        <path d="M212 404 L262 400 L254 452 L218 452 Z" fill={ COLORS.skin } />
        {/* 발 */}
        <ellipse cx="160" cy="462" rx="32" ry="13" fill={ COLORS.skinDark } />
        <ellipse cx="240" cy="462" rx="32" ry="13" fill={ COLORS.skinDark } />
        {/* 머리 */}
        <ellipse cx="200" cy="90" rx="52" ry="50" fill={ COLORS.skin } />
      </g>
      <ellipse cx="182" cy="66" rx="18" ry="9" fill={ COLORS.skinLight } opacity="0.6" />

      {isFront && (
        <g>
          {/* 눈 */}
          <ellipse cx="181" cy="92" rx="11" ry="12" fill="#FFFFFF" stroke={ COLORS.outline } strokeWidth="3" />
          <ellipse cx="219" cy="92" rx="11" ry="12" fill="#FFFFFF" stroke={ COLORS.outline } strokeWidth="3" />
          <circle cx="183" cy="94" r="5" fill="#111111" />
          <circle cx="217" cy="94" r="5" fill="#111111" />
          {/* 자신감 있는 눈썹 */}
          <path d="M166 74 L192 82 M234 74 L208 82" stroke={ COLORS.outline } strokeWidth="6" strokeLinecap="round" />
          {/* 콧구멍 + 웃는 입 */}
          <circle cx="195" cy="107" r="2.5" fill={ COLORS.outline } />
          <circle cx="205" cy="107" r="2.5" fill={ COLORS.outline } />
          <path d="M178 116 Q200 134 222 116" fill="none" stroke={ COLORS.outline } strokeWidth="4" strokeLinecap="round" />
        </g>
      )}
    </svg>
  );
}

export default TurtleFigure;

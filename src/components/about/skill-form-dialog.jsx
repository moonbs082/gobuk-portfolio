import { useState } from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import FormControlLabel from '@mui/material/FormControlLabel';
import ListSubheader from '@mui/material/ListSubheader';
import MenuItem from '@mui/material/MenuItem';
import Slider from '@mui/material/Slider';
import Switch from '@mui/material/Switch';
import TextField from '@mui/material/TextField';
import { getCategoryColor, getSkillIcon, groupSkillsByCategory } from '../../utils/skill-utils.js';

/**
 * SkillFormDialog 컴포넌트
 *
 * 스킬 추가 / 수정 다이얼로그.
 * - 추가: 추가 가능한 기술 목록에서 선택 + 숙련도 설정
 * - 수정: 기존 스킬의 숙련도와 메인 스킬 여부 변경
 * 열릴 때마다 새로 마운트되므로 입력값은 항상 초기값에서 시작한다.
 *
 * Props:
 * @param {boolean} isOpen - 다이얼로그 열림 여부 [Required]
 * @param {object} skill - 수정할 스킬. 없으면 추가 모드 [Optional, 기본값: null]
 * @param {object[]} presets - 추가 가능한 기술 목록 ({ name, icon, category, description }) [Optional, 기본값: []]
 * @param {function} onClose - 닫기 시 실행 [Required]
 * @param {function} onSubmit - 저장 시 실행 (values) => void [Required]
 *
 * Example usage:
 * <SkillFormDialog isOpen presets={ availablePresets } onClose={ handleClose } onSubmit={ handleSubmit } />
 */
function SkillFormDialog({ isOpen, skill = null, presets = [], onClose, onSubmit }) {
  const isEditMode = Boolean(skill);
  const [presetName, setPresetName] = useState(presets[0]?.name ?? '');
  const [level, setLevel] = useState(skill?.level ?? 50);
  const [isMainSkill, setIsMainSkill] = useState(skill?.isMainSkill ?? true);

  const selectedPreset = presets.find((preset) => preset.name === presetName);
  const target = isEditMode ? skill : selectedPreset;
  const color = getCategoryColor(target?.category);

  /** 저장 */
  const handleSubmit = () => {
    if (isEditMode) {
      onSubmit({ level, isMainSkill });
      return;
    }
    if (!selectedPreset) return;
    onSubmit({ ...selectedPreset, level, isMainSkill });
  };

  /** 카테고리 소제목 + 항목을 Select 가 요구하는 평평한 배열로 만든다 */
  const presetOptions = groupSkillsByCategory(presets).flatMap((group) => [
    <ListSubheader key={ `header-${group.id}` } sx={{ color: group.color, bgcolor: 'var(--color-surface)' }}>
      { group.label }
    </ListSubheader>,
    ...group.skills.map((preset) => (
      <MenuItem key={ preset.name } value={ preset.name }>
        { getSkillIcon(preset.icon) } { preset.name }
      </MenuItem>
    )),
  ]);

  return (
    <Dialog
      open={ isOpen }
      onClose={ onClose }
      fullWidth
      maxWidth="xs"
      slotProps={{
        paper: { sx: { borderRadius: 3, bgcolor: 'var(--color-surface)', backgroundImage: 'none' } },
      }}
    >
      <DialogTitle sx={{ fontFamily: 'var(--font-display-ko)', fontWeight: 400 }}>
        {isEditMode ? `${skill.name} 수정` : '스킬 추가'}
      </DialogTitle>

      <DialogContent sx={{ display: 'flex', flexDirection: 'column', gap: 3, pt: '8px !important' }}>
        {!isEditMode && (
          <TextField
            select
            fullWidth
            label="추가할 기술"
            value={ presetName }
            onChange={ (event) => setPresetName(event.target.value) }
          >
            { presetOptions }
          </TextField>
        )}

        {target && (
          <Box sx={{ fontSize: '0.9rem', color: 'var(--color-text-muted)' }}>
            <Box component="span" sx={{ fontWeight: 700, color }}>{ target.category }</Box>
            {' · '}
            { target.description }
          </Box>
        )}

        <Box>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1, fontWeight: 700 }}>
            숙련도
            <Box component="span" sx={{ fontFamily: 'var(--font-display)', fontWeight: 400, color }}>{ level }%</Box>
          </Box>
          <Slider
            value={ level }
            onChange={ (event, newValue) => setLevel(newValue) }
            step={ 5 }
            min={ 0 }
            max={ 100 }
            valueLabelDisplay="auto"
            aria-label="숙련도"
            sx={{ color }}
          />
        </Box>

        <FormControlLabel
          control={ (
            <Switch
              checked={ isMainSkill }
              onChange={ (event) => setIsMainSkill(event.target.checked) }
              color="warning"
            />
          ) }
          label="메인 스킬 (홈 화면 표시 후보)"
        />
      </DialogContent>

      <DialogActions sx={{ px: 3, pb: 2.5 }}>
        <Button onClick={ onClose } sx={{ color: 'var(--color-text-muted)' }}>취소</Button>
        <Button
          variant="contained"
          onClick={ handleSubmit }
          disabled={ !target }
          sx={{ px: 3, borderRadius: 999, background: 'var(--gradient-power)', color: '#0E0E10' }}
        >
          {isEditMode ? '저장' : '추가'}
        </Button>
      </DialogActions>
    </Dialog>
  );
}

export default SkillFormDialog;

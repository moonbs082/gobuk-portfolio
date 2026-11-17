import { useState } from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import CheckIcon from '@mui/icons-material/Check';

/**
 * SectionContentEditor 컴포넌트
 *
 * 콘텐츠 섹션 본문을 수정하는 입력창. 저장하면 onSave 로 새 본문을 넘긴다.
 *
 * Props:
 * @param {string} initialContent - 수정 전 본문 [Required]
 * @param {string} label - 입력창 라벨 [Required]
 * @param {function} onSave - 저장 시 실행 (newContent) => void [Required]
 * @param {function} onCancel - 취소 시 실행 [Required]
 *
 * Example usage:
 * <SectionContentEditor initialContent={ content } label="나의 개발 스토리" onSave={ handleSave } onCancel={ handleCancel } />
 */
function SectionContentEditor({ initialContent, label, onSave, onCancel }) {
  const [draft, setDraft] = useState(initialContent);

  const isEmpty = draft.trim().length === 0;

  /** 저장 */
  const handleSubmit = (event) => {
    event.preventDefault();
    if (isEmpty) return;
    onSave(draft.trim());
  };

  return (
    <Box component="form" onSubmit={ handleSubmit } noValidate>
      <TextField
        fullWidth
        multiline
        autoFocus
        minRows={ 6 }
        label={ `${label} 수정` }
        value={ draft }
        onChange={ (event) => setDraft(event.target.value) }
        error={ isEmpty }
        helperText={ isEmpty ? '내용을 입력해 주세요.' : `${draft.length}자 · 저장하면 홈 화면에도 바로 반영됩니다.` }
        sx={{
          '& .MuiOutlinedInput-root': { lineHeight: 1.7 },
          '& .MuiOutlinedInput-root.Mui-focused fieldset': { borderColor: 'var(--color-orange)' },
          '& .MuiInputLabel-root.Mui-focused': { color: 'var(--color-orange)' },
        }}
      />
      <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 1, mt: 2 }}>
        <Button onClick={ onCancel } sx={{ color: 'var(--color-text-muted)' }}>
          취소
        </Button>
        <Button
          type="submit"
          variant="contained"
          disabled={ isEmpty }
          startIcon={ <CheckIcon /> }
          sx={{ px: 3, borderRadius: 999, background: 'var(--gradient-power)', color: '#0E0E10' }}
        >
          저장
        </Button>
      </Box>
    </Box>
  );
}

export default SectionContentEditor;

import Accordion from '@mui/material/Accordion';
import AccordionDetails from '@mui/material/AccordionDetails';
import AccordionSummary from '@mui/material/AccordionSummary';
import Box from '@mui/material/Box';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import RuleIcon from '@mui/icons-material/Rule';

/**
 * LevelGuide 컴포넌트
 *
 * 숙련도 레벨의 평가 기준표를 접고 펼칠 수 있는 아코디언으로 보여준다.
 *
 * Props:
 * @param {object[]} levels - 레벨 기준 목록 ({ level, name, criteria }) [Required]
 *
 * Example usage:
 * <LevelGuide levels={ levelGuide } />
 */
function LevelGuide({ levels }) {
  return (
    <Accordion
      disableGutters
      elevation={0}
      sx={{
        borderRadius: '24px !important',
        border: '1px solid var(--color-border)',
        bgcolor: 'var(--color-surface)',
        '&::before': { display: 'none' },
      }}
    >
      <AccordionSummary
        expandIcon={ <ExpandMoreIcon sx={{ color: 'var(--color-orange)' }} /> }
        sx={{ px: { xs: 2.5, md: 3.5 }, py: 1 }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, fontWeight: 700 }}>
          <RuleIcon sx={{ color: 'var(--color-orange)' }} />
          숙련도 평가 기준 보기
          <Box component="span" sx={{ fontWeight: 400, fontSize: '0.85rem', color: 'var(--color-text-muted)' }}>
            (퍼센트 대신 행동 기준으로 평가합니다)
          </Box>
        </Box>
      </AccordionSummary>
      <AccordionDetails sx={{ px: { xs: 2.5, md: 3.5 }, pb: 3 }}>
        <Box component="ol" sx={{ listStyle: 'none', m: 0, p: 0, display: 'flex', flexDirection: 'column', gap: 1.25 }}>
          {levels.map((item) => (
            <Box
              component="li"
              key={ item.level }
              sx={{
                display: 'flex',
                alignItems: { xs: 'flex-start', sm: 'center' },
                flexDirection: { xs: 'column', sm: 'row' },
                gap: { xs: 0.5, sm: 2 },
                p: 1.5,
                borderRadius: 2,
                bgcolor: 'rgba(255, 255, 255, 0.03)',
              }}
            >
              <Box sx={{ minWidth: 120, fontWeight: 700, color: 'var(--color-orange)' }}>
                Lv.{ item.level } { item.name }
              </Box>
              <Box sx={{ color: 'var(--color-text)', fontSize: '0.95rem' }}>{ item.criteria }</Box>
            </Box>
          ))}
        </Box>
      </AccordionDetails>
    </Accordion>
  );
}

export default LevelGuide;

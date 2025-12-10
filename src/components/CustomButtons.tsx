import { Button } from '@mui/material';
import type { ButtonProps } from '@mui/material';
import { styled } from '@mui/material/styles';

// Primary Button
export const PrimaryButton = styled((props: ButtonProps) => (
  <Button variant="contained" disableElevation {...props} />
))(({ theme }) => ({
  border: 'none',
  borderRadius: '8px',
  padding: '5px 20px',
  textTransform: 'none',
  '--variant-outlinedBorder': 'none',
  fontWeight: 500,
  color: theme.palette.mode === 'dark' ? '#ffffff' : '#000000',
  backgroundColor:
    theme.palette.mode === 'dark'
      ? theme.palette.grey[900] || '#242424'
      : 'rgba(133,133,133,0.7)',
  '&:hover': {
    backgroundColor:
      theme.palette.mode === 'dark'
        ? theme.palette.grey[800] || '#1a1a1a'
        : 'rgba(133,133,133,0.9)',
    '--variant-outlinedBorder': 'transparent',
  },
}));

// Secondary Button
export const SecondaryButton = styled((props: ButtonProps) => (
  <Button variant="outlined" disableElevation {...props} />
))(({ theme }) => ({
  border: 'none',
  borderRadius: '8px',
  padding: '5px 19px',
  textTransform: 'none',
  fontWeight: 500,
  backgroundColor: 'transparent',
  '--variant-outlinedBorder': 'none',
  boxShadow:
    theme.palette.mode === 'dark'
      ? 'inset 0 0 0 1px #4B4848'
      : 'inset 0 0 0 1px rgba(0,0,0,0.6)',
  color: theme.palette.mode === 'dark' ? '#ffffff' : '#000000',
  '&:hover': {
    boxShadow:
      theme.palette.mode === 'dark'
        ? 'inset 0 0 0 1px #6b6969'
        : 'inset 0 0 0 1px rgba(0,0,0,0.8)',
    backgroundColor:
      theme.palette.mode === 'dark' ? 'rgba(75,72,72,0.1)' : 'rgba(0,0,0,0.05)',
    '--variant-outlinedBorder': 'transparent',
  },
}));

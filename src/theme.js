import { createTheme } from '@mui/material/styles';

export const getTheme = (mode) => {
  const isDark = mode === 'dark';

  return createTheme({
    palette: {
      mode,
      primary: {
        main: '#06b6d4', // cyan
      },
      secondary: {
        main: '#f97316', // orange
      },
      success: {
        main: '#22c55e',
      },
      error: {
        main: '#ef4444',
      },
      background: {
        default: isDark ? '#111827' : '#f9fafb',
        paper: isDark ? '#1f2937' : '#ffffff',
      },
      text: {
        primary: isDark ? '#f9fafb' : '#111827',
        secondary: isDark ? '#9ca3af' : '#6b7280',
      },
      divider: isDark ? '#374151' : '#e5e7eb',
    },
    components: {
      MuiCard: {
        styleOverrides: {
          root: {
            backgroundColor: isDark ? '#1f2937' : '#ffffff',
            borderColor: isDark ? '#374151' : '#e5e7eb',
            borderWidth: 1,
            borderStyle: 'solid',
            boxShadow: isDark 
              ? '0 4px 6px -1px rgba(0, 0, 0, 0.5), 0 2px 4px -1px rgba(0, 0, 0, 0.3)' 
              : '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
            transition: 'box-shadow 0.3s ease-in-out, transform 0.3s ease-in-out',
            '&:hover': {
              boxShadow: isDark
                ? '0 10px 15px -3px rgba(0, 0, 0, 0.6), 0 4px 6px -2px rgba(0, 0, 0, 0.4)'
                : '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
              transform: 'translateY(-2px)',
            },
          },
        },
      },
      MuiButton: {
        styleOverrides: {
          root: {
            textTransform: 'none',
            borderRadius: 8,
          },
        },
      },
      MuiPaper: {
        styleOverrides: {
          root: {
            backgroundImage: 'none',
          },
        },
      },
    },
  });
};

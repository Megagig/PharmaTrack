import { MantineThemeOverride } from '@mantine/core';

// Custom theme for date picker components
export const datePickerTheme: MantineThemeOverride = {
  components: {
    DatePicker: {
      defaultProps: {
        size: 'md',
        radius: 'md',
        clearable: false,
        firstDayOfWeek: 0,
      },
      styles: (theme) => ({
        calendarHeader: { 
          marginBottom: 10,
        },
        monthCell: { 
          padding: '5px 10px',
        },
        yearCell: { 
          padding: '5px 10px',
        },
        day: { 
          borderRadius: 4,
          fontWeight: 500,
          '&[data-selected]': {
            backgroundColor: theme.colors.blue[6],
            color: theme.white,
          },
          '&[data-in-range]': {
            backgroundColor: theme.colors.blue[0],
            color: theme.colors.blue[9],
          },
          '&[data-first-in-range]': {
            backgroundColor: theme.colors.blue[6],
            color: theme.white,
            borderTopRightRadius: 0,
            borderBottomRightRadius: 0,
          },
          '&[data-last-in-range]': {
            backgroundColor: theme.colors.blue[6],
            color: theme.white,
            borderTopLeftRadius: 0,
            borderBottomLeftRadius: 0,
          },
        },
        weekday: { 
          fontWeight: 600,
        },
        weekend: { 
          color: theme.colors.red[6],
        },
        calendarHeaderControl: { 
          borderRadius: 4,
          '&:hover': { 
            backgroundColor: theme.colors.blue[0],
          },
        },
        monthPickerControl: { 
          borderRadius: 4,
          '&:hover': { 
            backgroundColor: theme.colors.blue[0],
          },
        },
        yearPickerControl: { 
          borderRadius: 4,
          '&:hover': { 
            backgroundColor: theme.colors.blue[0],
          },
        },
        monthsList: {
          padding: '10px 0',
        },
        yearsList: {
          padding: '10px 0',
        },
        calendarHeaderLevel: {
          fontSize: theme.fontSizes.md,
          fontWeight: 600,
          textTransform: 'uppercase',
          letterSpacing: 0.5,
        },
      }),
    },
  },
};

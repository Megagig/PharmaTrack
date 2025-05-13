import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { RouterProvider } from 'react-router-dom';
import {
  MantineProvider,
  createTheme,
  localStorageColorSchemeManager,
  mergeMantineTheme,
} from '@mantine/core';
import { Notifications } from '@mantine/notifications';
import '@mantine/core/styles.css';
import '@mantine/dates/styles.css';
import '@mantine/notifications/styles.css';
import './index.css';
import { router } from './routes';
import { datePickerTheme } from './theme/datePickerTheme';

// Color scheme manager to persist user preference
const colorSchemeManager = localStorageColorSchemeManager({
  key: 'pharmatrack-color-scheme',
});

// Create a base theme
const baseTheme = createTheme({
  primaryColor: 'teal',
  primaryShade: 6,
  defaultRadius: 'md',
  fontFamily: 'Poppins, Inter, system-ui, Avenir, Helvetica, Arial, sans-serif',
  headings: {
    fontFamily:
      'Poppins, Inter, system-ui, Avenir, Helvetica, Arial, sans-serif',
    fontWeight: '600',
  },
  colors: {
    // Custom brand color palette
    teal: [
      '#e6fcf5',
      '#c3fae8',
      '#96f2d7',
      '#63e6be',
      '#38d9a9',
      '#20c997',
      '#12b886',
      '#0ca678',
      '#099268',
      '#087f5b',
    ],
    // Secondary color palette
    indigo: [
      '#edf2ff',
      '#dbe4ff',
      '#bac8ff',
      '#91a7ff',
      '#748ffc',
      '#5c7cfa',
      '#4c6ef5',
      '#4263eb',
      '#3b5bdb',
      '#364fc7',
    ],
  },
  components: {
    Button: {
      defaultProps: {
        radius: 'md',
      },
      styles: {
        root: {
          fontWeight: 500,
          transition: 'all 200ms ease',
          '&:hover': {
            transform: 'translateY(-2px)',
            boxShadow: '0 5px 15px rgba(0, 0, 0, 0.1)',
          },
        },
      },
    },
    Card: {
      defaultProps: {
        radius: 'md',
        shadow: 'sm',
      },
      styles: {
        root: {
          transition: 'all 200ms ease',
          '&:hover': {
            boxShadow: '0 10px 25px rgba(0, 0, 0, 0.1)',
          },
        },
      },
    },
    Paper: {
      defaultProps: {
        radius: 'md',
        shadow: 'sm',
      },
    },
    TextInput: {
      styles: {
        input: {
          transition: 'all 150ms ease',
          '&:focus': {
            borderColor: 'var(--mantine-color-teal-6)',
            boxShadow: '0 0 0 2px rgba(32, 201, 151, 0.2)',
          },
        },
      },
    },
    PasswordInput: {
      styles: {
        input: {
          transition: 'all 150ms ease',
          '&:focus': {
            borderColor: 'var(--mantine-color-teal-6)',
            boxShadow: '0 0 0 2px rgba(32, 201, 151, 0.2)',
          },
        },
      },
    },
  },
});

// Merge base theme with date picker theme
const theme = mergeMantineTheme(baseTheme, datePickerTheme);

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <MantineProvider
      theme={theme}
      colorSchemeManager={colorSchemeManager}
      defaultColorScheme="light"
    >
      <Notifications position="top-right" limit={5} />
      <RouterProvider router={router} />
    </MantineProvider>
  </StrictMode>
);

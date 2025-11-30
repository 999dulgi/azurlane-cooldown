'use client';
import { createTheme } from '@mui/material/styles';

const getTheme = (darkMode: boolean) =>
    createTheme({
        palette: {
            mode: darkMode ? 'dark' : 'light',
            primary: {
                main: '#2979ff',
            },
            secondary: {
                main: '#ff6d00',
            },
            background: {
                default: darkMode ? '#1c2128' : '#ffffff',
                paper: darkMode ? '#161b22' : '#f5f5f5',
            },
        },
        components: {
            MuiCard: {
                styleOverrides: {
                    root: {
                        boxShadow: '0 10px 20px 0 rgba(0,0,0,0.5)',
                    },
                },
            },
            MuiSelect: {
                styleOverrides: {
                    root: ({ theme }) => ({
                        ...(theme.palette.mode === 'light' && {
                            backgroundColor: theme.palette.grey[200],
                        }),
                    }),
                },
            },
        },
    });

export default getTheme;

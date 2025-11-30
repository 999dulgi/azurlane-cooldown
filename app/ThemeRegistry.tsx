'use client';
import { ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import getTheme from './theme';
import React from 'react';

export default function ThemeRegistry({ children, darkMode }: { children: React.ReactNode; darkMode: boolean }) {
    const theme = getTheme(darkMode);

    return (
        <ThemeProvider theme={theme}>
            <CssBaseline />
            {children}
        </ThemeProvider>
    );
}

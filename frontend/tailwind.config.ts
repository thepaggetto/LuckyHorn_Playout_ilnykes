import daisyui from 'daisyui'
import svgToDataUri from 'mini-svg-data-uri'

module.exports = {
    theme: {
        extend: {
            backgroundImage: (theme: any) => ({
                'multiselect-caret': `url("${svgToDataUri(
                    `<svg viewBox="0 0 320 512" fill="currentColor" xmlns="http://www.w3.org/2000/svg"><path d="M31.3 192h257.3c17.8 0 26.7 21.5 14.1 34.1L174.1 354.8c-7.8 7.8-20.5 7.8-28.3 0L17.2 226.1C4.6 213.5 13.5 192 31.3 192z"></path></svg>`
                )}")`,
                'multiselect-spinner': `url("${svgToDataUri(
                    `<svg viewBox="0 0 512 512" fill="${theme(
                        'colors.green.500'
                    )}" xmlns="http://www.w3.org/2000/svg"><path d="M456.433 371.72l-27.79-16.045c-7.192-4.152-10.052-13.136-6.487-20.636 25.82-54.328 23.566-118.602-6.768-171.03-30.265-52.529-84.802-86.621-144.76-91.424C262.35 71.922 256 64.953 256 56.649V24.56c0-9.31 7.916-16.609 17.204-15.96 81.795 5.717 156.412 51.902 197.611 123.408 41.301 71.385 43.99 159.096 8.042 232.792-4.082 8.369-14.361 11.575-22.424 6.92z"></path></svg>`
                )}")`,
                'multiselect-remove': `url("${svgToDataUri(
                    `<svg viewBox="0 0 320 512" fill="currentColor" xmlns="http://www.w3.org/2000/svg"><path d="M207.6 256l107.72-107.72c6.23-6.23 6.23-16.34 0-22.58l-25.03-25.03c-6.23-6.23-16.34-6.23-22.58 0L160 208.4 52.28 100.68c-6.23-6.23-16.34-6.23-22.58 0L4.68 125.7c-6.23 6.23-6.23 16.34 0 22.58L112.4 256 4.68 363.72c-6.23 6.23-6.23 16.34 0 22.58l25.03 25.03c6.23 6.23 16.34 6.23 22.58 0L160 303.6l107.72 107.72c6.23 6.23 16.34 6.23 22.58 0l25.03-25.03c6.23-6.23 6.23-16.34 0-22.58L207.6 256z"></path></svg>`
                )}")`,
            }),
            maskImage: (theme: any) => ({
                'multiselect-caret': `url("${svgToDataUri(
                    `<svg viewBox="0 0 320 512" fill="currentColor" xmlns="http://www.w3.org/2000/svg"><path d="M31.3 192h257.3c17.8 0 26.7 21.5 14.1 34.1L174.1 354.8c-7.8 7.8-20.5 7.8-28.3 0L17.2 226.1C4.6 213.5 13.5 192 31.3 192z"></path></svg>`
                )}")`,
                'multiselect-spinner': `url("${svgToDataUri(
                    `<svg viewBox="0 0 512 512" fill="${theme(
                        'colors.green.500'
                    )}" xmlns="http://www.w3.org/2000/svg"><path d="M456.433 371.72l-27.79-16.045c-7.192-4.152-10.052-13.136-6.487-20.636 25.82-54.328 23.566-118.602-6.768-171.03-30.265-52.529-84.802-86.621-144.76-91.424C262.35 71.922 256 64.953 256 56.649V24.56c0-9.31 7.916-16.609 17.204-15.96 81.795 5.717 156.412 51.902 197.611 123.408 41.301 71.385 43.99 159.096 8.042 232.792-4.082 8.369-14.361 11.575-22.424 6.92z"></path></svg>`
                )}")`,
                'multiselect-clear-icon': `url("${svgToDataUri(
                    `<svg viewBox="0 0 320 512" fill="currentColor" xmlns="http://www.w3.org/2000/svg"><path d="M207.6 256l107.72-107.72c6.23-6.23 6.23-16.34 0-22.58l-25.03-25.03c-6.23-6.23-16.34-6.23-22.58 0L160 208.4 52.28 100.68c-6.23-6.23-16.34-6.23-22.58 0L4.68 125.7c-6.23 6.23-6.23 16.34 0 22.58L112.4 256 4.68 363.72c-6.23 6.23-6.23 16.34 0 22.58l25.03 25.03c6.23 6.23 16.34 6.23 22.58 0L160 303.6l107.72 107.72c6.23 6.23 16.34 6.23 22.58 0l25.03-25.03c6.23-6.23 6.23-16.34 0-22.58L207.6 256z"></path></svg>`
                )}")`,
                'multiselect-tag-remove-icon': `url("${svgToDataUri(
                    `<svg viewBox="0 0 320 512" fill="currentColor" xmlns="http://www.w3.org/2000/svg"><path d="M207.6 256l107.72-107.72c6.23-6.23 6.23-16.34 0-22.58l-25.03-25.03c-6.23-6.23-16.34-6.23-22.58 0L160 208.4 52.28 100.68c-6.23-6.23-16.34-6.23-22.58 0L4.68 125.7c-6.23 6.23-6.23 16.34 0 22.58L112.4 256 4.68 363.72c-6.23 6.23-6.23 16.34 0 22.58l25.03 25.03c6.23 6.23 16.34 6.23 22.58 0L160 303.6l107.72 107.72c6.23 6.23 16.34 6.23 22.58 0l25.03-25.03c6.23-6.23 6.23-16.34 0-22.58L207.6 256z"></path></svg>`
                )}")`,
            }),
            borderWidth: {
                title: '0.1rem',
            },
            boxShadow: {
                '3xl': '0 1em 5em rgba(0, 0, 0, 0.3)',
                glow: '0 0 10px rgba(0, 0, 0, 0.3)',
            },
            colors: {
                'my-gray': 'var(--my-gray)',
            },
            fontFamily: {
                sans: ['Source Sans Pro', 'Segoe UI', 'Helvetica Neue', 'Arial', 'sans-serif'],
            },
            fontSize: {
                xxs: '10px',
                sm: '14px',
                base: '15px',
                lg: '20px',
                xl: '24px',
            },
            screens: {
                xxs: '374px',
                xs: '500px',
                '2xs': '739px',
                '2sm': '825px',
                '2md': '876px',
                '4xl': { min: '1971px' },
            },
            transitionProperty: {
                height: 'height',
            },
        },
    },
    daisyui: {
        themes: [
            {
                light: {
                    'color-scheme': 'light',
                    primary: '#ffffff', // Bianco pulito come base
                    'base-content': '#333333', // Testo scuro per un buon contrasto
                    secondary: '#f1f5f9', // Grigio chiarissimo per sfondo e sezioni
                    accent: '#0ea5e9', // Azzurro vivace e moderno per gli accenti
                    'base-100': '#f3f4f6', // Grigio molto chiaro per il background principale
                    'base-200': '#e5e7eb', // Per i contenuti secondari
                    'base-300': '#d1d5db', // Sfondo neutro per separatori o bordi
                    neutral: '#9ca3af', // Grigio medio per elementi neutri
                    'neutral-focus': '#6b7280', // Grigio più scuro per contenuti di focus
                    info: '#3b82f6', // Blu acceso e informativo
                    success: '#22c55e', // Verde per messaggi di successo
                    warning: '#f59e0b', // Giallo moderno per avvisi
                    error: '#ef4444', // Rosso brillante per errori

                    // Custom properties
                    '--base-100': '#fafafa', // Sfondo bianco pulito per un look minimalista
                    '--base-200': '#e5e7eb', // Per elementi secondari
                    '--base-300': '#d1d5db', // Separatore visibile ma discreto
                    '--my-accent': '#0ea5e9', // Accent azzurro moderno
                    '--my-gray': '#64748b', // Grigio chiaro per il testo secondario
                    '--my-purple': '#7c3aed', // Tocchi di viola per richiamare il tech
                    '--my-yellow': '#fbbf24', // Giallo vivace per notifiche
                    '--my-blue': '#2563eb', // Blu deciso per pulsanti e link
                    '--my-green': '#10b981', // Verde chiaro e moderno per notifiche di successo
                },
                dark: {
                    'color-scheme': 'dark',
                    primary: '#212121', // nero/grigio scuro per background
                    secondary: '#3a3a3a', // grigio più chiaro per elementi secondari
                    accent: '#f44336', // rosso per LIVE
                    info: '#2196f3', // blu per informazioni di stato e timer
                    success: '#4caf50', // verde per stato di attivo
                    warning: '#ffeb3b', // giallo per avvisi
                    error: '#ef5350', // rosso per errori
                    neutral: '#616161', // grigio neutro per sfondi o separatori
                    'base-100': '#1e1e1e', // base scura per il background
                    'base-200': '#2c2c2c', // base secondaria
                },
                boxShadow: {
                    sm: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
                    DEFAULT: '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)',
                    md: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
                    lg: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
                    xl: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
                    '2xl': '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
                    inner: 'inset 0 2px 4px 0 rgba(0, 0, 0, 0.06)',
                },
            },
        ],
    },
    plugins: [daisyui],
}

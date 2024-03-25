import type { Config } from 'tailwindcss';

const HEIGHT_HEADER = '48px';
export const HEIGHT_FOOTER = '48px';
const config: Config = {
    content: ['./src/pages/**/*.{js,ts,jsx,tsx,mdx}', './src/components/**/*.{js,ts,jsx,tsx,mdx}', './src/app/**/*.{js,ts,jsx,tsx,mdx}'],
    theme: {
        extend: {
            height: {
                header: HEIGHT_HEADER,
                'footer-fixed': HEIGHT_FOOTER,
                'conlection-home': `calc(-${HEIGHT_HEADER} + 100vh)`,
            },
            padding: {
                header: HEIGHT_HEADER,
                'header-categories': `calc(${HEIGHT_HEADER} + 60px)`,
                primary: '11px',
            },
            margin: {
                primary: '11px',
            },
            spacing: {
                header: HEIGHT_HEADER,
                'spacing-contaner': `calc(${HEIGHT_HEADER} + 20px)`,
            },
            colors: {
                primary: '#000',
                'primary-light': '#fff',
                heart: 'rgb(214,19,85)',
                'violet-primary': 'rgb(162,155,254)',
            },
            backgroundColor: {
                primary: '#fff',
                'primary-dark': '#000',
            },
            boxShadow: {
                box: 'rgba(149, 157, 165, 0.2) 0px 8px 24px;',
            },
        },
    },
    plugins: [],
};
export default config;

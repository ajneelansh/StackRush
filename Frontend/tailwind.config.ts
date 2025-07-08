import type { Config } from 'tailwindcss';

const config: Config = {
    content: ['./frontend/**/*.{js,ts,jsx,tsx}'],
    theme: {
        extend: {
            container : {
                padding:'1rem',
                centre:true,
            },
            
        },
    },
    plugins: [],
};

export default config;

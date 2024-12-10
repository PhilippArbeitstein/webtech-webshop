/** @type {import('tailwindcss').Config} */
module.exports = {
    content: ['./src/**/*.{html,ts,css}'],
    theme: {
        extend: {
            colors: {
                btn_primary: '#44E586',
                text_gray: '#CDCDCD'
            },
            fontFamily: {
                sans: ['Inter', 'ui-sans-serif', 'system-ui']
            },
            boxShadow: {
                'custom-top': 'rgba(0, 0, 0, 0.24) 0px 3px 8px'
            }
        }
    },
    plugins: []
};

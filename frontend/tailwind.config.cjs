import { searchForWorkspaceRoot } from 'vite';

const config = {
	content: [
		'./src/**/*.{html,js,svelte,ts}',
		searchForWorkspaceRoot(process.cwd()) + '/node_modules/flowbite-svelte/**/*.{html,js,svelte,ts}'
		// '../node_modules/flowbite-svelte/**/*.{html,js,svelte,ts}' // geht das eleganter?, eh so wie oben?
	],

	plugins: [require('flowbite/plugin')],

	darkMode: 'class',

	theme: {
		extend: {
			colors: {
				// flowbite-svelte
				primary: {
					50: '#FFF5F2',
					100: '#FFF1EE',
					200: '#FFE4DE',
					300: '#FFD5CC',
					400: '#FFBCAD',
					500: '#FE795D',
					600: '#EF562F',
					700: '#EB4F27',
					800: '#CC4522',
					900: '#A5371B'
				}
			},
			backgroundImage: {
				'gradient-radial': 'radial-gradient(circle at center, var(--tw-gradient-stops))'
			},
			keyframes: {
				colorous: {
					'0%, 100%': { filter: 'hue-rotate(0deg)' },
					'25%': { filter: 'hue-rotate(10deg)' },
					'75%': { filter: 'hue-rotate(-10deg)' }
				}
			},
			animation: {
				colorous: 'colorous 5s ease-in-out infinite'
			}
		}
	}
};

module.exports = config;

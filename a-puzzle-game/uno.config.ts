import {
    defineConfig,
    presetIcons,
    presetUno,
    presetWebFonts,
} from 'unocss'

export default defineConfig({
    shortcuts: [
        // ['btn', 'px-4 py-1 rounded inline-block bg-teal-600 text-white cursor-pointer hover:bg-teal-700 disabled:cursor-default disabled:bg-gray-600 disabled:opacity-50'],
        ['icon-btn', 'border-none text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm w-8 h-8 absolute top-2.5 end-2.5 flex items-center justify-center dark:hover:bg-gray-600 dark:hover:text-white'],
    ],
    presets: [
        presetUno(),
        presetIcons({
            scale: 2,
            warn: true,
            extraProperties: {
                'display': 'inline-block',
                'vertical-align': 'middle',
            },
        }),
        presetWebFonts({
            fonts: {
                sans: 'DM Sans',
                serif: 'DM Serif Display',
                mono: 'DM Mono',
            },
        }),
    ],
    theme: {
        colors: {
            primary: {
                50: "#EEF6F6",
                100: "#DDEEEE",
                200: "#B8DBDB",
                300: "#97C9C9",
                400: "#75B8B8",
                500: "#54A3A3",
                600: "#448383",
                700: "#326262",
                800: "#214040",
                900: "#112222",
                950: "#091111"
            }
        }
    }
})

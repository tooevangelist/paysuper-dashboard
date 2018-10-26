module.exports = {
    /*
    ** Headers of the page
    */
    env: {
        authServerUrl: 'http://auth.protocol.one.local:81/api/v1',
        socialNetworks: {
            facebook: { icon: 'fa-facebook' },
            vkontakte: { icon: 'fa-vk' },
            odnoklassniki: { icon: 'fa-odnoklassniki' }
        },
        apiServerUrl: 'http://127.0.0.1:3001/api/v1'
    },
    head: {
        title: 'PonePay',
        meta: [
            {charset: 'utf-8'},
            {name: 'viewport', content: 'width=device-width, initial-scale=1'},
            {hid: 'description', name: 'description', content: 'PONE payment solution customer control panel'}
        ],
        link: [
            {rel: 'icon', type: 'image/x-icon', href: '/favicon.ico'}
        ]
    },
    css: [
        { src: 'font-awesome/scss/font-awesome.scss', lang: 'scss' },
        { src: '@/assets/scss/style.scss', lang: 'scss' }
    ],
    /*
    ** Customize the progress bar color
    */
    loading: {color: '#3B8070'},
    /*
    ** Build configuration
    */
    build: {
        /*
        ** Run ESLint on save
        */
        extend(config, {isDev}) {
            if (isDev && process.client) {
                config.module.rules.push({
                    enforce: 'pre',
                    test: /\.(js|vue)$/,
                    loader: 'eslint-loader',
                    exclude: /(node_modules)/
                })
            }
        },
        build: {
            vendor: ['axios', 'jquery']
        }
    },
    modules: ['@nuxtjs/toast'],
    plugins: [
        { src: '~/plugins/vue-select', ssr: false }
    ],
    vendor: ['vue-select']
};


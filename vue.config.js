const resolve = dir => require('path').join(__dirname, dir)
module.exports = {
    publicPath: "./",
    configureWebpack: {
        resolve: {
            alias: {
                '@': resolve('./src'),
                components: '@/components',
                assets: '@/assets',
                network: '@/network',
                views: '@/views',
                router: '@/router',
                store: '@/store',
                constants: '@/constants'
            }
        }
    },
    transpileDependencies: ['@xdh/my'],
    chainWebpack(chain) {
        chain.resolve.alias.set('$ui', '@xdh/my/ui/lib')
    },
    lintOnSave: true
}

module.exports = {
    apps : [{
        name: "dashboard",
        script: "serve",
        env: {
            PM2_SERVE_PATH: './dist',
            PM2_SERVE_PORT: 9090,
            PM2_SERVE_SPA: 'true',
            PM2_SERVE_HOMEPAGE: '/index.html'
        }
    }]
}
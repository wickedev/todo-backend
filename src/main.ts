import { Application } from '~/application'
;(async () => {
    const app = await Application.bootstrap()
    app.start()
})()

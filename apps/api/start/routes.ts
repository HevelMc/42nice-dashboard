/*
|--------------------------------------------------------------------------
| Routes file
|--------------------------------------------------------------------------
|
| The routes file is used for defining the HTTP routes.
|
*/

import router from '@adonisjs/core/services/router'
import { middleware } from './kernel.js'

router.group(() => {
  router.get('/lines', '#controllers/lines_controller.index')
  router.get('/intra/clusters', '#controllers/intra_controller.clusters')
  router.get('/intra/events', '#controllers/intra_controller.events')
  router.get('/intra/coalitions', '#controllers/intra_controller.coalitions')
  router.get('/motd', '#controllers/motd_controller.index')
})

router.post('/users/login', '#controllers/users_controller.login')

router
  .group(() => {
    router.resource('/users', '#controllers/users_controller')
    router.patch('/motd', '#controllers/motd_controller.update')
  })
  .use(middleware.auth())

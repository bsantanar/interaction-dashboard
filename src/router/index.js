import Vue from 'vue'
import VueRouter from 'vue-router'
import Home from '../views/Home.vue'
import Login from '../views/Login.vue'
import ListProject from '../views/Projects/List.vue'
import NewProject from '../views/Projects/New.vue'
import EditProject from '../views/Projects/Edit.vue'
import DeleteProject from '../views/Projects/Delete.vue'
import ListActivity from '../views/Activities/List.vue'
import NewActivity from '../views/Activities/New.vue'
import EditActivity from '../views/Activities/Edit.vue'
import DeleteActivity from '../views/Activities/Delete.vue'
import ListPublication from '../views/Publications/List.vue'
import NewPublication from '../views/Publications/New.vue'
import EditPublication from '../views/Publications/Edit.vue'
import DeletePublication from '../views/Publications/Delete.vue'
import ListMember from '../views/Members/List.vue'
import NewMember from '../views/Members/New.vue'
import EditMember from '../views/Members/Edit.vue'
import DeleteMember from '../views/Members/Delete.vue'
import ListResource from '../views/Resources/List.vue'
import NewResource from '../views/Resources/New.vue'
import EditResource from '../views/Resources/Edit.vue'
import DeleteResource from '../views/Resources/Delete.vue'
import ListDataset from '../views/Datasets/List.vue'
import NewDataset from '../views/Datasets/New.vue'
import EditDataset from '../views/Datasets/Edit.vue'
import DeleteDataset from '../views/Datasets/Delete.vue'
import ListUser from '../views/Users/List.vue'
import NewUser from '../views/Users/New.vue'
import EditUser from '../views/Users/Edit.vue'
import DeleteUser from '../views/Users/Delete.vue'
import ListCategory from '../views/Categories/List.vue'
import NewCategory from '../views/Categories/New.vue'
import EditCategory from '../views/Categories/Edit.vue'
import DeleteCategory from '../views/Categories/Delete.vue'

Vue.use(VueRouter)

const routes = [
  {
    path: '*',
    name: 'Home',
    component: Home
  },
  {
    path: '/login',
    name: 'Login',
    component: Login
  },
  {
    path: '/projects/list',
    name: 'ListProject',
    component: ListProject
  },
  {
    path: '/projects/new',
    name: 'NewProject',
    component: NewProject
  },
  {
    path: '/projects/edit',
    name: 'EditProject',
    component: EditProject
  },
  {
    path: '/projects/delete',
    name: 'DeleteProject',
    component: DeleteProject
  },
  {
    path: '/activities/list',
    name: 'ListActivity',
    component: ListActivity
  },
  {
    path: '/activities/new',
    name: 'NewActivity',
    component: NewActivity
  },
  {
    path: '/activities/edit',
    name: 'EditActivity',
    component: EditActivity
  },
  {
    path: '/activities/delete',
    name: 'DeleteActivity',
    component: DeleteActivity
  },
  {
    path: '/publications/list',
    name: 'ListPublication',
    component: ListPublication
  },
  {
    path: '/publications/new',
    name: 'NewPublication',
    component: NewPublication
  },
  {
    path: '/publications/edit',
    name: 'EditPublication',
    component: EditPublication
  },
  {
    path: '/publications/delete',
    name: 'DeletePublication',
    component: DeletePublication
  },
  {
    path: '/members/list',
    name: 'ListMember',
    component: ListMember
  },
  {
    path: '/members/new',
    name: 'NewMember',
    component: NewMember
  },
  {
    path: '/members/edit',
    name: 'EditMember',
    component: EditMember
  },
  {
    path: '/members/delete',
    name: 'DeleteMember',
    component: DeleteMember
  },
  {
    path: '/resources/list',
    name: 'ListResource',
    component: ListResource
  },
  {
    path: '/resources/new',
    name: 'NewResource',
    component: NewResource
  },
  {
    path: '/resources/edit',
    name: 'EditResource',
    component: EditResource
  },
  {
    path: '/resources/delete',
    name: 'DeleteResource',
    component: DeleteResource
  },
  {
    path: '/datasets/list',
    name: 'ListDataset',
    component: ListDataset
  },
  {
    path: '/datasets/new',
    name: 'NewDataset',
    component: NewDataset
  },
  {
    path: '/datasets/edit',
    name: 'EditDataset',
    component: EditDataset
  },
  {
    path: '/datasets/delete',
    name: 'DeleteDataset',
    component: DeleteDataset
  },
  {
    path: '/users/list',
    name: 'ListUser',
    component: ListUser,
  },
  {
    path: '/users/new',
    name: 'NewUser',
    component: NewUser
  },
  {
    path: '/users/edit',
    name: 'EditUser',
    component: EditUser
  },
  {
    path: '/users/delete',
    name: 'DeleteUser',
    component: DeleteUser
  },
  {
    path: '/categories/list',
    name: 'ListCategory',
    component: ListCategory,
  },
  {
    path: '/categories/new',
    name: 'NewCategory',
    component: NewCategory
  },
  {
    path: '/categories/edit',
    name: 'EditCategory',
    component: EditCategory
  },
  {
    path: '/categories/delete',
    name: 'DeleteCategory',
    component: DeleteCategory
  }
]

const router = new VueRouter({
  routes
})

router.beforeEach((to, from, next) => {
  if (to.name !== 'Login' && !localStorage.getItem('token')) next({ name: 'Login' })
  else next()
})

export default router

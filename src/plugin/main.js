import ViewImg from './ViewImg.vue'

export {
  ViewImg
}

export default {
  install: function (Vue, globalOptions) {
    Vue.component('view-img', ViewImg)
  }
}

// Install by default if included from script tag
// if (typeof window !== 'undefined' && window.Vue) {
//   window.Vue.use(install)
// }
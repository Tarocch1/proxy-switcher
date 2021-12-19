declare module '*.vue' {
  import { DefineComponent } from 'vue'
  const component: DefineComponent<{}, {}, any> // eslint-disable-line @typescript-eslint/ban-types,@typescript-eslint/no-explicit-any
  export default component
}

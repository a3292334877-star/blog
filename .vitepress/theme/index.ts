import DefaultTheme from 'vitepress/theme'
import { defineAsyncComponent } from 'vue'
import Layout from './Layout.vue'
import MathShowcase from './components/MathShowcase.vue'
import ExampleBox from './components/ExampleBox.vue'
import ExampleSolution from './components/ExampleSolution.vue'
import StepCards from './components/StepCards.vue'
import StepCard from './components/StepCard.vue'
import QuizPanel from './components/QuizPanel.vue'
import './custom.css'

// 仅在个别页面使用的较重组件按需加载，避免全站每个页面都下载它们的代码。
const BlogList = defineAsyncComponent(() => import('./components/BlogList.vue'))
const BlogTimeline = defineAsyncComponent(() => import('./components/BlogTimeline.vue'))
const TagCloud = defineAsyncComponent(() => import('./components/TagCloud.vue'))
const FriendLinks = defineAsyncComponent(() => import('./components/FriendLinks.vue'))
const AnimeList = defineAsyncComponent(() => import('./components/AnimeList.vue'))
const ShuoshuoTimeline = defineAsyncComponent(() => import('./components/ShuoshuoTimeline.vue'))
const OdeDecisionTree = defineAsyncComponent(() => import('./components/OdeDecisionTree.vue'))
const OdeIntegralCurves = defineAsyncComponent(() => import('./components/OdeIntegralCurves.vue'))

export default {
  extends: DefaultTheme,
  Layout,
  enhanceApp({ app }) {
    app.component('BlogList', BlogList)
    app.component('BlogTimeline', BlogTimeline)
    app.component('TagCloud', TagCloud)
    app.component('FriendLinks', FriendLinks)
    app.component('AnimeList', AnimeList)
    app.component('ShuoshuoTimeline', ShuoshuoTimeline)
    app.component('MathShowcase', MathShowcase)
    app.component('ExampleBox', ExampleBox)
    app.component('ExampleSolution', ExampleSolution)
    app.component('StepCards', StepCards)
    app.component('StepCard', StepCard)
    app.component('QuizPanel', QuizPanel)
    app.component('OdeDecisionTree', OdeDecisionTree)
    app.component('OdeIntegralCurves', OdeIntegralCurves)
  },
}

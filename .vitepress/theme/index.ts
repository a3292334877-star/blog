import DefaultTheme from 'vitepress/theme'
import Layout from './Layout.vue'
import HomeHero from './components/HomeHero.vue'
import BlogList from './components/BlogList.vue'
import BlogTimeline from './components/BlogTimeline.vue'
import TagCloud from './components/TagCloud.vue'
import SiteStats from './components/SiteStats.vue'
import AnimePreview from './components/AnimePreview.vue'
import ProjectsPreview from './components/ProjectsPreview.vue'
import ShuoshuoPreview from './components/ShuoshuoPreview.vue'
import FriendLinks from './components/FriendLinks.vue'
import AnimeList from './components/AnimeList.vue'
import ShuoshuoTimeline from './components/ShuoshuoTimeline.vue'
import MathShowcase from './components/MathShowcase.vue'
import ExampleBox from './components/ExampleBox.vue'
import ExampleSolution from './components/ExampleSolution.vue'
import StepCards from './components/StepCards.vue'
import StepCard from './components/StepCard.vue'
import QuizPanel from './components/QuizPanel.vue'
import OdeDecisionTree from './components/OdeDecisionTree.vue'
import OdeIntegralCurves from './components/OdeIntegralCurves.vue'
import './custom.css'

export default {
  extends: DefaultTheme,
  Layout,
  enhanceApp({ app }) {
    app.component('HomeHero', HomeHero)
    app.component('BlogList', BlogList)
    app.component('BlogTimeline', BlogTimeline)
    app.component('TagCloud', TagCloud)
    app.component('SiteStats', SiteStats)
    app.component('AnimePreview', AnimePreview)
    app.component('ProjectsPreview', ProjectsPreview)
    app.component('ShuoshuoPreview', ShuoshuoPreview)
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

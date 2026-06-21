<template>
  <section class="home-preview projects-preview">
    <h2 class="section-heading">
      <span class="icon">🚀</span> 我的项目
      <a :href="withBase('projects/')" class="more-link">全部 →</a>
    </h2>

    <div class="projects-grid">
      <a
        v-for="(p, i) in projects"
        :key="p.slug"
        :href="withBase(`projects/${p.slug}`)"
        class="project-card"
        :style="{ animationDelay: i * 100 + 'ms' }"
      >
        <div class="project-cover" v-if="p.cover">
          <img :src="p.cover" :alt="p.title" loading="lazy" />
        </div>
        <div class="project-cover project-cover--placeholder" v-else>
          <span>📦</span>
        </div>
        <div class="project-body">
          <div class="project-title">{{ p.title }}</div>
          <div class="project-desc">{{ p.desc }}</div>
          <div class="project-tags" v-if="p.tags?.length">
            <span v-for="t in p.tags.slice(0, 4)" :key="t" class="project-tag">{{ t }}</span>
          </div>
        </div>
      </a>
    </div>
  </section>
</template>

<script setup lang="ts">
import { useData } from 'vitepress'
import { data } from '../../home.data.mjs'

const { site } = useData()
const base = site.value.base
function withBase(p: string) { return base + p.replace(/^\//, '') }

const projects = data.projects
</script>

<style scoped>
.home-preview {
  max-width: 1080px;
  margin: 0 auto;
  padding: 32px 24px;
}

.section-heading {
  font-size: 22px;
  margin-bottom: 24px;
  display: flex;
  align-items: baseline;
  gap: 10px;
}
.more-link {
  margin-left: auto;
  font-size: 13px;
  font-weight: 400;
  color: var(--vp-c-text-3);
  transition: color 0.2s;
}
.more-link:hover { color: var(--accent-color); }

.projects-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 20px;
}

.project-card {
  background: var(--vp-c-bg);
  border: 1px solid var(--vp-c-divider);
  border-radius: 14px;
  overflow: hidden;
  transition: transform 0.3s, box-shadow 0.3s, border-color 0.3s;
  opacity: 0;
  transform: translateY(16px);
  animation: card-in 0.6s cubic-bezier(0.2, 0.8, 0.2, 1) forwards;
}
@keyframes card-in {
  to { opacity: 1; transform: translateY(0); }
}
.project-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 12px 28px rgba(228,89,111,0.15);
  border-color: var(--accent-color);
}

.project-cover {
  width: 100%;
  aspect-ratio: 16 / 9;
  overflow: hidden;
  background: var(--sakura-light);
}
.project-cover img {
  width: 100%; height: 100%;
  object-fit: cover;
  transition: transform 0.5s ease;
}
.project-card:hover .project-cover img { transform: scale(1.05); }

.project-cover--placeholder {
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, var(--sakura-pink), var(--sakura-warm));
  font-size: 40px;
}

.project-body { padding: 16px 18px 18px; }

.project-title {
  font-size: 17px;
  font-weight: 700;
  font-family: var(--vp-font-family-title);
  color: var(--vp-c-text-1);
  margin-bottom: 8px;
}

.project-desc {
  font-size: 13px;
  line-height: 1.6;
  color: var(--vp-c-text-2);
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.project-tags {
  display: flex;
  gap: 6px;
  margin-top: 12px;
  flex-wrap: wrap;
}
.project-tag {
  font-size: 11px;
  padding: 2px 8px;
  background: var(--sakura-light);
  border-radius: 10px;
  color: var(--vp-c-text-2);
}
</style>

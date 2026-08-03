import { readFileSync, writeFileSync } from 'node:fs'
import { resolve } from 'node:path'

const files = [
  'learn/standard-japanese/elementary.md',
  'learn/standard-japanese/intermediate.md',
  'learn/standard-japanese/advanced.md',
]

const groups = {
  '动1': [
    '働く', '休む', '歩く', '帰る', '飲む', '買う', '送る', 'もらう', '会う',
    '分かる', 'かかる', '曲がる', '渡る', '使う', '座る', '入る', '申す', '取る',
    '吸う', '開く', '似合う', '触る', '脱ぐ', '転ぶ', '返す', '弾く', '泊まる',
    'やる', '違う', '込む', '決まる', '見送る', '思う', '言う', '探す', '笑う',
    '防ぐ', '回る', '走る', '通う', '集まる', '踊る', '要る', '困る', '拾う',
    '訳す', '選ぶ', '止まる', '謝る', '守る', '押す', 'つく', '下がる',
    '引っ越す', '閉まる', '壊す', '掛かる', '落とす', '飾る', '変わる', '通る',
    '空く', '持ち歩く', '見渡す', '続く', '向かう', '戻る', '終わる', '着く',
    '叱る', '頼む', '盗む', '踏む', '手伝う', '減る', '広がる', '済む',
    '積む', '育つ', '召し上がる', 'ご覧になる', 'おっしゃる', 'いらっしゃる',
    'なさる', '過ごす', '参る', '伺う', '出迎える', '従う', '身につく',
    '取り組む', '筋が通る', '疑う', '広まる', '取り上げる', '異なる',
    '当てはまる', '味わう', '受け継ぐ', '根づく', '着こなす', '心を打つ',
    '響く', '歩み寄る',
  ],
  '动2': [
    '起きる', '寝る', '食べる', '見る', 'あげる', 'できる', '出る', '開ける', 'つける',
    '降りる', '忘れる', '慌てる', '集める', '調べる', '遅れる', '届ける',
    '逃げる', '壊れる', '片づける', '決める', '割れる', '消える', '並べる',
    '見える', '聞こえる', '受ける', '通じる', '慣れる', '育てる', '始める',
    '続ける', '褒める', '目覚める', '過ぎる', '老いる', '進める', '仕上げる',
    '避ける', '任せる', '引き受ける', '申し出る', '乗り越える', '試みる',
    'やり遂げる', '諦める', '耐える', '存じる', '増える',
    '辞める', '重ねる',
  ],
  '动3': [
    '案内する', '紹介する', '相談する', '出発する', '到着する', '保存する',
    '用意する', '連絡する', '参加する', '合格する', '発見する', '設計する',
    '入院する', '拝見する', '意識する', '定着する', '承知する', '駆使する',
  ],
  '动1·使役': ['働かせる', '通わせる'],
  '动1·进行': ['変わりつつある'],
  '动1·郑重': ['ございます'],
  '形1': [
    '辛い', '甘い', '熱い', '冷たい', '高い', '安い', '難しい', 'おいしい',
    '若い', '暖かい', '明るい', '長い', '短い', '軽い', '優しい', '細い',
    '黒い', '欲しい', '新しい', 'うれしい', '正しい', '申し訳ない',
    'やむを得ない',
  ],
  '形2': [
    '静か', 'にぎやか', '有名', '親切', '元気', '便利', 'きれい', '好き',
    '嫌い', '大丈夫', '健康', '心配', '必要', '自由', '丈夫', '残念', '自然',
    '確実', '確か', '明らか', '危険', '単純', '幸い', '不満', '困難', '不安',
    '意外', '可能', '不可欠', '徹底的', '恐縮', '持続可能', '迷惑', '楽しみ',
    '当然', '不注意',
  ],
  '助动': ['らしい'],
}

const labels = new Map()
for (const [label, words] of Object.entries(groups)) {
  for (const word of words) {
    if (labels.has(word)) throw new Error(`重复词条：${word}`)
    labels.set(word, label)
  }
}

function escapeRegExp(value) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
}

function labelBody(body, label) {
  const parts = body.split('，')
  const currentLabel = parts.findIndex((part) => /^(?:动[123]|形[12]|助动)/.test(part))
  if (currentLabel >= 0) {
    parts[currentLabel] = label
    return parts.join('，')
  }
  const firstLooksLikeReading = /^[ぁ-んァ-ヶー・／a-zA-Z]+$/.test(parts[0])
  if (firstLooksLikeReading && parts.length > 1) {
    return [parts[0], label, ...parts.slice(1)].join('，')
  }
  return [label, ...parts].join('，')
}

let changedFiles = 0
let labeledEntries = 0
for (const relativePath of files) {
  const path = resolve(relativePath)
  const original = readFileSync(path, 'utf8')
  const lines = original.split('\n').map((line) => {
    if (!line.startsWith('- **核心词汇**：')) return line
    let output = line
    for (const [word, label] of labels) {
      const pattern = new RegExp(`${escapeRegExp(word)}（([^）]*)）`, 'g')
      output = output.replace(pattern, (_match, body) => {
        const next = labelBody(body, label)
        if (next !== body) labeledEntries++
        return `${word}（${next}）`
      })
    }
    return output
  }).join('\n')
  if (original !== lines) {
    writeFileSync(path, lines, 'utf8')
    changedFiles++
  }
}

console.log(`词性标注完成：${labeledEntries} 个词条，${changedFiles} 个文件已更新`)

import type {
  Category,
  Ingredient,
  PrepStep,
  Recipe,
  Step,
  Unit,
} from '../types'
import { computeNutrition } from '../lib/nutrition'

let seq = 0

// —— 构造辅助函数（减少手写样板）——

function food(name: string, amount: number, unit: Unit = '克', prep?: string): Ingredient {
  return { name, amount, unit, type: '主食材', prep }
}
function season(name: string, amount: number, unit: Unit = '克', prep?: string): Ingredient {
  return { name, amount, unit, type: '调料', prep }
}

interface StepOpts {
  d?: number // duration 分钟
  h?: string // heat 火候
  done?: string // doneWhen 判断标准
  tip?: string // 新手提示
}
function step(order: number, action: string, o: StepOpts = {}): Step {
  return { order, action, duration: o.d, heat: o.h, doneWhen: o.done, tip: o.tip }
}

interface Def {
  category: Category
  name: string
  mainIngredient: string
  emoji: string
  ingredients: Ingredient[]
  allergens?: string[]
  tags?: string[]
  difficulty?: 1 | 2 | 3
  tools?: string[]
  prep?: PrepStep[]
  steps: Step[]
  tips?: string[]
  description?: string
}

function define(d: Def): Recipe {
  seq += 1
  const n = computeNutrition(d.ingredients)
  const cookTime = d.steps.reduce((s, x) => s + (x.duration ?? 0), 0)
  const prepTime = (d.prep ?? []).reduce((s, x) => s + (x.duration ?? 0), 0)
  return {
    id: `${d.category}-${String(seq).padStart(2, '0')}`,
    name: d.name,
    category: d.category,
    calories: n.calories,
    protein: n.protein,
    carbs: n.carbs,
    fat: n.fat,
    ingredients: d.ingredients,
    tools: d.tools,
    prep: d.prep,
    steps: d.steps,
    mainIngredient: d.mainIngredient,
    allergens: d.allergens ?? [],
    tags: d.tags ?? [],
    cookTime,
    prepTime: prepTime > 0 ? prepTime : undefined,
    difficulty: d.difficulty ?? 1,
    emoji: d.emoji,
    description: d.description,
    tips: d.tips,
    source: { source: 'ai', reviewStatus: 'pending' },
  }
}

export const RECIPES: Recipe[] = [
  // ===================== 早餐 =====================
  define({
    category: 'breakfast', name: '燕麦牛奶粥', mainIngredient: '燕麦', emoji: '🥣',
    ingredients: [food('燕麦', 40), food('牛奶', 250, '毫升'), season('蜂蜜', 10), food('蓝莓', 30)],
    allergens: ['milk', 'gluten'], tags: ['素食'], difficulty: 1, tools: ['小锅', '勺子'],
    steps: [
      step(1, '牛奶倒入小锅，小火加热', { d: 2, h: '小火', done: '锅边冒细小气泡', tip: '别开大火，牛奶易溢锅' }),
      step(2, '加入燕麦搅拌，小火慢煮', { d: 3, h: '小火', done: '燕麦变软、粥体浓稠', tip: '勤搅拌防止糊底' }),
      step(3, '关火拌入蜂蜜，撒上蓝莓', { d: 1, done: '蜂蜜完全拌匀' }),
    ],
    tips: ['用快熟/即食燕麦更省时', '牛奶全程小火，沸腾会溢出'],
  }),
  define({
    category: 'breakfast', name: '水煮蛋配全麦吐司', mainIngredient: '鸡蛋', emoji: '🍳',
    ingredients: [food('鸡蛋', 2, '个'), food('全麦吐司', 2, '片'), food('生菜', 40)],
    allergens: ['egg', 'gluten'], tags: [], difficulty: 1, tools: ['小锅', '吐司机(可选)'],
    prep: [{ action: '鸡蛋洗净', duration: 1 }],
    steps: [
      step(1, '鸡蛋冷水下锅，中火煮开', { d: 5, h: '中火', done: '水沸腾' }),
      step(2, '转小火再煮 8 分钟', { d: 8, h: '小火', done: '蛋白凝固、蛋黄刚好全熟', tip: '煮久蛋黄发绿不影响吃' }),
      step(3, '捞出过凉水剥壳，吐司烤至微脆', { d: 2, done: '吐司表面金黄' }),
      step(4, '摆上生菜与切半鸡蛋', { d: 1, done: '摆盘完成' }),
    ],
    tips: ['水煮蛋煮好后立刻过凉水更好剥', '吐司可烤可不烤，按喜好来'],
  }),
  define({
    category: 'breakfast', name: '牛油果吐司', mainIngredient: '牛油果', emoji: '🥑',
    ingredients: [food('牛油果', 1, '个', '压成泥'), food('全麦吐司', 2, '片'), food('鸡蛋', 1, '个', '煮熟切片')],
    allergens: ['egg', 'gluten'], tags: ['素食'], difficulty: 1, tools: ['小锅', '叉子'],
    steps: [
      step(1, '鸡蛋煮熟切片', { d: 8, h: '中火', done: '蛋黄全熟' }),
      step(2, '牛油果对半切开去核，压成泥', { d: 2, done: '呈顺滑果泥' }),
      step(3, '吐司烤至微脆，抹上牛油果泥', { d: 2, done: '果泥抹匀' }),
      step(4, '铺上鸡蛋片', { d: 1, done: '摆盘完成' }),
    ],
    tips: ['牛油果要熟软才易压泥', '可撒一点黑胡椒提味'],
  }),
  define({
    category: 'breakfast', name: '希腊酸奶莓果杯', mainIngredient: '酸奶', emoji: '🫐',
    ingredients: [food('酸奶', 250), food('蓝莓', 40), food('草莓', 40, '克', '切块'), season('蜂蜜', 10)],
    allergens: ['milk'], tags: ['素食', '高蛋白'], difficulty: 1, tools: ['杯子', '勺子'],
    steps: [
      step(1, '酸奶倒入杯中', { d: 1, done: '铺满杯底' }),
      step(2, '铺上蓝莓与草莓块', { d: 1, done: '水果均匀分布' }),
      step(3, '淋上蜂蜜', { d: 1, done: '蜂蜜均匀淋上' }),
    ],
    tips: ['选浓稠的希腊酸奶口感更好', '水果可换成当季莓果'],
  }),
  define({
    category: 'breakfast', name: '香蕉花生酱吐司', mainIngredient: '香蕉', emoji: '🍌',
    ingredients: [food('香蕉', 1, '个', '切片'), season('花生酱', 20), food('全麦吐司', 2, '片')],
    allergens: ['peanut', 'gluten'], tags: ['素食'], difficulty: 1, tools: ['吐司机(可选)'],
    steps: [
      step(1, '吐司烤至微脆', { d: 2, done: '表面金黄' }),
      step(2, '均匀抹上花生酱', { d: 1, done: '薄薄一层抹匀' }),
      step(3, '香蕉切片铺上', { d: 1, done: '铺满表面' }),
    ],
    tips: ['花生酱抹薄一点更清爽', '香蕉选熟透的更香甜'],
  }),
  define({
    category: 'breakfast', name: '小米粥配咸鸭蛋', mainIngredient: '小米', emoji: '🥚',
    ingredients: [food('小米', 50), food('咸鸭蛋', 1, '个'), food('榨菜', 15)],
    allergens: ['egg'], tags: ['素食'], difficulty: 1, tools: ['小锅'],
    steps: [
      step(1, '小米淘洗后加水，大火煮开', { d: 5, h: '大火', done: '水沸腾' }),
      step(2, '转小火慢熬至米粒开花', { d: 18, h: '小火', done: '粥变粘稠', tip: '中途搅拌防糊' }),
      step(3, '咸鸭蛋剥壳切半，配榨菜上桌', { d: 2, done: '摆盘完成' }),
    ],
    tips: ['咸鸭蛋已咸，粥里少放盐', '小米粥可提前一晚预约熬煮'],
  }),
  define({
    category: 'breakfast', name: '鸡蛋蔬菜煎饼', mainIngredient: '鸡蛋', emoji: '🥞',
    ingredients: [food('鸡蛋', 2, '个'), food('面粉', 60), food('胡萝卜', 30, '克', '切丝'), season('葱', 5, '克', '切末')],
    allergens: ['egg', 'gluten'], tags: ['素食'], difficulty: 2, tools: ['平底锅', '打蛋器'],
    steps: [
      step(1, '鸡蛋打散，加面粉调成可流动面糊', { d: 2, done: '面糊无颗粒' }),
      step(2, '拌入胡萝卜丝与葱末', { d: 1, done: '配料拌匀' }),
      step(3, '平底锅刷油，倒入面糊摊平', { d: 2, h: '中小火', done: '面糊铺满锅底' }),
      step(4, '两面煎至金黄', { d: 4, h: '中小火', done: '两面金黄、中间熟透', tip: '火大易外焦内生' }),
    ],
    tips: ['面糊稀一点饼更薄更脆', '翻面前等边缘翘起再翻'],
  }),
  define({
    category: 'breakfast', name: '豆浆配油条', mainIngredient: '黄豆', emoji: '🥖',
    ingredients: [food('黄豆', 30), food('油条', 50), food('面粉', 10)],
    allergens: ['soy', 'gluten'], tags: ['素食'], difficulty: 1, tools: ['豆浆机'],
    steps: [
      step(1, '黄豆提前浸泡', { d: 360, done: '豆子泡发', tip: '可前一晚泡' }),
      step(2, '泡好的黄豆加水打成豆浆', { d: 20, h: '机器', done: '豆浆细腻无渣' }),
      step(3, '豆浆煮开，油条切段', { d: 5, h: '中火', done: '豆浆沸腾' }),
    ],
    tips: ['生豆浆必须彻底煮沸', '油条热量高，适量即可'],
  }),
  define({
    category: 'breakfast', name: '全麦火腿三明治', mainIngredient: '火腿', emoji: '🥪',
    ingredients: [food('火腿', 2, '片'), food('全麦面包', 2, '片'), food('生菜', 30), food('番茄', 50, '克', '切片')],
    allergens: ['gluten'], tags: [], difficulty: 1, tools: ['刀'],
    steps: [
      step(1, '番茄切片，生菜洗净沥干', { d: 2, done: '蔬菜备好' }),
      step(2, '面包上依次铺生菜、火腿、番茄', { d: 1, done: '层层叠好' }),
      step(3, '盖上另一片面包压紧，对半切开', { d: 1, done: '切面整齐' }),
    ],
    tips: ['面包可先烤一下更香', '可加一点芥末酱提味'],
  }),
  define({
    category: 'breakfast', name: '隔夜燕麦', mainIngredient: '燕麦', emoji: '🌾',
    ingredients: [food('燕麦', 50), food('牛奶', 200, '毫升'), season('奇亚籽', 10), food('香蕉', 0.5, '个', '切片')],
    allergens: ['milk', 'gluten'], tags: ['素食'], difficulty: 1, tools: ['密封罐'],
    prep: [{ action: '燕麦、牛奶、奇亚籽拌匀后冷藏过夜', duration: 480 }],
    steps: [
      step(1, '燕麦、牛奶、奇亚籽倒入密封罐拌匀', { d: 2, done: '奇亚籽均匀分布' }),
      step(2, '冷藏过夜', { d: 480, h: '冷藏', done: '燕麦吸饱变软' }),
      step(3, '早上取出，铺上香蕉片', { d: 1, done: '香蕉片铺好' }),
    ],
    tips: ['奇亚籽遇液体会变黏，拌匀即可', '可提前备好几罐'],
  }),
  define({
    category: 'breakfast', name: '红薯配鸡蛋', mainIngredient: '红薯', emoji: '🍠',
    ingredients: [food('红薯', 200), food('鸡蛋', 1, '个')],
    allergens: ['egg'], tags: ['素食'], difficulty: 1, tools: ['蒸锅'],
    steps: [
      step(1, '红薯洗净，鸡蛋洗净', { d: 1, done: '食材洗净' }),
      step(2, '红薯与鸡蛋一起上锅蒸', { d: 20, h: '大火', done: '筷子能轻松插入红薯' }),
      step(3, '取出剥壳去皮', { d: 1, done: '蒸熟透' }),
    ],
    tips: ['红薯选红心更甜', '鸡蛋一起蒸省时'],
  }),
  define({
    category: 'breakfast', name: '豆腐脑', mainIngredient: '豆腐', emoji: '🍮',
    ingredients: [food('豆腐', 250), season('酱油', 15, '毫升'), season('香菜', 5)],
    allergens: ['soy'], tags: ['素食', '低碳'], difficulty: 2, tools: ['蒸锅'],
    steps: [
      step(1, '嫩豆腐放入碗中蒸热', { d: 8, h: '大火', done: '豆腐热透' }),
      step(2, '淋上酱油，撒香菜', { d: 1, done: '调味均匀' }),
    ],
    tips: ['选嫩豆腐口感才像豆腐脑', '可加一点榨菜丁增味'],
  }),
  define({
    category: 'breakfast', name: '藜麦牛奶粥', mainIngredient: '藜麦', emoji: '🌾',
    ingredients: [food('藜麦', 40), food('牛奶', 250, '毫升'), season('蜂蜜', 10)],
    allergens: ['milk'], tags: ['素食', '无麸质'], difficulty: 1, tools: ['小锅'],
    steps: [
      step(1, '藜麦淘洗后加水煮开', { d: 5, h: '大火', done: '水沸腾' }),
      step(2, '转小火煮至藜麦出小芽', { d: 10, h: '小火', done: '藜麦透明、出现小白圈' }),
      step(3, '倒掉多余水，加入牛奶煮热', { d: 2, h: '小火', done: '牛奶温热' }),
      step(4, '拌入蜂蜜', { d: 1, done: '蜂蜜拌匀' }),
    ],
    tips: ['藜麦煮出小白圈就熟了', '可加坚果碎增香'],
  }),
  define({
    category: 'breakfast', name: '酸奶水果杯', mainIngredient: '酸奶', emoji: '🍎',
    ingredients: [food('酸奶', 180), food('苹果', 60, '克', '切丁'), food('香蕉', 0.5, '个', '切片'), food('燕麦', 15)],
    allergens: ['milk', 'gluten'], tags: ['素食'], difficulty: 1, tools: ['杯子'],
    steps: [
      step(1, '酸奶倒入杯中', { d: 1, done: '铺满杯底' }),
      step(2, '依次铺苹果丁、香蕉片、燕麦', { d: 2, done: '层次分明' }),
    ],
    tips: ['即吃即拌，燕麦久泡会软', '可淋少许蜂蜜'],
  }),
  define({
    category: 'breakfast', name: '鸡蛋火腿卷饼', mainIngredient: '鸡蛋', emoji: '🌯',
    ingredients: [food('鸡蛋', 2, '个'), food('火腿', 2, '片'), food('卷饼', 1, '片')],
    allergens: ['egg', 'gluten'], tags: [], difficulty: 2, tools: ['平底锅'],
    steps: [
      step(1, '鸡蛋打散，平底锅摊成蛋皮', { d: 3, h: '中小火', done: '蛋液凝固', tip: '火大蛋皮易破' }),
      step(2, '卷饼铺上蛋皮与火腿', { d: 1, done: '铺平' }),
      step(3, '卷起压紧，小火烙至饼皮金黄', { d: 3, h: '小火', done: '饼皮酥脆' }),
    ],
    tips: ['卷饼先热一下更软', '卷紧一点不易散'],
  }),
  define({
    category: 'breakfast', name: '玉米配牛奶', mainIngredient: '玉米', emoji: '🌽',
    ingredients: [food('玉米', 1, '个'), food('牛奶', 250, '毫升')],
    allergens: ['milk'], tags: ['素食'], difficulty: 1, tools: ['蒸锅'],
    steps: [
      step(1, '玉米蒸熟', { d: 15, h: '大火', done: '玉米粒饱满易剥' }),
      step(2, '牛奶加热至温热', { d: 2, h: '小火', done: '牛奶温热不烫口' }),
    ],
    tips: ['玉米选甜玉米更嫩', '牛奶别煮沸，营养易流失'],
  }),
  define({
    category: 'breakfast', name: '蓝莓松饼', mainIngredient: '蓝莓', emoji: '🥞',
    ingredients: [food('蓝莓', 50), food('面粉', 70), food('鸡蛋', 1, '个'), food('牛奶', 100, '毫升')],
    allergens: ['egg', 'milk', 'gluten'], tags: ['素食'], difficulty: 2, tools: ['平底锅', '打蛋器'],
    steps: [
      step(1, '鸡蛋、牛奶、面粉调成面糊', { d: 2, done: '面糊顺滑无颗粒' }),
      step(2, '拌入蓝莓', { d: 1, done: '蓝莓均匀分布' }),
      step(3, '平底锅小火倒入一勺面糊', { d: 2, h: '小火', done: '表面冒泡' }),
      step(4, '翻面煎至两面金黄', { d: 3, h: '小火', done: '内部熟透', tip: '表面冒泡后再翻面' }),
    ],
    tips: ['面糊别调太稀，松饼才厚', '可淋蜂蜜或酸奶'],
  }),
  define({
    category: 'breakfast', name: '蔬菜豆腐汤配杂粮馒头', mainIngredient: '豆腐', emoji: '🍲',
    ingredients: [food('豆腐', 200), food('白菜', 100), food('杂粮馒头', 1, '个')],
    allergens: ['soy', 'gluten'], tags: ['素食'], difficulty: 2, tools: ['汤锅', '蒸锅'],
    steps: [
      step(1, '白菜洗净切段，豆腐切块', { d: 3, done: '食材切配好' }),
      step(2, '水开后下白菜与豆腐煮至熟', { d: 6, h: '中火', done: '白菜软、豆腐入味' }),
      step(3, '馒头同时上锅蒸热', { d: 8, h: '大火', done: '馒头热透' }),
    ],
    tips: ['汤里加一点白胡椒更暖胃', '豆腐别煮太久易碎'],
  }),

  // ===================== 午餐 =====================
  define({
    category: 'lunch', name: '鸡胸肉沙拉', mainIngredient: '鸡胸肉', emoji: '🥗',
    ingredients: [food('鸡胸肉', 220), food('生菜', 80), food('番茄', 80), food('黄瓜', 80), season('油醋汁', 30, '毫升')],
    allergens: [], tags: ['高蛋白', '低碳'], difficulty: 1, tools: ['平底锅', '沙拉碗'],
    prep: [{ action: '鸡胸肉用盐和黑胡椒腌 10 分钟', duration: 10 }],
    steps: [
      step(1, '鸡胸肉小火煎至两面金黄', { d: 8, h: '小火', done: '切开无血水、内部发白', tip: '火大外焦内生' }),
      step(2, '生菜、番茄、黄瓜洗净切块', { d: 3, done: '蔬菜切配好' }),
      step(3, '鸡胸肉切片，与蔬菜装碗', { d: 2, done: '摆盘完成' }),
      step(4, '淋上油醋汁拌匀', { d: 1, done: '酱汁拌匀' }),
    ],
    tips: ['鸡胸肉先腌制更嫩', '油醋汁可按口味减量'],
  }),
  define({
    category: 'lunch', name: '牛肉盖饭', mainIngredient: '牛肉', emoji: '🍚',
    ingredients: [food('牛肉', 150, '克', '切薄片'), food('米饭', 200), food('洋葱', 50, '克', '切丝'), season('酱油', 15, '毫升')],
    allergens: ['soy'], tags: ['高蛋白'], difficulty: 2, tools: ['平底锅', '电饭煲'],
    steps: [
      step(1, '米饭煮熟', { d: 30, h: '电饭煲', done: '米饭软糯' }),
      step(2, '洋葱炒软后下牛肉片', { d: 4, h: '中火', done: '牛肉变色' }),
      step(3, '加酱油翻炒至收汁', { d: 2, h: '中火', done: '汤汁浓稠挂勺', tip: '牛肉别炒老' }),
      step(4, '浇在米饭上', { d: 1, done: '摆盘完成' }),
    ],
    tips: ['牛肉切薄片更嫩', '先炒洋葱出香再下牛肉'],
  }),
  define({
    category: 'lunch', name: '三文鱼藜麦碗', mainIngredient: '三文鱼', emoji: '🍣',
    ingredients: [food('三文鱼', 150), food('藜麦', 60), food('牛油果', 0.5, '个', '切片'), food('西兰花', 80)],
    allergens: ['fish'], tags: ['高蛋白'], difficulty: 2, tools: ['平底锅', '小锅'],
    steps: [
      step(1, '藜麦加水煮熟', { d: 15, h: '中火', done: '藜麦出小白圈' }),
      step(2, '西兰花焯水断生', { d: 3, h: '大火', done: '西兰花变翠绿' }),
      step(3, '三文鱼煎至两面金黄', { d: 6, h: '中小火', done: '鱼肉易散、中心不透明' }),
      step(4, '所有食材装碗，铺牛油果片', { d: 2, done: '摆盘完成' }),
    ],
    tips: ['三文鱼煎前吸干水分不易粘锅', '可挤一点柠檬汁去腥'],
  }),
  define({
    category: 'lunch', name: '番茄鸡蛋面', mainIngredient: '番茄', emoji: '🍜',
    ingredients: [food('番茄', 150, '克', '切块'), food('鸡蛋', 2, '个'), food('面条', 170)],
    allergens: ['egg', 'gluten'], tags: ['素食'], difficulty: 1, tools: ['汤锅'],
    steps: [
      step(1, '鸡蛋炒散盛出', { d: 2, h: '中火', done: '鸡蛋凝固' }),
      step(2, '番茄炒出汁', { d: 3, h: '中火', done: '番茄软烂出沙', tip: '番茄炒出沙才香' }),
      step(3, '加水煮开下面条', { d: 5, h: '大火', done: '面条熟透' }),
      step(4, '倒回鸡蛋，调味', { d: 1, done: '汤汁融合' }),
    ],
    tips: ['番茄多炒一会儿汤更浓', '面煮到中间无白芯即可'],
  }),
  define({
    category: 'lunch', name: '照烧鸡腿饭', mainIngredient: '鸡腿', emoji: '🍗',
    ingredients: [food('鸡腿肉', 200, '克', '去骨'), food('米饭', 200), season('照烧酱', 30, '毫升')],
    allergens: ['soy'], tags: ['高蛋白'], difficulty: 2, tools: ['平底锅', '电饭煲'],
    steps: [
      step(1, '米饭煮熟', { d: 30, h: '电饭煲', done: '米饭软糯' }),
      step(2, '鸡腿肉皮朝下煎至金黄', { d: 5, h: '中小火', done: '鸡皮焦黄出油' }),
      step(3, '翻面后淋照烧酱，焖煮收汁', { d: 8, h: '小火', done: '汤汁浓稠裹住鸡腿', tip: '小火避免酱烧焦' }),
      step(4, '切块铺在米饭上', { d: 1, done: '摆盘完成' }),
    ],
    tips: ['鸡皮朝下先煎，逼出油更香', '照烧酱含糖，注意收汁别糊'],
  }),
  define({
    category: 'lunch', name: '虾仁炒饭', mainIngredient: '虾', emoji: '🍤',
    ingredients: [food('虾', 120, '克', '去壳去虾线'), food('米饭', 200), food('鸡蛋', 1, '个'), food('豌豆', 40)],
    allergens: ['shellfish', 'egg'], tags: [], difficulty: 2, tools: ['炒锅'],
    steps: [
      step(1, '鸡蛋炒散盛出', { d: 2, h: '中火', done: '鸡蛋凝固' }),
      step(2, '虾仁炒至变色', { d: 3, h: '中火', done: '虾仁卷曲变红', tip: '虾仁别炒老' }),
      step(3, '下米饭、豌豆、鸡蛋大火翻炒', { d: 4, h: '大火', done: '米饭粒粒分明' }),
    ],
    tips: ['用隔夜饭炒更干爽', '虾仁最后放口感嫩'],
  }),
  define({
    category: 'lunch', name: '豆腐蔬菜盖饭', mainIngredient: '豆腐', emoji: '🍚',
    ingredients: [food('豆腐', 200, '克', '切块'), food('米饭', 180), food('西兰花', 80), food('胡萝卜', 50, '克', '切片')],
    allergens: ['soy'], tags: ['素食'], difficulty: 1, tools: ['平底锅', '电饭煲'],
    steps: [
      step(1, '米饭煮熟', { d: 30, h: '电饭煲', done: '米饭软糯' }),
      step(2, '西兰花、胡萝卜焯水断生', { d: 3, h: '大火', done: '蔬菜变翠绿' }),
      step(3, '豆腐煎至两面金黄', { d: 5, h: '中小火', done: '豆腐表面金黄' }),
      step(4, '全部铺在米饭上，淋少许酱油', { d: 1, done: '摆盘完成' }),
    ],
    tips: ['豆腐煎前吸干水分不易碎', '可淋一点照烧酱提味'],
  }),
  define({
    category: 'lunch', name: '意面番茄肉酱', mainIngredient: '意面', emoji: '🍝',
    ingredients: [food('牛肉', 120, '克', '剁碎'), food('意面', 100), food('番茄', 150, '克', '切丁'), season('奶酪', 10, '克', '擦碎')],
    allergens: ['gluten', 'milk'], tags: [], difficulty: 2, tools: ['汤锅', '平底锅'],
    steps: [
      step(1, '意面加盐煮至八分熟', { d: 8, h: '大火', done: '面芯微硬', tip: '水要够宽' }),
      step(2, '牛肉末炒散，下番茄丁炒出汁', { d: 5, h: '中火', done: '番茄软烂出沙' }),
      step(3, '意面倒回酱中翻拌', { d: 2, h: '中火', done: '酱汁裹满面' }),
      step(4, '撒奶酪碎', { d: 1, done: '奶酪融化' }),
    ],
    tips: ['煮面水要加盐，面更有底味', '意面煮到八分熟再回锅'],
  }),
  define({
    category: 'lunch', name: '韩式石锅拌饭', mainIngredient: '米饭', emoji: '🍲',
    ingredients: [food('米饭', 200), food('鸡蛋', 1, '个', '煎半熟'), food('牛肉', 80, '克', '切丝'), food('菠菜', 60, '克', '焯水'), food('胡萝卜', 50, '克', '切丝')],
    allergens: ['egg', 'soy'], tags: [], difficulty: 2, tools: ['平底锅', '电饭煲'],
    steps: [
      step(1, '米饭煮熟，蔬菜分别焯熟或炒熟', { d: 8, h: '中火', done: '蔬菜断生' }),
      step(2, '牛肉丝炒至变色', { d: 3, h: '中火', done: '牛肉熟透' }),
      step(3, '煎一个半熟蛋', { d: 2, h: '小火', done: '蛋白凝固、蛋黄流心' }),
      step(4, '米饭铺底，摆上配菜与鸡蛋', { d: 2, done: '摆盘完成' }),
    ],
    tips: ['配菜分开炒，颜色更好看', '拌饭酱按口味加'],
  }),
  define({
    category: 'lunch', name: '鸡肉牛油果卷', mainIngredient: '鸡肉', emoji: '🌯',
    ingredients: [food('鸡胸肉', 150), food('牛油果', 0.5, '个', '切片'), food('卷饼', 1, '片'), food('生菜', 40)],
    allergens: ['gluten'], tags: ['高蛋白'], difficulty: 1, tools: ['平底锅'],
    steps: [
      step(1, '鸡胸肉煎熟切条', { d: 8, h: '中小火', done: '鸡肉内部发白' }),
      step(2, '卷饼铺生菜、鸡肉条、牛油果片', { d: 2, done: '铺平' }),
      step(3, '卷起压紧，小火烙至金黄', { d: 3, h: '小火', done: '饼皮酥脆' }),
    ],
    tips: ['鸡肉切条更方便卷', '卷紧后烙不易散'],
  }),
  define({
    category: 'lunch', name: '金枪鱼三明治', mainIngredient: '金枪鱼', emoji: '🥪',
    ingredients: [food('金枪鱼', 120), food('全麦面包', 2, '片'), food('生菜', 30), season('蛋黄酱', 15)],
    allergens: ['fish', 'gluten', 'egg'], tags: ['高蛋白'], difficulty: 1, tools: ['刀'],
    steps: [
      step(1, '金枪鱼沥干，拌入蛋黄酱', { d: 2, done: '金枪鱼泥拌匀' }),
      step(2, '面包铺生菜与金枪鱼泥', { d: 1, done: '铺平' }),
      step(3, '盖上另一片面包，对半切开', { d: 1, done: '切面整齐' }),
    ],
    tips: ['选水浸金枪鱼更低脂', '可加一点洋葱末提味'],
  }),
  define({
    category: 'lunch', name: '鹰嘴豆素食碗', mainIngredient: '鹰嘴豆', emoji: '🥙',
    ingredients: [food('鹰嘴豆', 120, '克', '煮熟'), food('藜麦', 50), food('生菜', 60), food('番茄', 80), season('橄榄油', 10, '毫升')],
    allergens: [], tags: ['素食'], difficulty: 1, tools: ['小锅'],
    steps: [
      step(1, '藜麦煮熟', { d: 15, h: '中火', done: '藜麦出小白圈' }),
      step(2, '鹰嘴豆煮熟沥干', { d: 20, h: '中火', done: '豆子软烂', tip: '可提前泡发' }),
      step(3, '生菜、番茄切块，与所有食材装碗', { d: 3, done: '摆盘完成' }),
      step(4, '淋橄榄油拌匀', { d: 1, done: '油拌匀' }),
    ],
    tips: ['鹰嘴豆可提前煮好冷藏', '加一点柠檬汁更清爽'],
  }),
  define({
    category: 'lunch', name: '牛肉面', mainIngredient: '牛肉', emoji: '🍜',
    ingredients: [food('牛肉', 150, '克', '切块'), food('面条', 150), food('青菜', 80), food('高汤', 300, '毫升')],
    allergens: ['gluten'], tags: ['高蛋白'], difficulty: 2, tools: ['汤锅'],
    steps: [
      step(1, '牛肉块焯水去血沫', { d: 5, h: '大火', done: '血沫撇净' }),
      step(2, '牛肉加高汤炖至软烂', { d: 40, h: '小火', done: '筷子能插透牛肉', tip: '炖久一点更软' }),
      step(3, '下面条与青菜煮熟', { d: 5, h: '大火', done: '面条熟透' }),
    ],
    tips: ['牛肉焯水去腥更清爽', '面条另煮再浇汤不易浑'],
  }),
  define({
    category: 'lunch', name: '咖喱鸡饭', mainIngredient: '鸡肉', emoji: '🍛',
    ingredients: [food('鸡胸肉', 150, '克', '切块'), food('米饭', 180), season('咖喱', 40), food('土豆', 80, '克', '切块'), food('胡萝卜', 50, '克', '切块')],
    allergens: ['milk'], tags: [], difficulty: 2, tools: ['汤锅', '电饭煲'],
    steps: [
      step(1, '米饭煮熟', { d: 30, h: '电饭煲', done: '米饭软糯' }),
      step(2, '鸡肉块炒至变色', { d: 4, h: '中火', done: '鸡肉表面发白' }),
      step(3, '加土豆、胡萝卜与水煮软', { d: 10, h: '中火', done: '土豆变软' }),
      step(4, '加咖喱块搅化，小火煮至浓稠', { d: 5, h: '小火', done: '汤汁浓稠挂勺', tip: '咖喱易糊，需搅拌' }),
    ],
    tips: ['咖喱块最后放，易糊锅', '可加椰奶更香浓'],
  }),
  define({
    category: 'lunch', name: '蔬菜炒面', mainIngredient: '面条', emoji: '🍝',
    ingredients: [food('面条', 250), food('青菜', 100), food('胡萝卜', 40, '克', '切丝'), food('豆芽', 60), season('橄榄油', 10, '毫升')],
    allergens: ['gluten'], tags: ['素食'], difficulty: 1, tools: ['炒锅'],
    steps: [
      step(1, '面条煮熟过凉水', { d: 5, h: '大火', done: '面条熟透' }),
      step(2, '胡萝卜丝、豆芽、青菜大火快炒', { d: 3, h: '大火', done: '蔬菜断生' }),
      step(3, '下面条翻炒，调味', { d: 3, h: '大火', done: '面条均匀裹上味道' }),
    ],
    tips: ['面条过凉水更筋道', '全程大火快炒才不粘'],
  }),
  define({
    category: 'lunch', name: '猪排饭', mainIngredient: '猪排', emoji: '🍱',
    ingredients: [food('猪肉', 150, '克', '拍成猪排'), food('米饭', 200), food('面包糠', 30), food('鸡蛋', 1, '个')],
    allergens: ['egg', 'gluten'], tags: ['高蛋白'], difficulty: 2, tools: ['平底锅', '电饭煲'],
    steps: [
      step(1, '米饭煮熟', { d: 30, h: '电饭煲', done: '米饭软糯' }),
      step(2, '猪排裹蛋液与面包糠', { d: 3, done: '面包糠裹匀' }),
      step(3, '中小火炸至两面金黄', { d: 8, h: '中小火', done: '外酥里熟', tip: '油温别太高' }),
      step(4, '切条铺在米饭上', { d: 1, done: '摆盘完成' }),
    ],
    tips: ['猪排先拍松更嫩', '炸两遍更酥脆'],
  }),
  define({
    category: 'lunch', name: '什锦寿司', mainIngredient: '米饭', emoji: '🍣',
    ingredients: [food('三文鱼', 80), food('米饭', 180), food('海苔', 2, '片'), food('黄瓜', 60, '克', '切条'), food('鸡蛋', 1, '个', '摊蛋皮切条')],
    allergens: ['fish', 'egg', 'soy'], tags: [], difficulty: 3, tools: ['寿司卷帘'],
    steps: [
      step(1, '米饭放凉，加少许醋拌匀', { d: 5, done: '米饭微凉不粘手' }),
      step(2, '海苔铺上米饭，放三文鱼、黄瓜、蛋皮', { d: 3, done: '配料摆好' }),
      step(3, '用卷帘卷紧', { d: 2, done: '卷成紧实圆条', tip: '卷紧才不散' }),
      step(4, '切段装盘', { d: 2, done: '切面整齐' }),
    ],
    tips: ['刀沾水切不易粘', '米饭别铺太厚'],
  }),
  define({
    category: 'lunch', name: '鸡胸肉能量碗', mainIngredient: '鸡胸肉', emoji: '🥗',
    ingredients: [food('鸡胸肉', 200), food('糙米', 60), food('西兰花', 80), food('牛油果', 0.5, '个', '切片')],
    allergens: [], tags: ['高蛋白'], difficulty: 2, tools: ['平底锅', '小锅'],
    steps: [
      step(1, '糙米加水煮熟', { d: 35, h: '中火', done: '糙米软糯' }),
      step(2, '鸡胸肉煎至两面金黄', { d: 8, h: '中小火', done: '内部发白无血水' }),
      step(3, '西兰花焯水断生', { d: 3, h: '大火', done: '西兰花翠绿' }),
      step(4, '全部装碗，铺牛油果片', { d: 2, done: '摆盘完成' }),
    ],
    tips: ['糙米可提前泡更易煮', '鸡胸肉切片摆盘更好看'],
  }),

  // ===================== 晚餐 =====================
  define({
    category: 'dinner', name: '清蒸鲈鱼', mainIngredient: '鲈鱼', emoji: '🐟',
    ingredients: [food('鲈鱼', 400, '克', '处理干净'), season('姜', 10, '克', '切丝'), season('葱', 10, '克', '切丝'), season('蒸鱼豉油', 20, '毫升')],
    allergens: ['fish', 'soy'], tags: ['高蛋白', '低碳'], difficulty: 2, tools: ['蒸锅'],
    prep: [{ action: '鲈鱼用料酒、姜丝腌 10 分钟去腥', duration: 10 }],
    steps: [
      step(1, '鱼身划花刀，铺姜丝', { d: 2, done: '姜丝铺匀' }),
      step(2, '水开后上锅蒸', { d: 12, h: '大火', done: '鱼肉易脱骨、筷子能插透', tip: '蒸太久鱼肉老' }),
      step(3, '倒掉盘底汤汁，铺葱丝淋豉油', { d: 1, done: '调味均匀' }),
      step(4, '淋一勺热油激香', { d: 1, done: '葱丝被热油激出香味' }),
    ],
    tips: ['水开后再下锅，鱼肉更嫩', '蒸鱼时间按鱼大小调整'],
  }),
  define({
    category: 'dinner', name: '番茄牛腩', mainIngredient: '牛腩', emoji: '🍅',
    ingredients: [food('牛腩', 200, '克', '切块'), food('番茄', 150, '克', '切块'), food('土豆', 100, '克', '切块')],
    allergens: [], tags: ['高蛋白'], difficulty: 3, tools: ['汤锅'],
    steps: [
      step(1, '牛腩焯水去血沫', { d: 5, h: '大火', done: '血沫撇净' }),
      step(2, '牛腩炖至软烂', { d: 50, h: '小火', done: '筷子能插透' }),
      step(3, '下番茄与土豆再炖', { d: 15, h: '小火', done: '番茄融化、土豆软糯', tip: '番茄后放保留酸香' }),
    ],
    tips: ['牛腩炖久更软糯', '番茄炒出沙再炖更浓'],
  }),
  define({
    category: 'dinner', name: '蒜蓉西兰花炒虾', mainIngredient: '虾', emoji: '🥦',
    ingredients: [food('虾', 300, '克', '去壳去虾线'), food('西兰花', 150), season('蒜', 4, '瓣', '切末'), season('橄榄油', 10, '毫升')],
    allergens: ['shellfish'], tags: ['高蛋白', '低碳'], difficulty: 1, tools: ['炒锅'],
    steps: [
      step(1, '西兰花焯水断生', { d: 3, h: '大火', done: '西兰花翠绿' }),
      step(2, '蒜末爆香', { d: 1, h: '中火', done: '蒜香四溢', tip: '别炒糊' }),
      step(3, '下虾仁炒至变色', { d: 3, h: '中火', done: '虾仁卷曲变红' }),
      step(4, '下西兰花翻炒调味', { d: 2, h: '大火', done: '味道裹匀' }),
    ],
    tips: ['蒜末炒香是灵魂', '虾仁别炒太久会老'],
  }),
  define({
    category: 'dinner', name: '豆腐煲', mainIngredient: '豆腐', emoji: '🍲',
    ingredients: [food('豆腐', 250, '克', '切块'), food('香菇', 60, '克', '切片'), food('青菜', 100), food('粉丝', 30), season('橄榄油', 10, '毫升')],
    allergens: ['soy'], tags: ['素食'], difficulty: 2, tools: ['砂锅/汤锅'],
    steps: [
      step(1, '香菇片炒香', { d: 3, h: '中火', done: '香菇出香味' }),
      step(2, '加水烧开，下豆腐与粉丝', { d: 6, h: '中火', done: '豆腐入味、粉丝变软' }),
      step(3, '下青菜烫熟', { d: 2, done: '青菜断生' }),
    ],
    tips: ['豆腐先煎一下更不易碎', '粉丝吸水，汤可稍多一点'],
  }),
  define({
    category: 'dinner', name: '宫保鸡丁', mainIngredient: '鸡肉', emoji: '🌶️',
    ingredients: [food('鸡胸肉', 180, '克', '切丁'), food('花生', 20), season('干辣椒', 5), food('黄瓜', 60, '克', '切丁'), season('橄榄油', 10, '毫升')],
    allergens: ['peanut', 'soy'], tags: [], difficulty: 2, tools: ['炒锅'],
    prep: [{ action: '鸡丁用酱油、淀粉抓匀腌 10 分钟', duration: 10 }],
    steps: [
      step(1, '鸡丁滑炒至变色盛出', { d: 3, h: '中火', done: '鸡丁表面发白' }),
      step(2, '干辣椒爆香，下鸡丁、黄瓜丁翻炒', { d: 3, h: '大火', done: '香味出来' }),
      step(3, '下花生米，调入酱汁收浓', { d: 2, h: '大火', done: '酱汁裹匀' }),
    ],
    tips: ['花生米最后放保持脆', '鸡丁先腌更嫩滑'],
  }),
  define({
    category: 'dinner', name: '红烧肉', mainIngredient: '五花肉', emoji: '🍖',
    ingredients: [food('五花肉', 150, '克', '切块'), season('冰糖', 15), season('酱油', 20, '毫升'), season('八角', 1, '克')],
    allergens: ['soy'], tags: [], difficulty: 3, tools: ['炒锅', '汤锅'],
    steps: [
      step(1, '五花肉焯水去浮沫', { d: 5, h: '大火', done: '浮沫撇净' }),
      step(2, '冰糖小火炒出糖色', { d: 3, h: '小火', done: '冰糖融化成枣红色', tip: '糖色别炒糊，会苦' }),
      step(3, '下五花肉裹糖色，加酱油与八角', { d: 2, h: '中火', done: '肉块上色' }),
      step(4, '加水小火焖至软烂', { d: 60, h: '小火', done: '筷子能插透、汤汁浓稠' }),
    ],
    tips: ['糖色炒到位是红烧肉关键', '焖足时间才软糯'],
  }),
  define({
    category: 'dinner', name: '清炒时蔬配米饭', mainIngredient: '青菜', emoji: '🥬',
    ingredients: [food('青菜', 250), food('米饭', 250), food('胡萝卜', 50, '克', '切片'), food('香菇', 50, '克', '切片'), season('橄榄油', 10, '毫升')],
    allergens: [], tags: ['素食'], difficulty: 1, tools: ['炒锅', '电饭煲'],
    steps: [
      step(1, '米饭煮熟', { d: 30, h: '电饭煲', done: '米饭软糯' }),
      step(2, '香菇片、胡萝卜片炒软', { d: 3, h: '中火', done: '香菇出香' }),
      step(3, '下青菜大火快炒', { d: 2, h: '大火', done: '青菜断生', tip: '青菜别炒太久' }),
    ],
    tips: ['大火快炒蔬菜才脆嫩', '青菜最后放'],
  }),
  define({
    category: 'dinner', name: '照烧三文鱼', mainIngredient: '三文鱼', emoji: '🍣',
    ingredients: [food('三文鱼', 180), season('照烧酱', 25, '毫升'), season('芝麻', 5)],
    allergens: ['fish', 'soy'], tags: ['高蛋白', '低碳'], difficulty: 2, tools: ['平底锅'],
    steps: [
      step(1, '三文鱼吸干水分', { d: 1, done: '表面干爽', tip: '吸干才不粘锅' }),
      step(2, '中火煎至两面金黄', { d: 6, h: '中火', done: '表面焦香、中心不透明' }),
      step(3, '淋照烧酱，小火收浓', { d: 3, h: '小火', done: '酱汁裹住鱼身', tip: '别糊' }),
      step(4, '撒芝麻', { d: 1, done: '芝麻撒匀' }),
    ],
    tips: ['三文鱼别煎太老', '照烧酱含糖易焦，注意火候'],
  }),
  define({
    category: 'dinner', name: '麻婆豆腐', mainIngredient: '豆腐', emoji: '🌶️',
    ingredients: [food('豆腐', 250, '克', '切块'), food('猪肉', 70, '克', '剁碎'), season('花椒', 1), season('豆瓣酱', 20), season('橄榄油', 10, '毫升')],
    allergens: ['soy'], tags: [], difficulty: 2, tools: ['炒锅'],
    steps: [
      step(1, '豆腐块焯水定型', { d: 3, h: '中火', done: '豆腐不易碎', tip: '焯水加一点盐' }),
      step(2, '肉末炒散，下豆瓣酱炒出红油', { d: 3, h: '中火', done: '红油炒出' }),
      step(3, '加水下豆腐，小火焖入味', { d: 5, h: '小火', done: '豆腐入味' }),
      step(4, '勾薄芡，撒花椒', { d: 2, done: '汤汁浓稠' }),
    ],
    tips: ['豆瓣酱炒出红油才香', '豆腐焯水不易碎'],
  }),
  define({
    category: 'dinner', name: '白灼虾', mainIngredient: '虾', emoji: '🦐',
    ingredients: [food('虾', 250, '克', '处理干净'), season('姜', 10, '克', '切片'), season('生抽', 15, '毫升'), food('米饭', 130)],
    allergens: ['shellfish', 'soy'], tags: ['高蛋白', '低碳'], difficulty: 1, tools: ['汤锅'],
    steps: [
      step(1, '水加姜片烧开', { d: 4, h: '大火', done: '水沸腾' }),
      step(2, '下虾煮至变红', { d: 3, h: '大火', done: '虾身弯曲变红', tip: '煮久虾肉老' }),
      step(3, '捞出配生抽蘸食', { d: 1, done: '装盘完成' }),
    ],
    tips: ['虾煮到变红弯曲即可', '蘸汁可加姜丝'],
  }),
  define({
    category: 'dinner', name: '香菇鸡肉', mainIngredient: '鸡肉', emoji: '🍄',
    ingredients: [food('鸡胸肉', 180, '克', '切片'), food('香菇', 80, '克', '切片'), food('青椒', 50, '克', '切块'), food('米饭', 130), season('橄榄油', 10, '毫升')],
    allergens: [], tags: ['高蛋白', '低碳'], difficulty: 2, tools: ['炒锅'],
    steps: [
      step(1, '鸡片滑炒至变色盛出', { d: 3, h: '中火', done: '鸡片发白' }),
      step(2, '香菇片炒软出香', { d: 3, h: '中火', done: '香菇出香味' }),
      step(3, '下鸡片与青椒翻炒调味', { d: 2, h: '大火', done: '青椒断生' }),
    ],
    tips: ['香菇炒软更香', '鸡片别炒老'],
  }),
  define({
    category: 'dinner', name: '番茄炒蛋配米饭', mainIngredient: '番茄', emoji: '🍅',
    ingredients: [food('番茄', 150, '克', '切块'), food('鸡蛋', 2, '个'), food('米饭', 200)],
    allergens: ['egg'], tags: ['素食'], difficulty: 1, tools: ['炒锅', '电饭煲'],
    steps: [
      step(1, '米饭煮熟', { d: 30, h: '电饭煲', done: '米饭软糯' }),
      step(2, '鸡蛋炒散盛出', { d: 2, h: '中火', done: '鸡蛋凝固' }),
      step(3, '番茄炒出汁，倒回鸡蛋', { d: 3, h: '中火', done: '番茄软烂、汤汁融合' }),
    ],
    tips: ['番茄炒出沙更好吃', '鸡蛋先盛出保持嫩滑'],
  }),
  define({
    category: 'dinner', name: '冬瓜排骨汤配饭', mainIngredient: '排骨', emoji: '🍲',
    ingredients: [food('排骨', 150, '克', '剁块'), food('冬瓜', 150, '克', '切块'), food('米饭', 200), season('姜', 5, '克', '切片')],
    allergens: [], tags: [], difficulty: 2, tools: ['汤锅', '电饭煲'],
    steps: [
      step(1, '排骨焯水去血沫', { d: 5, h: '大火', done: '血沫撇净' }),
      step(2, '排骨加姜片炖至软', { d: 40, h: '小火', done: '肉易脱骨' }),
      step(3, '下冬瓜炖至透明', { d: 10, h: '中火', done: '冬瓜变透明' }),
    ],
    tips: ['冬瓜后放不易煮烂', '汤清味鲜即可，少放盐'],
  }),
  define({
    category: 'dinner', name: '烤鸡胸配红薯', mainIngredient: '鸡胸肉', emoji: '🍠',
    ingredients: [food('鸡胸肉', 200), food('红薯', 200), food('西兰花', 100)],
    allergens: [], tags: ['高蛋白'], difficulty: 2, tools: ['烤箱', '平底锅'],
    prep: [{ action: '鸡胸肉用盐、黑胡椒、橄榄油腌 15 分钟', duration: 15 }],
    steps: [
      step(1, '红薯入烤箱烤至软糯', { d: 30, h: '180℃', done: '筷子能插透红薯' }),
      step(2, '鸡胸肉煎至两面金黄', { d: 8, h: '中小火', done: '内部发白无血水' }),
      step(3, '西兰花焯水断生', { d: 3, h: '大火', done: '西兰花翠绿' }),
    ],
    tips: ['鸡胸肉先腌更嫩', '红薯烤到流蜜最甜'],
  }),
  define({
    category: 'dinner', name: '素食咖喱', mainIngredient: '鹰嘴豆', emoji: '🍛',
    ingredients: [food('鹰嘴豆', 100, '克', '煮熟'), food('椰奶', 100, '毫升'), food('土豆', 100, '克', '切块'), food('胡萝卜', 60, '克', '切块'), season('咖喱', 30)],
    allergens: [], tags: ['素食'], difficulty: 2, tools: ['汤锅'],
    steps: [
      step(1, '土豆、胡萝卜炒软', { d: 5, h: '中火', done: '土豆表面微黄' }),
      step(2, '加椰奶与水煮开，下鹰嘴豆', { d: 8, h: '中火', done: '土豆软糯' }),
      step(3, '加咖喱搅化，小火煮至浓稠', { d: 5, h: '小火', done: '汤汁浓稠挂勺', tip: '咖喱易糊，勤搅拌' }),
    ],
    tips: ['椰奶让咖喱更香浓', '鹰嘴豆提前煮熟'],
  }),
  define({
    category: 'dinner', name: '牛肉西兰花', mainIngredient: '牛肉', emoji: '🥦',
    ingredients: [food('牛肉', 250, '克', '切片'), food('西兰花', 150), season('蒜', 3, '瓣', '切末'), season('酱油', 15, '毫升'), season('橄榄油', 10, '毫升')],
    allergens: ['soy'], tags: ['高蛋白', '低碳'], difficulty: 2, tools: ['炒锅'],
    steps: [
      step(1, '西兰花焯水断生', { d: 3, h: '大火', done: '西兰花翠绿' }),
      step(2, '蒜末爆香，下牛肉片炒至变色', { d: 3, h: '中火', done: '牛肉变色', tip: '别炒老' }),
      step(3, '下西兰花与酱油翻炒', { d: 2, h: '大火', done: '味道裹匀' }),
    ],
    tips: ['牛肉切薄片大火快炒', '西兰花焯水后保持脆绿'],
  }),
  define({
    category: 'dinner', name: '蒸蛋配杂粮饭', mainIngredient: '鸡蛋', emoji: '🥚',
    ingredients: [food('鸡蛋', 2, '个'), food('杂粮饭', 200), season('葱', 5, '克', '切末')],
    allergens: ['egg'], tags: ['素食'], difficulty: 1, tools: ['蒸锅'],
    steps: [
      step(1, '鸡蛋打散加温水（1:1.5）', { d: 2, done: '蛋液均匀' }),
      step(2, '过筛去气泡，上锅小火蒸', { d: 10, h: '小火', done: '蛋羹凝固、表面光滑', tip: '小火蒸才嫩' }),
      step(3, '淋少许酱油，撒葱花', { d: 1, done: '调味完成' }),
    ],
    tips: ['蛋液过筛更嫩滑', '用温水蒸蛋不易起蜂窝'],
  }),
  define({
    category: 'dinner', name: '香煎豆腐配藜麦', mainIngredient: '豆腐', emoji: '🍳',
    ingredients: [food('豆腐', 250, '克', '切厚片'), food('藜麦', 60), food('菠菜', 100)],
    allergens: ['soy'], tags: ['素食', '无麸质'], difficulty: 2, tools: ['平底锅', '小锅'],
    steps: [
      step(1, '藜麦加水煮熟', { d: 15, h: '中火', done: '藜麦出小白圈' }),
      step(2, '豆腐煎至两面金黄', { d: 6, h: '中小火', done: '表面金黄', tip: '吸干水分不粘锅' }),
      step(3, '菠菜焯水断生', { d: 2, h: '大火', done: '菠菜变软' }),
    ],
    tips: ['豆腐吸干水分再煎', '藜麦煮出小白圈即熟'],
  }),

  // ===================== 点心 =====================
  define({
    category: 'snack', name: '原味酸奶', mainIngredient: '酸奶', emoji: '🥛',
    ingredients: [food('酸奶', 200)],
    allergens: ['milk'], tags: ['素食'], difficulty: 1, tools: ['杯子'],
    steps: [step(1, '酸奶倒入杯中即可食用', { d: 1, done: '装杯完成' })],
    tips: ['选无糖酸奶更健康', '可冷藏后风味更佳'],
  }),
  define({
    category: 'snack', name: '混合坚果', mainIngredient: '坚果', emoji: '🥜',
    ingredients: [food('混合坚果', 25), food('杏仁', 5), food('腰果', 5)],
    allergens: ['tree-nut'], tags: ['低碳'], difficulty: 1, tools: [],
    steps: [step(1, '混合坚果直接食用，控制分量', { d: 1, done: '约一小把(30克)' })],
    tips: ['坚果热量高，一小把即可', '选无盐原味更健康'],
  }),
  define({
    category: 'snack', name: '苹果配花生酱', mainIngredient: '苹果', emoji: '🍎',
    ingredients: [food('苹果', 1, '个', '切片'), season('花生酱', 15)],
    allergens: ['peanut'], tags: ['素食'], difficulty: 1, tools: ['刀'],
    steps: [
      step(1, '苹果切片', { d: 2, done: '切厚片' }),
      step(2, '蘸花生酱食用', { d: 1, done: '花生酱抹匀' }),
    ],
    tips: ['苹果切后易氧化，尽快吃', '花生酱薄蘸即可'],
  }),
  define({
    category: 'snack', name: '蛋白棒', mainIngredient: '蛋白棒', emoji: '🍫',
    ingredients: [food('蛋白棒', 1, '个'), food('乳清蛋白', 5), food('燕麦', 10)],
    allergens: ['milk', 'gluten'], tags: ['高蛋白'], difficulty: 1, tools: [],
    steps: [step(1, '蛋白棒直接食用，适合健身前后', { d: 1, done: '拆袋即食' })],
    tips: ['选低糖蛋白棒更健康', '健身前后 30 分钟吃效果佳'],
  }),
  define({
    category: 'snack', name: '香蕉', mainIngredient: '香蕉', emoji: '🍌',
    ingredients: [food('香蕉', 1, '个')],
    allergens: [], tags: ['素食'], difficulty: 1, tools: [],
    steps: [step(1, '香蕉剥皮即食', { d: 1, done: '熟软香甜' })],
    tips: ['香蕉是运动前快手能量', '选带芝麻点的更甜'],
  }),
  define({
    category: 'snack', name: '水煮蛋', mainIngredient: '鸡蛋', emoji: '🥚',
    ingredients: [food('鸡蛋', 2, '个')],
    allergens: ['egg'], tags: ['低碳'], difficulty: 1, tools: ['小锅'],
    steps: [
      step(1, '鸡蛋冷水下锅煮开', { d: 5, h: '中火', done: '水沸腾' }),
      step(2, '转小火再煮 8 分钟', { d: 8, h: '小火', done: '蛋黄全熟' }),
      step(3, '捞出过凉水剥壳', { d: 2, done: '剥壳完整' }),
    ],
    tips: ['过凉水更好剥壳', '煮 8 分钟蛋黄刚好全熟'],
  }),
  define({
    category: 'snack', name: '全麦饼干', mainIngredient: '小麦', emoji: '🍪',
    ingredients: [food('全麦粉', 40), food('鸡蛋', 0.5, '个'), season('蜂蜜', 10)],
    allergens: ['gluten', 'egg'], tags: ['素食'], difficulty: 2, tools: ['烤箱'],
    steps: [
      step(1, '全麦粉、蛋液、蜂蜜揉成团', { d: 3, done: '面团不粘手' }),
      step(2, '擀薄切块', { d: 3, done: '厚薄均匀' }),
      step(3, '烤箱烤至金黄酥脆', { d: 15, h: '170℃', done: '饼干上色酥脆' }),
    ],
    tips: ['擀薄一点更脆', '烤后放凉再吃更酥'],
  }),
  define({
    category: 'snack', name: '牛奶', mainIngredient: '牛奶', emoji: '🥛',
    ingredients: [food('牛奶', 250, '毫升')],
    allergens: ['milk'], tags: ['素食'], difficulty: 1, tools: ['杯子'],
    steps: [step(1, '牛奶温热后饮用', { d: 2, h: '小火', done: '温热不烫口' })],
    tips: ['睡前一杯助眠', '乳糖不耐可选无乳糖奶'],
  }),
  define({
    category: 'snack', name: '蓝莓酸奶杯', mainIngredient: '酸奶', emoji: '🫐',
    ingredients: [food('酸奶', 150), food('蓝莓', 40)],
    allergens: ['milk'], tags: ['素食'], difficulty: 1, tools: ['杯子'],
    steps: [
      step(1, '酸奶倒入杯中', { d: 1, done: '铺满杯底' }),
      step(2, '撒上蓝莓', { d: 1, done: '蓝莓铺匀' }),
    ],
    tips: ['蓝莓可冷冻保存', '选无糖酸奶更健康'],
  }),
  define({
    category: 'snack', name: '燕麦能量球', mainIngredient: '燕麦', emoji: '⚡',
    ingredients: [food('燕麦', 30), food('混合坚果', 10, '克', '切碎'), season('蜂蜜', 10)],
    allergens: ['tree-nut', 'gluten'], tags: ['素食'], difficulty: 1, tools: ['碗'],
    steps: [
      step(1, '燕麦、坚果碎、蜂蜜拌匀', { d: 3, done: '能捏成团' }),
      step(2, '搓成小球', { d: 3, done: '球体紧实' }),
      step(3, '冷藏定型', { d: 30, h: '冷藏', done: '球体变硬' }),
    ],
    tips: ['蜂蜜是天然粘合剂', '可裹椰蓉或可可粉'],
  }),
  define({
    category: 'snack', name: '黄瓜鹰嘴豆泥', mainIngredient: '鹰嘴豆', emoji: '🥒',
    ingredients: [food('鹰嘴豆', 80, '克', '煮熟'), food('黄瓜', 80, '克', '切条')],
    allergens: [], tags: ['素食'], difficulty: 1, tools: ['搅拌机'],
    steps: [
      step(1, '熟鹰嘴豆打成泥', { d: 3, done: '豆泥顺滑' }),
      step(2, '黄瓜切条，蘸豆泥食用', { d: 2, done: '摆盘完成' }),
    ],
    tips: ['可加一点橄榄油与柠檬汁', '豆泥冷藏更爽口'],
  }),
  define({
    category: 'snack', name: '坚果奶', mainIngredient: '坚果', emoji: '🥛',
    ingredients: [food('杏仁', 20, '克', '泡发'), food('水', 200, '毫升')],
    allergens: ['tree-nut'], tags: ['素食', '无麸质'], difficulty: 1, tools: ['搅拌机'],
    prep: [{ action: '杏仁提前泡 4 小时', duration: 240 }],
    steps: [
      step(1, '泡发杏仁与清水放入搅拌机', { d: 2, done: '原料备好' }),
      step(2, '高速打匀', { d: 2, done: '液体乳白细腻' }),
      step(3, '过滤即可饮用', { d: 2, done: '无渣顺滑' }),
    ],
    tips: ['过滤更顺滑', '可加一点蜂蜜调味'],
  }),
  define({
    category: 'snack', name: '黑巧克力', mainIngredient: '巧克力', emoji: '🍫',
    ingredients: [food('黑巧克力', 20)],
    allergens: ['milk'], tags: [], difficulty: 1, tools: [],
    steps: [step(1, '黑巧克力小块慢品，控制分量', { d: 1, done: '约 20 克' })],
    tips: ['选 70% 以上更健康', '一次别超 20 克'],
  }),
  define({
    category: 'snack', name: '烤鹰嘴豆', mainIngredient: '鹰嘴豆', emoji: '🫘',
    ingredients: [food('鹰嘴豆', 100, '克', '煮熟'), season('橄榄油', 5, '毫升')],
    allergens: [], tags: ['素食', '无麸质'], difficulty: 1, tools: ['烤箱'],
    steps: [
      step(1, '熟鹰嘴豆沥干，拌橄榄油', { d: 2, done: '豆子裹匀油' }),
      step(2, '烤箱烤至酥脆', { d: 25, h: '180℃', done: '豆子外酥内软' }),
    ],
    tips: ['烤干一点更脆', '可撒椒盐调味'],
  }),
  define({
    category: 'snack', name: '蛋白奶昔', mainIngredient: '乳清蛋白', emoji: '🥤',
    ingredients: [food('乳清蛋白', 20), food('香蕉', 0.5, '个', '切块'), food('牛奶', 150, '毫升')],
    allergens: ['milk'], tags: ['高蛋白'], difficulty: 1, tools: ['搅拌机'],
    steps: [
      step(1, '香蕉、牛奶、蛋白粉放入搅拌机', { d: 1, done: '原料备好' }),
      step(2, '高速打至顺滑', { d: 2, done: '奶昔顺滑无颗粒' }),
    ],
    tips: ['健身后来一杯补充蛋白', '香蕉冷冻后打更浓稠'],
  }),
  define({
    category: 'snack', name: '奶酪条', mainIngredient: '奶酪', emoji: '🧀',
    ingredients: [food('奶酪', 40)],
    allergens: ['milk'], tags: ['素食', '低碳'], difficulty: 1, tools: [],
    steps: [step(1, '奶酪切条即食', { d: 1, done: '切条完成' })],
    tips: ['选低脂奶酪更健康', '奶酪钠高，适量即可'],
  }),
]

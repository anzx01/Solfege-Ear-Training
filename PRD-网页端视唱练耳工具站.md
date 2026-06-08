# PRD：网页端视唱练耳工具站

## 1. 产品概述

### 1.1 产品名称

暂定名称：**Solfege Ear Trainer**

### 1.2 一句话定位

A free online movable-do solfege ear training tool for singers, music students, and beginners.

### 1.3 产品目标

做一个英文市场的网页端在线视唱练耳工具站，方法论参考 Web Harmonium：

- 通过 SEO 承接高意图搜索用户。
- 首屏直接交付可用工具。
- 不要求下载 App。
- 不强制注册账号。
- 第一版只解决一个具体动作：听到调性感和目标音后，选择正确的 movable-do 唱名。

核心用户需求可以概括为：

> I want to practice movable-do solfege ear training right now.

### 1.4 目标用户

- 英文市场用户。
- 音乐初学者。
- 合唱团成员。
- 学校音乐课学生。
- 自学 relative pitch / movable do / solfege 的练习者。
- 想在浏览器里快速练习 Do / Re / Mi / Fa / Sol / La / Ti 听感的人。

### 1.5 核心价值

- 打开网页即可练习。
- 不用安装手机 App。
- 不用注册账号。
- 不需要复杂乐理基础。
- 支持桌面端和移动端浏览器。
- 用即时反馈帮助用户建立 movable-do 听感。

---

## 2. 产品策略

### 2.1 方法论

本产品学习 Web Harmonium 的产品结构，而不是复制它的品类。

Web Harmonium 的关键方法是：

- 面向一个小众但明确的人群。
- 解决一个非常具体的动作。
- 用网页端降低使用门槛。
- 用 SEO 承接主动搜索需求。
- 首屏直接让用户得到结果。

本产品对应的策略是：

- 人群：学习 solfege / sight singing / relative pitch 的英文用户。
- 动作：听音后选择 Do / Re / Mi / Fa / Sol / La / Ti。
- 入口：`movable do ear training`、`solfege ear training`、`scale degree ear training` 等高意图关键词。
- 体验：打开网页，点击 `Start Practice`，立即进入练习。

### 2.2 产品边界

第一版不做大而全的音乐学习平台。

优先做：

- 一个好用的在线练习器。
- 少量高意图 SEO 页面。
- 基础统计。
- 后续 Pro 版本的入口和验证。

暂不做：

- 完整课程系统。
- 老师后台。
- 班级管理。
- 原生 App。
- 麦克风视唱评分。
- AI 伴练。

---

## 3. 平台形态

### 3.1 平台选择

产品形态为 **网页端优先的 Web app / browser-based tool**。

要求：

- 桌面端浏览器可用。
- 手机和平板浏览器可用。
- 不开发 iOS App。
- 不开发 Android App。
- 不把 PWA 安装作为首版核心目标。

### 3.2 设备适配

桌面端：

- 支持鼠标点击。
- 支持键盘快捷键。
- 练习器布局适合连续答题。

移动端：

- 支持触屏点击。
- 唱名按钮足够大，适合拇指操作。
- 页面不能横向滚动。
- 首屏需要直接看到练习入口。
- 音频播放必须由用户点击触发，避免移动浏览器拦截自动播放。

---

## 4. MVP 功能需求

### 4.1 核心练习

MVP 核心练习为：**听音选唱名**。

练习流程：

1. 用户进入页面。
2. 点击 `Start Practice`。
3. 系统播放调性感，例如 `I-V-I` 或 `I-IV-V-I`。
4. 系统播放一个目标音。
5. 用户从 `Do / Re / Mi / Fa / Sol / La / Ti` 中选择答案。
6. 系统立即反馈正确或错误。
7. 用户点击 `Next` 进入下一题。

### 4.2 唱名体系

第一版默认使用 **Movable Do**。

规则：

- Do 表示当前调的主音。
- Re 表示大调第二级。
- Mi 表示大调第三级。
- Fa 表示大调第四级。
- Sol 表示大调第五级。
- La 表示大调第六级。
- Ti 表示大调第七级。

第一版只做 major key，不做 minor key，不做 chromatic solfege。

### 4.3 答题按钮

页面显示七个固定唱名按钮：

- `Do`
- `Re`
- `Mi`
- `Fa`
- `Sol`
- `La`
- `Ti`

键盘快捷键：

- `1` = Do
- `2` = Re
- `3` = Mi
- `4` = Fa
- `5` = Sol
- `6` = La
- `7` = Ti

### 4.4 核心操作按钮

练习器至少包含以下操作：

- `Start Practice`
- `Replay Key`
- `Replay Note`
- `Show Answer`
- `Next`
- `Settings`

按钮行为：

- `Start Practice`：初始化音频上下文并生成第一题。
- `Replay Key`：重新播放当前题的调性感。
- `Replay Note`：重新播放当前题的目标音。
- `Show Answer`：显示正确答案，但记录为未答对或放弃。
- `Next`：生成下一题。
- `Settings`：打开练习设置面板。

### 4.5 难度模式

首版提供两个难度：

#### Beginner

- 默认启用 `Do / Mi / Sol`。
- 默认 cadence 为 `I-V-I`。
- 播放速度较慢。
- 适合第一次练习 movable do 的用户。

#### Practice

- 默认启用 `Do / Re / Mi / Fa / Sol / La / Ti`。
- 默认随机 key。
- 默认 cadence 为 `I-IV-V-I`。
- 适合已有基础的用户。

### 4.6 设置项

MVP 设置包括：

- `Difficulty`：`Beginner` / `Practice`
- `Key`：`Random` / `Fixed`
- `Fixed key`：`C` / `D` / `E` / `F` / `G` / `A` / `B` / `Bb` / `Eb`
- `Cadence`：`I-V-I` / `I-IV-V-I`
- `Enabled syllables`：可勾选启用的唱名

默认设置：

```ts
{
  difficulty: 'beginner',
  keyMode: 'random',
  cadence: 'I-V-I',
  enabledDegrees: ['do', 'mi', 'sol']
}
```

### 4.7 即时反馈

答对时：

- 显示 `Correct`
- 正确按钮高亮。
- 更新 session 统计。
- 保留 `Next` 进入下一题。

答错时：

- 用户选择的按钮标记为错误。
- 正确答案高亮。
- 显示 `The answer was Sol` 这类反馈文案。
- 更新 session 统计。
- 允许用户点击 `Replay Key`、`Replay Note` 或 `Next`。

使用 `Show Answer` 时：

- 展示正确答案。
- 本题计入 total。
- 本题不计入 correct。

### 4.8 练习统计

免费版展示当前 session 统计：

- `Total questions`
- `Correct answers`
- `Accuracy`
- `Current streak`
- `Weakest syllable`

统计数据保存在浏览器本地。

用户不登录也能使用统计。

---

## 5. 练习逻辑

### 5.1 出题逻辑

每题生成步骤：

1. 根据设置确定 key。
2. 根据 enabled syllables 随机选择目标唱名。
3. 根据 key 和目标唱名计算目标 MIDI note。
4. 播放 cadence 建立调性感。
5. 播放目标音。
6. 等待用户答题。

### 5.2 Key 规则

第一版支持以下 major keys：

- C major
- D major
- E major
- F major
- G major
- A major
- B major
- Bb major
- Eb major

如果用户选择 `Random`，每题随机选择一个 key。

如果用户选择 `Fixed`，所有题目使用当前 fixed key。

### 5.3 音区规则

为了避免音太低或太高：

- 目标音默认控制在适合人声练习的中音区。
- 建议范围：`C4` 到 `B4` 附近，可根据 key 做 octave 调整。
- cadence 音区保持稳定，避免突然跳八度影响判断。

### 5.4 Cadence 规则

首版支持：

- `I-V-I`
- `I-IV-V-I`

Cadence 可以用和弦或分解和弦播放。

MVP 可采用简单和弦音：

- I：Do / Mi / Sol
- IV：Fa / La / Do
- V：Sol / Ti / Re

---

## 6. 页面结构

### 6.1 首页 `/`

首页必须是工具页，不做纯营销页。

首屏内容：

- H1：`Movable Do Solfege Ear Training Online`
- 简短说明：`Practice hearing Do, Re, Mi, Fa, Sol, La, and Ti in different keys.`
- `Start Practice` 按钮。
- 练习器主体。

首页下方可包含：

- 简短说明：What is movable do?
- How to practice
- FAQ
- 相关练习入口
- Pro 等待名单入口

### 6.2 SEO 页面

第一批页面：

- `/movable-do-ear-training`
- `/solfege-ear-training`
- `/scale-degree-ear-training`
- `/relative-pitch-solfege`
- `/how-to-practice-solfege`

每个 SEO 页面都必须：

- 有独立 title。
- 有独立 meta description。
- 嵌入同一个练习器。
- 前 300 字回应页面搜索意图。
- 不堆砌关键词。
- 链接到相关练习页面。

### 6.3 商业页面

第一版包含：

- `/pricing`
- `/about`
- `/privacy`
- `/terms`

`/pricing` 首版可先做 Pro 等待名单，不必须接支付。

---

## 7. 高级版设计

### 7.1 商业化原则

产品第一阶段优先拿 SEO 流量和验证留存。

免费版不能限制得太重，否则会破坏工具站的打开即用体验。

### 7.2 免费版

免费版包含：

- 基础听音选唱名。
- Beginner / Practice 模式。
- 当前 session 统计。
- 本地保存最近练习记录。
- 基础设置。

### 7.3 Pro 版本

Pro 版本主打：

> Practice smarter with weak-point training and progress history.

高级功能：

- 长期历史统计。
- 每个唱名的准确率。
- 每个 key 的准确率。
- 弱项分析。
- 自动生成弱项题组。
- 每日练习目标。
- 连续练习 streak。
- 无广告体验。
- 后续支持云同步。

### 7.4 Pricing 页面文案方向

Free：

- `Start practicing instantly`
- `No account required`
- `Basic solfege ear training`

Pro：

- `Track your progress`
- `Train weak spots`
- `Build a daily practice habit`

---

## 8. 数据结构

### 8.1 Solfege

```ts
type Solfege = 'do' | 're' | 'mi' | 'fa' | 'sol' | 'la' | 'ti';
```

### 8.2 PracticeSettings

```ts
type PracticeSettings = {
  difficulty: 'beginner' | 'practice';
  keyMode: 'random' | 'fixed';
  fixedKey?: string;
  cadence: 'I-V-I' | 'I-IV-V-I';
  enabledDegrees: Solfege[];
};
```

### 8.3 Exercise

```ts
type Exercise = {
  id: string;
  key: string;
  target: {
    degree: number;
    syllable: Solfege;
    midi: number;
  };
  options: Solfege[];
  createdAt: string;
};
```

### 8.4 ExerciseResult

```ts
type ExerciseResult = {
  exerciseId: string;
  key: string;
  targetSyllable: Solfege;
  answer: Solfege;
  correct: boolean;
  attempts: number;
  responseMs: number;
  createdAt: string;
};
```

### 8.5 SessionStats

```ts
type SessionStats = {
  total: number;
  correct: number;
  accuracy: number;
  streak: number;
  bySyllable: Record<Solfege, {
    total: number;
    correct: number;
    accuracy: number;
  }>;
};
```

---

## 9. 技术方案

### 9.1 推荐技术栈

- Next.js
- React
- TypeScript
- Tailwind CSS
- Tone.js 或原生 Web Audio API
- localStorage

### 9.2 选择 Next.js 的原因

- SEO 友好。
- 适合工具页和内容页并存。
- 后续容易扩展登录、支付、博客、统计、sitemap。
- 可以为不同 SEO 页面生成独立 metadata。

### 9.3 音频方案

首版使用浏览器内生成音频，不使用版权音频采样。

需要实现：

- key 到 major scale 的映射。
- scale degree 到 MIDI note 的映射。
- cadence 播放。
- target note 播放。
- replay 功能。

音色要求：

- 简洁。
- 音准稳定。
- 延迟低。
- 在移动端浏览器可用。

### 9.4 本地存储

首版无账号，使用 localStorage 保存：

- 用户设置。
- 当前 session 结果。
- 最近练习记录。
- 是否看过基础提示。

如果 localStorage 不可用：

- 练习功能仍可使用。
- 只是不保存统计。
- 页面不应报错。

---

## 10. SEO 策略

### 10.1 核心关键词

优先关键词：

- `movable do ear training`
- `solfege ear training`
- `online solfege practice`
- `scale degree ear training`
- `relative pitch solfege`
- `do re mi ear training`
- `sight singing ear training`

### 10.2 页面标题示例

首页：

```text
Movable Do Solfege Ear Training Online
```

Solfege 页面：

```text
Solfege Ear Training Online - Practice Do Re Mi
```

Scale degree 页面：

```text
Scale Degree Ear Training - Hear Notes in Context
```

### 10.3 Meta description 示例

```text
Practice movable-do solfege online. Hear a key, identify Do, Re, Mi, Fa, Sol, La, or Ti, and improve your relative pitch.
```

### 10.4 内容原则

每个 SEO 页面应满足：

- 直接回答搜索意图。
- 页面中包含练习器。
- 内容短而清楚。
- 不做无关长文。
- 不堆关键词。
- 结尾引导用户继续练习。

### 10.5 初始内容建议

第一批内容主题：

- What is movable do?
- How to practice solfege ear training
- Solfege vs scale degrees
- How to hear Do, Mi, and Sol
- Relative pitch exercises for beginners

---

## 11. 用户体验要求

### 11.1 首屏要求

用户进入页面后，第一屏必须看到：

- 产品标题。
- 简短说明。
- `Start Practice`。
- 练习器主体或练习器入口。

不要把首屏做成：

- 长篇营销页。
- 注册引导页。
- 价格页。
- 课程销售页。
- App 下载页。

### 11.2 交互要求

- 操作按钮清晰。
- 答题反馈即时。
- 用户随时可以重播。
- 用户答错后能看到正确答案。
- 练习过程不弹出强制注册。

### 11.3 移动端要求

- 七个唱名按钮不能太小。
- 按钮间距足够，避免误触。
- 页面不能横向滚动。
- 音频操作必须稳定。
- 不依赖 hover 状态。

### 11.4 无障碍要求

- 按钮有明确 label。
- 答题反馈不能只依赖颜色。
- 支持键盘操作。
- 当前题状态可被屏幕阅读器理解。

---

## 12. 测试计划

### 12.1 功能测试

- 点击 `Start Practice` 后可以正常播放音频。
- `Replay Key` 可以重新播放调性感。
- `Replay Note` 可以重新播放目标音。
- 选择正确答案后显示正确反馈。
- 选择错误答案后显示错误反馈和正确答案。
- `Show Answer` 可以显示答案并记录为未答对。
- `Next` 可以生成新题。
- 设置变更后下一题生效。

### 12.2 音乐逻辑测试

- C major 下 Do = C。
- C major 下 Re = D。
- C major 下 Mi = E。
- G major 下 Do = G。
- G major 下 Ti = F#。
- Bb major 下 Mi = D。
- 随机 key 不生成超出范围的音。
- 禁用某个唱名后不会生成该唱名题目。

### 12.3 浏览器测试

需要覆盖：

- Chrome
- Safari
- Firefox
- Edge
- iOS Safari
- Android Chrome

重点检查：

- 首次点击后音频是否解锁。
- 移动端是否能正常播放。
- 连续答题是否有明显延迟。
- 页面布局是否稳定。

### 12.4 SEO 测试

- 每个页面有唯一 title。
- 每个页面有唯一 meta description。
- 每个页面有 canonical。
- sitemap 正常生成。
- robots.txt 正常。
- 首屏核心内容能被爬虫读取。

### 12.5 数据测试

- localStorage 可用时保存设置和统计。
- localStorage 不可用时仍可练习。
- 清空本地数据后页面不报错。
- 旧版本本地数据格式异常时页面不崩溃。

---

## 13. 非 MVP 范围

第一版不做：

- 麦克风视唱评分。
- 旋律听写。
- 和弦听辨。
- 节奏听写。
- 老师后台。
- 班级管理。
- 原生 iOS App。
- 原生 Android App。
- 多语言。
- 完整课程系统。
- AI 伴练。
- MIDI 输入。
- 社区功能。

这些功能可以在产品有自然流量和留存数据后再评估。

---

## 14. 版本路线

### V1：SEO 工具站

- 网页端练习器。
- Movable Do 听音选唱名。
- 免费练习。
- 本地统计。
- 基础 SEO 页面。

### V1.5：弱项训练

- 更细的统计。
- 弱项识别。
- 弱项题组。
- 更多 difficulty。
- 更多 cadence。
- Pro 等待名单。

### V2：账号和 Pro

- 用户账号。
- 云端进度。
- Stripe 订阅。
- Pro 统计面板。
- 无广告体验。

### V3：视唱扩展

- 麦克风音高检测。
- 视唱评分。
- 旋律模唱。
- Sight singing exercises。
- 老师布置作业功能。

---

## 15. 关键指标

### 15.1 MVP 指标

上线 30 天后观察：

- 首页访问量。
- SEO 页面收录数量。
- `Start Practice` 点击率。
- 每用户平均答题数。
- 单次 session 平均时长。
- Replay 使用率。
- Next 使用率。
- 移动端完成率。
- Pricing 页面点击率。
- 等待名单转化率。

### 15.2 建议目标

第一阶段目标：

- 访问用户中 40% 点击 `Start Practice`。
- 开始练习用户平均完成 10 题以上。
- 移动端无明显体验问题。
- 至少 5 个 SEO 页面被 Google 收录。
- 等待名单转化率达到 1% 以上。

---

## 16. 默认假设

- 目标市场：英文全球用户。
- 产品形态：网页端优先。
- 移动端策略：响应式网页适配。
- 默认唱名体系：Movable Do。
- 第一练习：听音选唱名。
- 第一版：无需账号。
- 商业化：免费工具 + 高级版。
- 高级版核心卖点：进度统计和弱项训练。
- 技术优先级：SEO、打开即用、移动端体验、音频稳定性。

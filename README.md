# 🍇 小葡萄成长记录 (Grape)

一款为宝宝"小葡萄"打造的成长记录应用，帮助父母轻松追踪宝宝的日常喂养、睡眠、换尿布、生长发育、健康状况和成长里程碑。

## 功能模块

- **首页仪表盘** — 宝宝年龄、今日喂养/睡眠/换尿布统计、7日趋势图、最近活动时间线
- **喂养记录** — 支持瓶喂、配方奶，记录奶量和时长
- **睡眠记录** — 内置计时器，支持进行中的睡眠追踪，统计每日睡眠时长
- **换尿布** — 快速记录尿布类型（湿/脏/混合），7日趋势图
- **生长发育** — 体重/身高/头围记录，WHO生长标准百分位曲线图
- **健康管理** — 疫苗接种计划（2024国家免疫规划）、就诊记录、体温监测
- **里程碑** — 按类别（运动/语言/社交/认知）记录发育里程碑，支持照片上传

## 技术栈

- **框架**: Next.js 16 (App Router) + React 19 + TypeScript
- **样式**: Tailwind CSS v4（葡萄紫/蜜桃粉/薄荷绿主题 + 毛玻璃风格）
- **数据库**: Prisma ORM + SQLite
- **图表**: Recharts
- **动画**: Framer Motion
- **图标**: Lucide React

## 快速开始

### 环境要求

- Node.js 18+
- npm

### 安装与运行

```bash
# 安装依赖
npm install

# 生成 Prisma Client 并初始化数据库
npx prisma generate
npx prisma db push

# 填充初始数据
node prisma/seed.js

# 启动开发服务器
npm run dev
```

浏览器访问 [http://localhost:3000](http://localhost:3000) 即可使用。

## 项目结构

```
src/
├── actions/        # Server Actions（喂养、睡眠、尿布等 CRUD 操作）
├── app/
│   ├── api/        # 文件上传接口
│   ├── diaper/     # 换尿布页面
│   ├── feeding/    # 喂养记录页面
│   ├── growth/     # 生长发育页面
│   ├── health/     # 健康管理页面（疫苗/就诊/体温）
│   ├── milestones/ # 里程碑页面
│   └── sleep/      # 睡眠记录页面
├── components/     # 共享组件（导航栏、图表等）
├── data/           # 参考数据（WHO生长标准、疫苗计划）
├── hooks/          # 自定义 Hooks（计时器等）
└── lib/            # 工具函数、Prisma 客户端
prisma/
├── schema.prisma   # 数据库模型定义
└── seed.js         # 数据库初始化脚本
```

## 数据库模型

| 模型 | 说明 |
|------|------|
| Baby | 宝宝基本信息（姓名、出生日期、性别） |
| Feeding | 喂养记录（类型、奶量、时长） |
| SleepRecord | 睡眠记录（开始/结束时间、质量） |
| DiaperRecord | 尿布记录（类型、颜色） |
| GrowthRecord | 生长记录（体重、身高、头围） |
| Vaccination | 疫苗接种记录 |
| DoctorVisit | 就诊记录 |
| Temperature | 体温记录 |
| Milestone | 发育里程碑 |

## License

MIT

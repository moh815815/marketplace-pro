# 🛒 ماركت برو — منصة تجارية متكاملة B2B/B2C

منصة تجارية احترافية مبنية بـ **Next.js 14** + **Supabase** + **Tailwind CSS**

---

## ✨ الميزات الكاملة

| الميزة | الوصف |
|--------|-------|
| 🔐 Supabase Auth | تسجيل دخول بالبريد + Google + Apple + JWT + RLS |
| 🛒 سلة مشتريات | LocalStorage — لا تضيع المنتجات عند الإغلاق |
| 🎥 فيديو المنتج | يُعرض عند التمرير على المنتج (video hover) |
| 💬 واتساب | زر عائم + رابط مباشر مع اسم المنتج ورابطه |
| 📦 لوحة التحكم | إضافة/تعديل/حذف المنتجات + إدارة الطلبات |
| 📸 رفع الوسائط | Supabase Storage — صور وفيديو مع ضغط تلقائي |
| 🔍 بحث وفلترة | بحث نصي + فلترة بالفئة والسعر والتقييم |
| ❤️ المفضلة | قائمة المفضلة مخزنة في LocalStorage |
| 📊 التحليلات | مبيعات، تحويلات، مصادر الزيارات |
| 📱 Responsive | متوافق تماماً مع الجوال |
| 🌙 RTL | كامل المنصة بالعربية من اليمين لليسار |

---

## 🚀 تشغيل المشروع

### 1. متطلبات البيئة
```bash
Node.js >= 18
npm or yarn
```

### 2. تثبيت الحزم
```bash
git clone https://github.com/yourname/marketplace-pro
cd marketplace-pro
npm install
```

### 3. إعداد Supabase
1. أنشئ مشروعاً جديداً على [supabase.com](https://supabase.com)
2. اذهب إلى **SQL Editor** وشغّل ملف `supabase-schema.sql`
3. أنشئ Buckets في **Storage**: `products`, `avatars`
4. اضبط الـ Bucket Policies لتكون `public` للـ `products`

### 4. متغيرات البيئة
```bash
cp .env.example .env.local
# عدّل القيم في .env.local
```

### 5. تشغيل بيئة التطوير
```bash
npm run dev
# افتح: http://localhost:3000
```

---

## 📁 هيكل المشروع

```
marketplace/
├── app/
│   ├── api/
│   │   ├── products/         # GET list / POST create
│   │   │   └── [id]/         # GET / PUT / DELETE single
│   │   ├── orders/           # GET list / POST create
│   │   └── upload/           # POST upload / DELETE remove
│   ├── dashboard/            # لوحة التحكم الكاملة
│   ├── product/[id]/         # صفحة تفاصيل المنتج
│   ├── checkout/             # صفحة الدفع
│   ├── profile/              # صفحة الحساب
│   ├── wishlist/             # قائمة المفضلة
│   ├── layout.tsx            # Layout رئيسي
│   └── globals.css           # CSS + Tailwind
│
├── components/
│   ├── layout/
│   │   ├── Navbar.tsx        # شريط التنقل
│   │   ├── Footer.tsx        # تذييل الصفحة
│   │   └── AuthModal.tsx     # نافذة تسجيل الدخول
│   ├── store/
│   │   ├── ProductCard.tsx   # بطاقة المنتج مع hover video
│   │   └── CartDrawer.tsx    # درج السلة الجانبي
│   ├── dashboard/
│   │   └── MediaUpload.tsx   # رفع الوسائط
│   └── ui/
│       └── WhatsAppFloat.tsx # زر واتساب العائم
│
├── lib/
│   ├── supabase.ts           # إعداد Supabase Client
│   └── store.ts              # Zustand: Cart + Auth + Wishlist
│
├── types/
│   └── database.ts           # TypeScript types للـ DB
│
├── supabase-schema.sql       # SQL كامل لإنشاء قاعدة البيانات
└── .env.example              # نموذج متغيرات البيئة
```

---

## 🗄️ هيكل قاعدة البيانات

```sql
profiles    — بيانات المستخدمين (متصل بـ auth.users)
merchants   — بيانات التجار والمتاجر
products    — المنتجات (مع فئات، مخزون، صور، فيديو)
orders      — الطلبات (مع بنود JSONB، العنوان، الحالة)
reviews     — التقييمات مع تحديث تلقائي للمعدل
wishlist    — المفضلة (لكل مستخدم)
coupons     — كودات الخصم (fixed / percentage)
```

---

## 🔗 API Endpoints

```
GET    /api/products              — قائمة المنتجات (مع فلترة وبحث وصفحات)
POST   /api/products              — إضافة منتج جديد
GET    /api/products/:id          — تفاصيل منتج + التقييمات
PUT    /api/products/:id          — تعديل منتج
DELETE /api/products/:id          — حذف (soft delete)

GET    /api/orders                — قائمة الطلبات
POST   /api/orders                — إنشاء طلب جديد (مع إنقاص المخزون)

POST   /api/upload                — رفع ملف إلى Supabase Storage
DELETE /api/upload?path=xxx       — حذف ملف من Storage
```

---

## 🚢 النشر على Vercel

```bash
npm install -g vercel
vercel --prod
# أضف متغيرات البيئة في Vercel Dashboard
```

---

## 📞 التواصل

- **واتساب**: +966 50 123 4567
- **البريد**: support@marketpro.sa
- **الموقع**: marketpro.sa

---

**مبني بـ ❤️ باستخدام Next.js 14 + Supabase + Tailwind CSS + TypeScript**

// app/dashboard/page.tsx
'use client'
import { useState } from 'react'
import {
  BarChart2, Package, PlusCircle, ShoppingBag,
  TrendingUp, Image, Settings, ChevronUp, ChevronDown,
} from 'lucide-react'
import { MediaUpload } from '@/components/dashboard/MediaUpload'

type Section = 'overview' | 'products' | 'addProduct' | 'orders' | 'analytics' | 'media' | 'settings'

const SAMPLE_PRODUCTS = [
  { id: 1, name: 'سماعة ANC لاسلكية', cat: 'إلكترونيات', price: 299, stock: 15, status: 'active', rating: 4.9 },
  { id: 2, name: 'فستان صيفي', cat: 'أزياء', price: 89, stock: 30, status: 'active', rating: 4.7 },
  { id: 3, name: 'مكيف هواء ذكي', cat: 'المنزل', price: 720, stock: 0, status: 'out', rating: 4.8 },
  { id: 4, name: 'لابتوب Ultra Slim', cat: 'إلكترونيات', price: 1299, stock: 5, status: 'active', rating: 4.9 },
]

const SAMPLE_ORDERS = [
  { id: '#ORD-5101', customer: 'محمد علي', items: 'سماعة + كابل', amount: '$249', status: 'مكتمل', statusClass: 'badge-green' },
  { id: '#ORD-5100', customer: 'سارة أحمد', items: 'فستان أزرق L', amount: '$89', status: 'في الطريق', statusClass: 'badge-orange' },
  { id: '#ORD-5099', customer: 'خالد محمود', items: 'لابتوب + حقيبة', amount: '$1,320', status: 'جديد', statusClass: 'badge-blue' },
  { id: '#ORD-5098', customer: 'فاطمة حسن', items: 'عطر + كريم', amount: '$195', status: 'قيد المراجعة', statusClass: 'badge-orange' },
]

const KPIs = [
  { label: 'إجمالي المبيعات', value: '$18,240', change: '+12.4%', up: true },
  { label: 'الطلبات الجديدة', value: '284', change: '+8.1%', up: true },
  { label: 'زيارات المتجر', value: '1,840', change: '+23%', up: true },
  { label: 'متوسط التقييم', value: '4.8★', change: '+0.2', up: true },
  { label: 'المنتجات النشطة', value: '34', change: '-2', up: false },
  { label: 'معدل الإتمام', value: '92%', change: '+3%', up: true },
]

const BARS = [65, 80, 55, 90, 72, 88, 95]
const DAYS = ['سبت', 'أحد', 'إثنين', 'ثلاثاء', 'أربعاء', 'خميس', 'جمعة']

export default function DashboardPage() {
  const [section, setSection] = useState<Section>('overview')
  const [products, setProducts] = useState(SAMPLE_PRODUCTS)

  // Add product form
  const [form, setForm] = useState({ name: '', category: 'electronics', price: '', oldPrice: '', stock: '', whatsapp: '', desc: '', variants: '', sizes: '' })

  function addProduct() {
    if (!form.name || !form.price) { alert('أدخل الاسم والسعر'); return }
    setProducts([...products, { id: Date.now(), name: form.name, cat: form.category, price: parseFloat(form.price), stock: parseInt(form.stock) || 0, status: 'active', rating: 5 }])
    setForm({ name: '', category: 'electronics', price: '', oldPrice: '', stock: '', whatsapp: '', desc: '', variants: '', sizes: '' })
    setSection('products')
  }

  function deleteProduct(id: number) {
    if (confirm('هل تريد حذف هذا المنتج؟')) setProducts(products.filter(p => p.id !== id))
  }

  const navItems: { id: Section; label: string; icon: React.ReactNode }[] = [
    { id: 'overview',   label: 'نظرة عامة',    icon: <BarChart2 size={15} /> },
    { id: 'products',   label: 'المنتجات',      icon: <Package size={15} /> },
    { id: 'addProduct', label: 'إضافة منتج',    icon: <PlusCircle size={15} /> },
    { id: 'orders',     label: 'الطلبات',       icon: <ShoppingBag size={15} /> },
    { id: 'analytics',  label: 'التحليلات',     icon: <TrendingUp size={15} /> },
    { id: 'media',      label: 'الوسائط',       icon: <Image size={15} /> },
    { id: 'settings',   label: 'الإعدادات',     icon: <Settings size={15} /> },
  ]

  return (
    <div className="container-custom py-6">
      <div className="grid grid-cols-1 lg:grid-cols-[220px_1fr] gap-5">

        {/* Sidebar */}
        <aside className="card p-4 h-fit lg:sticky lg:top-24">
          <div className="pb-4 mb-4 border-b border-white/[0.07]">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-gold to-brand-orange rounded-xl flex items-center justify-center font-black text-white">أ</div>
              <div>
                <p className="font-bold text-sm">أحمد التاجر</p>
                <p className="text-gold text-[11px] font-semibold">تاجر موثق ✓</p>
              </div>
            </div>
          </div>
          <nav className="space-y-0.5">
            {navItems.map((item) => (
              <button
                key={item.id}
                onClick={() => setSection(item.id)}
                className={`nav-item w-full text-right ${section === item.id ? 'active' : ''}`}
              >
                <span className="w-4">{item.icon}</span>
                {item.label}
              </button>
            ))}
          </nav>
        </aside>

        {/* Content */}
        <div className="card p-5 min-h-[600px]">

          {/* ── OVERVIEW ── */}
          {section === 'overview' && (
            <div className="animate-fade-in">
              <div className="flex justify-between items-center mb-5">
                <h2 className="text-lg font-black">نظرة عامة</h2>
                <span className="text-xs text-gray-400">آخر 30 يوم</span>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3 mb-5">
                {KPIs.map((k) => (
                  <div key={k.label} className="bg-navy-3 rounded-xl p-4 border border-white/[0.05]">
                    <div className="text-xl font-black text-gold">{k.value}</div>
                    <div className="text-xs text-gray-400 mt-0.5">{k.label}</div>
                    <div className={`text-xs font-bold mt-1 flex items-center gap-0.5 ${k.up ? 'text-emerald-400' : 'text-red-400'}`}>
                      {k.up ? <ChevronUp size={12} /> : <ChevronDown size={12} />}{k.change}
                    </div>
                  </div>
                ))}
              </div>

              {/* Bar chart */}
              <div className="bg-navy-3 rounded-xl p-4 mb-4">
                <p className="text-sm font-bold mb-3">مبيعات الأسبوع الحالي</p>
                <div className="flex items-end gap-2 h-28">
                  {BARS.map((h, i) => (
                    <div key={i} className="flex-1 flex flex-col items-center gap-1.5">
                      <div
                        className="w-full bg-gradient-to-t from-gold to-brand-orange rounded-t"
                        style={{ height: `${h}%` }}
                      />
                      <span className="text-[10px] text-gray-400">{DAYS[i]}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Recent orders */}
              <div className="bg-navy-3 rounded-xl p-4">
                <p className="text-sm font-bold mb-3">آخر الطلبات</p>
                <table className="data-table">
                  <thead><tr><th>رقم الطلب</th><th>العميل</th><th>المبلغ</th><th>الحالة</th></tr></thead>
                  <tbody>
                    {SAMPLE_ORDERS.slice(0, 3).map((o) => (
                      <tr key={o.id}>
                        <td className="text-gold font-bold">{o.id}</td>
                        <td>{o.customer}</td>
                        <td>{o.amount}</td>
                        <td><span className={o.statusClass}>{o.status}</span></td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* ── PRODUCTS ── */}
          {section === 'products' && (
            <div className="animate-fade-in">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-lg font-black">إدارة المنتجات</h2>
                <button onClick={() => setSection('addProduct')} className="btn-primary text-xs py-2 px-4">+ إضافة منتج</button>
              </div>
              <div className="overflow-x-auto">
                <table className="data-table">
                  <thead><tr><th>المنتج</th><th>الفئة</th><th>السعر</th><th>المخزون</th><th>التقييم</th><th>الحالة</th><th>إجراءات</th></tr></thead>
                  <tbody>
                    {products.map((p) => (
                      <tr key={p.id}>
                        <td className="font-bold">{p.name}</td>
                        <td className="text-gray-400 text-xs">{p.cat}</td>
                        <td className="text-gold font-bold">${p.price}</td>
                        <td>{p.stock}</td>
                        <td className="text-gold">{p.rating}★</td>
                        <td><span className={p.status === 'active' ? 'badge-green' : 'badge-red'}>{p.status === 'active' ? 'نشط' : 'نفد'}</span></td>
                        <td className="space-x-1 space-x-reverse">
                          <button className="text-xs border border-white/10 text-gray-400 px-2 py-1 rounded-md hover:border-gold hover:text-gold transition">✏️</button>
                          <button onClick={() => deleteProduct(p.id)} className="text-xs border border-white/10 text-gray-400 px-2 py-1 rounded-md hover:border-red-400 hover:text-red-400 transition">🗑️</button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* ── ADD PRODUCT ── */}
          {section === 'addProduct' && (
            <div className="animate-fade-in">
              <h2 className="text-lg font-black mb-5">إضافة منتج جديد</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {[
                  { label: 'اسم المنتج *', key: 'name', placeholder: 'مثال: سماعة ANC لاسلكية' },
                  { label: 'السعر ($) *', key: 'price', placeholder: '0.00', type: 'number' },
                  { label: 'السعر القديم ($)', key: 'oldPrice', placeholder: 'اختياري', type: 'number' },
                  { label: 'الكمية', key: 'stock', placeholder: '0', type: 'number' },
                  { label: 'رقم واتساب', key: 'whatsapp', placeholder: '+966...' },
                ].map(({ label, key, placeholder, type }) => (
                  <div key={key}>
                    <label className="label">{label}</label>
                    <input
                      className="input"
                      type={type || 'text'}
                      placeholder={placeholder}
                      value={(form as any)[key]}
                      onChange={(e) => setForm({ ...form, [key]: e.target.value })}
                    />
                  </div>
                ))}
                <div>
                  <label className="label">الفئة</label>
                  <select className="input" value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })}>
                    <option value="electronics">📱 إلكترونيات</option>
                    <option value="fashion">👗 أزياء</option>
                    <option value="home">🏠 المنزل</option>
                    <option value="food">🍃 غذاء</option>
                    <option value="beauty">✨ جمال</option>
                    <option value="sports">⚽ رياضة</option>
                  </select>
                </div>
                <div className="col-span-full">
                  <label className="label">الوصف</label>
                  <textarea className="input min-h-[80px] resize-y" placeholder="وصف تفصيلي..." value={form.desc} onChange={(e) => setForm({ ...form, desc: e.target.value })} />
                </div>
                <div className="col-span-full">
                  <label className="label">صورة / فيديو المنتج</label>
                  <MediaUpload accept="all" maxFiles={5} folder="products" />
                </div>
              </div>
              <button onClick={addProduct} className="btn-primary w-full py-3.5 mt-5 text-base">
                💾 حفظ المنتج في Supabase
              </button>
            </div>
          )}

          {/* ── ORDERS ── */}
          {section === 'orders' && (
            <div className="animate-fade-in">
              <h2 className="text-lg font-black mb-4">إدارة الطلبات</h2>
              <div className="overflow-x-auto">
                <table className="data-table">
                  <thead><tr><th>رقم الطلب</th><th>العميل</th><th>المنتجات</th><th>المبلغ</th><th>الحالة</th><th>إجراءات</th></tr></thead>
                  <tbody>
                    {SAMPLE_ORDERS.map((o) => (
                      <tr key={o.id}>
                        <td className="text-gold font-bold">{o.id}</td>
                        <td>{o.customer}</td>
                        <td className="text-gray-400 text-xs">{o.items}</td>
                        <td className="font-bold">{o.amount}</td>
                        <td>
                          <select className="bg-navy-3 border border-white/10 text-white text-xs px-2 py-1 rounded-lg font-cairo outline-none">
                            <option>جديد</option><option>قيد التجهيز</option><option>في الطريق</option><option>مكتمل</option><option>ملغي</option>
                          </select>
                        </td>
                        <td>
                          <button className="text-xs border border-white/10 text-gray-400 px-2 py-1 rounded-md hover:border-gold hover:text-gold transition">تفاصيل</button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* ── ANALYTICS ── */}
          {section === 'analytics' && (
            <div className="animate-fade-in">
              <h2 className="text-lg font-black mb-4">التحليلات المتقدمة</h2>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-5">
                {[{ l: 'معدل التحويل', v: '34.2%', c: '+4.1%' }, { l: 'متوسط قيمة الطلب', v: '$64', c: '+$8' }, { l: 'عملاء مكررون', v: '28%', c: '+3%' }, { l: 'معدل الإرجاع', v: '1.8%', c: '-0.2%' }].map((k) => (
                  <div key={k.l} className="bg-navy-3 rounded-xl p-3 border border-white/[0.05] text-center">
                    <div className="text-lg font-black text-gold">{k.v}</div>
                    <div className="text-[11px] text-gray-400">{k.l}</div>
                    <div className="text-xs text-emerald-400 font-bold mt-0.5">{k.c}</div>
                  </div>
                ))}
              </div>
              <div className="bg-navy-3 rounded-xl p-4 mb-4">
                <p className="text-sm font-bold mb-3">أفضل المنتجات مبيعاً</p>
                <table className="data-table"><thead><tr><th>#</th><th>المنتج</th><th>مبيعات</th><th>الإيراد</th></tr></thead>
                  <tbody>
                    <tr><td>1</td><td>سماعة ANC</td><td>142 وحدة</td><td className="text-gold">$42,458</td></tr>
                    <tr><td>2</td><td>لابتوب Ultra</td><td>38 وحدة</td><td className="text-gold">$49,362</td></tr>
                    <tr><td>3</td><td>كريم فيتامين C</td><td>210 وحدة</td><td className="text-gold">$13,650</td></tr>
                  </tbody>
                </table>
              </div>
              <div className="bg-navy-3 rounded-xl p-4">
                <p className="text-sm font-bold mb-3">مصادر الزيارات</p>
                {[{ n: 'بحث جوجل', p: 42, c: '#D4A843' }, { n: 'واتساب', p: 28, c: '#25D366' }, { n: 'انستقرام', p: 18, c: '#E1306C' }, { n: 'مباشر', p: 12, c: '#60A5FA' }].map((s) => (
                  <div key={s.n} className="flex items-center gap-3 mb-2">
                    <span className="text-xs text-gray-400 w-20">{s.n}</span>
                    <div className="flex-1 h-2 bg-navy-2 rounded-full overflow-hidden">
                      <div className="h-full rounded-full" style={{ width: `${s.p}%`, background: s.c }} />
                    </div>
                    <span className="text-xs font-bold w-8">{s.p}%</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ── MEDIA ── */}
          {section === 'media' && (
            <div className="animate-fade-in">
              <h2 className="text-lg font-black mb-4">مكتبة الوسائط</h2>
              <p className="text-sm text-gray-400 mb-4">رفع الصور والفيديوهات مباشرة إلى Supabase Storage مع ضغط تلقائي</p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <p className="label mb-2">رفع صور المنتجات</p>
                  <MediaUpload accept="images" maxFiles={8} folder="images" />
                </div>
                <div>
                  <p className="label mb-2">رفع فيديو المنتج</p>
                  <MediaUpload accept="videos" maxFiles={2} folder="videos" />
                </div>
              </div>
            </div>
          )}

          {/* ── SETTINGS ── */}
          {section === 'settings' && (
            <div className="animate-fade-in">
              <h2 className="text-lg font-black mb-5">إعدادات المتجر</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {[{ l: 'اسم المتجر', v: 'متجر أحمد للإلكترونيات' }, { l: 'رقم واتساب', v: '+966501234567' }, { l: 'Supabase Project URL', v: '', ph: 'https://xxxx.supabase.co' }, { l: 'Supabase Anon Key', v: '', ph: 'eyJ...' }, { l: 'Stripe Public Key', v: '', ph: 'pk_live_...' }, { l: 'رابط المتجر', v: '', ph: 'mystore.com' }].map((f) => (
                  <div key={f.l}>
                    <label className="label">{f.l}</label>
                    <input className="input" defaultValue={f.v} placeholder={f.ph} />
                  </div>
                ))}
                <div className="col-span-full">
                  <label className="label">وصف المتجر</label>
                  <textarea className="input min-h-[70px] resize-y" defaultValue="نوفر أفضل المنتجات الإلكترونية بضمان سنة كاملة وخدمة ما بعد البيع" />
                </div>
              </div>
              <button className="btn-primary mt-5 py-3 px-8">حفظ الإعدادات ✓</button>
            </div>
          )}

        </div>
      </div>
    </div>
  )
}

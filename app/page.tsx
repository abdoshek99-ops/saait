import Link from 'next/link';

export default function Home() {
  return (
    <main className="min-h-screen bg-[#030014] text-white overflow-hidden relative" dir="rtl">
      
      {/* شبكة خلفية تقنية (Neural/Circuit Grid) */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#1f2937_1px,transparent_1px),linear-gradient(to_bottom,#1f2937_1px,transparent_1px)] bg-[size:3rem_3rem] opacity-20 pointer-events-none z-0" />
      
      {/* إضاءات نيون في الخلفية */}
      <div className="absolute top-[-10%] right-[-5%] w-[500px] h-[500px] rounded-full bg-cyan-600/20 blur-[120px] pointer-events-none z-0" />
      <div className="absolute bottom-[20%] left-[-10%] w-[600px] h-[600px] rounded-full bg-violet-600/20 blur-[150px] pointer-events-none z-0" />

      {/* Navbar - تأثير زجاجي مع لوغوimage_0.png */}
      <nav className="border-b border-white/5 bg-[#030014]/60 backdrop-blur-md sticky top-0 z-50 transition-all duration-300">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4 group cursor-pointer">
            {/* اللوغو الجديد - صورة image_0.png */}
            <div className="w-16 h-16 rounded-xl overflow-hidden border border-cyan-400/50 shadow-[0_0_15px_rgba(6,182,212,0.3)] p-[2px]">
              <img src="/image_0.png" alt="SAAIT Logo" className="w-full h-full object-contain" />
            </div>
            <div>
              <span className="font-bold text-white text-xl tracking-wide">SAAIT</span>
              <p className="text-cyan-400/80 text-xs tracking-wider uppercase">Building Syria's Tech Future</p>
            </div>
          </div>
          <div className="hidden md:flex items-center gap-8 text-sm font-medium text-gray-300">
            <Link href="/projects" className="hover:text-cyan-400 hover:drop-shadow-[0_0_8px_rgba(6,182,212,0.8)] transition-all">المشاريع</Link>
            <Link href="/events" className="hover:text-cyan-400 hover:drop-shadow-[0_0_8px_rgba(6,182,212,0.8)] transition-all">الفعاليات</Link>
            <Link href="/community" className="hover:text-cyan-400 hover:drop-shadow-[0_0_8px_rgba(6,182,212,0.8)] transition-all">المجتمع</Link>
            <Link href="/news" className="hover:text-cyan-400 hover:drop-shadow-[0_0_8px_rgba(6,182,212,0.8)] transition-all">الأخبار</Link>
          </div>
          <div className="flex items-center gap-4">
            <Link href="/login" className="text-sm font-medium text-gray-300 hover:text-white transition px-4 py-2">
              تسجيل الدخول
            </Link>
            <Link href="/register" className="relative group overflow-hidden rounded-lg p-[1px]">
              <span className="absolute inset-0 bg-gradient-to-r from-cyan-400 to-violet-600 rounded-lg opacity-70 group-hover:opacity-100 transition-opacity duration-300"></span>
              <div className="relative bg-[#030014] px-5 py-2.5 rounded-lg transition-all duration-300 group-hover:bg-opacity-0">
                <span className="text-sm font-bold text-white group-hover:text-white transition-colors">انضم الآن</span>
              </div>
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section - تصميم مقسوم مع صورة image_1.png */}
      <section className="relative z-10 py-24 px-6 lg:min-h-[85vh] flex items-center">
        <div className="max-w-7xl mx-auto w-full grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          
          {/* النص (اليمين) */}
          <div className="text-right space-y-8 relative">
            <div className="inline-flex items-center gap-3 bg-white/5 border border-white/10 rounded-full px-5 py-2.5 backdrop-blur-md shadow-lg shadow-cyan-500/10">
              <span className="relative flex h-3 w-3">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-3 w-3 bg-cyan-500"></span>
              </span>
              <span className="text-cyan-200 text-sm font-medium">منصة المجتمع التقني السوري الرائدة</span>
            </div>
            
            <h1 className="text-5xl md:text-7xl font-extrabold leading-[1.2] tracking-tight">
              مستقبل التكنولوجيا <br/>
              <span className="text-transparent bg-clip-text bg-gradient-to-l from-cyan-400 via-blue-500 to-violet-600 drop-shadow-[0_0_20px_rgba(6,182,212,0.3)]">
                يبدأ هنا
              </span>
            </h1>
            
            <p className="text-lg md:text-xl text-gray-400 leading-relaxed max-w-xl">
              منصة تجمع المطورين، الباحثين، وطلاب التكنولوجيا السوريين للتعاون في بناء مشاريع الذكاء الاصطناعي وتقنيات الجيل القادم.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-5 pt-4">
              <Link href="/register" className="bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white font-bold px-8 py-4 rounded-xl text-lg text-center shadow-[0_0_20px_rgba(6,182,212,0.4)] hover:shadow-[0_0_30px_rgba(6,182,212,0.6)] transition-all duration-300 transform hover:-translate-y-1">
                ابدأ رحلتك مجاناً
              </Link>
              <Link href="/projects" className="bg-white/5 border border-white/10 hover:border-cyan-500/50 hover:bg-white/10 text-white font-bold px-8 py-4 rounded-xl text-lg text-center backdrop-blur-md transition-all duration-300">
                استعرض المشاريع
              </Link>
            </div>
          </div>

          {/* الصورة التفاعلية (اليسار) - صورة image_1.png الجديدة */}
          <div className="relative w-full h-[400px] md:h-[500px] lg:h-[600px] group perspective-1000">
            <div className="absolute inset-0 bg-gradient-to-tr from-cyan-500/20 to-violet-500/20 rounded-3xl transform rotate-3 scale-105 blur-lg group-hover:rotate-6 group-hover:scale-110 transition-all duration-700"></div>
            <div className="relative w-full h-full rounded-3xl overflow-hidden border border-white/10 shadow-2xl bg-[#0a0a14] transform transition-transform duration-700 group-hover:-translate-y-2 group-hover:shadow-[0_20px_50px_rgba(6,182,212,0.3)]">
              {/* صورة image_1.png الجديدة */}
              <img src="/image_1.png" alt="AI Robot" className="w-full h-full object-cover group-hover:scale-105 transition-all duration-700 mix-blend-screen" />
              <div className="absolute inset-0 bg-gradient-to-t from-[#030014] via-transparent to-transparent opacity-80"></div>
            </div>
          </div>

        </div>
      </section>

      {/* Stats - تأثيرات زجاجية */}
      <section className="relative z-10 py-16 px-6 border-y border-white/5 bg-white/[0.02] backdrop-blur-sm">
        <div className="max-w-6xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
          {[
            { value: '500+', label: 'عضو نشط', color: 'from-cyan-400 to-blue-500' },
            { value: '120+', label: 'مشروع تقني', color: 'from-blue-400 to-violet-500' },
            { value: '50+', label: 'فعالية منظمة', color: 'from-violet-400 to-purple-500' },
            { value: '15+', label: 'تخصص دقيق', color: 'from-purple-400 to-pink-500' },
          ].map((stat, i) => (
            <div key={i} className="group p-6 rounded-2xl hover:bg-white/5 transition-colors duration-300 border border-transparent hover:border-white/5">
              <div className={`text-5xl font-black bg-clip-text text-transparent bg-gradient-to-r ${stat.color} mb-3 drop-shadow-[0_0_10px_rgba(255,255,255,0.1)] group-hover:scale-110 transition-transform duration-300`}>
                {stat.value}
              </div>
              <div className="text-gray-400 font-medium tracking-wide">{stat.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Features - كروت احترافية مع صور أيقونية متناسقة */}
      <section className="relative z-10 py-32 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-20">
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">النظام البيئي المتكامل</h2>
            <p className="text-xl text-gray-400 max-w-2xl mx-auto">كل ما تحتاجه كمهندس أو مطور لبناء تقنيات المستقبل، مدعوم بأحدث أدوات الذكاء الاصطناعي.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              { img: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&q=80&w=600', title: 'المشاريع التقنية', desc: 'ابحث عن فريق، وتعاون مع أفضل المطورين لبناء حلول برمجية متقدمة.', href: '/projects' },
              { img: 'https://images.unsplash.com/photo-1540317580384-e5d43867caa6?auto=format&fit=crop&q=80&w=600', title: 'الفعاليات', desc: 'شارك في تحديات الذكاء الاصطناعي وورش العمل التفاعلية.', href: '/events' },
              { img: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&q=80&w=600', title: 'مجتمع تقني نشط', desc: 'تبادل الخبرات وابنِ شبكة علاقات مع خبراء التكنولوجيا.', href: '/community' },
              { img: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&q=80&w=600', title: 'أخبار التقنية', desc: 'تابع أحدث أخبار الذكاء الاصطناعي والتكنولوجيا عالمياً.', href: '/news' },
              { img: 'https://images.unsplash.com/photo-1605711285791-0219e80e43a3?auto=format&fit=crop&q=80&w=600', title: 'مسابقات برمجية', desc: 'شارك في المسابقات واثبت مهاراتك التقنية.', href: '/community' },
              { img: 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&q=80&w=600', title: 'فرص عمل وتدريب', desc: 'اكتشف فرص العمل والتدريب في مجال التقنية.', href: '/community' },
            ].map((feature, i) => (
              <Link key={i} href={feature.href} className="group relative bg-[#0a0a14] border border-white/10 rounded-2xl overflow-hidden hover:border-cyan-500/50 transition-all duration-500 hover:-translate-y-2 hover:shadow-[0_10px_30px_rgba(6,182,212,0.15)] block">
                {/* صورة مصغرة تفاعلية */}
                <div className="h-48 w-full overflow-hidden relative">
                  <div className="absolute inset-0 bg-gradient-to-b from-transparent to-[#0a0a14] z-10"></div>
                  <img src={feature.img} alt={feature.title} className="w-full h-full object-cover opacity-60 group-hover:opacity-100 group-hover:scale-110 transition-all duration-700" />
                </div>
                <div className="p-8 relative z-20 -mt-8">
                  <div className="w-12 h-12 rounded-lg bg-[#030014] border border-white/10 flex items-center justify-center mb-6 shadow-lg group-hover:border-cyan-400/50 transition-colors">
                     <span className="w-6 h-6 bg-gradient-to-tr from-cyan-400 to-violet-500 rounded-full animate-pulse"></span>
                  </div>
                  <h3 className="text-2xl font-bold text-white mb-3 group-hover:text-cyan-400 transition-colors">{feature.title}</h3>
                  <p className="text-gray-400 leading-relaxed">{feature.desc}</p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Specializations - تصميم شرائح تفاعلية */}
      <section className="relative z-10 py-20 px-6 bg-gradient-to-b from-white/[0.02] to-transparent">
        <div className="max-w-5xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">نغطي تقنيات المستقبل</h2>
          <p className="text-gray-400 mb-12 text-lg">من الذكاء الاصطناعي إلى الأمن السيبراني، نركز على أهم المجالات التقنية.</p>
          <div className="flex flex-wrap justify-center gap-4">
            {['الذكاء الاصطناعي (AI)', 'تعلم الآلة (ML)', 'الأمن السيبراني', 'علم البيانات', 'الرؤية الحاسوبية', 'الحوسبة السحابية', 'البلوكتشين', 'إنترنت الأشياء (IoT)'].map((spec, i) => (
              <span key={i} className="bg-[#0a0a14] border border-white/10 text-cyan-100 px-6 py-3 rounded-xl text-sm font-medium hover:border-cyan-400 hover:bg-cyan-900/20 hover:text-cyan-300 transition-all duration-300 cursor-pointer hover:shadow-[0_0_15px_rgba(6,182,212,0.2)]">
                {spec}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section - بانر مبهر مع صورة خلفية */}
      <section className="relative z-10 py-32 px-6">
        <div className="max-w-5xl mx-auto">
          <div className="relative rounded-[2.5rem] overflow-hidden border border-white/10 shadow-[0_0_50px_rgba(139,92,246,0.15)] group">
            <div className="absolute inset-0">
               <img src="https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&q=80&w=1200" alt="Tech Background" className="w-full h-full object-cover opacity-20 group-hover:scale-105 transition-transform duration-1000"/>
               <div className="absolute inset-0 bg-gradient-to-r from-[#030014] via-[#030014]/90 to-transparent"></div>
            </div>
            
            <div className="relative p-12 md:p-20 flex flex-col md:flex-row items-center justify-between gap-10">
              <div className="text-right flex-1">
                <h2 className="text-4xl md:text-5xl font-bold text-white mb-6 leading-tight">كن جزءاً من <br/><span className="text-transparent bg-clip-text bg-gradient-to-l from-cyan-400 to-violet-500">الثورة التقنية السورية</span></h2>
                <p className="text-gray-300 text-lg md:text-xl max-w-lg leading-relaxed">انضم إلى مجتمعنا الآن وابدأ في بناء هويتك التقنية، واعمل مع نخبة المطورين لتصميم المستقبل.</p>
              </div>
              <div className="shrink-0">
                <Link href="/register" className="inline-flex items-center justify-center bg-white text-[#030014] hover:bg-cyan-400 transition-colors font-bold px-10 py-5 rounded-2xl text-xl shadow-[0_0_20px_rgba(255,255,255,0.3)] hover:shadow-[0_0_30px_rgba(6,182,212,0.6)] hover:scale-105 transform duration-300">
                  انضم للتحالف الآن
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer مع لوغو image_0.png */}
      <footer className="relative z-10 border-t border-white/5 bg-[#030014] pt-16 pb-8 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-start gap-10 mb-16">
            <div className="max-w-xs">
              <div className="flex items-center gap-3 mb-6">
                {/* اللوغو في الفوتر - صورة image_0.png */}
                <div className="w-12 h-12 rounded-lg overflow-hidden border border-cyan-400/50 shadow-[0_0_10px_rgba(6,182,212,0.2)] p-[1px]">
                  <img src="/image_0.png" alt="SAAIT Logo" className="w-full h-full object-contain" />
                </div>
                <div>
                  <span className="font-bold text-white text-lg">SAAIT</span>
                </div>
              </div>
              <p className="text-gray-400 text-sm leading-relaxed">التحالف السوري للذكاء الاصطناعي والتكنولوجيا المتقدمة. نبني جسوراً نحو مستقبل رقمي واعد.</p>
            </div>
            
            <div className="flex gap-16">
              <div>
                <h4 className="text-white font-bold mb-4">المنصة</h4>
                <div className="flex flex-col gap-3 text-sm text-gray-400">
                  <Link href="/projects" className="hover:text-cyan-400 transition">المشاريع</Link>
                  <Link href="/events" className="hover:text-cyan-400 transition">الفعاليات</Link>
                  <Link href="/community" className="hover:text-cyan-400 transition">المجتمع</Link>
                </div>
              </div>
              <div>
                <h4 className="text-white font-bold mb-4">تواصل معنا</h4>
                <div className="flex flex-col gap-3 text-sm text-gray-400">
                  <Link href="/news" className="hover:text-cyan-400 transition">الأخبار</Link>
                  <Link href="/contact" className="hover:text-cyan-400 transition">الدعم الفني</Link>
                </div>
              </div>
            </div>
          </div>
          
          <div className="flex flex-col md:flex-row justify-between items-center gap-4 pt-8 border-t border-white/5 text-gray-500 text-sm">
            <p>© 2024 SAAIT — جميع الحقوق محفوظة.</p>
            <div className="flex gap-4">
              <a href="#" className="w-10 h-10 rounded-full bg-white/5 hover:bg-cyan-500/20 flex items-center justify-center hover:text-cyan-400 transition-all border border-transparent hover:border-cyan-500/30">
                W
              </a>
              <a href="#" className="w-10 h-10 rounded-full bg-white/5 hover:bg-blue-500/20 flex items-center justify-center hover:text-blue-400 transition-all border border-transparent hover:border-blue-500/30">
                T
              </a>
            </div>
          </div>
        </div>
      </footer>

    </main>
  );
}
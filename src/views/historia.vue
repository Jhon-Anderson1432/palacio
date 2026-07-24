<template>
  <!-- ESTRUCTURA & SEO: Uso de <main> semántico y selección de texto elegante -->
  <main class="relative min-h-screen w-full font-sans bg-neutral-950 text-white overflow-x-hidden pt-32 selection:bg-[#D4AF37] selection:text-black">
    
    <Navbar :ocultarBuscador="true" />

    <!-- SEO: Cabecera optimizada. El H1 es claro para Google -->
    <header class="text-center mb-20 px-4 mt-6">
      <h1 class="text-4xl md:text-6xl font-light tracking-[0.15em] uppercase mb-6 text-[#D4AF37] drop-shadow-[0_0_15px_rgba(212,175,55,0.2)]">
        {{ t.title }}
      </h1>
      <!-- Subtítulo expandido para SEO natural -->
      <p class="text-neutral-400 font-light tracking-[0.2em] uppercase text-xs md:text-sm max-w-3xl mx-auto leading-relaxed">
        {{ t.subtitle }}
      </p>
    </header>

    <!-- Línea de tiempo semántica -->
    <section class="max-w-6xl mx-auto relative px-4 md:px-8 mb-24" aria-label="Línea de tiempo histórica">
      
      <!-- Línea central decorativa -->
      <div class="absolute left-8 md:left-1/2 top-4 bottom-4 w-[2px] bg-gradient-to-b from-transparent via-[#D4AF37]/40 to-transparent md:-translate-x-1/2 rounded-full hidden sm:block"></div>

      <article 
        v-for="(item, index) in timelineTranslated" 
        :key="index" 
        class="timeline-item relative flex flex-col md:flex-row items-center w-full mb-16 md:mb-32 group"
      >
        <!-- Nodo central -->
        <div class="absolute left-8 md:left-1/2 w-5 h-5 rounded-full bg-neutral-950 border-2 border-[#D4AF37] shadow-[0_0_15px_rgba(212,175,55,0.5)] transform -translate-x-1/2 top-8 md:top-1/2 md:-translate-y-1/2 z-10 transition-all duration-500 group-hover:scale-150 group-hover:bg-[#D4AF37] group-hover:shadow-[0_0_25px_rgba(212,175,55,0.9)] hidden sm:block"></div>

        <div :class="['w-full md:w-1/2 pl-14 sm:pl-16 md:px-14', index % 2 === 0 ? 'md:mr-auto' : 'md:ml-auto']">
          
          <div class="bg-white/[0.02] backdrop-blur-xl border border-white/10 rounded-2xl p-6 hover:border-[#D4AF37]/50 transition-all duration-700 shadow-2xl hover:shadow-[0_15px_40px_rgba(212,175,55,0.15)] group-hover:-translate-y-3 relative overflow-hidden">
            <!-- Brillo de fondo al hacer hover -->
            <div class="absolute inset-0 bg-gradient-to-br from-[#D4AF37]/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none"></div>

            <div class="relative z-10">
              <figure class="w-full h-56 md:h-72 mb-8 rounded-xl overflow-hidden border border-white/5 relative bg-neutral-900">
                <!-- RENDIMIENTO: Lazy loading para imágenes fuera del primer pantallazo, eager para la primera -->
                <img 
                  :src="item.img" 
                  :alt="`${item.title} - Historia del Palacio Nacional`" 
                  :loading="index === 0 ? 'eager' : 'lazy'"
                  decoding="async"
                  :fetchpriority="index === 0 ? 'high' : 'auto'"
                  class="w-full h-full object-cover grayscale opacity-70 group-hover:grayscale-0 group-hover:opacity-100 transition-all duration-1000 transform group-hover:scale-105" 
                />
                <div class="absolute inset-0 bg-gradient-to-t from-neutral-950 via-transparent to-transparent opacity-60"></div>
              </figure>
              
              <div :class="index % 2 === 0 ? 'md:text-right' : 'md:text-left'">
                <!-- SEO: Uso de etiqueta <time> para fechas históricas -->
                <time :datetime="item.year" class="text-[#D4AF37] font-bold text-2xl tracking-[0.2em] block mb-3 drop-shadow-md">
                  {{ item.year }}
                </time>
                <h2 class="text-white text-2xl md:text-3xl font-serif font-light uppercase tracking-widest mb-4">
                  {{ item.title }}
                </h2>
                <p class="text-neutral-400 font-light leading-relaxed text-sm md:text-base tracking-wide text-justify md:text-left drop-shadow-sm" :class="index % 2 === 0 ? 'md:text-right' : ''">
                  {{ item.desc }}
                </p>
              </div>
            </div>
          </div>
        </div>
      </article>
    </section>

    <Footer />
  </main>
</template>

<script setup>
import { computed, onMounted } from 'vue'
import Navbar from '../components/Navbar.vue'
import Footer from '../components/footer.vue'
import { idiomaGlobal } from '../lib/supabase'

// 1. LÓGICA DE NEGOCIO Y TRADUCCIONES
const textos = {
  es: { title: 'Historia del Palacio', subtitle: 'La evolución arquitectónica y cultural del edificio más emblemático de Medellín: desde los tribunales de justicia hasta el santuario del arte contemporáneo.' },
  en: { title: 'History of the Palace', subtitle: 'The architectural and cultural evolution of Medellin\'s most iconic building: from courts of justice to a sanctuary of contemporary art.' },
  fr: { title: 'Histoire du Palais', subtitle: 'L\'évolution architecturale et culturelle du bâtiment le plus emblématique de Medellín : des cours de justice au sanctuaire de l\'art contemporain.' },
  ja: { title: '宮殿の歴史', subtitle: 'メデジンで最も象徴的な建物の建築的・文化的進化：正義の裁判所から現代アートの聖域まで。' }
}

const t = computed(() => textos[idiomaGlobal.value] || textos['es'])

// HISTORIA EXPANDIDA: Más detalle, más narrativa visual (6 eventos).
const timelineData = [
  {
    year: '1920', img: '/pa1.jpg',
    es: { title: 'El Diseño Visionario', desc: 'Ante la necesidad de modernizar la ciudad, el gobierno de Antioquia encomendó el diseño de un nuevo edificio administrativo al visionario arquitecto belga Agustín Goovaerts. Su genialidad trajo a Medellín un imponente diseño neo-románico, marcando el inicio de una de las joyas arquitectónicas más importantes de Colombia.' },
    en: { title: 'The Visionary Design', desc: 'Faced with the need to modernize the city, the government of Antioquia commissioned visionary Belgian architect Agustín Goovaerts. His genius brought an imposing Neo-Romanesque design to Medellin, marking the beginning of one of Colombia\'s most important architectural jewels.' },
    fr: { title: 'Le Design Visionnaire', desc: 'Face à la nécessité de moderniser la ville, le gouvernement d\'Antioquia a mandaté l\'architecte visionnaire belge Agustín Goovaerts. Son génie a apporté un imposant design néo-roman à Medellín, marquant le début de l\'un des joyaux architecturaux les plus importants de Colombie.' },
    ja: { title: '先見の明のあるデザイン', desc: '都市の近代化の必要性に直面し、アンティオキア政府は先見の明のあるベルギーの建築家アグスティン・ゴーヴァルツに設計を依頼しました。彼の才能はメデジンに壮大なネオ・ロマネスク様式のデザインをもたらし、コロンビアで最も重要な建築の宝石の一つの始まりを告げました。' }
  },
  {
    year: '1925', img: '/pa2.jpg',
    es: { title: 'Los Cimientos Románticos', desc: 'Se coloca la primera piedra y comienza oficialmente la construcción. Con sus arcos de medio punto, intrincada mampostería y amplios pasillos interiores, la estructura se consolidó rápidamente como el máximo exponente del estilo romántico modernizado en la región.' },
    en: { title: 'The Romantic Foundations', desc: 'The first stone was laid and construction officially began. With its semi-circular arches, intricate masonry, and wide interior corridors, the structure quickly established itself as the finest example of modernized romantic style in the region.' },
    fr: { title: 'Les Fondations Romantiques', desc: 'La première pierre a été posée et la construction a officiellement commencé. Avec ses arcs en plein cintre, sa maçonnerie complexe et ses larges couloirs intérieurs, la structure s\'est rapidement imposée comme le meilleur exemple de style romantique modernisé dans la région.' },
    ja: { title: 'ロマンチックな基盤', desc: '最初の礎石が置かれ、建設が正式に始まりました。半円形のアーチ、複雑な石工、広い内部の廊下を備えたこの構造は、地域で最も優れた近代化されたロマンチックなスタイルの例として急速に確立されました。' }
  },
  {
    year: '1933', img: '/pag3.webp',
    es: { title: 'La Sede de la Justicia', desc: 'Tras años de minucioso trabajo, el Palacio abre sus majestuosas puertas. Durante más de cinco décadas funcionaría ininterrumpidamente como el Palacio de Justicia de Antioquia. En estos pasillos y oficinas se tomaron decisiones que definieron el rumbo legal e histórico del departamento.' },
    en: { title: 'The Seat of Justice', desc: 'After years of meticulous work, the Palace opened its majestic doors. For over five decades it functioned uninterruptedly as the Palace of Justice of Antioquia. Decisions that defined the legal and historical course of the region were made in these halls.' },
    fr: { title: 'Le Siège de la Justice', desc: 'Après des années de travail minutieux, le Palais a ouvert ses portes majestueuses. Pendant plus de cinq décennies, il a fonctionné de manière ininterrompue comme Palais de Justice d\'Antioquia. C\'est dans ces salles qu\'ont été prises les décisions qui ont défini le cours légal de la région.' },
    ja: { title: '正義の座', desc: '長年の細心の注意を払った作業の後、宮殿はその荘厳な扉を開きました。50年以上にわたり、アンティオキアの正義の宮殿として途切れることなく機能しました。これらのホールで地域の法的および歴史的な進路を決定する決定が下されました。' }
  },
  {
    year: '1988', img: '/pa5.jpg',
    es: { title: 'Patrimonio de la Nación', desc: 'Reconociendo su incalculable valor estético, cultural e histórico, el edificio es elevado a la categoría de Monumento Nacional. Esta declaración como Patrimonio Histórico y Artístico de la Nación aseguró su preservación frente al rápido desarrollo urbanístico de Medellín.' },
    en: { title: 'National Heritage', desc: 'Recognizing its incalculable aesthetic, cultural, and historical value, the building was elevated to the status of National Monument. This declaration as a National Historical and Artistic Heritage ensured its preservation against Medellin\'s rapid urban development.' },
    fr: { title: 'Patrimoine National', desc: 'Reconnaissant sa valeur esthétique, culturelle et historique incalculable, le bâtiment a été élevé au rang de Monument National. Cette déclaration en tant que Patrimoine Historique et Artistique National a assuré sa préservation face au développement urbain rapide de Medellín.' },
    ja: { title: '国家遺産', desc: 'その計り知れない美的、文化的、歴史的価値を認識し、建物は国定記念物に指定されました。国家歴史的・芸術的遺産としてのこの宣言は、メデジンの急速な都市開発からその保存を保証しました。' }
  },
  {
    year: '1993', img: '/pa6.jpg', // Asumimos o reutilizamos imagen
    es: { title: 'El Renacer Comercial', desc: 'Tras el traslado de los juzgados a un nuevo complejo, el Palacio fue rescatado del abandono, meticulosamente restaurado y adaptado como centro comercial. Magistrados y abogados dieron paso a comerciantes y visitantes, convirtiendo sus imponentes arcos en un epicentro de la moda urbana.' },
    en: { title: 'The Commercial Rebirth', desc: 'After the courts moved to a new complex, the Palace was rescued from abandonment, meticulously restored and adapted into a shopping center. Magistrates made way for merchants and visitors, turning its imposing arches into an epicenter of urban fashion.' },
    fr: { title: 'La Renaissance Commerciale', desc: 'Après le déménagement des tribunaux, le Palais a été sauvé de l\'abandon, méticuleusement restauré et adapté en centre commercial. Les magistrats ont fait place aux commerçants et aux visiteurs, transformant ses imposantes arches en un épicentre de la mode urbaine.' },
    ja: { title: '商業のルネッサンス', desc: '裁判所が新しい複合施設に移転した後、宮殿は放棄から救われ、細心の注意を払って修復され、ショッピングセンターとして適応されました。治安判事は商人や訪問者に道を譲り、その壮大なアーチを都市のファッションの中心地に変えました。' }
  },
  {
    year: 'Actualidad', img: '/pa4.jpg',
    es: { title: 'El Santuario del Arte', desc: 'En su etapa más reciente, el Palacio trasciende su vocación comercial. Sus históricos pisos superiores resguardan hoy una vasta galería de arte contemporáneo, creando un contraste poético donde el bullicio comercial de la ciudad convive en armonía con lienzos, esculturas y exposiciones de talla internacional.' },
    en: { title: 'The Art Sanctuary', desc: 'In its most recent stage, the Palace transcends its commercial vocation. Its historic upper floors now house a vast contemporary art gallery, creating a poetic contrast where the city\'s commercial bustle coexists in harmony with canvases, sculptures, and world-class exhibitions.' },
    fr: { title: 'Le Sanctuaire de l\'Art', desc: 'Dans sa phase la plus récente, le Palais transcende sa vocation commerciale. Ses étages supérieurs historiques abritent aujourd\'hui une vaste galerie d\'art contemporain, créant un contraste poétique où l\'agitation commerciale coexiste en harmonie avec les toiles, les sculptures et les expositions.' },
    ja: { title: 'アートの聖域', desc: '最新の段階で、宮殿はその商業的使命を超越しています。その歴史的な上層階には現在、広大な現代アートギャラリーがあり、都市の商業的な喧騒がキャンバス、彫刻、世界クラスの展覧会と調和して共存する詩的なコントラストを作り出しています。' }
  }
]

const timelineTranslated = computed(() => {
  return timelineData.map(item => ({
    year: item.year, img: item.img,
    title: item[idiomaGlobal.value]?.title || item['es'].title,
    desc: item[idiomaGlobal.value]?.desc || item['es'].desc
  }))
})

// 2. LÓGICA SEO MAESTRA
const inyectarSEO = () => {
  // Title y Description súper optimizados
  document.title = "Historia del Palacio Nacional de Medellín | Monumento y Centro Cultural";
  
  let metaDesc = document.querySelector('meta[name="description"]');
  if (!metaDesc) {
    metaDesc = document.createElement('meta');
    metaDesc.name = "description";
    document.head.appendChild(metaDesc);
  }
  metaDesc.content = "Descubre la fascinante historia del Palacio Nacional de Medellín. De ser el Palacio de Justicia a convertirse en Monumento Nacional, centro comercial y galería de arte.";

  // Forzar Canonical
  let canonical = document.querySelector("link[rel='canonical']");
  if (!canonical) {
    canonical = document.createElement("link");
    canonical.setAttribute("rel", "canonical");
    document.head.appendChild(canonical);
  }
  canonical.setAttribute("href", "https://palacionacionalmedellin.com/historia");

  // Schema.org doble: AboutPage + HistoricalBuilding
  const schemaData = {
    "@context": "https://schema.org",
    "@type": "AboutPage",
    "mainEntity": {
      "@type": "HistoricalBuilding",
      "name": "Palacio Nacional de Medellín",
      "description": "Edificio histórico de estilo neo-románico diseñado por Agustín Goovaerts en 1920. Antiguo Palacio de Justicia de Antioquia y actual Patrimonio Nacional, Centro Comercial y Galería de Arte.",
      "url": "https://palacionacionalmedellin.com/historia",
      "address": {
        "@type": "PostalAddress",
        "streetAddress": "Carrera 52 # 52-43",
        "addressLocality": "Medellín",
        "addressRegion": "Antioquia",
        "addressCountry": "CO"
      },
      "architect": {
        "@type": "Person",
        "name": "Agustín Goovaerts"
      },
      "dateCreated": "1933",
      "keywords": "historia del palacio nacional de medellin, palacio de justicia medellin, agustin goovaerts, monumento nacional colombia"
    }
  };

  const scriptId = 'schema-historia-palacio';
  const existingScript = document.getElementById(scriptId);
  if (existingScript) existingScript.remove();

  const script = document.createElement('script');
  script.id = scriptId;
  script.setAttribute('type', 'application/ld+json');
  script.textContent = JSON.stringify(schemaData);
  document.head.appendChild(script);
}

onMounted(() => {
  window.scrollTo(0, 0);
  inyectarSEO();
})
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,700;1,400&display=swap');

.font-serif {
  font-family: 'Playfair Display', serif;
}

/* Animaciones de entrada secuencial al cargar la página */
.timeline-item {
  opacity: 0;
  animation: fadeInSlideUp 0.8s cubic-bezier(0.16, 1, 0.3, 1) forwards;
}

.timeline-item:nth-child(1) { animation-delay: 0.1s; }
.timeline-item:nth-child(2) { animation-delay: 0.3s; }
.timeline-item:nth-child(3) { animation-delay: 0.5s; }
.timeline-item:nth-child(4) { animation-delay: 0.7s; }
.timeline-item:nth-child(5) { animation-delay: 0.9s; }
.timeline-item:nth-child(6) { animation-delay: 1.1s; }

@keyframes fadeInSlideUp {
  from {
    opacity: 0;
    transform: translateY(50px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
</style>
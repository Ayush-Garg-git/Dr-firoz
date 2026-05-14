/* ── PAGE ROUTING ── */
const PAGES=['home','services','blogs','faq','appointment','contact','article'];
function go(name){
  PAGES.forEach(p=>document.getElementById('page-'+p).classList.remove('active'));
  const t=document.getElementById('page-'+name);
  t.classList.add('active');
  document.querySelectorAll('.nav-links a').forEach(a=>a.classList.remove('active'));
  const nl=document.getElementById('nl-'+name);
  if(nl)nl.classList.add('active');
  const f=document.getElementById('footer');
  const pb=t.querySelector('.pt');
  if(pb)pb.appendChild(f);
  window.scrollTo({top:0,behavior:'smooth'});
  setTimeout(initSR,60);
}

/* ── MOBILE MENU ── */
function toggleMob(){
  const nav = document.getElementById('mobNav');
  const overlay = document.getElementById('mobOverlay');
  const ham = document.querySelector('.ham');
  const isOpen = nav.classList.contains('open');
  
  if(isOpen){
    nav.classList.remove('open');
    overlay.classList.remove('open');
    if(ham) ham.classList.remove('active');
    document.body.style.overflow = '';
  } else {
    nav.classList.add('open');
    overlay.classList.add('open');
    if(ham) ham.classList.add('active');
    document.body.style.overflow = 'hidden';
  }
}

/* ── TESTIMONIAL SLIDER ── */
let testiTimer;
function slideTesti(dir) {
  const shelf = document.getElementById('testi-shelf');
  if (!shelf) return;
  const cards = shelf.querySelectorAll('.testi-aura-card');
  const cardWidth = 352; // 320px width + 32px gap
  
  // Smooth scroll
  shelf.scrollBy({ left: dir * cardWidth, behavior: 'smooth' });

  // Seamless Loop Logic (After slide finishes)
  setTimeout(() => {
    const scrollLeft = shelf.scrollLeft;
    const maxScroll = shelf.scrollWidth - shelf.clientWidth;
    const offset = cardWidth * 4; // Length of 4 cards
    
    // If too far right, jump back to middle set
    if (scrollLeft >= maxScroll - 50) {
      shelf.scrollTo({ left: scrollLeft - offset, behavior: 'instant' });
    }
    // If too far left, jump forward to middle set
    if (scrollLeft <= 50) {
      shelf.scrollTo({ left: scrollLeft + offset, behavior: 'instant' });
    }
  }, 600);

  startTestiAuto();
}

function startTestiAuto() {
  clearInterval(testiTimer);
  testiTimer = setInterval(() => {
    slideTesti(1);
  }, 7000); // 7s pause
}

/* ── NAV SCROLL ── */
window.addEventListener('scroll', () => {
  const nav = document.getElementById('nav');
  if (nav) nav.classList.toggle('scrolled', window.scrollY > 10);
}, { passive: true });

document.addEventListener('DOMContentLoaded', () => {
  const shelf = document.getElementById('testi-shelf');
  if (shelf) {
    // Start at the middle set (Set 2)
    shelf.scrollTo({ left: 352 * 4, behavior: 'instant' });
  }
  startTestiAuto();
});

/* ── FAQ ── */
function showMoreFaq(btn) {
  document.querySelectorAll('.faq-m-item.faq-hidden').forEach(i => i.style.display = 'block');
  btn.style.display = 'none';
}

function tFaqM(btn) {
  const item = btn.closest('.faq-m-item');
  const isActive = item.classList.contains('active');
  
  // Close all other items
  document.querySelectorAll('.faq-m-item').forEach(i => {
    if (i !== item) i.classList.remove('active');
  });

  // Toggle current item
  item.classList.toggle('active');
}

function tFaq(btn){
  const item=btn.closest('.faq-item');
  const open=item.classList.contains('open');
  document.querySelectorAll('.faq-item.open').forEach(i=>i.classList.remove('open'));
  if(!open)item.classList.add('open');
}

/* ── SERVICES ── */
function tSvc(btn){
  const item=btn.closest('.svc-acc-item');
  const open=item.classList.contains('open');
  document.querySelectorAll('.svc-acc-item.open').forEach(i=>i.classList.remove('open'));
  if(!open)item.classList.add('open');
}

/* ── SCROLL REVEAL ── */
function initSR(){
  const io=new IntersectionObserver(entries=>{
    entries.forEach(e=>{
      if(e.isIntersecting){e.target.classList.add('on');io.unobserve(e.target);}
    });
  },{threshold:.08,rootMargin:'0px 0px -40px 0px'});
  document.querySelectorAll('.sr:not(.on),.sr-l:not(.on),.sr-r:not(.on),.sr-s:not(.on)').forEach(el=>io.observe(el));

  // Explorer Transitions
  const exIo = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if(e.isIntersecting){
        const id = e.target.getAttribute('data-img');
        document.querySelectorAll('.svc-visual-img').forEach(img => img.classList.remove('active'));
        const active = document.getElementById('vi-'+id);
        if(active) active.classList.add('active');
      }
    });
  }, { threshold: 0.3, rootMargin: '-10% 0px -10% 0px' });
  document.querySelectorAll('.svc-block').forEach(b => exIo.observe(b));
}

/* ── INIT ── */
document.querySelector('#page-home .pt').appendChild(document.getElementById('footer'));
initSR();

/* ── FAQ LIQUID MOMENTUM SCROLL ── */
let targetY = 0;
let currentY = 0;
const lerp = (start, end, amt) => (1 - amt) * start + amt * end;

function updateFAQScroll() {
  const faqSec = document.getElementById('page-faq');
  const faqList = document.querySelector('.faq-m-list');
  const faqContainer = document.querySelector('.faq-m-right');

  if (faqSec && faqList && faqContainer && faqSec.classList.contains('active') && window.innerWidth > 992) {
    const rect = faqSec.getBoundingClientRect();
    
    // Only process if section is in viewport
    if (rect.top < window.innerHeight && rect.bottom > 0) {
      const scrollDist = window.innerHeight - rect.top;
      const totalDist = window.innerHeight + rect.height;
      const progress = Math.min(Math.max(scrollDist / totalDist, 0), 1);
      
      const travel = Math.max(0, faqList.offsetHeight - faqContainer.offsetHeight + 100);
      targetY = progress * travel * -1;
    }
    
    // Smooth transition
    currentY = lerp(currentY, targetY, 0.08); // 0.08 for "Liquid" feel
    faqList.style.transform = `translate3d(0, ${currentY}px, 0)`;
  } else if (faqList && window.innerWidth <= 992) {
    faqList.style.transform = 'none';
  }
  requestAnimationFrame(updateFAQScroll);
}

// Start the smooth loop
requestAnimationFrame(updateFAQScroll);

/* ── PREMIUM BLOG SYSTEM ── */
const ARTICLES = {
  'diabetes-baisi': {
    title: "How a Diabetes Doctor in Baisi Can Help You Manage Sugar Levels",
    cat: "Endocrine Health",
    date: "May 10, 2026",
    read: "5 min read",
    img: "https://images.unsplash.com/photo-1579684385127-1ef15d508118?auto=format&fit=crop&w=1600&q=80",
    content: `
      <p>Diabetes is no longer a disease of the city; it is spreading rapidly in Baisi, Amour, and throughout the Seemanchal region. As a <strong>Diabetes doctor in Baisi</strong>, I have seen thousands of patients struggle with high blood sugar because they lack a simple, clear plan.</p>
      
      <h2>What is Diabetes? (Simple Language)</h2>
      <p>Think of your body like a machine that needs fuel. Sugar is that fuel. But in Diabetes, the sugar stays in your blood instead of going into your cells for energy. This high sugar acts like "slow poison" for your heart, eyes, and kidneys.</p>
      
      <h3>7 Warning Signs You Should Not Ignore</h3>
      <ul>
        <li>Feeling thirsty all the time (Polydipsia)</li>
        <li>Frequent urination, especially at night</li>
        <li>Blurry vision or eye strain</li>
        <li>Unexplained weight loss despite eating well</li>
        <li>Slow-healing wounds or infections</li>
        <li>Tingling or numbness in hands and feet</li>
        <li>Constant fatigue and weakness</li>
      </ul>

      <h2>BP Treatment in Baisi: Why Professional Care Matters</h2>
      <p>Many patients in Purnea try home remedies first. While diet is important, professional <strong>BP treatment in Baisi</strong> is essential to prevent a silent stroke. We provide accurate blood pressure mapping and therapeutic lifestyle counselling.</p>

      <h3>Frequently Asked Questions</h3>
      <div class="art-faq">
        <strong>Can Diabetes be cured?</strong>
        <p>Type 2 Diabetes can be 'reversed' or managed so well that you may not need heavy medicine, but it requires strict discipline in diet and exercise.</p>
        <strong>What should I eat?</strong>
        <p>Avoid white rice and sugar. Focus on green vegetables, whole grains, and protein. We provide a custom diet chart during consultation.</p>
      </div>
      
      <p>Don't wait for complications. If you are looking for a trusted family physician in Seemanchal, visit Seemanchal Clinic today.</p>
    `
  },
  'bp-purnea': {
    title: "Effective BP Treatment in Baisi: A Complete Guide for Families",
    cat: "Hypertension Care",
    date: "May 08, 2026",
    read: "4 min read",
    img: "https://images.unsplash.com/photo-1505576399279-565b52d4ac71?auto=format&fit=crop&w=1600&q=80",
    content: `
      <p>High Blood Pressure is often called the 'Silent Killer' because it has no obvious symptoms until it causes a heart attack or stroke. Getting effective <strong>BP treatment in Purnea</strong> or Baisi is the most important step for long-term health.</p>
      
      <h2>Understanding Your BP Numbers</h2>
      <p>A normal BP is around 120/80. If your numbers are consistently above 140/90, your heart is working too hard. Over time, this weakens your arteries.</p>
      
      <h3>How We Control BP at Seemanchal Clinic</h3>
      <p>Our approach is "Satik aur Sasta" (Accurate and Affordable). We don't just give a pill; we look at the root cause—be it stress, salt intake, or lack of sleep.</p>
      
      <ul>
        <li><strong>Diagnostic Accuracy:</strong> We use calibrated digital and manual monitors.</li>
        <li><strong>Diet Therapy:</strong> Specialized salt-reduction plans for the Bihar diet.</li>
        <li><strong>Medication:</strong> Modern, safe drugs with minimal side effects.</li>
      </ul>

      <h3>Common Questions from Patients</h3>
      <div class="art-faq">
        <strong>Will I have to take BP medicine forever?</strong>
        <p>Not always. If you lose weight and change your lifestyle early, we can often reduce or stop the medicine.</p>
        <strong>Does salt really matter?</strong>
        <p>Yes. Reducing salt is the fastest way to bring down high blood pressure naturally.</p>
      </div>
    `
  },
  'thyroid-purnea': {
    title: "Advanced Thyroid Treatment in Purnea — Understanding Symptoms",
    cat: "Metabolic Health",
    date: "May 05, 2026",
    read: "6 min read",
    img: "https://images.unsplash.com/photo-1581056771107-24ca5f033842?auto=format&fit=crop&w=1600&q=80",
    content: `
      <p>Thyroid problems are becoming very common in women across the Seemanchal area. If you are looking for <strong>Thyroid care in Purnea</strong>, understanding your symptoms is the first step.</p>
      
      <h2>Hypothyroidism vs Hyperthyroidism</h2>
      <p>If your thyroid is 'slow' (Hypo), you feel cold, gain weight, and feel depressed. If it is 'fast' (Hyper), you lose weight rapidly and feel anxious.</p>
      
      <h3>When to see a General Physician near Baisi?</h3>
      <p>If you have been feeling tired for more than a month despite sleeping well, it is time for a Thyroid Profile test.</p>
      
      <h3>Local Support</h3>
      <p>At Seemanchal Clinic, we offer complete Thyroid screening and long-term management plans to help you regain your energy and health.</p>
    `
  },
  'gut-health': {
    title: "How to Maintain Gut Health — Simple Steps for Better Digestion",
    cat: "Digestive Health",
    date: "May 03, 2026",
    read: "4 min read",
    img: "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?auto=format&fit=crop&w=1600&q=80",
    content: `
      <p>Poor gut health affects your energy, immunity, and even your mood. In rural Bihar, digestive issues are common due to water quality and dietary habits. Learn how to maintain a healthy stomach naturally.</p>
      
      <h2>The Importance of Digestion</h2>
      <p>Your gut is like the engine of your body. If the engine is dirty, the whole car runs poorly. Similarly, if your digestion is weak, you will feel tired and fall ill easily.</p>
      
      <h3>5 Tips for Better Digestion</h3>
      <ul>
        <li>Drink plenty of clean, filtered or boiled water.</li>
        <li>Eat fiber-rich foods like green vegetables and whole grains.</li>
        <li>Avoid excessive oily and spicy street food.</li>
        <li>Maintain regular meal timings.</li>
        <li>Walk for 15 minutes after dinner.</li>
      </ul>
      
      <p>If you suffer from persistent acidity or bloating, consult Dr. Firoz for a customized treatment plan.</p>
    `
  },
  'herbal-medicine': {
    title: "Herbal Remedies That Actually Work — And When to See a Doctor",
    cat: "Unani Medicine",
    date: "May 01, 2026",
    read: "5 min read",
    img: "https://images.unsplash.com/photo-1471864190281-a93a3070b6de?auto=format&fit=crop&w=1600&q=80",
    content: `
      <p>As a B.U.M.S practitioner, I believe in the power of nature. However, it is vital to know which herbal remedies are backed by evidence and when you must consult a modern doctor for serious conditions.</p>
      
      <h2>The Best of Both Worlds</h2>
      <p>We use an integrated approach at Seemanchal Clinic. We combine the gentle healing of Unani medicine with the rapid diagnostic accuracy of modern Allopathy.</p>
      
      <h3>Effective Natural Remedies</h3>
      <p>Many local herbs have been scientifically proven to help with liver health, skin allergies, and minor respiratory issues. We provide these in pure, clinical-grade forms.</p>
      
      <h3>When Not to Wait</h3>
      <p>High fever, chest pain, and sudden weakness are emergencies that require immediate modern medical attention. Do not rely solely on home remedies for acute conditions.</p>
    `
  },
  'lifestyle-diseases': {
    title: "Key Points to Avoid Lifestyle Diseases — Practical Tips",
    cat: "Preventive Health",
    date: "May 06, 2026",
    read: "5 min read",
    img: "https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?auto=format&fit=crop&w=1600&q=80",
    content: `
      <p>Diabetes, BP, and obesity are no longer just 'city diseases.' They are spreading rapidly in rural Bihar too. The good news is that they are largely preventable through simple daily choices.</p>
      
      <h2>Small Changes, Big Impact</h2>
      <p>You don't need a gym or expensive food to stay healthy. Traditional village lifestyles actually have many benefits that we are starting to lose.</p>
      
      <h3>Stay Active, Stay Healthy</h3>
      <ul>
        <li>30 minutes of brisk walking every day.</li>
        <li>Reducing salt and refined sugar intake.</li>
        <li>Getting at least 7 hours of quality sleep.</li>
        <li>Managing stress through community and prayer.</li>
      </ul>
      
      <p>Prevention is always better than cure. Join our health awareness programs at Seemanchal Clinic to learn more.</p>
    `
  }
};

function openArticle(id) {
  const art = ARTICLES[id];
  if (!art) return;

  document.getElementById('art-detail-title').innerText = art.title;
  document.getElementById('art-detail-cat').innerText = art.cat;
  document.getElementById('art-detail-date').innerText = art.date;
  document.getElementById('art-detail-read').innerText = art.read;
  document.getElementById('art-detail-content').innerHTML = art.content;

  go('article');
  window.scrollTo(0, 0);
}

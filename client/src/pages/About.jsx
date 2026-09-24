import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { BRAND } from '../config.js';
import { useLanguage } from '../context/LanguageContext.jsx';
import api from '../api/axios.js';
import TestimonialsSlider from '../components/TestimonialsSlider.jsx';

const defaultAboutHero = {
  eyebrow: 'About NMC',
  title: 'India’s Taste. The World’s Table',
  description:
    'We connect trusted Indian food products with international buyers through a clear, organised export process.',
};

const defaultAboutApproach = {
  eyebrow: 'Our approach',
  title: 'What sets us apart',
  description:
    'A structured approach to sourcing, documentation and export coordination — designed to make international buying clearer and more dependable.',
  items: [
    {
      side: 'left',
      icon: '01',
      title: 'The beginning',
      description:
        'We started with a simple idea: make quality Indian food products easier for international buyers to source with confidence.',
      image:
        'https://images.unsplash.com/photo-1556761175-b413da4baf72?auto=format&fit=crop&w=900&q=80',
    },
    {
      side: 'right',
      icon: '02',
      title: 'Built around quality',
      description:
        'Every product opportunity is supported with clear specifications, packaging details, certifications and practical export documentation.',
      image:
        'https://images.unsplash.com/photo-1521737711867-e3b97375f902?auto=format&fit=crop&w=900&q=80',
    },
    {
      side: 'left',
      icon: '03',
      title: 'Ready for global buyers',
      description:
        'From product selection and samples to pricing and shipment coordination, we keep the process organised around the buyer and destination market.',
      image:
        'https://images.unsplash.com/photo-1497366811353-6870744d04b2?auto=format&fit=crop&w=900&q=80',
    },
  ],
};

const defaultWhyChooseUs = {
  eyebrow: 'Why choose us',
  title: 'A practical partner for international food sourcing',
  description:
    'We combine product knowledge, supplier coordination and export documentation to make buying from India clearer and easier.',
  items: [
    {
      icon: '01',
      title: 'Reliable sourcing',
      description:
        'We coordinate with established growers and food companies and match products to buyer requirements.',
    },
    {
      icon: '02',
      title: 'Export-ready information',
      description:
        'Clear specifications, packaging, certifications and documentation support before shipment.',
    },
    {
      icon: '03',
      title: 'Buyer-focused coordination',
      description:
        'One organised point of contact for samples, pricing, production updates and logistics.',
    },
  ],
};

const defaultTestimonials = {
  eyebrow: 'Client feedback',
  title: 'What our clients say about us',
  description:
    'Feedback from buyers and partners who value clear communication, reliable information and a well-coordinated export process.',
  items: [
    {
      logo: 'NMC',
      quote:
        'Clear communication, practical product information and a smooth process from inquiry to shipment.',
      name: 'Amanda Smith',
      role: 'Import Buyer',
      avatar:
        'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=180&q=80',
      order: 1,
    },
    {
      logo: 'GLOBAL FOODS',
      quote:
        'The team understood our market requirements and helped us coordinate samples, specifications and pricing efficiently.',
      name: 'Mark Wilson',
      role: 'Procurement Manager',
      avatar:
        'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=180&q=80',
      order: 2,
    },
    {
      logo: 'TRADE PARTNERS',
      quote:
        'A dependable point of contact for Indian food products, export documentation and shipment coordination.',
      name: 'Jessica Smith',
      role: 'Category Manager',
      avatar:
        'https://images.unsplash.com/photo-1531123897727-8f129e1688ce?auto=format&fit=crop&w=180&q=80',
      order: 3,
    },
  ],
};

export default function About() {
  const { t } = useLanguage();
  const [content, setContent] = useState({
    aboutHero: defaultAboutHero,
    aboutApproach: defaultAboutApproach,
    aboutWhyChooseUs: defaultWhyChooseUs,
    testimonials: defaultTestimonials,
  });

  useEffect(() => {
    api
      .get('/site-content')
      .then((res) => setContent((prev) => ({ ...prev, ...res.data })))
      .catch((err) => console.error('About page content error:', err));
  }, []);

  const aboutHero = content.aboutHero || defaultAboutHero;
  const aboutApproach = content.aboutApproach || defaultAboutApproach;
  const whyChooseUs = content.aboutWhyChooseUs || defaultWhyChooseUs;
  const feedback = content.testimonials || defaultTestimonials;

  return (
    <div className="overflow-x-hidden">
      {/* 1. About Header Hero */}
      <section className="border-b border-line bg-gradient-to-b from-[#fbf8f4] to-white">
        <div className="container-x py-16 md:py-24">
          <div className="max-w-3xl">
            <span className="eyebrow text-gold">{aboutHero.eyebrow}</span>
            <h1 className="mt-3 font-display text-4xl font-extrabold tracking-tight text-ink sm:text-5xl lg:text-6xl">
              {aboutHero.title}
            </h1>
            <p className="mt-5 text-lg leading-relaxed text-ink/70">
              {aboutHero.description}
            </p>
          </div>
        </div>
      </section>

      {/* 2. Our Approach / What Sets Us Apart */}
      <section className="about-approach bg-paper border-b border-line py-16 md:py-20">
        <div className="container-x">
          <div className="about-section-intro">
            <p className="eyebrow text-moss">{aboutApproach.eyebrow || t('ourApproach')}</p>
            <h2>{aboutApproach.title || t('whatSetsApart')}</h2>
            <p>{aboutApproach.description}</p>
          </div>

          <div className="about-timeline">
            <div className="about-timeline-line" aria-hidden="true" />

            {(aboutApproach.items || [])
              .filter((item) => item.isActive !== false)
              .sort((a, b) => (a.order || 0) - (b.order || 0))
              .map((item, index) => (
                <article
                  key={item._id || index}
                  className={`about-timeline-item ${(item.side || (index % 2 === 1 ? 'right' : 'left')) === 'right' ? 'is-right' : 'is-left'}`}
                >
                  <div className="about-timeline-media">
                    {item.image ? (
                      <img src={item.image} alt={item.title || 'Our approach'} loading="lazy" />
                    ) : (
                      <div className="h-full min-h-56 w-full bg-forest" />
                    )}
                  </div>

                  <div className="about-timeline-marker" aria-hidden="true">
                    <span />
                  </div>

                  <div className="about-timeline-copy">
                    <span className="about-timeline-number">
                      {item.icon || String(index + 1).padStart(2, '0')}
                    </span>
                    <h3>{item.title}</h3>
                    <p>{item.description}</p>
                  </div>
                </article>
              ))}
          </div>
        </div>
      </section>

      {/* 3. Our Promise / Start a conversation */}
      <section className="border-b border-line bg-white py-14 md:py-20">
        <div className="container-x">
          <div className="mx-auto max-w-3xl rounded-3xl border border-line/80 bg-[#fbf9f4] p-8 md:p-12 shadow-sm text-center">
            <span className="eyebrow text-gold">Our promise</span>
            <p className="mt-4 text-base md:text-lg leading-relaxed text-ink/75">
              We understand that every export requirement is different. We combine product knowledge, supplier coordination and documentation support to help buyers move from enquiry to shipment with fewer surprises.
            </p>
            <div className="mt-6">
              <Link
                to="/inquiry?source=aboutConversation"
                className="btn-primary inline-flex items-center gap-2"
              >
                <span>Start a conversation</span>
                <span aria-hidden="true">→</span>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* 4. Why Choose Us (Aligned Grid with Equal Heights) */}
      <section className="border-b border-line bg-white py-16 md:py-20">
        <div className="container-x">
          <div className="about-section-intro">
            <p className="eyebrow text-moss">{whyChooseUs.eyebrow}</p>
            <h2>{whyChooseUs.title}</h2>
            <p>{whyChooseUs.description}</p>
          </div>

          <div className="grid gap-6 md:grid-cols-3">
            {(whyChooseUs.items || [])
              .filter((item) => item.isActive !== false)
              .sort((a, b) => (a.order || 0) - (b.order || 0))
              .map((item, index) => (
                <article
                  key={item._id || index}
                  className="group flex h-full flex-col justify-between rounded-2xl border border-line bg-[#fbf9f4] p-7 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-gold hover:bg-white hover:shadow-xl"
                >
                  <div>
                    {item.image && (
                      <img
                        src={item.image}
                        alt=""
                        loading="lazy"
                        className="mb-5 h-40 w-full rounded-xl object-cover"
                      />
                    )}
                    <span className="font-mono text-sm font-bold text-gold">
                      {item.icon || String(index + 1).padStart(2, '0')}
                    </span>
                    <h3 className="mt-3 font-display text-xl font-bold text-ink group-hover:text-forest transition-colors">
                      {item.title}
                    </h3>
                    <p className="mt-2 text-sm leading-relaxed text-ink/65">
                      {item.description}
                    </p>
                  </div>
                  <div className="mt-6 pt-4 border-t border-line/50 font-mono text-[11px] text-moss">
                    NMC Quality Verified
                  </div>
                </article>
              ))}
          </div>
        </div>
      </section>

      {/* 5. Reduced & Compact Auto-Rotatable Testimonials */}
      <TestimonialsSlider testimonials={feedback} />

      {/* 6. Call To Action */}
      <section className="container-x py-16 md:py-24">
        <div className="rounded-3xl border border-line bg-white p-8 text-center shadow-card md:p-14">
          <h2 className="font-display text-2xl font-extrabold text-ink sm:text-3xl lg:text-4xl">
            {t('specificProduct')}
          </h2>
          <p className="mx-auto mt-3 max-w-xl text-ink/65">
            {t('specificPrompt')}
          </p>
          <Link to="/inquiry" className="btn-primary mt-8 animated-cta">
            {t('getInTouch')}
          </Link>
        </div>
      </section>
    </div>
  );
}

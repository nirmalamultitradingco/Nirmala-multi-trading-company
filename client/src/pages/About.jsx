import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { BRAND } from '../config.js';
import { useLanguage } from '../context/LanguageContext.jsx';
import api from '../api/axios.js';

const defaultAboutHero = { eyebrow: 'About NMC', title: 'India’s Taste. The World’s Table', description: 'We connect trusted Indian food products with international buyers through a clear, organised export process.' };

const defaultAboutApproach = {
  eyebrow: 'Our approach',
  title: 'What sets us apart',
  description: 'A structured approach to sourcing, documentation and export coordination — designed to make international buying clearer and more dependable.',
  items: [
    {
      side: 'left',
      icon: '01',
      title: 'The beginning',
      description: 'We started with a simple idea: make quality Indian food products easier for international buyers to source with confidence.',
      image: 'https://images.unsplash.com/photo-1556761175-b413da4baf72?auto=format&fit=crop&w=900&q=80',
    },
    {
      side: 'right',
      icon: '02',
      title: 'Built around quality',
      description: 'Every product opportunity is supported with clear specifications, packaging details, certifications and practical export documentation.',
      image: 'https://images.unsplash.com/photo-1521737711867-e3b97375f902?auto=format&fit=crop&w=900&q=80',
    },
    {
      side: 'left',
      icon: '03',
      title: 'Ready for global buyers',
      description: 'From product selection and samples to pricing and shipment coordination, we keep the process organised around the buyer and destination market.',
      image: 'https://images.unsplash.com/photo-1497366811353-6870744d04b2?auto=format&fit=crop&w=900&q=80',
    },
  ],
};


const defaultWhyChooseUs = {
  eyebrow: 'Why choose us',
  title: 'A practical partner for international food sourcing',
  description: 'We combine product knowledge, supplier coordination and export documentation to make buying from India clearer and easier.',
  items: [
    { icon: '01', title: 'Reliable sourcing', description: 'We coordinate with established growers and food companies and match products to buyer requirements.' },
    { icon: '02', title: 'Export-ready information', description: 'Clear specifications, packaging, certifications and documentation support before shipment.' },
    { icon: '03', title: 'Buyer-focused coordination', description: 'One organised point of contact for samples, pricing, production updates and logistics.' },
  ],
};

const defaultTestimonials = {
  eyebrow: 'Client feedback',
  title: 'What our clients say about us',
  description: 'Feedback from buyers and partners who value clear communication, reliable information and a well-coordinated export process.',
  items: [
    { logo: 'NMC', quote: 'Clear communication, practical product information and a smooth process from inquiry to shipment.', name: 'Amanda Smith', role: 'Import Buyer', avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=180&q=80', order: 1 },
    { logo: 'GLOBAL FOODS', quote: 'The team understood our market requirements and helped us coordinate samples, specifications and pricing efficiently.', name: 'Mark Wilson', role: 'Procurement Manager', avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=180&q=80', order: 2 },
    { logo: 'TRADE PARTNERS', quote: 'A dependable point of contact for Indian food products, export documentation and shipment coordination.', name: 'Jessica Smith', role: 'Category Manager', avatar: 'https://images.unsplash.com/photo-1531123897727-8f129e1688ce?auto=format&fit=crop&w=180&q=80', order: 3 },
  ],
};

export default function About() {
  const { t } = useLanguage();
  const [content, setContent] = useState({ aboutHero: defaultAboutHero, aboutApproach: defaultAboutApproach, aboutWhyChooseUs: defaultWhyChooseUs, testimonials: defaultTestimonials });

  useEffect(() => {
    api.get('/site-content')
      .then((res) => setContent((prev) => ({ ...prev, ...res.data })))
      .catch((err) => console.error('About page content error:', err));
  }, []);

  const aboutHero = content.aboutHero || defaultAboutHero;
  const aboutApproach = content.aboutApproach || defaultAboutApproach;
  const whyChooseUs = content.aboutWhyChooseUs || defaultWhyChooseUs;
  const feedback = content.testimonials || defaultTestimonials;
  const feedbackItems = (feedback.items || []).filter((item) => item.isActive !== false).sort((a, b) => (a.order || 0) - (b.order || 0));

  return (
    <div>
      {/* About header */}
      <section className="border-b border-line">
        <div className="container-x py-16 md:py-20">
          <p className="eyebrow">{aboutHero.eyebrow}</p>
          <h1 className="mt-4 max-w-3xl font-display text-4xl font-extrabold tracking-tight text-ink sm:text-5xl">
            {aboutHero.title}
          </h1>
          <p className="mt-5 max-w-2xl text-lg text-ink/65">{aboutHero.description}</p>
        </div>
      </section>

      {/* Our approach / What sets us apart */}
      <section className="about-approach bg-paper">
        <div className="container-x">
          <div className="about-section-intro">
            <p className="eyebrow">{aboutApproach.eyebrow || t('ourApproach')}</p>
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
                    {item.image ? <img src={item.image} alt={item.title || 'Our approach'} loading="lazy" /> : <div className="h-full min-h-56 w-full bg-forest" />}
                  </div>

                  <div className="about-timeline-marker" aria-hidden="true">
                    <span />
                  </div>

                  <div className="about-timeline-copy">
                    <span className="about-timeline-number">{item.icon || String(index + 1).padStart(2, '0')}</span>
                    <h3>{item.title}</h3>
                    <p>{item.description}</p>
                  </div>
                </article>
              ))}
          </div>


        </div>
      </section>

      {/* Start a conversation */}
      <section className="about-conversation border-y border-line bg-white">
        <div className="container-x py-12 md:py-16">
          <div className="mx-auto max-w-3xl border-t border-line pt-8">
            <p className="eyebrow">Our promise</p>
            <p className="mt-4 max-w-2xl text-sm leading-7 text-ink/65 md:text-base">
              We understand that every export requirement is different. We combine product knowledge, supplier coordination and documentation support to help buyers move from enquiry to shipment with fewer surprises.
            </p>
            <Link
              to="/inquiry?source=aboutConversation"
              className="mt-5 inline-flex items-center gap-2 text-sm font-semibold text-forest transition hover:gap-3 hover:underline"
            >
              Start a conversation <span aria-hidden="true">→</span>
            </Link>
          </div>
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="about-why-choose border-y border-line bg-white">
        <div className="container-x">
          <div className="about-section-intro">
            <p className="eyebrow">{whyChooseUs.eyebrow}</p>
            <h2>{whyChooseUs.title}</h2>
            <p>{whyChooseUs.description}</p>
          </div>

          <div className="about-why-grid">
            {(whyChooseUs.items || [])
              .filter((item) => item.isActive !== false)
              .sort((a, b) => (a.order || 0) - (b.order || 0))
              .map((item, index) => (
                <article key={item._id || index} className="about-why-card cursor-pointer">
                  {item.image && <img src={item.image} alt="" loading="lazy" className="mb-5 h-36 w-full rounded-xl object-cover" />}
                  <span className="about-why-number">{item.icon || String(index + 1).padStart(2, '0')}</span>
                  <h3>{item.title}</h3>
                  <p>{item.description}</p>
                </article>
              ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="about-testimonials border-y border-line">
        <div className="container-x">
          <div className="about-testimonials-heading">
            <p className="eyebrow">{feedback.eyebrow}</p>
            <h2>{feedback.title}</h2>
            <p>{feedback.description}</p>
          </div>

          <div className="about-testimonial-grid">
            {feedbackItems.map((item, index) => (
              <article className="about-testimonial-card cursor-pointer" key={item._id || item.name || index}>
                <div className="about-testimonial-logo">{item.logo}</div>
                <blockquote>“{item.quote}”</blockquote>
                <div className="about-testimonial-person">
                  {item.avatar ? <img src={item.avatar} alt={item.name} loading="lazy" /> : <div className="grid h-[62px] w-[62px] shrink-0 place-items-center rounded-full bg-line font-display font-bold text-forest">{(item.name || 'C').charAt(0)}</div>}
                  <div>
                    <p className="about-testimonial-name">{item.name}</p>
                    <p className="about-testimonial-role">{item.role}</p>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="container-x py-16 md:py-20">
        <div className="rounded-2xl border border-line bg-white p-8 text-center shadow-card md:p-12">
          <h2 className="font-display text-2xl font-extrabold text-ink sm:text-3xl">{t('specificProduct')}</h2>
          <p className="mx-auto mt-2 max-w-xl text-ink/65">{t('specificPrompt')}</p>
          <Link to="/inquiry" className="btn-primary mt-6 animated-cta">{t('getInTouch')}</Link>
        </div>
      </section>
    </div>
  );
}

import { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import api from '../api/axios.js';
import { BRAND } from '../config.js';

// Pre-defined knowledge base derived exclusively from NMC's public website & catalogue
const KNOWLEDGE_BASE = [
  {
    triggers: ['hello', 'hi', 'hey', 'start', 'greetings', 'namaste'],
    reply: `Hello! I am **TradeMitra**, your export assistant at **${BRAND.fullName}** (NMC). \n\nI can help you explore our export-grade Indian spices, basmati rice, grains, oil seeds, dehydrated foods, container shipping routes from Mundra & JNPT ports, lab certifications, or requesting samples. \n\nWhat are you looking to import or source today?`,
    suggestions: ['What spices do you export?', 'Shipping to USA, Europe & GCC', 'Can I request sample kits?', 'Certificates & Quality'],
  },
  {
    triggers: ['spice', 'spices', 'cumin', 'turmeric', 'chilli', 'coriander', 'fenugreek', 'fennel', 'mustard', 'pepper', 'curry'],
    reply: `We export 100% Sortex-cleaned, premium Indian spices directly from primary farm origins in Gujarat and Rajasthan:\n\n• **Cumin Seeds (Jeera):** Singapore 99%, Europe 99.5% Sortex quality with low moisture.\n• **Turmeric Fingers & Powder:** High curcumin (3%–5%) Salem, Nizamabad, and Rajapuri grades.\n• **Red Chilli:** Whole with/without stem & powder (Teja, Sanman, Byadgi) with lab-verified ASTA color.\n• **Coriander Seeds (Dhania):** Eagle, Scooter, and Badami qualities.\n• **Oil Seeds:** Hulled White Sesame (99.98% purity), Natural Sesame & Mustard seeds.\n\nAll spices are steam-sterilized (ETO/Steam treated upon request) and cleared for pesticide MRLs.`,
    link: '/products',
    linkText: 'Browse All Products →',
    suggestions: ['What is your MOQ?', 'Request sample kit', 'Lab certifications'],
  },
  {
    triggers: ['grain', 'grains', 'rice', 'basmati', 'wheat', 'pulse', 'pulses', 'dal', 'chickpea', 'chickpeas', 'lentil', 'lentils'],
    reply: `We supply high-grade Indian agricultural grains and pulses in bulk and retail packs:\n\n• **Basmati Rice:** 1121 Steam, Sella & Golden Sella (8.35mm+ average grain length), 1509, and Traditional Basmati.\n• **Non-Basmati Rice:** Sona Masoori, PR-11, IR-64, Sharbati, and Broken Rice for industrial feed/brewery.\n• **Pulses & Lentils:** Kabuli Chickpeas (75/80, 58/60, 42/44 count), Desi Chana, Toor Dal, Moong, and Red Lentils.\n• **Packaging:** 5kg, 10kg, 25kg, 50kg PP, Non-woven, and BOPP private label bags.`,
    link: '/products',
    linkText: 'Explore Grain & Rice Catalogue →',
    suggestions: ['What is your MOQ?', 'Shipping transit time', 'Request pricing'],
  },
  {
    triggers: ['dehydrate', 'dehydrated', 'onion', 'garlic', 'flake', 'powder'],
    reply: `NMC sources high-grade dehydrated vegetables from Mahuva, Gujarat (India's dehydration capital):\n\n• **Dehydrated White & Red Onion:** Flakes / Kibbled, Minced, Chopped, Granules, and Fine Powder.\n• **Dehydrated Garlic:** Cloves, Flakes, Minced, Granules, and Pure Powder.\n• **Standards:** Zero artificial additives, moisture < 6%, microbiological testing for zero Salmonella/E. Coli, packed in double poly-lined multi-wall paper bags.`,
    link: '/products',
    linkText: 'View Dehydrated Products →',
    suggestions: ['Ask for quotation', 'Request sample kit'],
  },
  {
    triggers: ['port', 'ports', 'shipping', 'ship', 'transit', 'logistics', 'container', 'fcl', 'lcl', 'freight', 'ocean', 'mundra', 'jnpt'],
    reply: `We handle smooth containerized logistics from Western India’s premier container ports:\n\n• **Dispatch Ports:** Mundra Port (Gujarat) & Nhava Sheva (JNPT, Mumbai).\n• **Consignment Options:** Full Container Load (20ft & 40ft HC FCL) and consolidated Less-than-Container Load (LCL).\n• **Maritime Transit Times:**\n  - **GCC / Middle East (Jebel Ali, Jeddah, Qatar):** 3 – 7 Days\n  - **Asian Markets (Singapore, Malaysia, Japan):** 6 – 14 Days\n  - **United Kingdom (London Gateway, Felixstowe):** 20 – 25 Days\n  - **European Union (Rotterdam, Hamburg, Antwerp):** 18 – 24 Days\n  - **USA (New York, Long Beach, Houston):** 22 – 28 Days\n  - **Norway & Scandinavia:** 22 – 27 Days\n• **Incoterms:** FOB, CIF, CFR, and DDP with full tracking.`,
    link: '/inquiry',
    linkText: 'Get Container Freight Quote →',
    suggestions: ['How to request samples?', 'Pesticide & Lab compliance'],
  },
  {
    triggers: ['certificate', 'certificates', 'certification', 'fssai', 'apeda', 'iso', 'haccp', 'gmp', 'asta', 'lab', 'mrl', 'halal', 'quality'],
    reply: `Our export consignments strictly conform to international food safety and destination-country import regulations:\n\n• **FSSAI:** Central statutory food license from Govt. of India.\n• **APEDA:** Ministry of Commerce certification with organic traceability.\n• **ISO 22000:2018 & HACCP:** Food safety management and hazard prevention.\n• **GMP & GHP:** Good manufacturing & hygiene practices.\n• **ASTA:** American Spice Trade Association cleanliness benchmarks.\n• **Export Documentation:** Phytosanitary Certificate, Fumigation Certificate, Certificate of Origin, and SGS/Eurofins laboratory pesticide MRL reports for zero customs rejection.`,
    link: '/brochures',
    linkText: 'Download Specification Sheets →',
    suggestions: ['Request sample kit', 'What spices do you export?'],
  },
  {
    triggers: ['sample', 'samples', 'moq', 'minimum order', 'order quantity', 'test'],
    reply: `**Samples & Minimum Order Quantities (MOQ):**\n\n• **Physical Sample Kits:** We ship representative laboratory samples via international courier (DHL / FedEx) for your visual inspection, moisture testing, and internal quality evaluation.\n• **Commercial MOQ:** Typically 1 FCL (one 20ft container ≈ 18–25 Metric Tons depending on product density). For multi-item consolidated trials, we also accommodate LCL shipments.\n• **How to request:** Share your delivery address and requirements through our Inquiry page, and our export team will dispatch your sample kit promptly.`,
    link: '/inquiry',
    linkText: 'Request Physical Sample Kit →',
    suggestions: ['Send an inquiry', 'Talk to sales team'],
  },
  {
    triggers: ['partner', 'partners', 'supplier', 'become partner', 'registration', 'producer', 'grower', 'vendor'],
    reply: `Are you a food manufacturer, miller, or Farmer Producer Organization (FPO) in India?\n\nWe collaborate with verified processors and growers across India to list their products for international export. \n\n• **Partner Benefits:** Direct access to verified global buyers, container consolidation at Mundra/JNPT, and complete export documentation handling.\n• You can register your company directly on our **Partners page** using our registration form.`,
    link: '/become-a-partner',
    linkText: 'Submit Partner Registration →',
    suggestions: ['Browse all products', 'Contact details'],
  },
  {
    triggers: ['contact', 'email', 'phone', 'whatsapp', 'address', 'location', 'office'],
    reply: `You can reach the international trade team at **${BRAND.fullName}** directly:\n\n• **Email:** [${BRAND.email}](mailto:${BRAND.email})\n• **Phone / WhatsApp:** ${BRAND.phone}\n• **Headquarters:** ${BRAND.address}\n• **Logistics Gateways:** Mundra Port (Gujarat) & JNPT (Mumbai)\n• **Hours:** Monday – Saturday (9:00 AM – 7:00 PM IST)\n\nFeel free to send an inquiry form for official price quotes and specification sheets.`,
    link: '/inquiry',
    linkText: 'Open Official Inquiry Form →',
    suggestions: ['Request sample kit', 'Browse all products'],
  },
  {
    triggers: ['brochure', 'brochures', 'catalogue', 'pdf', 'download', 'spec', 'specs'],
    reply: `We provide downloadable PDF product catalogues, line cards, and technical specification sheets detailing box sizes, container stuffing capacities, and HS codes.\n\nYou can view and download all active brochures directly on our Downloads page.`,
    link: '/brochures',
    linkText: 'Go to Downloads & Catalogues →',
    suggestions: ['What spices do you export?', 'Send an inquiry'],
  },
  {
    triggers: ['price', 'pricing', 'quote', 'quotation', 'rate', 'cost', 'cif', 'fob'],
    reply: `Agricultural commodity prices fluctuate based on seasonal harvest arrivals, market mandis, and international ocean freight rates.\n\nTo receive an accurate **FOB (Mundra/JNPT)** or **CIF (to your destination port)** quotation, please send an inquiry with your desired quantity, packaging specifications, and delivery port. Our team responds within 12–24 business hours.`,
    link: '/inquiry',
    linkText: 'Request CIF / FOB Quotation →',
    suggestions: ['Request sample kit', 'Port transit times'],
  },
];

// Sensitive keywords check to strictly protect confidential/private system data
const SENSITIVE_KEYWORDS = [
  'password',
  'credential',
  'token',
  'jwt',
  'secret',
  'admin_password',
  '.env',
  'mongo_uri',
  'database',
  'db_password',
  'smtp_password',
  'inquiry message',
  'customer data',
  'user table',
  'private key',
  'api key',
  'system prompt',
  'hack',
  'dump',
];

export default function TradeMitraChatbot() {
  const [isOpen, setIsOpen] = useState(false);
  const [hasUnread, setHasUnread] = useState(false);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);

  const [botConfig, setBotConfig] = useState({
    botName: 'TradeMitra',
    botSubtitle: 'AI Export & Sourcing Assistant',
    welcomeMessage: `Hello! I am **TradeMitra**, your export & sourcing assistant at **Nirmala Multi Trading Co.** (NMC).\n\nHow can I assist your food import or procurement inquiry today?`,
    defaultSuggestions: [
      'What spices do you export?',
      'Shipping to USA, Europe & GCC',
      'Can I request sample kits?',
      'Certificates & Quality',
    ],
    knowledgeBase: KNOWLEDGE_BASE,
    disclaimer: 'Responses are generated based on NMC product catalogues and export shipping specifications.',
    isActive: true,
  });

  const [messages, setMessages] = useState([]);

  // Fetch dynamic chatbot configuration from Admin SiteContent API
  useEffect(() => {
    let mounted = true;
    api
      .get('/site-content')
      .then((res) => {
        if (!mounted) return;
        const cb = res.data?.chatbot;
        if (cb) {
          const mergedKnowledge =
            Array.isArray(cb.knowledgeBase) && cb.knowledgeBase.length > 0
              ? [
                  ...cb.knowledgeBase.filter((k) => k.isActive !== false),
                  ...KNOWLEDGE_BASE.filter(
                    (def) =>
                      !cb.knowledgeBase.some((k) =>
                        k.triggers?.some((t) => def.triggers?.includes(t))
                      )
                  ),
                ]
              : KNOWLEDGE_BASE;

          setBotConfig({
            botName: cb.botName || 'TradeMitra',
            botSubtitle: cb.botSubtitle || 'AI Export & Sourcing Assistant',
            welcomeMessage:
              cb.welcomeMessage ||
              `Hello! I am **${cb.botName || 'TradeMitra'}**, your export assistant at **${BRAND.fullName}** (NMC).\n\nHow can I assist your food import or procurement inquiry today?`,
            defaultSuggestions:
              Array.isArray(cb.defaultSuggestions) && cb.defaultSuggestions.length > 0
                ? cb.defaultSuggestions
                : [
                    'What spices do you export?',
                    'Shipping to USA, Europe & GCC',
                    'Can I request sample kits?',
                    'Certificates & Quality',
                  ],
            knowledgeBase: mergedKnowledge,
            disclaimer:
              cb.disclaimer ||
              'Responses are generated based on NMC product catalogues and export shipping specifications.',
            isActive: cb.isActive !== false,
          });
        }
      })
      .catch(() => {});

    return () => {
      mounted = false;
    };
  }, []);

  // Initialize initial welcome message once botConfig is ready
  useEffect(() => {
    setMessages([
      {
        id: 1,
        sender: 'bot',
        text: botConfig.welcomeMessage,
        suggestions: botConfig.defaultSuggestions,
        time: 'Just now',
      },
    ]);
  }, [botConfig.welcomeMessage, botConfig.defaultSuggestions]);

  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (isOpen) {
      scrollToBottom();
      setHasUnread(false);
    }
  }, [messages, isOpen]);

  // Knowledge matcher
  const getBotResponse = (query) => {
    const clean = query.trim().toLowerCase();

    // STRICT CONFIDENTIALITY & DATA SECURITY SHIELD
    const isSensitive = SENSITIVE_KEYWORDS.some((word) => clean.includes(word));
    if (isSensitive) {
      return {
        text: `🔒 **Security & Privacy Policy:**\n\nI am ${botConfig.botName}, an assistant for NMC's public export catalogue, commodities, and shipping routes. \n\nTo safeguard commercial and system security, I strictly do not share administrative credentials, internal server configurations, or private customer communications.\n\nFor official business inquiries, please reach out to our management at **${BRAND.email}** or submit a request through our official inquiry form.`,
        link: '/inquiry',
        linkText: 'Contact Official Export Desk →',
        suggestions: ['What spices do you export?', 'Shipping transit time', 'Request pricing'],
      };
    }

    // Match keywords against active Knowledge Base (dynamic admin + defaults)
    const kb = botConfig.knowledgeBase || KNOWLEDGE_BASE;
    for (const item of kb) {
      const triggers = Array.isArray(item.triggers) ? item.triggers : [];
      const match = triggers.some((t) => clean.includes(t.toLowerCase()));
      if (match) {
        return {
          text: item.reply,
          link: item.link,
          linkText: item.linkText,
          suggestions: item.suggestions || [],
        };
      }
    }

    // Intelligent Fallback
    return {
      text: `Thank you for your inquiry about "${query}". \n\nNMC specializes in direct export of premium Indian spices (cumin, turmeric, chilli, coriander), basmati rice, grains, pulses, oil seeds, and dehydrated foods with Sortex cleaning and container consolidation from Mundra and JNPT ports.\n\nWould you like to browse our full product catalogue, download our brochure, or request a customized price quote with physical samples?`,
      link: '/inquiry',
      linkText: 'Send Detailed Inquiry →',
      suggestions: [
        'What spices do you export?',
        'Basmati rice & grains',
        'Shipping transit times',
        'Request sample kit',
      ],
    };
  };

  const handleSend = (textToSend) => {
    const query = typeof textToSend === 'string' ? textToSend : input;
    if (!query || !query.trim()) return;

    const userMsg = {
      id: Date.now(),
      sender: 'user',
      text: query.trim(),
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInput('');
    setIsTyping(true);

    // Realistic human response delay
    setTimeout(() => {
      const resp = getBotResponse(query);
      const botMsg = {
        id: Date.now() + 1,
        sender: 'bot',
        text: resp.text,
        link: resp.link,
        linkText: resp.linkText,
        suggestions: resp.suggestions,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };

      setMessages((prev) => [...prev, botMsg]);
      setIsTyping(false);

      if (!isOpen) {
        setHasUnread(true);
      }
    }, 600);
  };

  if (!botConfig.isActive) return null;

  return (
    <>
      {/* FLOATING CHAT TRIGGER BUTTON ON BOTTOM-RIGHT */}
      <div className="fixed bottom-6 right-6 z-50 flex items-center gap-3">
        {!isOpen && (
          <div
            onClick={() => setIsOpen(true)}
            className="hidden sm:flex items-center gap-2 rounded-full border border-gold/40 bg-[#0d1e17]/95 px-4 py-2 text-xs font-bold text-white shadow-xl backdrop-blur transition-all duration-300 hover:scale-105 hover:border-gold cursor-pointer"
          >
            <span className="h-2 w-2 rounded-full bg-emerald-400 animate-ping" />
            <span>Ask {botConfig.botName}</span>
          </div>
        )}

        <button
          type="button"
          onClick={() => setIsOpen((prev) => !prev)}
          aria-label={isOpen ? `Close ${botConfig.botName} Assistant` : `Open ${botConfig.botName} Assistant`}
          className="relative flex h-14 w-14 items-center justify-center rounded-full bg-gradient-to-br from-[#16382b] to-[#0d1e17] text-gold shadow-2xl border-2 border-gold/50 transition-all duration-300 hover:scale-110 hover:border-gold hover:shadow-gold/20"
        >
          {isOpen ? (
            <span className="text-xl font-bold leading-none text-white">✕</span>
          ) : (
            <div className="relative flex items-center justify-center">
              <span className="text-2xl" aria-hidden="true">💬</span>
              {hasUnread && (
                <span className="absolute -top-1 -right-1 h-3.5 w-3.5 rounded-full bg-gold border-2 border-[#0d1e17] animate-bounce" />
              )}
            </div>
          )}
        </button>
      </div>

      {/* CHATBOT DIALOG MODAL */}
      {isOpen && (
        <div
          role="dialog"
          aria-label={`NMC ${botConfig.botName} Assistant`}
          className="fixed bottom-24 right-4 sm:right-6 z-50 flex w-[calc(100vw-2rem)] sm:w-[400px] flex-col overflow-hidden rounded-3xl border border-line bg-white shadow-2xl transition-all duration-300 animate-in fade-in slide-in-from-bottom-5 max-h-[620px] h-[580px]"
        >
          {/* Header */}
          <div className="flex items-center justify-between bg-gradient-to-r from-[#0d1e17] via-[#16382b] to-[#12281e] p-4 text-white">
            <div className="flex items-center gap-3">
              <div className="relative grid h-10 w-10 place-items-center rounded-full bg-forest border border-gold/40 shadow-inner">
                <span className="text-lg">🌿</span>
                <span className="absolute bottom-0 right-0 h-2.5 w-2.5 rounded-full bg-emerald-400 ring-2 ring-[#0d1e17]" />
              </div>
              <div>
                <div className="flex items-center gap-1.5">
                  <h3 className="font-display text-sm font-extrabold tracking-tight text-white">
                    {botConfig.botName}
                  </h3>
                  <span className="rounded bg-gold/20 px-1.5 py-0.2 text-[9px] font-mono font-bold uppercase text-gold">
                    AI Sourcing
                  </span>
                </div>
                <p className="text-[11px] text-paper/70">
                  {botConfig.botSubtitle || `${BRAND.name} • Mundra & JNPT Export Desk`}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-1">
              <button
                type="button"
                onClick={() =>
                  setMessages([
                    {
                      id: Date.now(),
                      sender: 'bot',
                      text: `Chat restarted. How can I assist your food sourcing or container shipping inquiry?`,
                      suggestions: [
                        'What spices do you export?',
                        'Shipping transit times',
                        'Request sample kit',
                      ],
                      time: 'Just now',
                    },
                  ])
                }
                title="Restart chat"
                className="rounded-lg p-1.5 text-xs text-paper/60 hover:bg-white/10 hover:text-white"
              >
                🔄
              </button>
              <button
                type="button"
                onClick={() => setIsOpen(false)}
                aria-label="Minimize TradeMitra"
                className="rounded-lg p-1.5 text-xs text-paper/60 hover:bg-white/10 hover:text-white"
              >
                ✕
              </button>
            </div>
          </div>

          {/* Message History */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-[#faf8f4] text-xs">
            {messages.map((m) => {
              const isUser = m.sender === 'user';
              return (
                <div
                  key={m.id}
                  className={`flex flex-col ${isUser ? 'items-end' : 'items-start'}`}
                >
                  <div
                    className={`max-w-[88%] rounded-2xl px-4 py-3 shadow-xs ${
                      isUser
                        ? 'bg-forest text-white rounded-br-none'
                        : 'bg-white text-ink border border-line rounded-bl-none'
                    }`}
                  >
                    <div className="whitespace-pre-line leading-relaxed">
                      {m.text}
                    </div>

                    {m.link && (
                      <div className="mt-3 pt-2 border-t border-line/60">
                        <Link
                          to={m.link}
                          onClick={() => setIsOpen(false)}
                          className="inline-flex items-center gap-1 text-[11px] font-bold text-forest hover:text-ink hover:underline"
                        >
                          {m.linkText}
                        </Link>
                      </div>
                    )}
                  </div>

                  <span className="mt-1 px-1 text-[10px] text-ink/40 font-mono">
                    {m.time}
                  </span>

                  {/* Suggestion Chips */}
                  {!isUser && m.suggestions?.length > 0 && (
                    <div className="mt-2 flex flex-wrap gap-1.5 max-w-[90%]">
                      {m.suggestions.map((sug) => (
                        <button
                          key={sug}
                          type="button"
                          onClick={() => handleSend(sug)}
                          className="rounded-full border border-line bg-white px-2.5 py-1 text-[10px] font-semibold text-ink/75 shadow-xs transition hover:border-gold hover:bg-paper hover:text-forest"
                        >
                          {sug}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              );
            })}

            {isTyping && (
              <div className="flex items-center gap-1.5 rounded-2xl bg-white border border-line px-3 py-2 text-ink/50 w-20 shadow-xs">
                <span className="h-1.5 w-1.5 rounded-full bg-forest animate-bounce" />
                <span className="h-1.5 w-1.5 rounded-full bg-forest animate-bounce [animation-delay:0.2s]" />
                <span className="h-1.5 w-1.5 rounded-full bg-forest animate-bounce [animation-delay:0.4s]" />
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Quick Inquiry CTA strip */}
          <div className="bg-paper px-4 py-2 border-t border-line flex items-center justify-between text-[11px]">
            <span className="text-ink/60">Need formal FOB/CIF pricing?</span>
            <Link
              to="/inquiry"
              onClick={() => setIsOpen(false)}
              className="font-bold text-forest hover:underline"
            >
              Send Inquiry ↗
            </Link>
          </div>

          {/* Input Footer */}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSend();
            }}
            className="flex items-center gap-2 border-t border-line bg-white p-3"
          >
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask about spices, basmati, shipping, MOQ…"
              className="flex-1 rounded-full border border-line bg-paper/60 px-4 py-2.5 text-xs text-ink outline-none transition focus:border-forest focus:bg-white focus:ring-2 focus:ring-forest/10"
            />
            <button
              type="submit"
              disabled={!input.trim()}
              aria-label="Send query"
              className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-forest text-white transition hover:bg-forest/90 disabled:opacity-40 shadow-xs"
            >
              ➤
            </button>
          </form>
        </div>
      )}
    </>
  );
}

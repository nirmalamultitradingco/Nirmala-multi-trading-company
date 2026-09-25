import SiteContent from '../models/SiteContent.js';
import { asyncHandler } from '../utils/sendEmail.js';

const getOrCreate = async () => {
  let content = await SiteContent.findOne({ key: 'main' });
  if (!content) {
    content = await SiteContent.create({ key: 'main' });
  }

  let modified = false;
  if (!content.globalMap || !content.globalMap.regions || content.globalMap.regions.length === 0) {
    const fresh = new SiteContent();
    content.globalMap = fresh.globalMap;
    modified = true;
  } else if (!content.globalMap.pillars || content.globalMap.pillars.length === 0) {
    const fresh = new SiteContent();
    content.globalMap.pillars = fresh.globalMap.pillars;
    modified = true;
  }

  if (!content.certificates || !content.certificates.items || content.certificates.items.length === 0) {
    const fresh = new SiteContent();
    content.certificates = fresh.certificates;
    modified = true;
  }

  if (!content.flashCard || !content.flashCard.title) {
    const fresh = new SiteContent();
    content.flashCard = fresh.flashCard;
    modified = true;
  }

  if (!content.chatbot || !content.chatbot.botName) {
    const fresh = new SiteContent();
    content.chatbot = fresh.chatbot;
    modified = true;
  }

  if (!content.newArrivals || !content.newArrivals.title) {
    const fresh = new SiteContent();
    content.newArrivals = fresh.newArrivals;
    modified = true;
  }

  if (!content.productsPage || !content.productsPage.hero) {
    const fresh = new SiteContent();
    content.productsPage = fresh.productsPage;
    modified = true;
  } else {
    const fresh = new SiteContent();
    let subModified = false;
    if (!content.productsPage.showcase) {
      content.productsPage.showcase = fresh.productsPage.showcase;
      subModified = true;
    } else {
      if (content.productsPage.showcase.isActive === undefined) {
        content.productsPage.showcase.isActive = true;
        subModified = true;
      }
      if (content.productsPage.showcase.showcaseBadge === undefined) {
        content.productsPage.showcase.showcaseBadge = 'FEATURED FOOD SHOWCASE';
        subModified = true;
      }
    }
    if (!content.productsPage.bento || !content.productsPage.bento.headline) {
      content.productsPage.bento = fresh.productsPage.bento;
      subModified = true;
    }
    if (!content.productsPage.trustBar || !content.productsPage.trustBar.items || content.productsPage.trustBar.items.length === 0) {
      content.productsPage.trustBar = fresh.productsPage.trustBar;
      subModified = true;
    }
    if (!content.productsPage.ctaBanner || !content.productsPage.ctaBanner.title) {
      content.productsPage.ctaBanner = fresh.productsPage.ctaBanner;
      subModified = true;
    }
    if (subModified) {
      content.markModified('productsPage');
      modified = true;
    }
  }

  if (modified) {
    await content.save();
  }

  return content;
};

export const getSiteContent = asyncHandler(async (req, res) => {
  const content = await getOrCreate();
  res.json(content);
});

export const updateSiteContent = asyncHandler(async (req, res) => {
  const allowed = [
    'homeHero',
    'aboutHero',
    'inquiryHero',
    'aboutApproach',
    'homeOfferings',
    'homeHowWeWork',
    'aboutWhyChooseUs',
    'testimonials',
    'globalMap',
    'certificates',
    'engineerTrade',
    'flashCard',
    'chatbot',
    'newArrivals',
    'productsPage',
  ];
  const update = {};

  allowed.forEach((key) => {
    if (req.body[key] !== undefined) update[key] = req.body[key];
  });

  const content = await SiteContent.findOneAndUpdate(
    { key: 'main' },
    { $set: update, $setOnInsert: { key: 'main' } },
    { new: true, upsert: true, runValidators: true, setDefaultsOnInsert: true }
  );

  res.json(content);
});

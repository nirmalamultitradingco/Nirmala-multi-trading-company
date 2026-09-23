import { useEffect, useState } from 'react';
import api from '../api/axios.js';
import SectionHeading from '../components/SectionHeading.jsx';
import PartnerCard from '../components/PartnerCard.jsx';
import Loader from '../components/Loader.jsx';
import EmptyState from '../components/EmptyState.jsx';
import { useLanguage } from '../context/LanguageContext.jsx';

export default function Partners() {
  const [partners, setPartners] = useState([]);
  const [loading, setLoading] = useState(true);
  const { t } = useLanguage();

  useEffect(() => {
    api.get('/partners').then((r) => setPartners(r.data)).finally(() => setLoading(false));
  }, []);

  return (
    <div className="container-x py-14 md:py-20">
      <SectionHeading eyebrow={t('collaborations')} title={t('companiesWeWorkWith')}>
        {t('partnersIntro')}
      </SectionHeading>
      {loading ? (
        <Loader />
      ) : partners.length === 0 ? (
        <div className="mt-10"><EmptyState title={t('noPartners')} hint={t('addPartners')} /></div>
      ) : (
        <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {partners.map((p) => (
            <PartnerCard key={p._id} partner={p} />
          ))}
        </div>
      )}
    </div>
  );
}

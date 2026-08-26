import { useEffect, useState } from 'react';
import api from '../api/axios.js';
import SectionHeading from '../components/SectionHeading.jsx';
import SegmentCard from '../components/SegmentCard.jsx';
import Loader from '../components/Loader.jsx';
import EmptyState from '../components/EmptyState.jsx';

export default function Segments() {
  const [segments, setSegments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/segments').then((r) => setSegments(r.data)).finally(() => setLoading(false));
  }, []);

  return (
    <div className="container-x py-14 md:py-20">
      <SectionHeading eyebrow="Product segments" title="What we export">
        Browse our range by category. Each segment carries multiple products from partner companies.
      </SectionHeading>
      {loading ? (
        <Loader />
      ) : segments.length === 0 ? (
        <div className="mt-10"><EmptyState title="No segments yet" hint="Add segments from the admin panel." /></div>
      ) : (
        <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {segments.map((s) => (
            <SegmentCard key={s._id} segment={s} />
          ))}
        </div>
      )}
    </div>
  );
}

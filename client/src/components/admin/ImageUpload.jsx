import { useState } from 'react';
import api, { asset } from '../../api/axios.js';

// Uploads an image and returns the stored URL via onChange.
export default function ImageUpload({ value, onChange, label = 'Image' }) {
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');

  const upload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setBusy(true);
    setError('');
    try {
      const fd = new FormData();
      fd.append('image', file);
      const res = await api.post('/upload', fd, { headers: { 'Content-Type': 'multipart/form-data' } });
      onChange(res.data.url);
    } catch (err) {
      setError(err.message);
    } finally {
      setBusy(false);
    }
  };

  return (
    <div>
      <label className="label">{label}</label>
      <div className="flex items-center gap-3">
        {value ? (
          <img src={asset(value)} alt="" className="h-14 w-14 rounded-lg border border-line object-cover" />
        ) : (
          <div className="grid h-14 w-14 place-items-center rounded-lg border border-dashed border-line text-xs text-ink/40">
            none
          </div>
        )}
        <div className="flex-1">
          <input type="file" accept="image/*" onChange={upload} className="text-sm" />
          <input
            className="field mt-2"
            placeholder="…or paste an image URL"
            value={value || ''}
            onChange={(e) => onChange(e.target.value)}
          />
        </div>
      </div>
      {busy && <p className="mt-1 text-xs text-moss">Uploading…</p>}
      {error && <p className="mt-1 text-xs text-clay">{error}</p>}
    </div>
  );
}

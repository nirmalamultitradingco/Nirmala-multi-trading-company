import { useState } from 'react';
import api, { asset } from '../../api/axios.js';

// Uploads a video file or accepts an MP4/WebM URL and returns it via onChange
export default function VideoUpload({ value, onChange, label = 'Commercial Video / Ad URL' }) {
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');

  const upload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setBusy(true);
    setError('');
    try {
      const fd = new FormData();
      fd.append('image', file); // upload router listens on 'image' field
      const res = await api.post('/upload', fd, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      onChange(res.data.url);
    } catch (err) {
      setError(err.response?.data?.message || err.message);
    } finally {
      setBusy(false);
    }
  };

  return (
    <div>
      <label className="label">{label}</label>
      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
        {value ? (
          <div className="relative h-16 w-24 overflow-hidden rounded-lg border border-line bg-black flex-shrink-0">
            <video src={asset(value)} className="h-full w-full object-cover" muted />
            <span className="absolute bottom-0.5 right-0.5 rounded bg-forest/90 px-1 py-0.2 text-[9px] font-bold text-white">
              MP4
            </span>
          </div>
        ) : (
          <div className="grid h-16 w-24 flex-shrink-0 place-items-center rounded-lg border border-dashed border-line text-xs text-ink/40">
            No video
          </div>
        )}
        <div className="flex-1 w-full">
          <input
            type="file"
            accept="video/mp4,video/webm,video/quicktime,video/m4v"
            onChange={upload}
            className="text-sm block w-full text-ink/70 file:mr-3 file:rounded-md file:border-0 file:bg-forest/10 file:px-3 file:py-1 file:text-xs file:font-semibold file:text-forest hover:file:bg-forest/20"
          />
          <input
            className="field mt-2"
            placeholder="…or paste direct video URL (.mp4 / .webm)"
            value={value || ''}
            onChange={(e) => onChange(e.target.value)}
          />
        </div>
      </div>
      {busy && <p className="mt-1 text-xs text-moss animate-pulse">Uploading video (up to 100MB)…</p>}
      {error && <p className="mt-1 text-xs text-clay">{error}</p>}
    </div>
  );
}

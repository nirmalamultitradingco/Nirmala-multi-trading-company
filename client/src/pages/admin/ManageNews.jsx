import { useEffect, useState } from 'react';
import api, { asset } from '../../api/axios.js';
import Modal from '../../components/admin/Modal.jsx';
import ImageUpload from '../../components/admin/ImageUpload.jsx';

const blank = {
  title: '',
  excerpt: '',
  content: '',
  image: '',
  images: [],
  sections: [],
  publishedAt: new Date().toISOString().slice(0, 10),
  order: 0,
  isActive: true,
  featured: false,
};

const dateValue = (v) => (v ? new Date(v).toISOString().slice(0, 10) : '');

export default function ManageNews() {
  const [items, setItems] = useState([]);
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState(blank);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');

  const load = () =>
    api.get('/news', { params: { all: true } }).then((r) => setItems(r.data || []));

  useEffect(() => {
    load();
  }, []);

  const openNew = () => {
    setEditing(null);
    setForm(blank);
    setError('');
    setOpen(true);
  };

  const openEdit = (item) => {
    setEditing(item);
    setForm({
      ...blank,
      ...item,
      images: Array.isArray(item.images) ? item.images : [],
      sections: Array.isArray(item.sections) ? item.sections : [],
      publishedAt: dateValue(item.publishedAt),
    });
    setError('');
    setOpen(true);
  };

  // Gallery image helpers
  const addGalleryImage = () => {
    setForm({
      ...form,
      images: [...(form.images || []), ''],
    });
  };

  const updateGalleryImage = (index, url) => {
    const nextImages = [...(form.images || [])];
    nextImages[index] = url;
    setForm({ ...form, images: nextImages });
  };

  const removeGalleryImage = (index) => {
    const nextImages = (form.images || []).filter((_, i) => i !== index);
    setForm({ ...form, images: nextImages });
  };

  // Content section helpers
  const addSection = () => {
    setForm({
      ...form,
      sections: [
        ...(form.sections || []),
        {
          subtitle: '',
          text: '',
          image: '',
          order: (form.sections?.length || 0) + 1,
        },
      ],
    });
  };

  const updateSection = (index, field, value) => {
    const nextSections = [...(form.sections || [])];
    nextSections[index] = { ...nextSections[index], [field]: value };
    setForm({ ...form, sections: nextSections });
  };

  const removeSection = (index) => {
    const nextSections = (form.sections || []).filter((_, i) => i !== index);
    setForm({ ...form, sections: nextSections });
  };

  const save = async (e) => {
    e.preventDefault();
    setBusy(true);
    setError('');
    try {
      const payload = {
        ...form,
        title: form.title?.trim() || 'Untitled Post',
        publishedAt: form.publishedAt
          ? new Date(`${form.publishedAt}T12:00:00`).toISOString()
          : new Date().toISOString(),
        images: (form.images || []).filter(Boolean),
      };

      if (editing) await api.put(`/news/${editing._id}`, payload);
      else await api.post('/news', payload);

      setOpen(false);
      await load();
    } catch (err) {
      setError(err.message);
    } finally {
      setBusy(false);
    }
  };

  const remove = async (item) => {
    if (!confirm(`Delete blog post "${item.title || 'Untitled'}"?`)) return;
    try {
      await api.delete(`/news/${item._id}`);
      await load();
    } catch (err) {
      alert(err.message);
    }
  };

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="font-display text-2xl font-extrabold text-ink">Blog</h1>
          <p className="mt-1 text-sm text-ink/60">
            Add, edit, publish and manage website blog posts, multiple images, and market articles.
          </p>
        </div>
        <button className="btn-primary" onClick={openNew}>
          + Add blog post
        </button>
      </div>

      <div className="mt-6 grid gap-4">
        {items.map((item) => (
          <div
            key={item._id}
            className="flex flex-col gap-4 rounded-2xl border border-line bg-white p-4 shadow-card sm:flex-row sm:items-center"
          >
            <div className="h-24 w-full shrink-0 overflow-hidden rounded-xl bg-line sm:w-32">
              {item.image || (item.images && item.images[0]) ? (
                <img
                  src={asset(item.image || item.images[0])}
                  alt=""
                  className="h-full w-full object-cover"
                />
              ) : (
                <div className="grid h-full place-items-center text-xs text-ink/35">No image</div>
              )}
            </div>
            <div className="min-w-0 flex-1">
              <div className="flex flex-wrap gap-2">
                <span className="tag">{dateValue(item.publishedAt)}</span>
                {item.featured && <span className="tag">featured</span>}
                {!item.isActive && <span className="tag">hidden</span>}
                {item.images?.length > 0 && (
                  <span className="tag bg-gold/15 text-gold-dark font-mono text-[11px]">
                    +{item.images.length} images
                  </span>
                )}
                {item.sections?.length > 0 && (
                  <span className="tag bg-forest/10 text-forest font-mono text-[11px]">
                    {item.sections.length} sections
                  </span>
                )}
              </div>
              <h2 className="mt-2 font-display text-lg font-bold text-ink">
                {item.title || 'Untitled Post'}
              </h2>
              <p className="mt-1 line-clamp-2 text-sm text-ink/55">{item.excerpt}</p>
            </div>
            <div className="flex shrink-0 gap-2">
              <button className="btn-outline" onClick={() => openEdit(item)}>
                Edit
              </button>
              <button
                className="text-sm font-medium text-clay hover:underline"
                onClick={() => remove(item)}
              >
                Delete
              </button>
            </div>
          </div>
        ))}
        {!items.length && (
          <p className="rounded-xl border border-dashed border-line p-6 text-sm text-ink/50">
            No blog posts yet. Add your first article.
          </p>
        )}
      </div>

      <Modal open={open} title={editing ? 'Edit blog post' : 'Add blog post'} onClose={() => setOpen(false)} wide>
        <form onSubmit={save} className="space-y-5">
          {/* Note: All fields are non-compulsory */}
          <div>
            <label className="label">Title</label>
            <input
              className="field"
              placeholder="e.g. India's Agricultural Export Boom in 2026"
              value={form.title}
              onChange={(e) => setForm({ ...form, title: e.target.value })}
            />
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="label">Published date</label>
              <input
                type="date"
                className="field"
                value={form.publishedAt}
                onChange={(e) => setForm({ ...form, publishedAt: e.target.value })}
              />
            </div>
            <div>
              <label className="label">Order</label>
              <input
                type="number"
                className="field"
                value={form.order}
                onChange={(e) => setForm({ ...form, order: Number(e.target.value) })}
              />
            </div>
          </div>

          <ImageUpload
            label="Post cover image"
            value={form.image}
            onChange={(url) => setForm({ ...form, image: url })}
          />

          <div>
            <label className="label">Short description / excerpt</label>
            <textarea
              className="field"
              rows="2"
              placeholder="Brief summary displayed on blog list cards..."
              value={form.excerpt}
              onChange={(e) => setForm({ ...form, excerpt: e.target.value })}
            />
          </div>

          <div>
            <label className="label">Full article content</label>
            <textarea
              className="field"
              rows="6"
              value={form.content}
              onChange={(e) => setForm({ ...form, content: e.target.value })}
              placeholder="Write the full article. Use blank lines between paragraphs."
            />
          </div>

          {/* Multiple Gallery Images */}
          <div className="rounded-2xl border border-line bg-paper/60 p-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-display text-sm font-bold text-ink">Additional Gallery Images</h3>
                <p className="text-xs text-ink/60">Add multiple photos to display in an image gallery within this post.</p>
              </div>
              <button
                type="button"
                onClick={addGalleryImage}
                className="btn-outline py-1 text-xs"
              >
                + Add Image
              </button>
            </div>

            {form.images?.length > 0 && (
              <div className="mt-4 space-y-3">
                {form.images.map((imgUrl, idx) => (
                  <div key={idx} className="flex items-center gap-3 rounded-xl border border-line bg-white p-3">
                    <span className="font-mono text-xs text-gold">#{idx + 1}</span>
                    <div className="flex-1">
                      <ImageUpload
                        label={`Gallery Image ${idx + 1}`}
                        value={imgUrl}
                        onChange={(url) => updateGalleryImage(idx, url)}
                      />
                    </div>
                    <button
                      type="button"
                      onClick={() => removeGalleryImage(idx)}
                      className="self-center text-xs font-semibold text-clay hover:underline"
                    >
                      Remove
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Multiple Content Sections */}
          <div className="rounded-2xl border border-line bg-paper/60 p-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-display text-sm font-bold text-ink">Additional Content Sections</h3>
                <p className="text-xs text-ink/60">Add multiple headings, narrative paragraphs, and accompanying photos.</p>
              </div>
              <button
                type="button"
                onClick={addSection}
                className="btn-outline py-1 text-xs"
              >
                + Add Section
              </button>
            </div>

            {form.sections?.length > 0 && (
              <div className="mt-4 space-y-4">
                {form.sections.map((sec, idx) => (
                  <div key={idx} className="rounded-xl border border-line bg-white p-4 space-y-3">
                    <div className="flex items-center justify-between border-b border-line/50 pb-2">
                      <span className="font-mono text-xs font-bold text-forest">
                        Section {idx + 1}
                      </span>
                      <button
                        type="button"
                        onClick={() => removeSection(idx)}
                        className="text-xs font-semibold text-clay hover:underline"
                      >
                        Delete Section
                      </button>
                    </div>

                    <div>
                      <label className="label">Section Heading / Subtitle</label>
                      <input
                        className="field"
                        placeholder="e.g. Sourcing from Western Ghats"
                        value={sec.subtitle || ''}
                        onChange={(e) => updateSection(idx, 'subtitle', e.target.value)}
                      />
                    </div>

                    <div>
                      <label className="label">Section Text / Paragraph</label>
                      <textarea
                        className="field"
                        rows="3"
                        placeholder="Write this section's content..."
                        value={sec.text || ''}
                        onChange={(e) => updateSection(idx, 'text', e.target.value)}
                      />
                    </div>

                    <ImageUpload
                      label="Section Image (optional)"
                      value={sec.image || ''}
                      onChange={(url) => updateSection(idx, 'image', url)}
                    />
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="flex flex-wrap gap-5">
            <label className="flex items-center gap-2 text-sm">
              <input
                type="checkbox"
                checked={form.isActive}
                onChange={(e) => setForm({ ...form, isActive: e.target.checked })}
              />{' '}
              Published / visible
            </label>
            <label className="flex items-center gap-2 text-sm">
              <input
                type="checkbox"
                checked={form.featured}
                onChange={(e) => setForm({ ...form, featured: e.target.checked })}
              />{' '}
              Featured
            </label>
          </div>

          {error && <p className="rounded-lg bg-clay/10 px-3 py-2 text-sm text-clay">{error}</p>}

          <div className="flex justify-end gap-2 pt-2 border-t border-line/60">
            <button type="button" className="btn-outline" onClick={() => setOpen(false)}>
              Cancel
            </button>
            <button className="btn-primary" disabled={busy}>
              {busy ? 'Saving…' : 'Save article'}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
}

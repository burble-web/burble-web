'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { Plus, Edit2, Trash2, CheckCircle, XCircle, Loader2, Image as ImageIcon, Sparkles } from 'lucide-react';
import { BlogPost } from '@/types';
import {
  getAdminBlogPostsAction,
  saveBlogPostAction,
  deleteBlogPostAction,
  SaveBlogPostPayload,
} from '@/app/actions/blog';
import { translateTextAction } from '@/app/actions/translate';
import { MediaPickerModal } from '@/components/admin/MediaPickerModal';

export default function AdminBlogPage() {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [translating, setTranslating] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [mediaPickerOpen, setMediaPickerOpen] = useState(false);
  const [feedback, setFeedback] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  const [editingPost, setEditingPost] = useState<Partial<SaveBlogPostPayload>>({});

  const loadPosts = async () => {
    setLoading(true);
    const res = await getAdminBlogPostsAction();
    if (res.success && res.data) {
      setPosts(res.data);
    } else {
      setPosts([]);
    }
    setLoading(false);
  };

  useEffect(() => {
    loadPosts();
  }, []);

  const handleAutoTranslate = async () => {
    if (!editingPost.title || editingPost.title.trim().length === 0) {
      setFeedback({ type: 'error', message: 'Please enter English article title first.' });
      setTimeout(() => setFeedback(null), 3000);
      return;
    }

    setTranslating(true);
    try {
      const titleRes = await translateTextAction(editingPost.title.trim(), 'blog_title');
      const translatedTitle = titleRes.success && titleRes.translation ? titleRes.translation : (editingPost.title_ar || '');
      
      let translatedExcerpt = editingPost.excerpt_ar || '';
      if (editingPost.excerpt && editingPost.excerpt.trim().length > 0 && !editingPost.excerpt_ar) {
        const excerptRes = await translateTextAction(editingPost.excerpt.trim(), 'blog_content');
        if (excerptRes.success && excerptRes.translation) {
          translatedExcerpt = excerptRes.translation;
        }
      }

      let translatedContent = editingPost.content_ar || '';
      if (editingPost.content && editingPost.content.trim().length > 0 && !editingPost.content_ar) {
        const contentRes = await translateTextAction(editingPost.content.trim(), 'blog_content');
        if (contentRes.success && contentRes.translation) {
          translatedContent = contentRes.translation;
        }
      }

      setEditingPost({
        ...editingPost,
        title_ar: translatedTitle,
        excerpt_ar: translatedExcerpt,
        content_ar: translatedContent,
      });

      setFeedback({ type: 'success', message: '✨ Arabic blog translation generated!' });
      setTimeout(() => setFeedback(null), 3000);
    } catch (e) {
      setFeedback({ type: 'error', message: 'Failed to auto-translate blog post.' });
      setTimeout(() => setFeedback(null), 3000);
    } finally {
      setTranslating(false);
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingPost.title || !editingPost.content) return;

    setSaving(true);
    setFeedback(null);

    const res = await saveBlogPostAction(editingPost as SaveBlogPostPayload);
    setSaving(false);

    if (res.success) {
      setFeedback({ type: 'success', message: 'Blog post saved successfully!' });
      setModalOpen(false);
      loadPosts();
      setTimeout(() => setFeedback(null), 3000);
    } else {
      setFeedback({ type: 'error', message: res.error || 'Failed to save blog post.' });
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this blog post?')) return;
    const res = await deleteBlogPostAction(id);
    if (res.success) {
      setFeedback({ type: 'success', message: 'Blog post deleted.' });
      loadPosts();
      setTimeout(() => setFeedback(null), 3000);
    } else {
      setFeedback({ type: 'error', message: res.error || 'Failed to delete blog post.' });
    }
  };

  return (
    <div className="space-y-6 max-w-4xl">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-serif text-3xl font-bold text-plum-900">Blog Posts Management</h1>
          <p className="text-xs text-ink-500 mt-1">Publish bilingual floral care guides, news, and storytelling articles.</p>
        </div>

        <button
          onClick={() => {
            setEditingPost({
              title: '',
              title_ar: '',
              excerpt: '',
              excerpt_ar: '',
              content: '',
              content_ar: '',
              cover_image: '',
              author: 'Burble Florist',
              is_published: true,
            });
            setModalOpen(true);
          }}
          className="inline-flex items-center gap-2 bg-plum-900 hover:bg-plum-800 text-white font-semibold text-xs px-5 py-3 rounded-xl shadow-sm"
        >
          <Plus className="w-4 h-4" />
          <span>New Blog Post</span>
        </button>
      </div>

      {feedback && (
        <div
          className={`p-4 rounded-xl text-xs font-medium border ${
            feedback.type === 'success'
              ? 'bg-emerald-50 border-emerald-200 text-emerald-800'
              : 'bg-rose-50 border-rose-200 text-rose-800'
          }`}
        >
          {feedback.message}
        </div>
      )}

      <div className="bg-white rounded-3xl p-6 border border-ink-200/80 shadow-2xs">
        {loading ? (
          <div className="py-16 flex flex-col items-center justify-center text-ink-500">
            <Loader2 className="w-6 h-6 animate-spin mb-2 text-plum-800" />
            <span className="text-xs font-medium">Loading blog posts...</span>
          </div>
        ) : posts.length === 0 ? (
          <div className="py-16 text-center border border-dashed border-ink-200 rounded-2xl bg-cream-50/30 p-8">
            <ImageIcon className="w-10 h-10 text-ink-400 mx-auto mb-3 stroke-[1.5]" />
            <p className="font-serif text-base font-bold text-plum-950">No Blog Posts Found</p>
            <p className="text-xs text-ink-600 font-medium mt-1">Create your first floral guide or article using the button above.</p>
          </div>
        ) : (
          <div className="overflow-x-auto rounded-2xl border border-ink-200">
            <table className="w-full text-start border-collapse text-xs">
              <thead>
                <tr className="bg-cream-100/90 border-b border-ink-200 text-ink-800 font-bold uppercase tracking-wider text-[11px]">
                  <th className="py-3.5 px-4">Article (EN / AR)</th>
                  <th className="py-3.5 px-4">Author</th>
                  <th className="py-3.5 px-4">Status</th>
                  <th className="py-3.5 px-4 text-end">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-ink-100">
                {posts.map((post) => (
                  <tr key={post.id} className="hover:bg-cream-50/80 transition-colors">
                    <td className="py-3.5 px-4 font-bold text-plum-950">
                      <div className="flex items-center gap-3">
                        <div className="relative w-12 h-10 rounded-xl overflow-hidden bg-cream-200 shrink-0 border border-ink-200 flex items-center justify-center">
                          {post.cover_image ? (
                            <Image
                              src={post.cover_image}
                              alt={post.title}
                              fill
                              className="object-cover"
                            />
                          ) : (
                            <ImageIcon className="w-4 h-4 text-ink-400" />
                          )}
                        </div>
                        <div>
                          <p>{post.title}</p>
                          {post.title_ar && (
                            <p className="text-[11px] text-plum-800 font-arabic font-semibold">{post.title_ar}</p>
                          )}
                          <p className="text-[10px] text-ink-500 font-mono">/{post.slug}</p>
                        </div>
                      </div>
                    </td>
                    <td className="py-3.5 px-4 font-semibold text-plum-900">{post.author}</td>
                    <td className="py-3.5 px-4">
                      {post.is_published ? (
                        <span className="inline-flex items-center gap-1 bg-emerald-50 text-emerald-950 border border-emerald-200 px-2.5 py-1 rounded-full text-[10px] font-bold">
                          <CheckCircle className="w-3.5 h-3.5 text-emerald-700" />
                          <span>Published</span>
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 bg-amber-50 text-amber-950 border border-amber-200 px-2.5 py-1 rounded-full text-[10px] font-bold">
                          <XCircle className="w-3.5 h-3.5 text-amber-700" />
                          <span>Draft</span>
                        </span>
                      )}
                    </td>
                    <td className="py-3.5 px-4 text-end space-x-1 rtl:space-x-reverse">
                      <button
                        onClick={() => {
                          setEditingPost({
                            id: post.id,
                            title: post.title,
                            title_ar: post.title_ar || '',
                            slug: post.slug,
                            excerpt: post.excerpt,
                            excerpt_ar: post.excerpt_ar || '',
                            content: post.content,
                            content_ar: post.content_ar || '',
                            cover_image: post.cover_image,
                            author: post.author,
                            is_published: post.is_published,
                          });
                          setModalOpen(true);
                        }}
                        className="p-2 text-plum-900 hover:bg-plum-100/70 rounded-lg transition-colors cursor-pointer"
                        title="Edit"
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(post.id)}
                        className="p-2 text-rose-700 hover:bg-rose-100/70 rounded-lg transition-colors cursor-pointer"
                        title="Delete"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {modalOpen && (
        <div className="fixed inset-0 z-50 bg-plum-950/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl max-w-xl w-full p-6 sm:p-8 shadow-2xl border border-ink-200 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-serif text-2xl font-bold text-plum-950">
                {editingPost.id ? 'Edit Blog Post' : 'Create Blog Post'}
              </h2>
              <button
                type="button"
                onClick={handleAutoTranslate}
                disabled={translating}
                className="inline-flex items-center gap-1.5 bg-blush-100 hover:bg-blush-200 text-plum-950 font-bold px-3 py-1.5 rounded-xl text-xs transition-colors cursor-pointer"
              >
                {translating ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Sparkles className="w-3.5 h-3.5 text-gold-600" />}
                <span>{translating ? 'Translating...' : '✨ Generate Arabic'}</span>
              </button>
            </div>

            <form onSubmit={handleSave} className="space-y-4 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-semibold text-plum-950 mb-1.5">Article Title (English) <span className="text-rose-600">*</span></label>
                  <input
                    type="text"
                    required
                    value={editingPost.title || ''}
                    onChange={(e) => setEditingPost({ ...editingPost, title: e.target.value })}
                    className="w-full bg-cream-50/50 border border-ink-200 rounded-xl px-4 py-2.5 text-xs text-ink-900 placeholder:text-ink-400 focus:outline-none focus:ring-2 focus:ring-plum-800/20 focus:border-plum-800 transition-all"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-plum-950 mb-1.5 font-arabic">عنوان المقال (العربية)</label>
                  <input
                    type="text"
                    dir="rtl"
                    value={editingPost.title_ar || ''}
                    onChange={(e) => setEditingPost({ ...editingPost, title_ar: e.target.value })}
                    className="w-full bg-cream-50/50 border border-ink-200 rounded-xl px-4 py-2.5 text-xs text-ink-900 placeholder:text-ink-400 focus:outline-none focus:ring-2 focus:ring-plum-800/20 focus:border-plum-800 transition-all font-arabic"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-semibold text-plum-950 mb-1.5">Excerpt / Summary (English)</label>
                  <textarea
                    rows={2}
                    value={editingPost.excerpt || ''}
                    onChange={(e) => setEditingPost({ ...editingPost, excerpt: e.target.value })}
                    className="w-full bg-cream-50/50 border border-ink-200 rounded-xl px-4 py-2.5 text-xs text-ink-900 placeholder:text-ink-400 focus:outline-none focus:ring-2 focus:ring-plum-800/20 focus:border-plum-800 transition-all"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-plum-950 mb-1.5 font-arabic">الموجز (العربية)</label>
                  <textarea
                    rows={2}
                    dir="rtl"
                    value={editingPost.excerpt_ar || ''}
                    onChange={(e) => setEditingPost({ ...editingPost, excerpt_ar: e.target.value })}
                    className="w-full bg-cream-50/50 border border-ink-200 rounded-xl px-4 py-2.5 text-xs text-ink-900 placeholder:text-ink-400 focus:outline-none focus:ring-2 focus:ring-plum-800/20 focus:border-plum-800 transition-all font-arabic"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-plum-950 mb-1.5">Article Content (English) <span className="text-rose-600">*</span></label>
                <textarea
                  rows={4}
                  required
                  value={editingPost.content || ''}
                  onChange={(e) => setEditingPost({ ...editingPost, content: e.target.value })}
                  className="w-full bg-cream-50/50 border border-ink-200 rounded-xl px-4 py-2.5 text-xs text-ink-900 placeholder:text-ink-400 focus:outline-none focus:ring-2 focus:ring-plum-800/20 focus:border-plum-800 transition-all font-mono"
                />
              </div>

              <div>
                <label className="block font-semibold text-plum-950 mb-1.5 font-arabic">محتوى المقال (العربية)</label>
                <textarea
                  rows={4}
                  dir="rtl"
                  value={editingPost.content_ar || ''}
                  onChange={(e) => setEditingPost({ ...editingPost, content_ar: e.target.value })}
                  className="w-full bg-cream-50/50 border border-ink-200 rounded-xl px-4 py-2.5 text-xs text-ink-900 placeholder:text-ink-400 focus:outline-none focus:ring-2 focus:ring-plum-800/20 focus:border-plum-800 transition-all font-arabic"
                />
              </div>

              <div>
                <label className="block font-semibold text-plum-950 mb-1.5">Cover Image (Cloudinary URL)</label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={editingPost.cover_image || ''}
                    onChange={(e) => setEditingPost({ ...editingPost, cover_image: e.target.value })}
                    className="w-full bg-cream-50/50 border border-ink-200 rounded-xl px-4 py-2.5 text-xs text-ink-900 placeholder:text-ink-400 focus:outline-none focus:ring-2 focus:ring-plum-800/20 focus:border-plum-800 transition-all"
                  />
                  <button
                    type="button"
                    onClick={() => setMediaPickerOpen(true)}
                    className="bg-cream-100 hover:bg-cream-200 text-plum-950 border border-ink-200 font-semibold px-3 py-2 rounded-xl text-xs flex items-center gap-1.5 shrink-0 cursor-pointer transition-colors"
                  >
                    <ImageIcon className="w-4 h-4 text-plum-800" />
                    <span>Choose</span>
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block font-semibold text-plum-950 mb-1.5">Author Name</label>
                  <input
                    type="text"
                    value={editingPost.author || 'Burble Florist'}
                    onChange={(e) => setEditingPost({ ...editingPost, author: e.target.value })}
                    className="w-full bg-cream-50/50 border border-ink-200 rounded-xl px-4 py-2.5 text-xs text-ink-900 placeholder:text-ink-400 focus:outline-none focus:ring-2 focus:ring-plum-800/20 focus:border-plum-800 transition-all"
                  />
                </div>

                <div className="flex items-center pt-6">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={editingPost.is_published ?? true}
                      onChange={(e) => setEditingPost({ ...editingPost, is_published: e.target.checked })}
                      className="text-plum-900 rounded focus:ring-plum-800"
                    />
                    <span className="font-semibold text-plum-950">Publish Immediately</span>
                  </label>
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-6 border-t border-ink-200">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="px-5 py-2.5 rounded-xl border border-ink-200 text-ink-800 font-semibold hover:bg-cream-100 transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="px-6 py-2.5 rounded-xl bg-plum-900 hover:bg-plum-800 text-white font-semibold flex items-center gap-2 disabled:opacity-50 shadow-xs transition-colors cursor-pointer"
                >
                  {saving && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
                  <span>{saving ? 'Saving...' : 'Save Article'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <MediaPickerModal
        isOpen={mediaPickerOpen}
        onClose={() => setMediaPickerOpen(false)}
        onSelect={(url) => setEditingPost({ ...editingPost, cover_image: url })}
        title="Select Blog Cover Image"
      />
    </div>
  );
}


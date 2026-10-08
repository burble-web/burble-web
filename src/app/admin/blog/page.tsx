'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { Plus, Edit2, Trash2, CheckCircle, XCircle, Loader2, Image as ImageIcon, BookOpen } from 'lucide-react';
import { BlogPost } from '@/types';
import { DEMO_BLOG_POSTS } from '@/lib/data/storefront';
import {
  getAdminBlogPostsAction,
  saveBlogPostAction,
  deleteBlogPostAction,
  SaveBlogPostPayload,
} from '@/app/actions/blog';
import { MediaPickerModal } from '@/components/admin/MediaPickerModal';

export default function AdminBlogPage() {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [mediaPickerOpen, setMediaPickerOpen] = useState(false);
  const [feedback, setFeedback] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  const [editingPost, setEditingPost] = useState<Partial<SaveBlogPostPayload>>({});

  const loadPosts = async () => {
    setLoading(true);
    const res = await getAdminBlogPostsAction();
    if (res.success && res.data && res.data.length > 0) {
      setPosts(res.data);
    } else {
      setPosts(DEMO_BLOG_POSTS);
    }
    setLoading(false);
  };

  useEffect(() => {
    loadPosts();
  }, []);

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
          <p className="text-xs text-ink-500 mt-1">Publish floral care guides, news, and storytelling articles.</p>
        </div>

        <button
          onClick={() => {
            setEditingPost({
              title: '',
              excerpt: '',
              content: '',
              cover_image: '/demo-media/product_blush_bouquet.jpg',
              author: 'Burble Florist',
              is_published: true,
            });
            setModalOpen(true);
          }}
          className="inline-flex items-center space-x-2 bg-plum-900 hover:bg-plum-800 text-white font-semibold text-xs px-5 py-3 rounded-xl shadow-sm"
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

      <div className="bg-white rounded-3xl p-6 border border-ink-100 shadow-xs">
        {loading ? (
          <div className="py-12 flex flex-col items-center justify-center text-ink-400">
            <Loader2 className="w-6 h-6 animate-spin mb-2" />
            <span className="text-xs font-medium">Loading blog posts...</span>
          </div>
        ) : (
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="border-b border-ink-100 text-ink-500 font-semibold uppercase tracking-wider">
                <th className="py-3 px-4">Article</th>
                <th className="py-3 px-4">Author</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-ink-100">
              {posts.map((post) => (
                <tr key={post.id} className="hover:bg-cream-50 transition-colors">
                  <td className="py-3.5 px-4 font-bold text-plum-900">
                    <div className="flex items-center space-x-3">
                      <div className="relative w-12 h-10 rounded-lg overflow-hidden bg-cream-200 shrink-0 border border-ink-100">
                        <Image
                          src={post.cover_image || '/demo-media/product_blush_bouquet.jpg'}
                          alt={post.title}
                          fill
                          className="object-cover"
                        />
                      </div>
                      <div>
                        <p>{post.title}</p>
                        <p className="text-[11px] text-ink-500 font-mono">/{post.slug}</p>
                      </div>
                    </div>
                  </td>
                  <td className="py-3.5 px-4 font-semibold text-plum-800">{post.author}</td>
                  <td className="py-3.5 px-4">
                    {post.is_published ? (
                      <span className="text-emerald-700 flex items-center space-x-1 font-semibold">
                        <CheckCircle className="w-4 h-4" />
                        <span>Published</span>
                      </span>
                    ) : (
                      <span className="text-amber-700 flex items-center space-x-1 font-semibold">
                        <XCircle className="w-4 h-4" />
                        <span>Draft</span>
                      </span>
                    )}
                  </td>
                  <td className="py-3.5 px-4 text-right space-x-1">
                    <button
                      onClick={() => {
                        setEditingPost({
                          id: post.id,
                          title: post.title,
                          slug: post.slug,
                          excerpt: post.excerpt,
                          content: post.content,
                          cover_image: post.cover_image,
                          author: post.author,
                          is_published: post.is_published,
                        });
                        setModalOpen(true);
                      }}
                      className="p-1.5 text-plum-800 hover:bg-plum-100 rounded-lg"
                      title="Edit"
                    >
                      <Edit2 className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleDelete(post.id)}
                      className="p-1.5 text-rose-700 hover:bg-rose-100 rounded-lg"
                      title="Delete"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {modalOpen && (
        <div className="fixed inset-0 z-50 bg-plum-950/40 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl max-w-xl w-full p-6 sm:p-8 shadow-2xl border border-ink-100 max-h-[90vh] overflow-y-auto">
            <h2 className="font-serif text-2xl font-bold text-plum-900 mb-4">
              {editingPost.id ? 'Edit Blog Post' : 'Create Blog Post'}
            </h2>

            <form onSubmit={handleSave} className="space-y-4 text-xs">
              <div>
                <label className="block font-semibold text-plum-900 mb-1">Article Title *</label>
                <input
                  type="text"
                  required
                  value={editingPost.title || ''}
                  onChange={(e) => setEditingPost({ ...editingPost, title: e.target.value })}
                  className="w-full bg-cream-50 border border-ink-100 rounded-xl px-4 py-2.5 text-xs text-ink-900 focus:outline-none"
                />
              </div>

              <div>
                <label className="block font-semibold text-plum-900 mb-1">Excerpt / Summary</label>
                <textarea
                  rows={2}
                  value={editingPost.excerpt || ''}
                  onChange={(e) => setEditingPost({ ...editingPost, excerpt: e.target.value })}
                  className="w-full bg-cream-50 border border-ink-100 rounded-xl px-4 py-2.5 text-xs text-ink-900 focus:outline-none"
                />
              </div>

              <div>
                <label className="block font-semibold text-plum-900 mb-1">Article Content *</label>
                <textarea
                  rows={6}
                  required
                  value={editingPost.content || ''}
                  onChange={(e) => setEditingPost({ ...editingPost, content: e.target.value })}
                  className="w-full bg-cream-50 border border-ink-100 rounded-xl px-4 py-2.5 text-xs text-ink-900 focus:outline-none font-mono"
                />
              </div>

              <div>
                <label className="block font-semibold text-plum-900 mb-1">Cover Image (Cloudinary URL)</label>
                <div className="flex space-x-2">
                  <input
                    type="text"
                    value={editingPost.cover_image || ''}
                    onChange={(e) => setEditingPost({ ...editingPost, cover_image: e.target.value })}
                    className="w-full bg-cream-50 border border-ink-100 rounded-xl px-4 py-2.5 text-xs text-ink-900 focus:outline-none"
                  />
                  <button
                    type="button"
                    onClick={() => setMediaPickerOpen(true)}
                    className="bg-plum-100 hover:bg-plum-200 text-plum-900 font-semibold px-3 py-2 rounded-xl text-xs flex items-center space-x-1 shrink-0"
                  >
                    <ImageIcon className="w-4 h-4" />
                    <span>Choose</span>
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block font-semibold text-plum-900 mb-1">Author Name</label>
                  <input
                    type="text"
                    value={editingPost.author || 'Burble Florist'}
                    onChange={(e) => setEditingPost({ ...editingPost, author: e.target.value })}
                    className="w-full bg-cream-50 border border-ink-100 rounded-xl px-4 py-2.5 text-xs text-ink-900 focus:outline-none"
                  />
                </div>

                <div className="flex items-center pt-6">
                  <label className="flex items-center space-x-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={editingPost.is_published ?? true}
                      onChange={(e) => setEditingPost({ ...editingPost, is_published: e.target.checked })}
                      className="text-plum-800 rounded focus:ring-plum-800"
                    />
                    <span className="font-semibold text-plum-900">Publish Immediately</span>
                  </label>
                </div>
              </div>

              <div className="flex justify-end space-x-3 pt-4 border-t border-ink-100">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="px-4 py-2 rounded-xl border border-ink-200 text-ink-700 font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="px-5 py-2 rounded-xl bg-plum-900 text-white font-semibold flex items-center space-x-2 disabled:opacity-50"
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

'use client';
import { useState, useEffect } from 'react';
import axios from 'axios';

interface PostImage {
  id: number;
  image: string;
}

interface Post {
  id: number;
  caption: string;
  images: PostImage[];
  created_at: string;
}

export default function FeedPage() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [slideIndexes, setSlideIndexes] = useState<{ [key: number]: number }>({});

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const response = await axios.get('http://localhost:8000/api/posts');
        setPosts(response.data);
      } catch (error) {
        console.error('Failed to fetch posts', error);
      } finally {
        setLoading(false);
      }
    };
    fetchPosts();
  }, []);

  const handlePrev = (postId: number, imagesLength: number) => {
    setSlideIndexes((prev) => ({
      ...prev,
      [postId]: prev[postId] > 0 ? prev[postId] - 1 : imagesLength - 1,
    }));
  };

  const handleNext = (postId: number, imagesLength: number) => {
    setSlideIndexes((prev) => ({
      ...prev,
      [postId]: prev[postId] < imagesLength - 1 ? prev[postId] + 1 : 0,
    }));
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center py-6">
      <h1 className="text-2xl font-bold mb-6 text-blue-700 tracking-tight">Gallery</h1>
      <div className="w-full max-w-xl">
        {loading ? (
          <div className="flex justify-center items-center h-40">
            <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-600"></div>
          </div>
        ) : (
          <div className="flex flex-col">
            {posts.map((post, idx) => {
              const currentIndex = slideIndexes[post.id] || 0;
              const hasImages = post.images && post.images.length > 0;
              return (
                <div
                  key={post.id}
                  className={`border-b border-gray-200 px-4 py-6 bg-white ${idx === 0 ? 'rounded-t-2xl' : ''}`}
                >
                  <div className="mb-2 text-base text-gray-900 whitespace-pre-line break-words">{post.caption}</div>
                  {hasImages && (
                    <div className="relative w-full rounded-xl overflow-hidden bg-gray-100 aspect-[4/3] flex items-center justify-center mb-2">
                      <img
                        src={`data:image/jpeg;base64,${post.images[currentIndex].image}`}
                        alt={post.caption}
                        className="w-full h-full object-cover transition-all duration-300"
                      />
                      {post.images.length > 1 && (
                        <>
                          <button
                            onClick={() => handlePrev(post.id, post.images.length)}
                            className="absolute left-2 top-1/2 -translate-y-1/2 bg-white bg-opacity-80 hover:bg-blue-100 text-blue-700 rounded-full p-1.5 shadow transition"
                            aria-label="Previous image"
                          >
                            <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
                            </svg>
                          </button>
                          <button
                            onClick={() => handleNext(post.id, post.images.length)}
                            className="absolute right-2 top-1/2 -translate-y-1/2 bg-white bg-opacity-80 hover:bg-blue-100 text-blue-700 rounded-full p-1.5 shadow transition"
                            aria-label="Next image"
                          >
                            <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                            </svg>
                          </button>
                          <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex gap-1">
                            {post.images.map((_, idx) => (
                              <span
                                key={idx}
                                className={`inline-block w-2 h-2 rounded-full transition-all duration-200 ${
                                  idx === currentIndex ? 'bg-blue-600' : 'bg-blue-200'
                                }`}
                              />
                            ))}
                          </div>
                        </>
                      )}
                    </div>
                  )}
                  <div className="flex items-center justify-between mt-2">
                    <span className="text-xs text-gray-400">
                      {new Date(post.created_at).toISOString().replace('T', ' ').slice(0, 16)}
                    </span>
                    <span className="inline-flex items-center gap-1 text-xs text-blue-500 font-medium">
                      {post.images.length} {post.images.length === 1 ? 'image' : 'images'}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
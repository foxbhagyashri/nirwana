"use client";

import React, { useState, useRef, useEffect } from "react";
import {
  Instagram,
  Heart,
  MessageCircle,
  Share,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { useOnScreen } from "./perf/useOnScreen";

type IGMedia = {
  id: string;
  media_type: "IMAGE" | "VIDEO" | "CAROUSEL_ALBUM";
  media_url: string;
  thumbnail_url?: string;
  caption?: string;
  timestamp?: string;
  permalink: string;
};

type UIPost = {
  id: string;
  type: "image" | "video" | "carousel_album";
  image: string; // display image/poster for video
  media_url: string;
  thumbnail_url?: string;
  caption?: string;
  timeAgo: string;
  permalink: string;
  likes: number; // not provided by Basic Display API; we keep 0
  comments: number; // same as above
};

// Replace with your own Instagram Graph API access token (proxy recommended)
const ACCESS_TOKEN =
  "IGAAKslcCRoUJBZAFJxUHhVSlllbE1WZA2tYMnc1WGhYejdEb2N1TV9YQlVTMUYtUWJ1U0YyQkFuLXdNd3U5TjZA0WGl5S2Y1T0ZATSHVTTmVDdURLOHhkUllFQlRJQmdlamY4LTJQd2dDcW9BMjF2MnRtbDctR1FnRW9ZAMDV6Y0QyQQZDZD"
export function InstagramShowcase() {
  const [posts, setPosts] = useState<UIPost[]>([]);
  const [likedPosts, setLikedPosts] = useState<Set<string>>(new Set());
  const [currentSlide, setCurrentSlide] = useState(0);
  const sliderRef = useRef<HTMLDivElement>(null);
  const { ref, visible } = useOnScreen<HTMLDivElement>("150px");

  // Fetch only after the section is close/visible
  useEffect(() => {
    if (!visible) return;

    async function fetchInstagramPosts() {
      try {
        const fields =
          "id,media_type,media_url,thumbnail_url,caption,timestamp,permalink";
        const url = `https://graph.instagram.com/me/media?fields=${fields}&access_token=${ACCESS_TOKEN}&limit=6`;
        const res = await fetch(url);
        const data = await res.json();

        if (Array.isArray(data?.data)) {
          const normalized: UIPost[] = data.data.map((p: IGMedia) => {
            const isVideo = p.media_type === "VIDEO";
            return {
              id: p.id,
              type:
                p.media_type === "IMAGE"
                  ? "image"
                  : p.media_type === "CAROUSEL_ALBUM"
                    ? "carousel_album"
                    : "video",
              image: isVideo ? p.thumbnail_url || p.media_url : p.media_url,
              media_url: p.media_url,
              thumbnail_url: p.thumbnail_url,
              caption: p.caption,
              timeAgo: p.timestamp
                ? new Date(p.timestamp).toLocaleDateString()
                : "",
              permalink: p.permalink,
              likes: 0,
              comments: 0,
            };
          });
          setPosts(normalized);
          setCurrentSlide(0);
        } else {
          console.error("Instagram API error:", data);
          setPosts([]);
        }
      } catch (err) {
        console.error("Failed to fetch Instagram posts", err);
        setPosts([]);
      }
    }

    fetchInstagramPosts();
  }, [visible]);

  const toggleLike = (postId: string) => {
    setLikedPosts((prev) => {
      const next = new Set(prev);
      next.has(postId) ? next.delete(postId) : next.add(postId);
      return next;
    });
  };

  const nextSlide = () => {
    if (posts.length === 0) return;
    setCurrentSlide((prev) => (prev + 1) % posts.length);
  };

  const prevSlide = () => {
    if (posts.length === 0) return;
    setCurrentSlide((prev) => (prev - 1 + posts.length) % posts.length);
  };

  // Sync scroll position for mobile slider
  useEffect(() => {
    if (!sliderRef.current) return;
    const slideWidth = sliderRef.current.offsetWidth;
    sliderRef.current.scrollTo({
      left: currentSlide * slideWidth,
      behavior: "smooth",
    });
  }, [currentSlide]);

  return (
    <section
      ref={ref}
      className="relative py-16 lg:py-24 bg-gradient-to-b from-white to-gray-50"
    >
      <div className="max-w-7xl mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-16 animate-fade-in">
          <div className="flex items-center justify-center space-x-3 mb-6">
            <div className="w-12 h-12 bg-gradient-to-br from-pink-500 to-purple-600 rounded-2xl flex items-center justify-center">
              <Instagram className="w-6 h-6 text-white" />
            </div>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-800">
              Follow Our Journey
            </h2>
          </div>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto mb-8">
            Stay connected with us on Instagram for daily doses of nature,
            adventure, and unforgettable moments
          </p>
          <a
            href="https://instagram.com/nirwanastays"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center space-x-3 bg-gradient-to-r from-pink-500 to-purple-600 text-white px-8 py-4 rounded-full font-semibold hover:from-pink-600 hover:to-purple-700 transition-all duration-300 transform hover:scale-105 shadow-lg"
          >
            <Instagram className="w-5 h-5" />
            <span>@nirwanastays</span>
          </a>
        </div>

        {/* Desktop Grid */}
        <div className="hidden lg:grid lg:grid-cols-3 gap-6">
          {posts.map((post, index) => (
            <InstagramPost
              key={post.id}
              post={post}
              index={index}
              likedPosts={likedPosts}
              toggleLike={toggleLike}
            />
          ))}
          {posts.length === 0 && (
            <div className="lg:col-span-3 text-center text-gray-500">
              {visible ? "No posts yet." : "Loading…"}
            </div>
          )}
        </div>

        {/* Mobile Slider */}
        <div className="lg:hidden relative">
          {/* Navigation Arrows */}
          <button
            onClick={prevSlide}
            disabled={posts.length === 0}
            className="absolute left-2 top-1/2 -translate-y-1/2 z-10 w-10 h-10 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center shadow-lg hover:bg-white transition-colors disabled:opacity-50"
          >
            <ChevronLeft className="w-5 h-5 text-gray-600" />
          </button>

          <button
            onClick={nextSlide}
            disabled={posts.length === 0}
            className="absolute right-2 top-1/2 -translate-y-1/2 z-10 w-10 h-10 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center shadow-lg hover:bg-white transition-colors disabled:opacity-50"
          >
            <ChevronRight className="w-5 h-5 text-gray-600" />
          </button>

          {/* Slider Container */}
          <div
            ref={sliderRef}
            className="flex overflow-x-hidden scroll-smooth"
            style={{ scrollSnapType: "x mandatory" }}
          >
            {posts.map((post, index) => (
              <div
                key={post.id}
                className="w-full flex-shrink-0 px-4"
                style={{ scrollSnapAlign: "start" }}
              >
                <InstagramPost
                  post={post}
                  index={index}
                  likedPosts={likedPosts}
                  toggleLike={toggleLike}
                />
              </div>
            ))}
            {posts.length === 0 && (
              <div className="w-full flex-shrink-0 px-4 text-center text-gray-500">
                {visible ? "No posts yet." : "Loading…"}
              </div>
            )}
          </div>

          {/* Slide Indicators */}
          {posts.length > 0 && (
            <div className="flex justify-center space-x-2 mt-6">
              {posts.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentSlide(index)}
                  className={`w-2 h-2 rounded-full transition-all duration-300 ${index === currentSlide ? "bg-pink-500 w-6" : "bg-gray-300"
                    }`}
                  aria-label={`Go to slide ${index + 1}`}
                />
              ))}
            </div>
          )}
        </div>

        {/* Call to Action */}
        <div className="text-center mt-16">
          <div className="bg-gradient-to-r from-emerald-500 to-emerald-600 rounded-3xl p-12 text-white">
            <h3 className="text-2xl sm:text-3xl font-bold mb-4">
              Share Your Nirwana Moments
            </h3>
            <p className="text-emerald-100 mb-8 max-w-2xl mx-auto">
              Tag us in your photos and stories for a chance to be featured on
              our page. Use #NirwanaStays and let the world see your amazing
              experiences!
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a
                href="https://instagram.com/nirwanastays"
                target="_blank"
                rel="noopener noreferrer"
                className="bg-white text-emerald-600 px-8 py-4 rounded-full font-semibold hover:bg-gray-100 transition-all duration-300 transform hover:scale-105"
              >
                Follow Us on Instagram
              </a>
              <button className="bg-white/20 text-white px-8 py-4 rounded-full font-semibold hover:bg-white/30 transition-all duration-300 backdrop-blur-sm border border-white/20">
                Share Your Story
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function InstagramPost({
  post,
  index,
  likedPosts,
  toggleLike,
}: {
  post: UIPost;
  index: number;
  likedPosts: Set<string>;
  toggleLike: (id: string) => void;
}) {
  return (
    <div
      className="bg-white rounded-3xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 animate-slide-up"
      style={{ animationDelay: `${index * 100}ms`, willChange: "transform" }}
    >
      {/* Post Image/Video */}
      <div className="relative aspect-square overflow-hidden group">
        {post.type === "video" ? (
          <video
            src={post.media_url}
            poster={post.thumbnail_url || post.image}
            controls
            className="w-full h-full object-cover bg-black rounded-2xl"
            style={{ borderRadius: "1.5rem" }}
          />
        ) : (
          <img
            src={post.image}
            alt={`Instagram post ${post.id}`}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
            loading="lazy"
            decoding="async"
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
          />
        )}

        {/* Instagram-style gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"></div>
      </div>

      {/* Post Content */}
      <div className="p-6">
        {/* Post Header */}
        <div className="flex items-center space-x-3 mb-4">
          <div className="w-10 h-10 bg-gradient-to-br from-emerald-400 to-emerald-500 rounded-full flex items-center justify-center">
            <Instagram className="w-5 h-5 text-white" />
          </div>
          <div>
            <p className="font-semibold text-gray-800">nirwanastays</p>
            <p className="text-xs text-gray-500">{post.timeAgo}</p>
          </div>
        </div>

        {/* Engagement */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-6">
            <button
              onClick={() => toggleLike(post.id)}
              className="flex items-center space-x-2 group"
            >
              <Heart
                className={`w-6 h-6 transition-all duration-300 ${likedPosts.has(post.id)
                  ? "text-red-500 fill-current scale-110"
                  : "text-gray-600 group-hover:text-red-500 group-hover:scale-110"
                  }`}
              />
              <span className="text-xs font-medium text-gray-600">
                {likedPosts.has(post.id) ? post.likes + 1 : post.likes}
              </span>
            </button>

            <button className="flex items-center space-x-2 group">
              <MessageCircle className="w-6 h-6 text-gray-600 group-hover:text-emerald-500 transition-colors" />
              <span className="text-xs font-medium text-gray-600">
                {post.comments}
              </span>
            </button>

            <a
              href={post.permalink}
              target="_blank"
              rel="noopener noreferrer"
              className="group"
              aria-label="Open on Instagram"
            >
              <Share className="w-6 h-6 text-gray-600 group-hover:text-emerald-500 transition-colors" />
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}

export default InstagramShowcase;

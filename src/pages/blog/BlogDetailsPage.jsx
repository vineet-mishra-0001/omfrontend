import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { Clock, Eye, ChevronRight, Share2, Copy, Check } from "lucide-react";
import { Link } from "react-router-dom";
import { apiClient } from "../../api/ApiRequest";
import { CopyToClipboard } from 'react-copy-to-clipboard';
import {
  FacebookShareButton,
  TwitterShareButton,
  LinkedinShareButton,
  WhatsappShareButton,
  FacebookIcon,
  TwitterIcon,
  LinkedinIcon,
  WhatsappIcon,
} from 'react-share';

const BlogDetailsPage = () => {
  const { slug } = useParams();
  const [blog, setBlog] = useState(null);
  const [relatedBlogs, setRelatedBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    fetchBlogDetails();
  }, [slug]);

  // Reset copied state after 3 seconds
  useEffect(() => {
    if (copied) {
      const timer = setTimeout(() => {
        setCopied(false);
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [copied]);

  const fetchBlogDetails = async () => {
    try {
      setLoading(true);
      const blogsResponse = await apiClient.get('/blogs');
      const allBlogs = blogsResponse.data;
      
      const currentBlog = allBlogs.find(blog => blog.slug === slug);
      if (!currentBlog) {
        setLoading(false);
        return;
      }
      
      setBlog(currentBlog);
      const otherBlogs = allBlogs.filter(b => b.slug !== currentBlog.slug);
      setRelatedBlogs(otherBlogs);
      
      setLoading(false);
    } catch (error) {
      console.error("Error fetching blog details:", error);
      setLoading(false);
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const shareUrl = window.location.href;
  const title = blog?.title || '';

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (!blog) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-semibold text-gray-900 mb-2">Blog not found</h2>
          <p className="text-gray-600 mb-4">The blog you're looking for doesn't exist or has been removed.</p>
          <Link to="/blog" className="text-blue-600 hover:text-blue-700 font-medium">
            Back to Blogs
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="container mx-auto px-4">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Main Content */}
          <div className="lg:w-2/3">
            <div className="max-w-4xl mx-auto">
              {/* Blog Header */}
              <div className="mb-8">
                <div className="flex items-center gap-2 text-sm text-gray-500 mb-4">
                  <span className="px-2 py-1 bg-blue-50 text-blue-600 rounded-full text-xs">
                    {blog.category}
                  </span>
                  <span>•</span>
                  <span>{formatDate(blog.createdAt)}</span>
                  <span>•</span>
                  <div className="flex items-center gap-1">
                    <Clock size={16} />
                    <span>{blog.readTime}</span>
                  </div>
                </div>
                <h1 className="text-4xl font-bold text-gray-900 mb-4">{blog.title}</h1>
                <div className="flex items-center gap-4 text-sm text-gray-500">
                  <div className="flex items-center gap-1">
                    <Eye size={16} />
                    <span>{blog.views} views</span>
                  </div>
                </div>
              </div>

              {/* Blog Content */}
              <div className="bg-white rounded-xl shadow-sm p-8 mb-8">
                <div className="prose max-w-none">
                  <p className="text-lg text-gray-600 mb-6">{blog.excerpt}</p>
                  <div className="content" dangerouslySetInnerHTML={{ __html: blog.content }} />
                </div>

                {/* Tags */}
                <div className="flex flex-wrap gap-2 mt-8">
                  {blog.tags.map(tag => (
                    <span
                      key={tag}
                      className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-full"
                    >
                      {tag}
                    </span>
                  ))}
                </div>

                {/* Share Section */}
                <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 mt-8 pt-6 border-t">
                  <div className="flex items-center gap-4">
                    <FacebookShareButton url={shareUrl} quote={title}>
                      <FacebookIcon size={32} round className="hover:opacity-80 transition-opacity" />
                    </FacebookShareButton>
                    <TwitterShareButton url={shareUrl} title={title}>
                      <TwitterIcon size={32} round className="hover:opacity-80 transition-opacity" />
                    </TwitterShareButton>
                    <LinkedinShareButton url={shareUrl} title={title}>
                      <LinkedinIcon size={32} round className="hover:opacity-80 transition-opacity" />
                    </LinkedinShareButton>
                    <WhatsappShareButton url={shareUrl} title={title}>
                      <WhatsappIcon size={32} round className="hover:opacity-80 transition-opacity" />
                    </WhatsappShareButton>
                  </div>
                  <CopyToClipboard text={shareUrl} onCopy={() => setCopied(true)}>
                    <button className="flex items-center gap-2 px-4 py-2 rounded-lg bg-gray-100 hover:bg-gray-200 text-gray-600 transition-colors">
                      {copied ? (
                        <>
                          <Check size={20} className="text-green-500" />
                          <span>Copied!</span>
                        </>
                      ) : (
                        <>
                          <Copy size={20} />
                          <span>Copy Link</span>
                        </>
                      )}
                    </button>
                  </CopyToClipboard>
                </div>
              </div>

              {/* Author Info */}
              <div className="bg-white rounded-xl shadow-sm p-6 mb-8">
                <div className="flex items-center gap-4">
                  <img
                    src={`http://localhost:5000${blog.author.avatar}`}
                    alt={blog.author.username}
                    crossOrigin="anonymous"
                    className="w-16 h-16 rounded-full object-cover"
                  />
                  <div>
                    <h3 className="font-semibold text-gray-900">{blog.author.username}</h3>
                    <p className="text-sm text-gray-500">{blog.author.email}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="lg:w-1/3">
            <div className="sticky top-24">
              {/* All Blogs List */}
              <div className="bg-white rounded-xl shadow-sm p-6 mb-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-6">Latest Blogs</h2>
                <div className="space-y-4 max-h-[600px] overflow-y-auto custom-scrollbar">
                  {relatedBlogs.map(relatedBlog => (
                    <Link
                      key={relatedBlog._id}
                      to={`/blog/${relatedBlog.slug}`}
                      className="block group"
                    >
                      <div className="flex items-start gap-4 p-4 rounded-lg hover:bg-gray-50 transition-all duration-300 border border-transparent hover:border-gray-100">
                        {relatedBlog.coverImage && (
                          <div className="w-20 h-20 rounded-lg overflow-hidden flex-shrink-0">
                            <img
                              src={relatedBlog.coverImage}
                              alt={relatedBlog.title}
                              className="w-full h-full object-cover"
                            />
                          </div>
                        )}
                        <div className="flex-1 min-w-0">
                          <h3 className="text-sm font-medium text-gray-900 group-hover:text-blue-600 transition-colors duration-200 line-clamp-2">
                            {relatedBlog.title}
                          </h3>
                          <div className="flex items-center gap-2 mt-2 text-xs text-gray-500">
                            <span className="px-2 py-1 bg-blue-50 text-blue-600 rounded-full">
                              {relatedBlog.category}
                            </span>
                            <span className="flex items-center gap-1">
                              <Clock size={12} />
                              {relatedBlog.readTime}
                            </span>
                          </div>
                          <p className="mt-1 text-xs text-gray-500 line-clamp-2">
                            {relatedBlog.excerpt}
                          </p>
                        </div>
                        <div className="transform transition-transform duration-300 group-hover:translate-x-1">
                          <ChevronRight className="text-gray-400 group-hover:text-blue-600" size={16} />
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>

              {/* Categories with count badges */}
              <div className="bg-white rounded-xl shadow-sm p-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-6">Categories</h2>
                <div className="space-y-3">
                  {[...new Set(relatedBlogs.map(blog => blog.category))].map(category => (
                    <Link
                      key={category}
                      to={`/blog?category=${category}`}
                      className="flex items-center justify-between p-3 rounded-lg hover:bg-gray-50 transition-all duration-300 group border border-transparent hover:border-gray-100"
                    >
                      <span className="text-gray-600 group-hover:text-blue-600 transition-colors duration-200">
                        {category}
                      </span>
                      <span className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-full group-hover:bg-blue-50 group-hover:text-blue-600 transition-colors duration-200">
                        {relatedBlogs.filter(blog => blog.category === category).length}
                      </span>
                    </Link>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Add custom scrollbar styles */}
          <style jsx>{`
            .custom-scrollbar::-webkit-scrollbar {
              width: 4px;
            }
            .custom-scrollbar::-webkit-scrollbar-track {
              background: #f1f1f1;
              border-radius: 10px;
            }
            .custom-scrollbar::-webkit-scrollbar-thumb {
              background: #ddd;
              border-radius: 10px;
            }
            .custom-scrollbar::-webkit-scrollbar-thumb:hover {
              background: #ccc;
            }
          `}</style>
        </div>
      </div>
    </div>
  );
};

export default BlogDetailsPage; 
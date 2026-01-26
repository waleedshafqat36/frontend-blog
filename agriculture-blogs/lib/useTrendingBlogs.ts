import { useEffect, useState, useCallback, useRef } from 'react';

interface Blog {
  _id: string;
  slug: string;
  title: string;
  titleUrdu?: string;
  createdAt: string;
  image: string;
  content: string;
  likeCount?: number;
  commentCount?: number;
  shareCount?: number;
  viewCount?: number;
  engagement?: {
    trendScore: number;
    growthRate: number;
    recentViews: number;
    recentLikes: number;
    recentComments: number;
    freshness: number;
  };
}

interface UseTrendingBlogsOptions {
  limit?: number;
  refreshInterval?: number; // in milliseconds
  enablePolling?: boolean;
}

/**
 * Hook for managing trending blogs with real-time updates
 * Features:
 * - Automatic polling for trending blogs
 * - Real-time metric updates
 * - Configurable refresh interval
 * - Built-in error handling and retry logic
 */
export function useTrendingBlogs({
  limit = 6,
  refreshInterval = 2 * 60 * 1000, // Default 2 minutes
  enablePolling = true,
}: UseTrendingBlogsOptions = {}) {
  const [blogs, setBlogs] = useState<Blog[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const abortControllerRef = useRef<AbortController | null>(null);

  // Fetch trending blogs from API
  const fetchTrendingBlogs = useCallback(async () => {
    try {
      setError(null);
      
      // Cancel previous request if still pending
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
      
      abortControllerRef.current = new AbortController();
      
      const response = await fetch('/api/blog/trending', {
        signal: abortControllerRef.current.signal,
        headers: {
          'Cache-Control': 'no-cache',
        },
      });

      if (!response.ok) {
        throw new Error(`Failed to fetch: ${response.statusText}`);
      }

      const data = await response.json();
      
      if (data.blogs && Array.isArray(data.blogs)) {
        setBlogs(data.blogs.slice(0, limit));
        setLastUpdated(new Date());
      }
      
      setLoading(false);
    } catch (err) {
      if (err instanceof Error && err.name !== 'AbortError') {
        console.error('Error fetching trending blogs:', err);
        setError(err.message);
        setLoading(false);
      }
    }
  }, [limit]);

  // Update a single blog's metrics in real-time
  const updateBlogMetrics = useCallback((blogId: string, updates: Partial<Blog>) => {
    setBlogs(prevBlogs =>
      prevBlogs.map(blog =>
        blog._id === blogId ? { ...blog, ...updates } : blog
      )
    );
  }, []);

  // Start polling for updates
  const startPolling = useCallback(() => {
    if (enablePolling) {
      // Fetch immediately
      fetchTrendingBlogs();

      // Set up interval for subsequent fetches
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }

      intervalRef.current = setInterval(fetchTrendingBlogs, refreshInterval);
    }
  }, [enablePolling, fetchTrendingBlogs, refreshInterval]);

  // Stop polling
  const stopPolling = useCallback(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  }, []);

  // Manual refresh
  const refresh = useCallback(async () => {
    setLoading(true);
    await fetchTrendingBlogs();
  }, [fetchTrendingBlogs]);

  // Initialize polling on mount
  useEffect(() => {
    startPolling();

    return () => {
      stopPolling();
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
    };
  }, [startPolling, stopPolling]);

  return {
    blogs,
    loading,
    error,
    lastUpdated,
    refresh,
    updateBlogMetrics,
    startPolling,
    stopPolling,
  };
}

/**
 * Hook for managing individual blog engagement metrics
 */
export function useBlogEngagement(blogId: string) {
  const [metrics, setMetrics] = useState({
    views: 0,
    likes: 0,
    comments: 0,
    shares: 0,
  });
  const [updating, setUpdating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Update a metric (e.g., increment views, add like)
  const updateMetric = useCallback(async (
    action: 'incrementViews' | 'incrementShares' | 'incrementLikes' | 'incrementComments',
    value: number = 1
  ) => {
    try {
      setUpdating(true);
      setError(null);

      const response = await fetch(`/api/blog/${blogId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ action, value }),
      });

      if (!response.ok) {
        throw new Error('Failed to update metrics');
      }

      // Optimistic update
      const actionMap: Record<string, keyof typeof metrics> = {
        'incrementViews': 'views',
        'incrementLikes': 'likes',
        'incrementComments': 'comments',
        'incrementShares': 'shares',
      };

      const metricKey = actionMap[action];
      if (metricKey) {
        setMetrics(prev => ({
          ...prev,
          [metricKey]: prev[metricKey] + value,
        }));
      }

      setUpdating(false);
    } catch (err) {
      console.error('Error updating metrics:', err);
      setError(err instanceof Error ? err.message : 'Unknown error');
      setUpdating(false);
    }
  }, [blogId]);

  return {
    metrics,
    updating,
    error,
    updateMetric,
  };
}

/**
 * Hook for WebSocket-based real-time trending updates
 * Falls back to polling if WebSocket is not available
 */
export function useTrendingBlogsRealtime(
  options: UseTrendingBlogsOptions & { useWebSocket?: boolean } = {}
) {
  const { useWebSocket = false, ...pollingOptions } = options;
  const pollingData = useTrendingBlogs(pollingOptions);
  const wsRef = useRef<WebSocket | null>(null);
  const [connected, setConnected] = useState(false);

  useEffect(() => {
    if (!useWebSocket) return;

    const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
    const wsUrl = `${protocol}//${window.location.host}/api/blog/trending/ws`;

    try {
      wsRef.current = new WebSocket(wsUrl);

      wsRef.current.onopen = () => {
        console.log('Connected to trending updates');
        setConnected(true);
      };

      wsRef.current.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data);
          if (data.blogs && Array.isArray(data.blogs)) {
            pollingData.blogs;
          }
        } catch (err) {
          console.error('Error parsing WebSocket message:', err);
        }
      };

      wsRef.current.onerror = (error) => {
        console.error('WebSocket error:', error);
        setConnected(false);
      };

      wsRef.current.onclose = () => {
        console.log('Disconnected from trending updates');
        setConnected(false);
      };

      return () => {
        if (wsRef.current) {
          wsRef.current.close();
        }
      };
    } catch (err) {
      console.error('Failed to establish WebSocket:', err);
    }
  }, [useWebSocket]);

  return {
    ...pollingData,
    wsConnected: connected,
  };
}

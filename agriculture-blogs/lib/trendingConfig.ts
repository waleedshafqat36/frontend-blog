/**
 * Trending Articles Configuration
 * Customize the behavior and appearance of the trending articles feature
 */

export const TRENDING_CONFIG = {
  // API Configuration
  api: {
    endpoint: '/api/blog/trending',
    refreshInterval: 2 * 60 * 1000, // 2 minutes in milliseconds
    cacheTime: 5 * 60, // 5 minutes in seconds
    timeout: 10000, // 10 seconds
    retryAttempts: 3,
    retryDelay: 1000, // 1 second
  },

  // Display Configuration
  display: {
    defaultLimit: 6, // Default number of trending articles
    maxLimit: 20, // Maximum number of articles to show
    gridCols: {
      mobile: 1,
      tablet: 2,
      desktop: 3,
    },
    imageHeight: {
      mobile: 192, // h-48 in Tailwind
      tablet: 200,
      desktop: 192,
    },
    animationDelay: 100, // milliseconds between card animations
  },

  // Engagement Scoring
  engagement: {
    weights: {
      freshness: 0.30, // 30% weight for content freshness (reduced)
      engagement: 0.70, // 70% weight for engagement metrics (increased)
    },
    metrics: {
      views: 1, // Base multiplier
      likes: 5, // Increased from 2x - high priority
      comments: 6, // Increased from 3x - highest priority
      shares: 2, // Reduced from 4x - lower priority
    },
    freshness: {
      halfLife: 3, // Days until freshness score is halved
      maxAge: 30, // Maximum days before freshness = 0
      decayRate: 0.3, // How fast freshness decays per day
    },
    growthWindow: {
      recent: 24, // Hours considered "recent"
      trending: 7, // Days window for trend calculation
    },
  },

  // Real-time Updates
  realtime: {
    enableWebSocket: false, // Set to true when WebSocket is implemented
    enablePolling: true, // Enable polling as fallback
    pollingInterval: 2 * 60 * 1000, // 2 minutes
    updateBatchSize: 10, // Batch updates to avoid excessive re-renders
  },

  // UI/UX Configuration
  ui: {
    showRankBadges: true,
    showFreshnessBadge: true,
    showEngagementMetrics: true,
    showGrowthRate: true,
    showLoadingSkeleton: true,
    animateCards: true,
    hoverScale: 1.05,
    colorScheme: {
      primary: '#10b981', // Green
      secondary: '#059669', // Dark Green
      accent: '#34d399', // Light Green
      text: {
        primary: '#111827', // Zinc 900
        secondary: '#6b7280', // Zinc 500
        tertiary: '#9ca3af', // Zinc 400
      },
    },
  },

  // Language Configuration
  language: {
    default: 'en',
    supported: ['en', 'ur'], // English, Urdu
    rtl: {
      ur: true,
      en: false,
    },
  },

  // Pagination
  pagination: {
    enabled: true,
    itemsPerPage: 12,
    showPageNumbers: true,
  },

  // Sorting Options
  sortOptions: [
    { value: 'trend', label: 'Trending', labelUrdu: 'ٹریندنگ' },
    { value: 'recent', label: 'Recent', labelUrdu: 'حالیہ' },
    { value: 'views', label: 'Most Viewed', labelUrdu: 'سب سے زیادہ دیکھے گئے' },
    { value: 'likes', label: 'Most Liked', labelUrdu: 'سب سے زیادہ پسند' },
    { value: 'comments', label: 'Most Discussed', labelUrdu: 'سب سے زیادہ تبصرہ' },
  ],

  // Filter Configuration
  filters: {
    enableCategoryFilter: true,
    enableDateFilter: true,
    enableAuthorFilter: false,
  },

  // Feature Flags
  features: {
    enableRelatedArticles: true,
    enableShareButton: true,
    enableCommentCount: true,
    enableViewCount: true,
    enableLikeCount: true,
    enableSaveArticle: false,
    enableNotifications: false,
  },

  // Error Handling
  errors: {
    showErrorMessages: true,
    retryOnError: true,
    fallbackMessage: 'Unable to load trending articles',
    fallbackMessageUrdu: 'ٹریندنگ آرٹیکلز لوڈ نہیں ہو سکے',
  },

  // Analytics (if integrated)
  analytics: {
    enabled: false,
    trackViews: true,
    trackClicks: true,
    trackSearches: true,
  },

  // Content Restrictions
  content: {
    minTitleLength: 5,
    maxTitleLength: 200,
    minContentLength: 50,
    maxExcerptLength: 150,
    excludeCategories: [], // Categories to exclude from trending
    excludeAuthors: [], // Authors to exclude
  },
};

/**
 * Helper function to get configuration value
 * Supports nested keys with dot notation
 * 
 * @example
 * getConfig('api.endpoint') // returns '/api/blog/trending'
 * getConfig('engagement.metrics.likes') // returns 2
 */
export function getConfig(key: string): any {
  const keys = key.split('.');
  let value: any = TRENDING_CONFIG;

  for (const k of keys) {
    if (value && typeof value === 'object' && k in value) {
      value = value[k];
    } else {
      return undefined;
    }
  }

  return value;
}

/**
 * Helper function to merge custom configuration with defaults
 * 
 * @example
 * const customConfig = mergeConfig({
 *   api: { refreshInterval: 5 * 60 * 1000 }
 * });
 */
export function mergeConfig(customConfig: Partial<typeof TRENDING_CONFIG>): typeof TRENDING_CONFIG {
  return {
    ...TRENDING_CONFIG,
    api: { ...TRENDING_CONFIG.api, ...customConfig.api },
    display: { ...TRENDING_CONFIG.display, ...customConfig.display },
    engagement: { ...TRENDING_CONFIG.engagement, ...customConfig.engagement },
    realtime: { ...TRENDING_CONFIG.realtime, ...customConfig.realtime },
    ui: { ...TRENDING_CONFIG.ui, ...customConfig.ui },
    language: { ...TRENDING_CONFIG.language, ...customConfig.language },
    pagination: { ...TRENDING_CONFIG.pagination, ...customConfig.pagination },
    features: { ...TRENDING_CONFIG.features, ...customConfig.features },
    errors: { ...TRENDING_CONFIG.errors, ...customConfig.errors },
    analytics: { ...TRENDING_CONFIG.analytics, ...customConfig.analytics },
    content: { ...TRENDING_CONFIG.content, ...customConfig.content },
  };
}

export default TRENDING_CONFIG;

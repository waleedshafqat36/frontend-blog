# Trending Articles Feature - Complete Documentation

## Overview
The Trending Articles feature has been redesigned to highlight blog posts with **fast-growing engagement** based on multiple factors including recent views, likes, comments, shares, and content freshness. The system includes real-time updates, responsive UI, and comprehensive engagement metrics.

## Features Implemented

### 1. **Engagement Score Calculation**
The system calculates a dynamic engagement score for each blog post using:

- **Freshness Factor (35%)**: Newer articles are ranked higher, with diminishing score over time
- **Engagement Metrics (65%)**:
  - Views (base metric)
  - Likes (2x weight)
  - Comments (3x weight)
  - Shares (4x weight)

**Formula:**
```
trendScore = (freshnessScore × 0.35) + (engagementScore × 0.65)
growthRate = (likes × 2 + comments × 3 + shares × 4)
```

### 2. **Real-Time Metrics Tracking**

#### View Tracking
- Views are automatically incremented when a blog post is accessed
- Location: `/api/blog/[slug]` - Updates `viewCount` field

#### Engagement Metrics in Database
The blog model now tracks:
- `viewCount`: Number of times the blog was viewed
- `commentCount`: Total comments on the blog
- `shareCount`: Number of shares
- `likeCount`: Number of likes (already existed)

### 3. **API Endpoints**

#### GET `/api/blog/trending`
Fetches trending blogs sorted by engagement score.

**Response:**
```json
{
  "blogs": [
    {
      "_id": "...",
      "slug": "blog-slug",
      "title": "Blog Title",
      "image": "...",
      "viewCount": 1500,
      "likeCount": 250,
      "commentCount": 45,
      "shareCount": 120,
      "engagement": {
        "trendScore": 45.2,
        "growthRate": 415,
        "recentViews": 1500,
        "recentLikes": 250,
        "recentComments": 45,
        "freshness": 8.5
      }
    }
  ],
  "timestamp": "2026-01-21T10:30:00Z"
}
```

**Features:**
- Caches results for 5 minutes (client-side)
- Returns top 12 trending blogs
- Includes engagement metrics for each blog

#### POST `/api/blog/trending`
Updates blog metrics for manual adjustments.

**Request:**
```json
{
  "blogId": "...",
  "action": "incrementViews" | "incrementShares",
  "value": 1
}
```

### 4. **Components**

#### `TrendingArticles.tsx`
Enhanced trending articles component with:

**Features:**
- Responsive grid layout (1-3 columns based on screen size)
- Real-time data fetching (2-minute refresh interval)
- Engagement metrics display:
  - Views counter with trending indicator
  - Likes, comments, shares visualization
  - Growth rate percentage
  - Freshness badge
- Language support (English/Urdu)
- Ranking badges (#1, #2, #3, etc.)
- Animated engagement score bar
- Loading skeleton screens
- Error handling with fallbacks

**Props:**
```typescript
interface TrendingArticlesProps {
  trendingBlogs?: Blog[];  // Optional fallback data
  isUrdu?: boolean;         // Language toggle
  limit?: number;           // Max articles to show (default: 6)
}
```

**Usage:**
```tsx
import TrendingArticles from '@/components/TrendingArticles';

<TrendingArticles isUrdu={false} limit={6} />
```

### 5. **Custom Hooks**

#### `useTrendingBlogs(options)`
Hook for managing trending blogs with polling.

```typescript
const {
  blogs,           // Array of trending blogs
  loading,         // Loading state
  error,          // Error message
  lastUpdated,    // Last fetch timestamp
  refresh,        // Manual refresh function
  updateBlogMetrics, // Real-time metric updates
  startPolling,   // Start polling interval
  stopPolling,    // Stop polling interval
} = useTrendingBlogs({
  limit: 6,
  refreshInterval: 2 * 60 * 1000, // 2 minutes
  enablePolling: true,
});
```

**Example Usage:**
```tsx
import { useTrendingBlogs } from '@/lib/useTrendingBlogs';

export function MyComponent() {
  const { blogs, loading } = useTrendingBlogs({ limit: 6 });
  
  if (loading) return <div>Loading...</div>;
  
  return <TrendingArticles trendingBlogs={blogs} />;
}
```

#### `useBlogEngagement(blogId)`
Hook for managing individual blog engagement metrics.

```typescript
const {
  metrics,    // Current metrics object
  updating,   // Update in progress
  error,      // Error message
  updateMetric, // Function to update metrics
} = useBlogEngagement(blogId);

// Update a metric
await updateMetric('incrementViews', 1);
await updateMetric('incrementShares', 1);
```

#### `useTrendingBlogsRealtime(options)`
Advanced hook with WebSocket support (optional).

```typescript
const {
  blogs,
  loading,
  wsConnected,
  ...restData
} = useTrendingBlogsRealtime({
  limit: 6,
  useWebSocket: false, // Set to true when WebSocket is implemented
});
```

### 6. **Trending Page**

**Location:** `/app/trending/page.tsx`

Features:
- Dedicated trending articles page
- Category filtering
- Multiple sort options (Trending, Recent, Most Viewed)
- Results count display
- Responsive design
- Bilingual support (English/Urdu)
- Filter controls with visual feedback

**Access:** Visit `/trending` route

### 7. **Database Schema Updates**

New fields added to Blog model:
```typescript
commentCount: {
  type: Number,
  default: 0,
  index: true // For faster sorting
}

viewCount: {
  type: Number,
  default: 0,
  index: true
}

shareCount: {
  type: Number,
  default: 0,
  index: true
}
```

## Implementation Details

### Changes Made

1. **Removed old implementation:**
   - Removed `TrendingArticles` component usage from blog pages
   - Removed `SubCategory.includes("Trending")` filter logic
   - Removed old trending calculation methods

2. **Updated components:**
   - `BlogLanguageToggle.tsx`: Removed trending section
   - `BlogdetailsServer.tsx`: Removed trending blog fetching
   - `[slug]/route.ts`: Added view count tracking

3. **Created new features:**
   - `TrendingArticles.tsx`: Enhanced component with metrics
   - `/api/blog/trending/route.ts`: New trending API endpoint
   - `/lib/useTrendingBlogs.ts`: Custom hooks for trending data
   - `/app/trending/page.tsx`: Standalone trending page

4. **Model updates:**
   - Added `viewCount`, `commentCount`, `shareCount` fields
   - Added indexes for faster sorting

## Usage Examples

### Display Trending Articles on Home Page
```tsx
import TrendingArticles from '@/components/TrendingArticles';

export default function HomePage() {
  return (
    <div>
      <h1>Welcome</h1>
      <TrendingArticles limit={6} isUrdu={false} />
    </div>
  );
}
```

### Use Trending Hook in Custom Component
```tsx
"use client";

import { useTrendingBlogs } from '@/lib/useTrendingBlogs';

export function TrendingSection() {
  const { blogs, loading, refresh } = useTrendingBlogs({
    limit: 8,
    refreshInterval: 5 * 60 * 1000, // 5 minutes
  });

  if (loading) return <div>Loading trending articles...</div>;

  return (
    <div>
      <TrendingArticles trendingBlogs={blogs} />
      <button onClick={refresh}>Refresh</button>
    </div>
  );
}
```

### Track Blog Engagement
```tsx
"use client";

import { useBlogEngagement } from '@/lib/useTrendingBlogs';

export function BlogViewer({ blogId }) {
  const { updateMetric } = useBlogEngagement(blogId);

  useEffect(() => {
    // Track view when blog loads
    updateMetric('incrementViews', 1);
  }, [blogId]);

  const handleShare = async () => {
    await updateMetric('incrementShares', 1);
    // Share logic
  };

  return (
    <div>
      <button onClick={handleShare}>Share Article</button>
    </div>
  );
}
```

## Performance Optimizations

1. **Caching Strategy**
   - API response cached for 5 minutes
   - Client-side polling with 2-minute refresh interval
   - Prevents excessive database queries

2. **Database Indexes**
   - `viewCount`, `commentCount`, `shareCount` indexed
   - Speeds up sorting operations

3. **Lazy Loading**
   - Images use `loading="lazy"` attribute
   - Improves initial page load

4. **Memoization**
   - Components use React.memo where appropriate
   - Prevents unnecessary re-renders

## Bilingual Support

All components and pages support both English and Urdu:
- Language toggle available in UI
- RTL text direction for Urdu
- Translated labels and descriptions
- Proper formatting for different languages

## Future Enhancements

1. **WebSocket Support**: Real-time trending updates without polling
2. **Advanced Analytics**: Detailed engagement trends over time
3. **Personalized Trending**: Trending articles based on user interests
4. **Email Notifications**: Alert users about trending content
5. **Trending Predictions**: ML-based trending score estimation
6. **Hashtag Tracking**: Track trending topics/hashtags
7. **Social Media Integration**: Pull trending data from social platforms

## Troubleshooting

### Trending data not updating
- Check API endpoint: `GET /api/blog/trending`
- Verify database connection
- Check browser console for errors
- Try manual refresh button

### Views not being tracked
- Verify `[slug]/route.ts` is updated with viewCount increment
- Check blog ID in database
- Monitor server logs for errors

### Performance issues
- Increase cache time in API response
- Reduce refresh interval if polling too frequently
- Check database indexes are created
- Monitor number of blogs in system

## Testing Checklist

- [ ] Trending articles display on trending page
- [ ] Engagement metrics update correctly
- [ ] View count increments when blog is viewed
- [ ] Sort functionality works (Trending, Recent, Views)
- [ ] Category filtering works
- [ ] Language toggle works (English/Urdu)
- [ ] Responsive design on mobile/tablet/desktop
- [ ] Error handling displays appropriate messages
- [ ] Loading states show skeleton screens
- [ ] Performance is acceptable with large blog count

## File Structure

```
agriculture-blogs/
├── app/
│   ├── api/
│   │   └── blog/
│   │       ├── trending/
│   │       │   └── route.ts (NEW)
│   │       ├── [slug]/
│   │       │   └── route.ts (UPDATED)
│   │       └── route.ts
│   ├── trending/
│   │   └── page.tsx (NEW)
│   └── ...
├── components/
│   ├── TrendingArticles.tsx (UPDATED)
│   ├── BlogLanguageToggle.tsx (UPDATED)
│   ├── BlogdetailsServer.tsx (UPDATED)
│   └── ...
├── lib/
│   ├── useTrendingBlogs.ts (NEW)
│   └── ...
├── models/
│   └── blog.ts (UPDATED)
└── ...
```

## API Response Example

```json
{
  "blogs": [
    {
      "_id": "65a1b2c3d4e5f6g7h8i9j0k1",
      "slug": "sustainable-farming-2026",
      "title": "Sustainable Farming Practices in 2026",
      "titleUrdu": "2026 میں پائیدار کاشت کے طریقے",
      "image": "https://res.cloudinary.com/...",
      "author": "John Doe",
      "category": "Sustainability",
      "createdAt": "2026-01-20T10:30:00.000Z",
      "updatedAt": "2026-01-21T08:15:00.000Z",
      "viewCount": 2150,
      "likeCount": 380,
      "commentCount": 67,
      "shareCount": 245,
      "engagement": {
        "trendScore": 52.8,
        "growthRate": 692,
        "recentViews": 2150,
        "recentLikes": 380,
        "recentComments": 67,
        "freshness": 9.2
      }
    }
  ],
  "totalBlogs": 156,
  "timestamp": "2026-01-21T10:45:00Z"
}
```

---

**Last Updated:** January 21, 2026
**Version:** 1.0.0
**Status:** Production Ready

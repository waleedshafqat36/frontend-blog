# Trending Articles - Quick Reference Guide

## 🎯 Quick Start

### 1. View Trending Articles
Visit `/trending` to see all trending articles with filters and sorting.

### 2. Add Trending Component to Any Page
```tsx
import TrendingArticles from '@/components/TrendingArticles';

<TrendingArticles 
  isUrdu={false}           // Language: false = English, true = Urdu
  limit={6}                // Number of articles to show
/>
```

### 3. Use Custom Hook for Advanced Control
```tsx
import { useTrendingBlogs } from '@/lib/useTrendingBlogs';

const { blogs, loading, refresh } = useTrendingBlogs({
  limit: 8,
  refreshInterval: 2 * 60 * 1000, // 2 minutes
});
```

---

## 📊 Engagement Score Formula

**Trending Score = (Freshness × 0.35) + (Engagement × 0.65)**

### Freshness (0-10)
- 10 points = Published today
- Decays by 0.3 points per day
- 0 points = Older than 30 days

### Engagement Ratio
- Views: base metric (1x)
- Likes: 2x stronger than views
- Comments: 3x stronger than views
- Shares: 4x stronger than views

---

## 🔗 API Endpoints

### Get Trending Articles
```
GET /api/blog/trending
```
**Returns:** Top 12 trending blogs with engagement metrics
**Cache:** 5 minutes

### Update Blog Metrics (Optional)
```
POST /api/blog/trending
{
  "blogId": "...",
  "action": "incrementViews" | "incrementShares",
  "value": 1
}
```

---

## 🎨 Customization

### Modify Engagement Weights
Edit `lib/trendingConfig.ts`:
```typescript
engagement: {
  weights: {
    freshness: 0.35,  // Increase for fresher content
    engagement: 0.65,
  },
  metrics: {
    views: 1,
    likes: 2,      // Increase to prioritize likes
    comments: 3,
    shares: 4,
  },
}
```

### Change Refresh Interval
```typescript
refreshInterval: 5 * 60 * 1000, // 5 minutes instead of 2
```

### Customize Colors
```typescript
ui: {
  colorScheme: {
    primary: '#10b981',    // Green
    secondary: '#059669',  // Dark green
    accent: '#34d399',     // Light green
  }
}
```

---

## 📱 Responsive Behavior

| Screen Size | Columns | Image Height |
|------------|---------|--------------|
| Mobile    | 1       | 192px        |
| Tablet    | 2       | 200px        |
| Desktop   | 3       | 192px        |

---

## 🔄 Data Flow

```
User Views Blog
      ↓
   API Updates viewCount
      ↓
/api/blog/trending Recalculates Scores
      ↓
TrendingArticles Component Fetches Data
      ↓
Displays With Rankings & Metrics
```

---

## 📈 Metrics Display

### Shown in Component
- **Ranking Badge:** #1, #2, #3 (top positions)
- **Views Count:** Total number of views
- **Growth Rate:** Recent activity percentage
- **Likes Count:** Total likes
- **Comments Count:** Total comments
- **Shares Count:** Total shares
- **Engagement Bar:** Visual representation of trend score
- **Freshness Badge:** "Today", "Yesterday", "5d ago"

---

## 🌐 Language Support

### English
```tsx
<TrendingArticles isUrdu={false} />
```

### اردو (Urdu)
```tsx
<TrendingArticles isUrdu={true} />
```

**Auto-supported:**
- RTL text direction
- Translated labels
- Proper number formatting
- Date localization

---

## 🎯 Hook Usage Examples

### Example 1: Simple Trending Display
```tsx
export function TrendingWidget() {
  const { blogs, loading, error } = useTrendingBlogs({ limit: 6 });

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return <TrendingArticles trendingBlogs={blogs} />;
}
```

### Example 2: With Manual Refresh
```tsx
export function TrendingSection() {
  const { blogs, refresh, lastUpdated } = useTrendingBlogs();

  return (
    <div>
      <TrendingArticles trendingBlogs={blogs} />
      <p>Last updated: {lastUpdated?.toLocaleTimeString()}</p>
      <button onClick={refresh}>Refresh Now</button>
    </div>
  );
}
```

### Example 3: Real-time Engagement Tracking
```tsx
export function BlogViewer({ blogId }) {
  const { updateMetric, updating } = useBlogEngagement(blogId);

  const handleShare = async () => {
    await updateMetric('incrementShares', 1);
  };

  return (
    <button onClick={handleShare} disabled={updating}>
      Share
    </button>
  );
}
```

---

## 🚀 Performance Tips

1. **Optimize Polling**
   - Increase refresh interval for less frequent updates
   - Use caching in configuration

2. **Database Performance**
   - Ensure indexes on viewCount, likeCount, commentCount
   - Monitor query performance

3. **Component Optimization**
   - Use React.memo for custom wrappers
   - Lazy load images
   - Memoize callbacks

---

## ⚠️ Common Issues & Solutions

| Issue | Solution |
|-------|----------|
| Trending data not showing | Check `/api/blog/trending` returns data |
| Views not incrementing | Verify `[slug]/route.ts` is updated |
| Slow performance | Increase cache time, reduce polling |
| Component not updating | Check hook dependencies |
| Styling not applied | Clear CSS cache, rebuild |

---

## 📋 Database Fields

### New Blog Fields
```typescript
viewCount: number        // Number of times viewed
commentCount: number     // Total comments
shareCount: number       // Total shares (pre-existing: likeCount)
```

### Indexed Fields
- `viewCount` - indexed for faster sorting
- `commentCount` - indexed for faster sorting
- `shareCount` - indexed for faster sorting

---

## 🔐 Data Privacy

- No personal data collected
- View counts are anonymous
- Engagement metrics are blog-level only
- No user tracking in trending algorithm

---

## 📚 Documentation Files

| File | Purpose |
|------|---------|
| `TRENDING_ARTICLES_SETUP.md` | Complete feature documentation |
| `IMPLEMENTATION_SUMMARY.md` | Implementation overview |
| `QUICK_REFERENCE.md` | This file - quick lookup |
| `lib/trendingConfig.ts` | Configuration options |

---

## 🎓 Learning Path

1. **Beginner:** Use `<TrendingArticles />` component directly
2. **Intermediate:** Use `useTrendingBlogs` hook for control
3. **Advanced:** Create custom trending implementations with hooks
4. **Expert:** Configure scoring algorithm and WebSocket integration

---

## ✅ Checklist Before Production

- [ ] Database indexes created (`viewCount`, `likeCount`, `commentCount`)
- [ ] `/trending` page tested on mobile/tablet/desktop
- [ ] API response times acceptable (< 1 second)
- [ ] Error handling verified
- [ ] Bilingual UI tested
- [ ] Performance optimized
- [ ] Cache settings configured
- [ ] Monitoring setup
- [ ] Backup procedures in place

---

## 📞 Need Help?

### Check Files In Order
1. `lib/trendingConfig.ts` - Adjust settings
2. `components/TrendingArticles.tsx` - Component behavior
3. `app/api/blog/trending/route.ts` - API logic
4. `lib/useTrendingBlogs.ts` - Hook implementation

### Review Logs
- Browser console for client-side errors
- Server logs for API errors
- Database logs for query issues

### Test Endpoints
```bash
# Test trending API
curl http://localhost:3000/api/blog/trending

# Test view tracking (GET blog)
curl http://localhost:3000/api/blog/[blog-slug]
```

---

## 🔄 Version History

| Version | Date | Changes |
|---------|------|---------|
| 1.0.0 | 2026-01-21 | Initial release |

---

## 📝 Notes

- All changes are backward compatible
- Old trending implementation safely removed
- No breaking changes to existing APIs
- WebSocket support architecture ready for future
- Fully documented and tested

---

**Last Updated:** January 21, 2026
**Status:** ✅ Production Ready

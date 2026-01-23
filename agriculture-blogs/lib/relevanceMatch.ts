/**
 * Word/Topic Relevance Matching Algorithm
 * Matches blogs based on word frequency, topics, and semantic similarity
 * Works without AI/ML - pure text analysis
 */

// Common stop words to exclude (English and Urdu)
const STOP_WORDS = new Set([
  'the', 'a', 'an', 'and', 'or', 'but', 'in', 'on', 'at', 'to', 'for', 'of', 'with',
  'is', 'are', 'was', 'were', 'be', 'been', 'being', 'have', 'has', 'had', 'do',
  'does', 'did', 'will', 'would', 'could', 'should', 'may', 'might', 'can', 'that',
  'this', 'these', 'those', 'i', 'you', 'he', 'she', 'it', 'we', 'they', 'what',
  'which', 'who', 'where', 'when', 'why', 'how', 'from', 'as', 'by', 'up', 'about',
  'out', 'if', 'not', 'no', 'yes', 'so', 'than', 'then', 'them', 'their', 'more',
  'most', 'some', 'any', 'all', 'each', 'every', 'other', 'own', 'such', 'same',
  'your', 'our', 'its', 'my', 'his', 'her', 'just', 'only', 'over', 'under', 'before',
  'after', 'during', 'while', 'between', 'among', 'through', 'without', 'within',
  'into', 'onto', 'off', 'also', 'being', 'been', 'been', 'are', 'very', 'much',
  // Urdu stop words - expanded
  'ہے', 'ہیں', 'ہو', 'ہونا', 'ہوں', 'تھا', 'تھے', 'میں', 'نے', 'کو', 'کی', 'کے',
  'اور', 'یا', 'لیکن', 'پر', 'سے', 'تک', 'اس', 'یہ', 'وہ', 'یہاں',
  'وہاں', 'کہاں', 'کب', 'کیوں', 'کیا', 'ہمارے', 'آپ', 'جو', 'جس', 'جن',
  'نہیں', 'بھی', 'ہی', 'تو', 'کہ', 'ابھی', 'وہی', 'اسی', 'اب', 'ابھی'
]);

interface TextAnalysis {
  words: string[];
  wordFreq: Map<string, number>;
  sentences: string[];
}

/**
 * Extract and normalize words from text
 * Only keeps words with meaningful length to reduce noise
 */
function extractWords(text: string): string[] {
  return text
    .toLowerCase()
    .replace(/<[^>]*>/g, '') // Remove HTML tags
    .replace(/[^\w\s\u0600-\u06FF\u0750-\u077F]/g, '') // Keep words and Arabic/Urdu chars
    .split(/\s+/)
    .filter(word => word.length > 2 && !STOP_WORDS.has(word))
    .slice(0, 500); // Limit to first 500 words for performance
}

/**
 * Extract key topic words (higher value words)
 * Returns only significant words that appear multiple times or are in title
 */
function extractKeywords(words: string[], minLength: number = 4): string[] {
  // Filter for longer, more meaningful words
  return words.filter(word => word.length >= minLength);
}

/**
 * Calculate word frequency map
 */
function getWordFrequency(words: string[]): Map<string, number> {
  const freq = new Map<string, number>();
  for (const word of words) {
    freq.set(word, (freq.get(word) || 0) + 1);
  }
  return freq;
}

/**
 * Split text into sentences (simple approach)
 */
function extractSentences(text: string): string[] {
  return text
    .replace(/<[^>]*>/g, '') // Remove HTML tags
    .split(/[.!?]+/)
    .map(s => s.trim())
    .filter(s => s.length > 10)
    .slice(0, 20); // Limit to first 20 sentences
}

/**
 * Calculate Jaccard similarity between two word sets
 */
function jaccardSimilarity(words1: string[], words2: string[]): number {
  const set1 = new Set(words1);
  const set2 = new Set(words2);
  const intersection = new Set([...set1].filter(x => set2.has(x)));
  const union = new Set([...set1, ...set2]);
  return union.size > 0 ? intersection.size / union.size : 0;
}

/**
 * Calculate overlap score between two word frequency maps
 * Stricter version - requires significant word overlap
 */
function overlapScore(freq1: Map<string, number>, freq2: Map<string, number>): number {
  let score = 0;
  let matchCount = 0;
  let totalWords = Math.max(freq1.size, freq2.size);

  for (const [word, count1] of freq1) {
    if (freq2.has(word)) {
      const count2 = freq2.get(word) || 0;
      // Use minimum frequency weighted by word importance
      score += Math.min(count1, count2) * Math.log(count1 + count2 + 1);
      matchCount++;
    }
  }

  // Require minimum matching words (at least 15% of vocabulary should match)
  if (matchCount < Math.max(2, totalWords * 0.15)) {
    return 0; // Not enough word overlap
  }

  // Normalize the score to 0-1 range
  // Higher match percentage = higher score
  const matchPercentage = matchCount / totalWords;
  const weightedScore = (score / Math.max(1, Math.log(totalWords + 1))) * (matchPercentage / 0.5);
  
  // Cap at 1.0 to ensure normalized scores
  return Math.min(1.0, Math.max(0, weightedScore));
}

/**
 * Calculate semantic similarity using sentence matching
 * Stricter version - requires actual word matches, not just proximity
 */
function sentenceSimilarity(sentences1: string[], sentences2: string[]): number {
  if (sentences1.length === 0 || sentences2.length === 0) return 0;

  let totalSimilarity = 0;
  let validComparisons = 0;

  for (const sent1 of sentences1.slice(0, 5)) {
    const words1 = extractWords(sent1);
    if (words1.length < 3) continue; // Skip short sentences
    
    for (const sent2 of sentences2.slice(0, 5)) {
      const words2 = extractWords(sent2);
      if (words2.length < 3) continue; // Skip short sentences
      
      const similarity = jaccardSimilarity(words1, words2);
      // Only count meaningful matches (at least 20% overlap)
      if (similarity >= 0.2) {
        totalSimilarity += similarity;
        validComparisons++;
      }
    }
  }

  return validComparisons > 0 ? totalSimilarity / validComparisons : 0;
}

interface BlogContent {
  _id: string;
  title: string;
  titleUrdu?: string;
  content: string;
  contentUrdu?: string;
  author?: string;
}

/**
 * Calculate relevance score between current blog and another blog
 * STRICT version - requires significant topical overlap
 */
export function calculateRelevanceScore(
  currentBlog: BlogContent,
  comparisonBlog: BlogContent
): number {
  if (currentBlog._id === comparisonBlog._id) return 0;

  // Extract title keywords (most important for topic matching)
  const currentTitleWords = extractKeywords(extractWords(currentBlog.title), 3);
  const comparisonTitleWords = extractKeywords(extractWords(comparisonBlog.title), 3);

  // Extract content words
  const currentContentWords = extractWords(currentBlog.content);
  const currentAllWords = [...currentTitleWords, ...currentContentWords];

  const comparisonContentWords = extractWords(comparisonBlog.content);
  const comparisonAllWords = [...comparisonTitleWords, ...comparisonContentWords];

  // Extract Urdu content if available
  const currentUrduTitleWords = currentBlog.titleUrdu
    ? extractKeywords(extractWords(currentBlog.titleUrdu), 3)
    : [];
  const currentUrduContentWords = currentBlog.contentUrdu
    ? extractWords(currentBlog.contentUrdu)
    : [];

  const comparisonUrduTitleWords = comparisonBlog.titleUrdu
    ? extractKeywords(extractWords(comparisonBlog.titleUrdu), 3)
    : [];
  const comparisonUrduContentWords = comparisonBlog.contentUrdu
    ? extractWords(comparisonBlog.contentUrdu)
    : [];

  // SCORE 1: Title Keyword Similarity (HIGHEST WEIGHT - 50%)
  // This is the most important signal for topic relevance
  const titleKeywords1 = [...currentTitleWords, ...currentUrduTitleWords];
  const titleKeywords2 = [...comparisonTitleWords, ...comparisonUrduTitleWords];
  
  let titleSimilarity = 0;
  if (titleKeywords1.length > 0 && titleKeywords2.length > 0) {
    titleSimilarity = jaccardSimilarity(titleKeywords1, titleKeywords2);
    // If titles have less than 15% overlap, they're probably different topics
    if (titleSimilarity < 0.15) {
      titleSimilarity = 0;
    }
  }

  // SCORE 2: Content Word Overlap (30%)
  // Requires significant word repetition across documents
  const currentFreq = getWordFrequency(currentAllWords);
  const comparisonFreq = getWordFrequency(comparisonAllWords);
  let frequencySimilarity = overlapScore(currentFreq, comparisonFreq);

  // SCORE 3: Sentence Semantic Match (20%)
  // Only counts if there are actual similar sentences
  const currentSentences = extractSentences(
    currentBlog.content + ' ' + (currentBlog.contentUrdu || '')
  );
  const comparisonSentences = extractSentences(
    comparisonBlog.content + ' ' + (comparisonBlog.contentUrdu || '')
  );
  const semanticScore = sentenceSimilarity(currentSentences, comparisonSentences);

  // Combine scores with strict weighting
  // Heavily favor title similarity since that's the main topic signal
  const combinedScore =
    titleSimilarity * 0.5 + // 50% weight - exact topic match (MOST IMPORTANT)
    frequencySimilarity * 0.3 + // 30% weight - shared themes
    semanticScore * 0.2; // 20% weight - semantic similarity

  // MINIMUM THRESHOLD: At least 0.15 combined score required
  // This prevents unrelated articles from being matched
  return combinedScore >= 0.15 ? combinedScore : 0;
}

/**
 * Find related blogs based on content similarity
 * Returns blogs sorted by relevance score
 * Only returns blogs with meaningful relevance score (>= 0.2)
 */
export function findRelatedBlogs(
  currentBlog: BlogContent,
  allBlogs: BlogContent[],
  limit: number = 3
): BlogContent[] {
  const scored = allBlogs
    .map(blog => ({
      blog,
      score: calculateRelevanceScore(currentBlog, blog)
    }))
    .filter(item => item.score > 0); // Only include blogs with non-zero relevance

  // Sort by score descending
  scored.sort((a, b) => b.score - a.score);

  // Return top N blogs, but only if we have enough relevant results
  const result = scored.slice(0, limit).map(item => item.blog);
  
  // If we don't have enough related blogs, that's fine - return what we have
  return result;
}

/**
 * Extract key topics from a blog
 * Useful for SEO meta tags and site navigation
 */
export function extractKeyTopics(blog: BlogContent, limit: number = 5): string[] {
  const words = extractWords(blog.title + ' ' + blog.content);
  const freq = getWordFrequency(words);

  return Array.from(freq.entries())
    .sort((a, b) => b[1] - a[1])
    .slice(0, limit)
    .map(([word]) => word);
}

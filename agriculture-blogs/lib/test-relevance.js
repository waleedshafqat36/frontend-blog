/**
 * Test script for relevance matching algorithm
 * Run with: node lib/test-relevance.js
 */

const fs = require('fs');
const path = require('path');

// Simple test implementation of the algorithm
const STOP_WORDS = new Set([
  'the', 'a', 'an', 'and', 'or', 'but', 'in', 'on', 'at', 'to', 'for', 'of', 'with',
  'is', 'are', 'was', 'were', 'be', 'been', 'being', 'have', 'has', 'had', 'do',
  'does', 'did', 'will', 'would', 'could', 'should', 'may', 'might', 'can', 'that',
  'this', 'these', 'those', 'i', 'you', 'he', 'she', 'it', 'we', 'they', 'what',
  'which', 'who', 'where', 'when', 'why', 'how', 'from', 'as', 'by', 'up', 'about',
  'out', 'if', 'not', 'no', 'yes', 'so', 'than', 'then', 'them', 'their', 'more',
]);

function extractWords(text) {
  return text
    .toLowerCase()
    .replace(/<[^>]*>/g, '')
    .replace(/[^\w\s]/g, '')
    .split(/\s+/)
    .filter(word => word.length > 2 && !STOP_WORDS.has(word));
}

function extractKeywords(words, minLength = 4) {
  return words.filter(word => word.length >= minLength);
}

function jaccardSimilarity(words1, words2) {
  const set1 = new Set(words1);
  const set2 = new Set(words2);
  const intersection = new Set([...set1].filter(x => set2.has(x)));
  const union = new Set([...set1, ...set2]);
  return union.size > 0 ? intersection.size / union.size : 0;
}

function getWordFrequency(words) {
  const freq = new Map();
  for (const word of words) {
    freq.set(word, (freq.get(word) || 0) + 1);
  }
  return freq;
}

function overlapScore(freq1, freq2) {
  let score = 0;
  let matchCount = 0;
  let totalWords = Math.max(freq1.size, freq2.size);

  for (const [word, count1] of freq1) {
    if (freq2.has(word)) {
      const count2 = freq2.get(word) || 0;
      score += Math.min(count1, count2) * Math.log(count1 + count2 + 1);
      matchCount++;
    }
  }

  if (matchCount < Math.max(2, totalWords * 0.15)) {
    return 0;
  }

  const matchPercentage = matchCount / totalWords;
  const weightedScore = (score / Math.max(1, Math.log(totalWords + 1))) * (matchPercentage / 0.5);
  
  return Math.min(1.0, Math.max(0, weightedScore));
}

// Test cases
const testBlogs = [
  {
    _id: '1',
    title: 'Mechanical Energy in Physics',
    content: 'Mechanical energy is the energy possessed by an object due to its motion or position. It consists of kinetic energy and potential energy. Understanding mechanical energy is crucial in physics.'
  },
  {
    _id: '2',
    title: 'Agriculture Farming Techniques',
    content: 'Modern agriculture uses various farming techniques to improve crop yield. Sustainable farming practices protect the environment while ensuring food security. Traditional and modern agriculture methods are being combined.'
  },
  {
    _id: '3',
    title: 'Kinetic and Potential Energy',
    content: 'Kinetic energy is the energy of motion. Potential energy is stored energy based on position. Together they form the basis of mechanical energy in physics and mechanics.'
  },
  {
    _id: '4',
    title: 'Organic Farming Methods',
    content: 'Organic farming avoids synthetic pesticides and fertilizers. It focuses on natural agricultural techniques and sustainable practices. Farmers use crop rotation and composting for soil health.'
  }
];

function testRelevance(blog1, blog2) {
  const titleWords1 = extractKeywords(extractWords(blog1.title), 3);
  const titleWords2 = extractKeywords(extractWords(blog2.title), 3);
  const contentWords1 = extractWords(blog1.content);
  const contentWords2 = extractWords(blog2.content);
  
  const titleSimilarity = jaccardSimilarity(titleWords1, titleWords2);
  if (titleSimilarity < 0.15) {
    titleSimilarity = 0;
  }
  
  const freq1 = getWordFrequency([...titleWords1, ...contentWords1]);
  const freq2 = getWordFrequency([...titleWords2, ...contentWords2]);
  let frequencySimilarity = overlapScore(freq1, freq2);
  
  let finalScore = titleSimilarity * 0.5 + frequencySimilarity * 0.3;
  
  if (finalScore < 0.15) finalScore = 0;
  
  return {
    blog1: blog1.title,
    blog2: blog2.title,
    titleSimilarity: titleSimilarity.toFixed(3),
    frequencySimilarity: frequencySimilarity.toFixed(3),
    finalScore: finalScore.toFixed(3),
    isRelated: finalScore > 0
  };
}

console.log('=== RELEVANCE MATCHING TEST ===\n');

// Test: Mechanical Energy vs Agriculture
console.log('Test 1: "Mechanical Energy" vs "Agriculture"');
const result1 = testRelevance(testBlogs[0], testBlogs[1]);
console.log(`  Title Similarity: ${result1.titleSimilarity}`);
console.log(`  Frequency Similarity: ${result1.frequencySimilarity}`);
console.log(`  Final Score: ${result1.finalScore}`);
console.log(`  Expected: NOT related (score = 0)`);
console.log(`  Result: ${result1.isRelated ? '❌ FAILED - Should not be related' : '✓ PASSED'}\n`);

// Test: Mechanical Energy vs Kinetic Energy
console.log('Test 2: "Mechanical Energy" vs "Kinetic and Potential Energy"');
const result2 = testRelevance(testBlogs[0], testBlogs[2]);
console.log(`  Title Similarity: ${result2.titleSimilarity}`);
console.log(`  Frequency Similarity: ${result2.frequencySimilarity}`);
console.log(`  Final Score: ${result2.finalScore}`);
console.log(`  Expected: RELATED (score > 0)`);
console.log(`  Result: ${result2.isRelated ? '✓ PASSED' : '❌ FAILED - Should be related'}\n`);

// Test: Agriculture vs Organic Farming
console.log('Test 3: "Agriculture" vs "Organic Farming"');
const result3 = testRelevance(testBlogs[1], testBlogs[3]);
console.log(`  Title Similarity: ${result3.titleSimilarity}`);
console.log(`  Frequency Similarity: ${result3.frequencySimilarity}`);
console.log(`  Final Score: ${result3.finalScore}`);
console.log(`  Expected: RELATED (score > 0)`);
console.log(`  Result: ${result3.isRelated ? '✓ PASSED' : '❌ FAILED - Should be related'}\n`);

// Test: Mechanical Energy vs Organic Farming
console.log('Test 4: "Mechanical Energy" vs "Organic Farming"');
const result4 = testRelevance(testBlogs[0], testBlogs[3]);
console.log(`  Title Similarity: ${result4.titleSimilarity}`);
console.log(`  Frequency Similarity: ${result4.frequencySimilarity}`);
console.log(`  Final Score: ${result4.finalScore}`);
console.log(`  Expected: NOT related (score = 0)`);
console.log(`  Result: ${result4.isRelated ? '❌ FAILED - Should not be related' : '✓ PASSED'}\n`);

console.log('=== TEST COMPLETE ===');


// Simple Rule-Based Matching System (Free, Zero AI, Pure Deterministic Scoring)

const STOP_WORDS = new Set([
  'a', 'an', 'and', 'the', 'in', 'on', 'at', 'with', 'for', 'of', 'to', 'from', 'my', 'it', 'is', 'was', 'near'
]);

function extractKeywords(text) {
  if (!text) return [];
  return text
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, ' ')
    .split(/\s+/)
    .filter((word) => word.length > 2 && !STOP_WORDS.has(word));
}

/**
 * Calculates match score between two items
 * Rule 1: Opposite types (LOST matches with FOUND) -> only compare opposite types
 * Rule 2: Category match -> +3 points
 * Rule 3: Location match -> +3 points
 * Rule 4: Title keyword overlap -> +2 points
 * Rule 5: Description keyword overlap -> +2 points
 */
export function calculateMatchScore(itemA, itemB) {
  // Only match opposite types (a LOST item matches with a FOUND item)
  if (!itemA || !itemB || itemA.type === itemB.type) {
    return 0;
  }

  let score = 0;

  // Category Match (+3)
  if (itemA.category && itemB.category && itemA.category.toLowerCase() === itemB.category.toLowerCase()) {
    score += 3;
  }

  // Location Match (+3)
  if (itemA.location && itemB.location && itemA.location.toLowerCase() === itemB.location.toLowerCase()) {
    score += 3;
  }

  // Title Keyword Match (+2)
  const titleAWords = new Set(extractKeywords(itemA.title));
  const titleBWords = extractKeywords(itemB.title);
  const titleOverlap = titleBWords.some((word) => titleAWords.has(word));
  if (titleOverlap) {
    score += 2;
  }

  // Description Keyword Match (+2)
  const descAWords = new Set(extractKeywords(itemA.description));
  const descBWords = extractKeywords(itemB.description);
  const descOverlap = descBWords.some((word) => descAWords.has(word));
  if (descOverlap) {
    score += 2;
  }

  return score;
}

/**
 * Finds all candidate items that match a given target item
 * Threshold >= 3 points means either Category match, Location match, or strong text overlap
 */
export function findPossibleMatches(targetItem, allItems, threshold = 3) {
  if (!targetItem || !allItems) return [];

  const matches = [];

  for (const candidate of allItems) {
    // Don't compare with itself
    const targetId = targetItem._id || targetItem.id;
    const candidateId = candidate._id || candidate.id;
    if (targetId && candidateId && targetId === candidateId) continue;

    const score = calculateMatchScore(targetItem, candidate);
    if (score >= threshold) {
      matches.push({
        item: candidate,
        score
      });
    }
  }

  // Sort highest score first
  return matches.sort((a, b) => b.score - a.score);
}

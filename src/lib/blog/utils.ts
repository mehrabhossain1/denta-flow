/**
 * Blog utility functions for client and server
 */

/**
 * Format author names for display
 * Joins multiple authors with proper grammar
 */
export function formatAuthors(authors: string[]): string {
  const listJoiner = new Intl.ListFormat('en-US', {
    style: 'long',
    type: 'conjunction',
  })

  if (authors.length === 0) return 'Unknown'
  return listJoiner.format(authors)
}

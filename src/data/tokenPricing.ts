/** Token pricing config — USD per 1M tokens as of April 2026 */

export const TOKEN_PRICES: Record<string, { input: number; output: number }> = {
  // OpenAI
  'gpt-4o':        { input: 2.50,  output: 10.00 },
  'gpt-4o-mini':   { input: 0.15,  output: 0.60  },
  'gpt-4-turbo':   { input: 10.00, output: 30.00 },
  'gpt-3.5-turbo': { input: 0.50,  output: 1.50  },
  'o1':            { input: 15.00, output: 60.00 },
  'o1-mini':       { input: 3.00,  output: 12.00 },
  // Anthropic
  'claude-opus-4-6':    { input: 15.00, output: 75.00 },
  'claude-sonnet-4-6':  { input: 3.00,  output: 15.00 },
  'claude-haiku-4-5':   { input: 0.80,  output: 4.00  },
}

/**
 * Calculate cost in integer cents for a given model + token counts.
 * Returns 0 (and warns) if the model is unknown.
 */
export function calculateCostCents(
  model: string,
  inputTokens: number,
  outputTokens: number,
): number {
  const prices = TOKEN_PRICES[model]
  if (!prices) {
    console.warn(`[tokenPricing] Unknown model: ${model}. Cost set to 0.`)
    return 0
  }
  const cost =
    (inputTokens  / 1_000_000) * prices.input  * 100 +
    (outputTokens / 1_000_000) * prices.output * 100
  return Math.round(cost)
}

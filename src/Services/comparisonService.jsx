import visaData, { convertToUSD, getCountryById } from '../data/visaData';

/**
 * Service for salary fit checking and country comparison
 */
class ComparisonService {
  /**
   * Check if user's salary fits a specific country's requirements
   * @param {number} userIncomeMonthly - User's monthly income in USD
   * @param {string} countryId - Country ID from visaData
   * @returns {Object} Salary fit analysis
   */
  checkSalaryFit(userIncomeMonthly, countryId) {
    const visa = getCountryById(countryId);

    if (!visa) {
      return {
        error: 'Country not found',
        countryId
      };
    }

    // Convert country's requirement to USD
    const requiredIncomeUSD = convertToUSD(visa.minIncomeMonthly, visa.currency);
    const ratio = userIncomeMonthly / requiredIncomeUSD;
    const percentage = Math.round(ratio * 100);
    const shortfall = requiredIncomeUSD - userIncomeMonthly;

    let status, message, recommendation, color;

    if (ratio >= 1) {
      status = 'Eligible';
      color = 'green';
      message = `Great news! You meet the income requirement for ${visa.country}.`;
      recommendation = `You can proceed with your ${visa.visaName} application. Make sure to gather proof of income documents.`;
    } else if (ratio >= 0.8) {
      status = 'Close';
      color = 'yellow';
      message = `You're ${Math.round((1 - ratio) * 100)}% short of the requirement.`;
      recommendation = `Consider taking on additional freelance work, increasing your salary, or choosing a country with lower income requirements. You need approximately $${Math.round(shortfall)} more per month.`;
    } else {
      status = 'Not Eligible';
      color = 'red';
      message = `Income is ${Math.round((1 - ratio) * 100)}% below requirement.`;
      recommendation = `Try filtering by 'Easy' difficulty countries or those with lower income requirements. Consider countries like Croatia, Czech Republic, or Mexico which have more accessible thresholds.`;
    }

    return {
      country: visa.country,
      countryId: visa.id,
      visaName: visa.visaName,
      required: requiredIncomeUSD,
      requiredOriginal: `${visa.currencySymbol}${visa.minIncomeMonthly.toLocaleString()}`,
      userIncome: userIncomeMonthly,
      shortfall: shortfall > 0 ? shortfall : 0,
      status,
      color,
      percentage,
      message,
      recommendation,
      additionalInfo: {
        costOfLiving: visa.costOfLivingIndex,
        processingTime: `${visa.processingWeeks} weeks`,
        difficulty: visa.difficulty
      }
    };
  }

  /**
   * Check salary fit for all countries
   * @param {number} userIncomeMonthly - User's monthly income in USD
   * @returns {Array} Array of salary fit results sorted by eligibility
   */
  checkAllCountries(userIncomeMonthly) {
    const results = visaData.map(visa =>
      this.checkSalaryFit(userIncomeMonthly, visa.id)
    );

    // Sort by eligibility: Eligible > Close > Not Eligible
    // Within each category, sort by income requirement (lower first)
    return results.sort((a, b) => {
      const statusOrder = { 'Eligible': 0, 'Close': 1, 'Not Eligible': 2 };
      if (statusOrder[a.status] !== statusOrder[b.status]) {
        return statusOrder[a.status] - statusOrder[b.status];
      }
      return a.required - b.required;
    });
  }

  /**
   * Compare multiple countries side-by-side
   * @param {Array<string>} countryIds - Array of country IDs to compare
   * @returns {Array} Comparison data for selected countries
   */
  compareCountries(countryIds) {
    const selected = countryIds
      .map(id => getCountryById(id))
      .filter(Boolean); // Remove null entries

    if (selected.length === 0) {
      return { error: 'No valid countries selected' };
    }

    return selected.map(country => ({
      id: country.id,
      country: country.country,
      visaName: country.visaName,
      visaType: country.visaType,
      difficulty: country.difficulty,
      minIncome: {
        original: `${country.currencySymbol}${country.minIncomeMonthly.toLocaleString()}`,
        usd: Math.round(convertToUSD(country.minIncomeMonthly, country.currency)),
        yearly: `${country.currencySymbol}${country.minIncomeYearly.toLocaleString()}`
      },
      duration: `${country.durationMonths} months`,
      renewable: country.renewableYears === 999 ? 'Indefinitely' :
                 country.renewableYears === 0 ? 'No' :
                 `Up to ${country.renewableYears} years`,
      processing: `${country.processingWeeks} weeks`,
      cost: `$${country.costUSD}`,
      costOfLiving: country.costOfLivingIndex,
      costOfLivingText: this.getCostOfLivingText(country.costOfLivingIndex),
      safetyRating: country.safetyRating,
      internetSpeed: `${country.internetSpeed} Mbps`,
      englishProficiency: country.englishProficiency,
      timezone: country.timezone,
      color: country.color,
      topRequirements: country.requirements.slice(0, 4),
      topBenefits: country.benefits.slice(0, 4),
      restrictions: country.restrictions,
      bestFor: country.bestFor
    }));
  }

  /**
   * Get text description for cost of living index
   */
  getCostOfLivingText(index) {
    if (index < 40) return 'Very Low';
    if (index < 50) return 'Low';
    if (index < 60) return 'Moderate';
    if (index < 70) return 'High';
    return 'Very High';
  }

  /**
   * Find best countries based on user's income and preferences
   * @param {number} userIncomeMonthly - User's monthly income in USD
   * @param {Object} preferences - User preferences
   * @returns {Array} Recommended countries
   */
  findBestMatches(userIncomeMonthly, preferences = {}) {
    const {
      maxCostOfLiving = 100,
      minInternetSpeed = 0,
      minSafetyRating = 0,
      difficulty = null, // 'Easy', 'Medium', 'Hard'
      preferredRegion = null, // 'Europe', 'Americas', 'Asia', 'Middle East'
      englishRequired = false
    } = preferences;

    let eligible = this.checkAllCountries(userIncomeMonthly)
      .filter(result => result.status === 'Eligible');

    // Apply filters
    const filtered = eligible.filter(result => {
      const visa = getCountryById(result.countryId);
      if (!visa) return false;

      if (visa.costOfLivingIndex > maxCostOfLiving) return false;
      if (visa.internetSpeed < minInternetSpeed) return false;
      if (visa.safetyRating < minSafetyRating) return false;
      if (difficulty && visa.difficulty !== difficulty) return false;
      if (englishRequired && visa.englishProficiency === 'Low') return false;

      return true;
    });

    // Sort by a composite score
    return filtered.map(result => {
      const visa = getCountryById(result.countryId);
      const score = this.calculateMatchScore(visa, userIncomeMonthly, preferences);

      return {
        ...result,
        matchScore: score,
        visa: visa
      };
    }).sort((a, b) => b.matchScore - a.matchScore);
  }

  /**
   * Calculate match score for a country based on user preferences
   */
  calculateMatchScore(visa, userIncomeMonthly, preferences) {
    let score = 0;

    // Income buffer (more buffer = better score)
    const requiredUSD = convertToUSD(visa.minIncomeMonthly, visa.currency);
    const incomeRatio = userIncomeMonthly / requiredUSD;
    score += Math.min(incomeRatio * 20, 40); // Up to 40 points

    // Cost of living (lower = better)
    score += (100 - visa.costOfLivingIndex) * 0.3; // Up to 30 points

    // Safety rating
    score += visa.safetyRating * 2; // Up to 20 points

    // Internet speed (important for remote work)
    score += Math.min(visa.internetSpeed / 10, 10); // Up to 10 points

    // Difficulty (easier = better)
    const difficultyBonus = { 'Easy': 10, 'Medium': 5, 'Hard': 0 };
    score += difficultyBonus[visa.difficulty] || 0;

    // Popular/Featured bonus
    if (visa.featured) score += 5;
    if (visa.popular) score += 5;

    return Math.round(score);
  }

  /**
   * Get statistics for comparison table
   */
  getComparisonStats(countryIds) {
    const comparison = this.compareCountries(countryIds);

    if (comparison.error) return comparison;

    return {
      countries: comparison,
      stats: {
        cheapest: comparison.reduce((prev, curr) =>
          prev.costOfLiving < curr.costOfLiving ? prev : curr
        ),
        fastest: comparison.reduce((prev, curr) => {
          const prevWeeks = parseInt(prev.processing);
          const currWeeks = parseInt(curr.processing);
          return prevWeeks < currWeeks ? prev : curr;
        }),
        safest: comparison.reduce((prev, curr) =>
          prev.safetyRating > curr.safetyRating ? prev : curr
        ),
        lowestIncome: comparison.reduce((prev, curr) =>
          prev.minIncome.usd < curr.minIncome.usd ? prev : curr
        )
      }
    };
  }
}

export default new ComparisonService();

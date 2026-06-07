// Exchange rates to USD (approximate)
const EXCHANGE_RATES = {
  USD: 1,
  EUR: 1.08,
  CZK: 0.044,
};

function convertToUSD(amount, currency) {
  return amount * (EXCHANGE_RATES[currency] ?? 1);
}

class ComparisonService {
  checkSalaryFit(userIncomeMonthly, visa) {
    const requiredIncomeUSD = convertToUSD(visa.minIncomeMonthly, visa.currency);
    const ratio      = userIncomeMonthly / requiredIncomeUSD;
    const percentage = Math.round(ratio * 100);
    const shortfall  = requiredIncomeUSD - userIncomeMonthly;

    let status, message, recommendation;

    if (ratio >= 1) {
      status = 'Eligible';
      message = `Great news! You meet the income requirement for ${visa.country}.`;
      recommendation = `You can proceed with your ${visa.visaName} application. Make sure to gather proof of income documents.`;
    } else if (ratio >= 0.8) {
      status = 'Close';
      message = `You're ${Math.round((1 - ratio) * 100)}% short of the requirement.`;
      recommendation = `Consider taking on additional freelance work or increasing your salary. You need approximately $${Math.round(shortfall)} more per month.`;
    } else {
      status = 'Not Eligible';
      message = `Income is ${Math.round((1 - ratio) * 100)}% below requirement.`;
      recommendation = `Try filtering by 'Easy' difficulty or lower income countries like Croatia, Czech Republic, or Mexico.`;
    }

    return {
      country:          visa.country,
      countryId:        visa.country_id,   //  API field
      visaName:         visa.visaName,
      required:         requiredIncomeUSD,
      requiredOriginal: `${visa.currencySymbol}${visa.minIncomeMonthly.toLocaleString()}`,
      userIncome:       userIncomeMonthly,
      shortfall:        shortfall > 0 ? shortfall : 0,
      status,
      percentage,
      message,
      recommendation,
      additionalInfo: {
        costOfLiving:   visa.costOfLivingIndex,
        processingTime: `${visa.processingWeeks} weeks`,
        difficulty:     visa.difficulty,
      },
    };
  }

  //  Now receives countries array from API instead of reading local visaData
  checkAllCountries(userIncomeMonthly, countries) {
    return countries
      .map(visa => this.checkSalaryFit(userIncomeMonthly, visa))
      .sort((a, b) => {
        const order = { Eligible: 0, Close: 1, 'Not Eligible': 2 };
        if (order[a.status] !== order[b.status]) return order[a.status] - order[b.status];
        return a.required - b.required;
      });
  }

  getCostOfLivingText(index) {
    if (index < 40) return 'Very Low';
    if (index < 50) return 'Low';
    if (index < 60) return 'Moderate';
    if (index < 70) return 'High';
    return 'Very High';
  }
}

export default new ComparisonService();

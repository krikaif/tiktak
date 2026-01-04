const form = document.querySelector("#calc-form");
const recommended = document.querySelector("#recommended");
const coverage = document.querySelector("#coverage");
const demand = document.querySelector("#demand");
const risk = document.querySelector("#risk");

const formatNumber = (value) => new Intl.NumberFormat("ru-RU").format(value);

const calculate = ({ stock, sales, trend, lead, safety }) => {
  const trendFactor = 1 + trend / 100;
  const demandForecast = Math.round(sales * (lead + safety) * trendFactor);
  const recommendedShipment = Math.max(demandForecast - stock, 0);
  const coverageDays = Math.round(stock / Math.max(sales, 1));

  let riskLevel = "Низкий";
  if (coverageDays <= safety) {
    riskLevel = "Высокий";
  } else if (coverageDays <= safety + Math.ceil(lead / 2)) {
    riskLevel = "Средний";
  }

  return { recommendedShipment, demandForecast, coverageDays, riskLevel };
};

const updateUI = (values) => {
  const { recommendedShipment, demandForecast, coverageDays, riskLevel } =
    calculate(values);

  recommended.textContent = `${formatNumber(recommendedShipment)} шт.`;
  demand.textContent = formatNumber(demandForecast);
  coverage.textContent = coverageDays;
  risk.textContent = riskLevel;
};

if (form) {
  form.addEventListener("submit", (event) => {
    event.preventDefault();
    const formData = new FormData(form);
    const values = Object.fromEntries(
      Array.from(formData.entries()).map(([key, value]) => [key, Number(value)])
    );
    updateUI(values);
  });

  updateUI({
    stock: 1200,
    sales: 80,
    trend: 12,
    lead: 14,
    safety: 7,
  });
}

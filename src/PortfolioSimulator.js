import React, { useState, useEffect } from "react";
import Cookies from "js-cookie";
import {
  LineChart,
  Line,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import "./App.css"; // Import your CSS styles

const PortfolioSimulator = () => {
  // State for inputs
  const [initialPortfolio, setInitialPortfolio] = useState(parseFloat(Cookies.get("initialPortfolio")) || 1000000);
  const [annualDraw, setAnnualDraw] = useState(parseFloat(Cookies.get("annualDraw")) || 100000);
  const [inflationRate, setInflationRate] = useState(parseFloat(Cookies.get("inflationRate")) || 0.03);
  const [annualReturn, setAnnualReturn] = useState(parseFloat(Cookies.get("annualReturn")) || 0.08);
  const [ssaBenefit, setSsaBenefit] = useState(parseFloat(Cookies.get("ssaBenefit")) || 300);
  const [years, setYears] = useState(30);

  // State for chart data
  const [data, setData] = useState([]);

  // Save updated values to cookies whenever they change
  useEffect(() => {
    Cookies.set("initialPortfolio", initialPortfolio, { expires: 7 });
    Cookies.set("annualDraw", annualDraw, { expires: 7 });
    Cookies.set("inflationRate", inflationRate, { expires: 7 });
    Cookies.set("annualReturn", annualReturn, { expires: 7 });
    Cookies.set("ssaBenefit", ssaBenefit, { expires: 7 });
    Cookies.set("years", years, { expires: 7 });
  }, [initialPortfolio, annualDraw, inflationRate, annualReturn, ssaBenefit, years]);

  // Update chart data whenever inputs change
  useEffect(() => {
    const portfolioValues = [initialPortfolio];
    const chartData = [];

    for (let year = 1; year <= years; year++) {
      const growth = portfolioValues[year - 1] * annualReturn;
      const draw = annualDraw * (1 + inflationRate) ** year - (ssaBenefit * 12);
      const endOfYearBalance = portfolioValues[year - 1] + growth - draw;

      if (endOfYearBalance < 0)
        break;

      portfolioValues.push(endOfYearBalance);

      chartData.push({
        year,
        portfolioBalance: endOfYearBalance,
        annualGrowth: growth,
        annualDraw: draw,
      });
    }

    setData(chartData);
  }, [initialPortfolio, annualDraw, inflationRate, annualReturn, ssaBenefit, years]);

  return (
    <div className="container">
      <h2 className="heading">Portfolio Simulator</h2>

      {/* Input Fields */}
      <div className="inputs">
        <label>
          Initial Portfolio:
          <input
            type="number"
            value={initialPortfolio}
            onChange={(e) => setInitialPortfolio(parseFloat(e.target.value) || 0)}
          />
        </label>
        <label>
          Annual Draw:
          <input
            type="number"
            value={annualDraw}
            onChange={(e) => setAnnualDraw(parseFloat(e.target.value) || 0)}
          />
        </label>
        <label>
          Inflation Rate (%):
          <input
            type="number"
            step="0.01"
            value={inflationRate * 100}
            onChange={(e) => setInflationRate(parseFloat(e.target.value) / 100 || 0)}
          />
        </label>
        <label>
          Annual Return (%):
          <input
            type="number"
            step="0.01"
            value={annualReturn * 100}
            onChange={(e) => setAnnualReturn(parseFloat(e.target.value) / 100 || 0)}
          />
        </label>
        <label>
          SSA Benefit (Monthly):
          <input
            type="number"
            value={ssaBenefit}
            onChange={(e) => setSsaBenefit(parseFloat(e.target.value) || 0)}
          />
        </label>
      </div>

      {/* Chart */}
      <div className="chart">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data}>
            <CartesianGrid stroke="#ccc" />
            <XAxis dataKey="year" label={{ value: "Year", position: "insideBottom", offset: -5 }} />
            <YAxis
              label={{
                value: "Amount ($ in thousands)",
                angle: -90,
                position: "insideLeft",
              }}
              tickFormatter={(tick) => `${(tick / 1000).toFixed(0)}K`}
            />
            <Tooltip formatter={(value) => `$${value.toLocaleString()}`} />
            <Line
              type="monotone"
              dataKey="portfolioBalance"
              stroke="#8884d8"
              name="Portfolio Balance"
            />
            <Line
              type="monotone"
              dataKey="annualGrowth"
              stroke="#82ca9d"
              name="Annual Growth"
            />
            <Line
              type="monotone"
              dataKey="annualDraw"
              stroke="#ff7300"
              name="Annual Draw"
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default PortfolioSimulator;

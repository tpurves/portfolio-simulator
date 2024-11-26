import React, { useState, useEffect } from "react";
import "./App.css"; // Import App.css
import {
  LineChart,
  Line,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

const PortfolioSimulator = () => {
  // Parameters
  const initialPortfolio = 4_000_000; // Starting portfolio
  const monthlyDraw = 250_000 / 12; // Monthly withdrawal
  const inflationRate = 0.03; // Average annual inflation rate
  const annualReturn = 0.08; // Average annual return
  const ssaBenefit = 3_500; // Monthly social security benefit
  const years = 30; // Duration in years

  // State to hold simulation data
  const [data, setData] = useState([]);

  useEffect(() => {
    // Simulation logic
    const portfolioValues = [initialPortfolio];
    const annualGrowth = [];
    const annualDraw = [];
    const chartData = [];

    for (let year = 1; year <= years; year++) {
      // Calculate annual growth
      const growth = portfolioValues[year - 1] * annualReturn;
      annualGrowth.push(growth);

      // Calculate annual draw
      const draw = monthlyDraw * 12 * (1 + inflationRate) ** year;
      annualDraw.push(draw - ssaBenefit * 12);

      // Update portfolio
      const endOfYearBalance =
        portfolioValues[year - 1] + growth - draw;
      portfolioValues.push(endOfYearBalance);

      // Prepare data for chart
      chartData.push({
        year,
        portfolioBalance: endOfYearBalance,
        annualGrowth: growth,
        annualDraw: draw - ssaBenefit * 12,
      });
    }

    setData(chartData);
  }, [initialPortfolio, monthlyDraw, inflationRate, annualReturn, ssaBenefit, years]);

  return (
    <div className="container">
      <h2 className="heading">Portfolio Balance, Growth, and Draw Over {years} Years</h2>
        <div className="chart">
          <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data}>
            <CartesianGrid stroke="#ccc" />
            <XAxis
              dataKey="year"
              label={{ value: "Year", position: "insideBottom", offset: -5 }}
            />
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
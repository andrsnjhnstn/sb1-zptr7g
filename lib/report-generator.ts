export function generateHtmlReport(data: any): string {
  const styles = `
    <style>
      :root {
        --primary: #ADFA1D;
        --background: #ffffff;
        --foreground: #000000;
        --muted: #f3f4f6;
        --muted-foreground: #6b7280;
        --border: #e5e7eb;
      }

      @media (prefers-color-scheme: dark) {
        :root {
          --background: #1a1a1a;
          --foreground: #ffffff;
          --muted: #27272a;
          --muted-foreground: #a1a1aa;
          --border: #2e2e2e;
        }
      }

      body {
        font-family: system-ui, -apple-system, sans-serif;
        background: var(--background);
        color: var(--foreground);
        line-height: 1.5;
        margin: 0;
        padding: 2rem;
      }

      .container {
        max-width: 1200px;
        margin: 0 auto;
      }

      .card {
        background: var(--background);
        border: 1px solid var(--border);
        border-radius: 0.5rem;
        padding: 1.5rem;
        margin-bottom: 1.5rem;
      }

      .title {
        font-size: 1.5rem;
        font-weight: bold;
        margin: 0 0 1rem;
      }

      .subtitle {
        font-size: 0.875rem;
        color: var(--muted-foreground);
        margin: 0;
      }

      .value {
        font-size: 1.5rem;
        font-weight: bold;
        margin: 0.5rem 0;
      }

      .grid {
        display: grid;
        gap: 1.5rem;
      }

      .grid-cols-2 {
        grid-template-columns: repeat(2, 1fr);
      }

      .grid-cols-3 {
        grid-template-columns: repeat(3, 1fr);
      }

      table {
        width: 100%;
        border-collapse: collapse;
        margin: 1rem 0;
      }

      th, td {
        padding: 0.75rem;
        text-align: left;
        border-bottom: 1px solid var(--border);
      }

      th {
        font-weight: 600;
        color: var(--muted-foreground);
      }

      .section {
        background: var(--muted);
        padding: 1rem;
        border-radius: 0.5rem;
        margin-bottom: 1rem;
      }

      .text-right {
        text-align: right;
      }
    </style>
  `

  const content = `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Carbon Footprint Report - ${data.product.name}</title>
      ${styles}
    </head>
    <body>
      <div class="container">
        <div class="card">
          <h1 class="title">Product Overview: ${data.product.name}</h1>
          <div class="grid grid-cols-3">
            <div>
              <p class="subtitle">Total Emissions</p>
              <p class="value">${data.product.total_emissions_kgCO2e.toFixed(2)} kg CO2e</p>
            </div>
            <div>
              <p class="subtitle">Number of Parts</p>
              <p class="value">${data.product.parts.length}</p>
            </div>
            <div>
              <p class="subtitle">Assembly Location</p>
              <p class="value">${data.product.assembly.location}</p>
            </div>
          </div>
        </div>

        <div class="card">
          <h2 class="title">Parts Analysis</h2>
          <table>
            <thead>
              <tr>
                <th>Part Name</th>
                <th>Material</th>
                <th>Weight (kg)</th>
                <th>Shipping Method</th>
                <th>Emissions (kg CO2e)</th>
              </tr>
            </thead>
            <tbody>
              ${data.product.parts.map(part => `
                <tr>
                  <td>${part.name}</td>
                  <td>${part.material}</td>
                  <td>${part.weight_kg}</td>
                  <td>${part.shipping?.method || "N/A"}</td>
                  <td>${part.total_part_emissions_kgCO2e.toFixed(3)}</td>
                </tr>
              `).join("")}
              <tr>
                <td>Assembly</td>
                <td>-</td>
                <td>-</td>
                <td>-</td>
                <td>${data.product.assembly.emissions_kgCO2e.toFixed(3)}</td>
              </tr>
            </tbody>
          </table>
        </div>

        <div class="card">
          <h2 class="title">Emissions Factors</h2>
          <table>
            <thead>
              <tr>
                <th>Name</th>
                <th class="text-right">Value (kg CO2e/kg)</th>
                <th>Source</th>
              </tr>
            </thead>
            <tbody>
              ${Object.values(data.emissions_factors).map(factor => `
                <tr>
                  <td>${factor.name}</td>
                  <td class="text-right">${factor.value_kgCO2e_per_kg.toFixed(3)}</td>
                  <td>${factor.source}</td>
                </tr>
              `).join("")}
            </tbody>
          </table>
        </div>

        <div class="card">
          <h2 class="title">Opportunities for Improvement</h2>
          <div class="grid grid-cols-2">
            <div class="card">
              <h3 class="title">Adjustment Opportunities</h3>
              <p class="subtitle">Short-term improvements that can be implemented with minimal changes</p>
              ${Object.values(data.adjustment_opportunities).map(value => `
                <div class="section">
                  <p>${value}</p>
                </div>
              `).join("")}
            </div>

            <div class="card">
              <h3 class="title">Reduction Opportunities</h3>
              <p class="subtitle">Long-term strategies for significant emissions reduction</p>
              ${Object.values(data.reduction_opportunities).map(value => `
                <div class="section">
                  <p>${value}</p>
                </div>
              `).join("")}
            </div>
          </div>
        </div>

        <div class="card">
          <h2 class="title">Conclusion</h2>
          <div class="section">
            <p>${data.conclusion}</p>
          </div>
        </div>

        <div class="card" style="text-align: center; color: var(--muted-foreground);">
          <p>Generated on ${new Date().toLocaleDateString()} at ${new Date().toLocaleTimeString()}</p>
        </div>
      </div>
    </body>
    </html>
  `

  return content
}
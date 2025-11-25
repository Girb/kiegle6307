import fs from "fs/promises";

export async function generateHtml() {
  const timestamp = new Date().toISOString();

  const html = `
    <!DOCTYPE html>
    <html>
    <head><title>Kongematch</title></head>
    <body>
      <h1>Kongematch Live View</h1>
      <p>Generated at: ${timestamp}</p>
    </body>
    </html>
  `;

  const response = await fetch('http://localhost:6307/api/results/1'); 
  if (!response.ok) {
    throw new Error(`Failed to fetch results: ${response.statusText}`);
  }
  const results = await response.json();
  console.log(results);
  await fs.unlink('./generated.html').catch(() => {}); // Remove old file if exists
  await fs.writeFile('./generated.html', html, 'utf8');
}
console.log('HTML file generated at ./generated.html');
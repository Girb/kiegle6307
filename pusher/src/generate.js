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

  await fs.writeFile('./generated.html', html, 'utf8');
}

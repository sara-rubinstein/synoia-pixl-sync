export function openImagePreview(url: string, title: string = "Image Preview") {
  const previewHtml = `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8" />
      <title>${title}</title>
      <style>
        html, body {
          margin: 0;
          background: #0e0e0e;
          height: 100%;
          display: flex;
          align-items: center;
          justify-content: center;
          overflow: hidden;
        }
        img {
          max-width: 95vw;
          max-height: 95vh;
          border-radius: 8px;
          object-fit: contain;
          box-shadow: 0 0 24px rgba(255, 255, 255, 0.15);
        }
        .info {
          position: fixed;
          bottom: 10px;
          left: 15px;
          color: #fff;
          font-family: sans-serif;
          font-size: 13px;
          opacity: 0.8;
        }
      </style>
    </head>
    <body>
      <img src="${url}" alt="${title}" />
      <div class="info">${title}</div>
    </body>
    </html>
  `;

  // 🧠 Encode the HTML into a data URL
  const encodedHtml = encodeURIComponent(previewHtml);
  const dataUrl = `data:text/html;charset=utf-8,${encodedHtml}`;

  // ✅ Opens immediately in all browsers (Chrome, Edge, Firefox)
  window.open(dataUrl, "_blank", "noopener,noreferrer");
}

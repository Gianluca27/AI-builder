import { useEffect, useRef } from "react";

const Preview = ({ code }) => {
  const iframeRef = useRef(null);

  useEffect(() => {
    if (!iframeRef.current) return;

    const fullHTML = `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Preview</title>
    ${code.css ? `<style>${code.css}</style>` : ""}
</head>
<body>
${code.html}
${code.js ? `<script>${code.js}</script>` : ""}
</body>
</html>
    `;

    const iframe = iframeRef.current;
    const iframeDoc = iframe.contentDocument || iframe.contentWindow.document;

    iframeDoc.open();
    iframeDoc.write(fullHTML);
    iframeDoc.close();
  }, [code]);

  return (
    <div className="h-full bg-white">
      <iframe
        ref={iframeRef}
        className="w-full h-full border-0"
        title="Website Preview"
        sandbox="allow-scripts allow-same-origin"
      />
    </div>
  );
};

export default Preview;

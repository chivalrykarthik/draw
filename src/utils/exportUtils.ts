/**
 * File download utility — triggers a browser download for a Blob.
 */
function downloadBlob(blob: Blob, filename: string) {
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
}

/**
 * Parses SVG string dimensions from width/height attributes or viewBox.
 */
function getSvgDimensions(svgEl: SVGSVGElement): { width: number; height: number } {
    let width = parseFloat(svgEl.getAttribute('width') || '0');
    let height = parseFloat(svgEl.getAttribute('height') || '0');

    if (!width || !height) {
        const viewBox = svgEl.getAttribute('viewBox');
        if (viewBox) {
            const parts = viewBox.split(/[\s,]+/).map(Number);
            width = parts[2] || 800;
            height = parts[3] || 600;
        } else {
            width = 800;
            height = 600;
        }
    }

    return { width, height };
}

/**
 * Downloads the given SVG string as an .svg file.
 */
export function downloadSVG(svgContent: string, filename: string = 'd2-diagram') {
    const fullSvg = svgContent.startsWith('<?xml')
        ? svgContent
        : `<?xml version="1.0" encoding="UTF-8"?>\n${svgContent}`;

    const blob = new Blob([fullSvg], { type: 'image/svg+xml;charset=utf-8' });
    downloadBlob(blob, `${filename}.svg`);
}

/**
 * Renders the SVG to a canvas and downloads as a high-res PNG.
 */
export function downloadPNG(
    svgContent: string,
    filename: string = 'd2-diagram',
    scale: number = 2,
    isDark: boolean = true,
): Promise<void> {
    return new Promise<void>((resolve, reject) => {
        const parser = new DOMParser();
        const svgDoc = parser.parseFromString(svgContent, 'image/svg+xml');
        const svgEl = svgDoc.querySelector('svg');

        if (!svgEl) {
            reject(new Error('Invalid SVG content'));
            return;
        }

        const { width, height } = getSvgDimensions(svgEl);

        // Ensure the SVG has xmlns
        if (!svgEl.getAttribute('xmlns')) {
            svgEl.setAttribute('xmlns', 'http://www.w3.org/2000/svg');
        }

        const serializer = new XMLSerializer();
        const svgString = serializer.serializeToString(svgEl);
        const svgBlob = new Blob([svgString], { type: 'image/svg+xml;charset=utf-8' });
        const svgUrl = URL.createObjectURL(svgBlob);

        const img = new Image();
        img.crossOrigin = 'anonymous';

        img.onload = () => {
            const canvas = document.createElement('canvas');
            canvas.width = width * scale;
            canvas.height = height * scale;

            const ctx = canvas.getContext('2d');
            if (!ctx) {
                reject(new Error('Could not create canvas context'));
                return;
            }

            // Fill with theme-appropriate background
            ctx.fillStyle = isDark ? '#0f172a' : '#ffffff';
            ctx.fillRect(0, 0, canvas.width, canvas.height);
            ctx.scale(scale, scale);
            ctx.drawImage(img, 0, 0, width, height);

            canvas.toBlob(
                (blob) => {
                    if (!blob) {
                        reject(new Error('Failed to create PNG blob'));
                        return;
                    }
                    downloadBlob(blob, `${filename}.png`);
                    URL.revokeObjectURL(svgUrl);
                    resolve();
                },
                'image/png',
                1.0,
            );
        };

        img.onerror = () => {
            URL.revokeObjectURL(svgUrl);
            reject(new Error('Failed to load SVG image'));
        };

        img.src = svgUrl;
    });
}

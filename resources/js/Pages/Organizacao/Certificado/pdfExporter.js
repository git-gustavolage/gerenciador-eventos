import { buildSvgString, CANVAS_W, CANVAS_H } from "./svgBuilder";

export function triggerDownload(url, filename) {
    const a = document.createElement("a");
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
}

async function imageUrlToDataUrl(url) {
    if (!url || url.startsWith("data:")) return url;

    try {
        const response = await fetch(url, { credentials: "same-origin" });
        if (!response.ok) {
            throw new Error("Não foi possível carregar a imagem de fundo.");
        }
        const blob = await response.blob();
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = () => resolve(reader.result);
            reader.onerror = reject;
            reader.readAsDataURL(blob);
        });
    } catch (e) {
        console.error(e);
        return null;
    }
}

function dataUrlToBinary(dataUrl) {
    const base64 = dataUrl.split(",")[1];
    const binary = atob(base64);
    const bytes = new Uint8Array(binary.length);

    for (let i = 0; i < binary.length; i++) {
        bytes[i] = binary.charCodeAt(i);
    }

    return bytes;
}

function pdfObject(body) {
    return `${body}\n`;
}

function createSinglePagePdf(jpegBytes) {
    const pageW = 841.89;
    const pageH = 595.28;

    let imageBinary = "";
    for (let i = 0; i < jpegBytes.length; i++) {
        imageBinary += String.fromCharCode(jpegBytes[i]);
    }

    const content = `q ${pageW} 0 0 ${pageH} 0 0 cm /Im1 Do Q\n`;
    const objects = [
        pdfObject("<< /Type /Catalog /Pages 2 0 R >>"),
        pdfObject("<< /Type /Pages /Kids [3 0 R] /Count 1 >>"),
        pdfObject(
            `<< /Type /Page /Parent 2 0 R /MediaBox [0 0 ${pageW} ${pageH}] /Resources << /XObject << /Im1 4 0 R >> >> /Contents 5 0 R >>`
        ),
        `<< /Type /XObject /Subtype /Image /Width ${CANVAS_W * 2} /Height ${CANVAS_H * 2} /ColorSpace /DeviceRGB /BitsPerComponent 8 /Filter /DCTDecode /Length ${jpegBytes.length} >>\nstream\n${imageBinary}\nendstream\n`,
        pdfObject(`<< /Length ${content.length} >>\nstream\n${content}endstream`),
    ];

    let pdf = "%PDF-1.4\n%\xE2\xE3\xCF\xD3\n";
    const offsets = [0];

    objects.forEach((object, index) => {
        offsets.push(pdf.length);
        pdf += `${index + 1} 0 obj\n${object}endobj\n`;
    });

    const xref = pdf.length;
    pdf += `xref\n0 ${objects.length + 1}\n0000000000 65535 f \n`;

    for (let i = 1; i <= objects.length; i++) {
        pdf += `${String(offsets[i]).padStart(10, "0")} 00000 n \n`;
    }

    pdf += `trailer\n<< /Size ${objects.length + 1} /Root 1 0 R >>\nstartxref\n${xref}\n%%EOF`;

    const buffer = new Uint8Array(pdf.length);
    for (let i = 0; i < pdf.length; i++) {
        buffer[i] = pdf.charCodeAt(i) & 0xff;
    }

    return new Blob([buffer], { type: "application/pdf" });
}

export async function exportPdf(fields, data, bgDataUrl, filename) {
    const inlineBg = await imageUrlToDataUrl(bgDataUrl);
    let svgString = buildSvgString(fields, data, inlineBg);

    const scale = 2;
    const canvas = document.createElement("canvas");
    canvas.width = CANVAS_W * scale;
    canvas.height = CANVAS_H * scale;
    const ctx = canvas.getContext("2d");

    if (inlineBg) {
        await new Promise((resolve) => {
            const bgImg = new Image();
            bgImg.onload = () => {
                ctx.drawImage(bgImg, 0, 0, canvas.width, canvas.height);
                resolve();
            };
            bgImg.onerror = resolve;
            bgImg.src = inlineBg;
        });

        svgString = svgString.replace(/<image[^>]*>/g, "");
    } else {
        ctx.fillStyle = "#ffffff";
        ctx.fillRect(0, 0, canvas.width, canvas.height);
    }

    const blob = new Blob([svgString], { type: "image/svg+xml;charset=utf-8" });
    const url = URL.createObjectURL(blob);

    await new Promise((resolve, reject) => {
        const img = new Image();
        img.onload = () => {
            ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
            URL.revokeObjectURL(url);
            resolve();
        };
        img.onerror = (err) => {
            URL.revokeObjectURL(url);
            reject(err);
        };
        img.src = url;
    });

    const jpegDataUrl = canvas.toDataURL("image/jpeg", 0.95);
    const pdfBlob = createSinglePagePdf(dataUrlToBinary(jpegDataUrl));

    triggerDownload(URL.createObjectURL(pdfBlob), filename);
}

export async function exportSvg(fields, data, bgDataUrl, filename) {
    const inlineBg = await imageUrlToDataUrl(bgDataUrl);
    let svg = buildSvgString(fields, data, inlineBg);
    if (!svg.includes("xmlns:xlink")) {
        svg = svg.replace("<svg ", '<svg xmlns:xlink="http://www.w3.org/1999/xlink" ');
    }
    svg = svg.replace(/<image href="([^"]+)"/g, '<image href="$1" xlink:href="$1"');
    const blob = new Blob([svg], { type: "image/svg+xml;charset=utf-8" });
    triggerDownload(URL.createObjectURL(blob), filename);
}

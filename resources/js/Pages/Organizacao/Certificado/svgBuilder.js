// Dimensões A4 landscape
export const CANVAS_W = 1122;
export const CANVAS_H = 794;
export const ASPECT = `${CANVAS_W}/${CANVAS_H}`;

export const VARS = [
    { key: "{{nome_participante}}", label: "Nome do participante" },
    { key: "{{nome_evento}}", label: "Nome do evento" },
    { key: "{{nome_atividade}}", label: "Nome da atividade" },
    { key: "{{data_atividade}}", label: "Data da atividade" },
    { key: "{{horario_atividade}}", label: "Horário da atividade" },
    { key: "{{carga_horaria}}", label: "Carga horária" },
    { key: "{{data_emissao}}", label: "Data de emissão" },
];

export const DEFAULT_FIELDS = [
    {
        id: "titulo",
        label: "Título",
        content: "CERTIFICADO DE PARTICIPAÇÃO",
        x: 561,
        y: 110,
        fontSize: 32,
        fontWeight: "bold",
        color: "#064e3b",
        align: "center",
        width: 1020,
    },
    {
        id: "subtitulo",
        label: "Subtítulo",
        content: "Certificamos que",
        x: 561,
        y: 250,
        fontSize: 16,
        fontWeight: "normal",
        color: "#6b7280",
        align: "center",
        width: 900,
    },
    {
        id: "nome",
        label: "Nome",
        content: "{{nome_participante}}",
        x: 561,
        y: 310,
        fontSize: 36,
        fontWeight: "bold",
        color: "#111827",
        align: "center",
        width: 900,
    },
    {
        id: "corpo",
        label: "Corpo",
        content: "participou da atividade {{nome_atividade}} no evento {{nome_evento}},\ncom carga horária de {{carga_horaria}}.",
        x: 561,
        y: 400,
        fontSize: 16,
        fontWeight: "normal",
        color: "#374151",
        align: "center",
        width: 860,
    },
    {
        id: "atividade",
        label: "Atividade",
        content: "Realizada em {{data_atividade}} das {{horario_atividade}}",
        x: 561,
        y: 480,
        fontSize: 14,
        fontWeight: "normal",
        color: "#6b7280",
        align: "center",
        width: 780,
    },
    {
        id: "rodape",
        label: "Rodapé",
        content: "Emitido em {{data_emissao}}",
        x: 561,
        y: 730,
        fontSize: 12,
        fontWeight: "normal",
        color: "#9ca3af",
        align: "center",
        width: 400,
    },
];

export function interpolate(text, data) {
    return Object.entries(data).reduce((acc, [k, v]) => acc.replaceAll(k, v), text);
}

function parseCarbonValue(value) {
    if (!value) return null;
    if (typeof value === "object" && value.date) return value.date;
    return String(value);
}

export function parseDate(value) {
    const str = parseCarbonValue(value);
    if (!str) return "";

    if (/^\d{2}\/\d{2}\/\d{4}/.test(str)) return str.split(" ")[0];

    if (/^\d{4}-\d{2}-\d{2}/.test(str)) {
        const [datePart] = str.split(/[T ]/);
        const [y, m, d] = datePart.split("-");
        return `${d}/${m}/${y}`;
    }

    return str;
}

export function parseHour(value) {
    const str = parseCarbonValue(value);
    if (!str) return "";

    if (/^\d{2}\/\d{2}\/\d{4} \d{2}:\d{2}/.test(str)) {
        return str.split(" ")[1].slice(0, 5);
    }

    const timePart = str.includes("T") ? str.split("T")[1] : str.split(" ")[1];
    if (timePart) return timePart.slice(0, 5);

    return "";
}

function defaultBackground() {
    const corners = [
        [32, 32],
        [CANVAS_W - 32, 32],
        [32, CANVAS_H - 32],
        [CANVAS_W - 32, CANVAS_H - 32],
    ]
        .map(
            ([cx, cy]) =>
                `<circle cx="${cx}" cy="${cy}" r="6" fill="none" stroke="#10b981" stroke-width="1.5"/>` +
                `<circle cx="${cx}" cy="${cy}" r="2" fill="#10b981"/>`
        )
        .join("");

    return `<rect width="${CANVAS_W}" height="${CANVAS_H}" fill="#f9fafb"/>
  <rect x="20" y="20" width="${CANVAS_W - 40}" height="${CANVAS_H - 40}" fill="none" stroke="#10b981" stroke-width="1.5" rx="4"/>
  <rect x="28" y="28" width="${CANVAS_W - 56}" height="${CANVAS_H - 56}" fill="none" stroke="#d1fae5" stroke-width="0.75" rx="2"/>
  <line x1="160" y1="190" x2="${CANVAS_W - 160}" y2="190" stroke="#d1fae5" stroke-width="1"/>
  <line x1="160" y1="560" x2="${CANVAS_W - 160}" y2="560" stroke="#d1fae5" stroke-width="1"/>
  ${corners}`;
}

export function buildSvgString(fields, data, bgDataUrl) {
    const esc = (t) => t.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
    const escAttr = (t) => String(t).replace(/&/g, "&amp;").replace(/"/g, "&quot;");
    const toFw = (fw) => (fw === "bold" ? "bold" : fw === "medium" ? "500" : "normal");

    const fieldsSvg = fields
        .map((f) => {
            const content = interpolate(f.content, data);
            const lines = content.split("\n");
            const lh = f.fontSize * 1.5;
            let ax = f.x,
                anchor = "middle";
            if (f.align === "left") {
                ax = f.x - f.width / 2;
                anchor = "start";
            }
            if (f.align === "right") {
                ax = f.x + f.width / 2;
                anchor = "end";
            }
            const tspans = lines.map((line, i) => `<tspan x="${ax}" dy="${i === 0 ? 0 : lh}">${esc(line)}</tspan>`).join("");
            return `<text x="${ax}" y="${f.y}" font-size="${f.fontSize}" font-weight="${toFw(f.fontWeight)}" fill="${f.color}" text-anchor="${anchor}" font-family="Georgia,'Times New Roman',serif">${tspans}</text>`;
        })
        .join("\n  ");

    const bgEl = bgDataUrl
        ? `<image href="${escAttr(bgDataUrl)}" x="0" y="0" width="${CANVAS_W}" height="${CANVAS_H}" preserveAspectRatio="xMidYMid slice"/>`
        : defaultBackground();

    return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${CANVAS_W} ${CANVAS_H}" width="${CANVAS_W}" height="${CANVAS_H}">
  ${bgEl}
  ${fieldsSvg}
</svg>`;
}

export function buildInlineSvg(fields, data, bgDataUrl) {
    return buildSvgString(fields, data, bgDataUrl).replace(
        /(<svg[^>]*)\s+width="\d+"(\s+height="\d+")?/,
        `$1 style="width:100%;display:block;aspect-ratio:${ASPECT}"`
    );
}

export function buildPreviewData(evento) {
    if (!evento) {
        return {
            "{{nome_participante}}": "Selena Gomez",
            "{{nome_evento}}": "Semana de Tecnologia 2026",
            "{{nome_atividade}}": "Palestra de Abertura",
            "{{data_atividade}}": "01/06/2026",
            "{{horario_atividade}}": "09:00",
            "{{carga_horaria}}": "2h",
            "{{data_emissao}}": new Date().toLocaleDateString("pt-BR"),
        };
    }

    const primeira = evento.atividades?.[0];
    let cargaFormatada = "0h";

    if (primeira?.data_inicio && primeira?.data_fim) {
        const diffMs = new Date(primeira.data_fim) - new Date(primeira.data_inicio);
        const diffMinutos = Math.floor(diffMs / 60000);
        const horas = Math.floor(diffMinutos / 60);
        const minutos = diffMinutos % 60;
        cargaFormatada = `${horas}h${minutos > 0 ? minutos + "min" : ""}`;
    }

    return {
        "{{nome_participante}}": "Nome do Participante",
        "{{nome_evento}}": evento.titulo,
        "{{nome_atividade}}": primeira?.titulo ?? "Atividade Exemplo",
        "{{data_atividade}}": primeira?.data_inicio ? new Date(primeira.data_inicio).toLocaleDateString("pt-BR") : "",
        "{{horario_atividade}}": `${parseHour(primeira?.data_inicio) || "14:00"} às ${parseHour(primeira?.data_fim) || "18:00"}`,
        "{{carga_horaria}}": cargaFormatada,
        "{{data_emissao}}": new Date().toLocaleDateString("pt-BR"),
    };
}

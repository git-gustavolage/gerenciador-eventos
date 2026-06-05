const TOKEN_PATTERNS = {
    YYYY: "(\\d{4})",
    MM: "(\\d{1,2})",
    DD: "(\\d{1,2})",
    HH: "(\\d{1,2})",
    ii: "(\\d{1,2})",
    ss: "(\\d{1,2})",
};

const TOKEN_REGEX = /(YYYY|MM|DD|HH|ii|ss)/g;

function getDaysInMonth(year, month) {
    return new Date(year, month, 0).getDate();
}

function normalizeFormat(format) {
    return format.replace(/HH:MM:ss/g, "HH:ii:ss");
}

export function formatDate(value, from = "YYYY-MM-DD", to = "DD/MM/YYYY") {
    from = normalizeFormat(from);
    to = normalizeFormat(to);

    if (value === null || value === undefined || value === "") {
        return "";
    }

    const normalized = String(value)
        .replace(/\u00A0/g, " ")
        .trim();

    const order = [];

    const regexStr = from.replace(TOKEN_REGEX, (token) => {
        order.push(token);
        return TOKEN_PATTERNS[token];
    });

    const regex = new RegExp(`^${regexStr}$`);
    const match = normalized.match(regex);

    if (!match) {
        return "";
    }

    const map = {};

    order.forEach((token, index) => {
        map[token] = match[index + 1];
    });

    const y = map.YYYY ? Number(map.YYYY) : 0;
    const m = map.MM ? Number(map.MM) : 0;
    let d = map.DD ? Number(map.DD) : 0;
    const h = map.HH ? Number(map.HH) : 0;
    const min = map.ii ? Number(map.ii) : 0;
    const s = map.ss ? Number(map.ss) : 0;

    if (
        (map.YYYY && Number.isNaN(y)) ||
        (map.MM && (Number.isNaN(m) || m < 1 || m > 12)) ||
        (map.DD && (Number.isNaN(d) || d < 1)) ||
        (map.HH && (Number.isNaN(h) || h < 0 || h > 23)) ||
        (map.ii && (Number.isNaN(min) || min < 0 || min > 59)) ||
        (map.ss && (Number.isNaN(s) || s < 0 || s > 59))
    ) {
        return "";
    }

    if (map.DD && map.MM && map.YYYY) {
        const maxDays = getDaysInMonth(y, m);

        if (d > maxDays) {
            d = maxDays;
        }
    }

    return to
        .replace("YYYY", map.YYYY ? String(y).padStart(4, "0") : "")
        .replace("MM", map.MM ? String(m).padStart(2, "0") : "")
        .replace("DD", map.DD ? String(d).padStart(2, "0") : "")
        .replace("HH", map.HH ? String(h).padStart(2, "0") : "")
        .replace("ii", map.ii ? String(min).padStart(2, "0") : "")
        .replace("ss", map.ss ? String(s).padStart(2, "0") : "");
}

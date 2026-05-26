export function maskCellphone(celular = "") {
    let celularFormatado = celular.replace(/\D/g, "");

    if (celularFormatado.length > 4 && celularFormatado.length < 9) {
        celularFormatado = celularFormatado.replace(/^(\d{4})(\d+)/, "$1-$2");
    } else if (celularFormatado.length >= 9 && celularFormatado.length < 11) {
        celularFormatado = celularFormatado.replace(/^(\d{2})(\d{4})(\d+)/, "($1) $2-$3");
    } else if (celularFormatado.length == 11) {
        celularFormatado = celularFormatado.replace(/^(\d{2})(\d{5})(\d{4})/, "($1) $2-$3");
    }

    return celularFormatado;
}

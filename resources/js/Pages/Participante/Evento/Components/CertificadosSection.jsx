export function CertificadosSection({ certificados = [] }) {
    return (
        <section className="bg-white border border-neutral-300 rounded-sm">
            <div className="p-5 border-b border-neutral-300">
                <h2 className="text-xl font-semibold text-neutral-800">Certificados</h2>

                <p className="text-sm text-neutral-500 mt-1">Certificados emitidos para este evento.</p>
            </div>

            <div className="p-8 text-center text-neutral-500">Nenhum certificado disponível.</div>
        </section>
    );
}

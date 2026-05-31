export default function InputImage({ preview, onChange }) {
    return (
        <label
            htmlFor="banner"
            className="flex min-h-56 w-full cursor-pointer flex-col items-center justify-center rounded-sm border-2 border-dashed border-neutral-300bg-neutral-50 transition hover:border-emerald-500 hover:bg-emerald-50/50"
        >
            {preview ? (
                <div className="relative h-full w-full">
                    <img src={preview} alt="Banner do evento" className="h-56 w-full rounded-sm object-cover" />

                    <div className="absolute inset-0 flex items-center justify-center bg-black/40 opacity-0 transition hover:opacity-100">
                        <span className="text-sm font-medium text-white">Alterar imagem</span>
                    </div>
                </div>
            ) : (
                <>
                    <ImageIcon size={40} className="mb-3 text-neutral-400" />

                    <p className="font-medium text-neutral-800">Clique para selecionar uma imagem</p>

                    <p className="mt-1 text-sm text-neutral-500">PNG, JPG ou WEBP</p>
                </>
            )}

            <input id="banner" type="file" accept="image/png,image/jpeg,image/webp" className="hidden" onChange={onChange} />
        </label>
    );
}

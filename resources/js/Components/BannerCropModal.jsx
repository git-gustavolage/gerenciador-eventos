import { useCallback, useEffect, useMemo, useState } from "react";
import Cropper from "react-easy-crop";
import Modal from "@/Components/Modal";
import PrimaryButton from "@/Components/PrimaryButton";
import SecondaryButton from "@/Components/SecondaryButton";

export default function BannerCropModal({ show, file, onClose, onConfirm }) {
    const [crop, setCrop] = useState({ x: 0, y: 0 });
    const [zoom, setZoom] = useState(1);
    const [croppedAreaPixels, setCroppedAreaPixels] = useState(null);
    const [loading, setLoading] = useState(false);

    const imageUrl = useMemo(() => {
        if (!file) return null;

        return URL.createObjectURL(file);
    }, [file]);

    useEffect(() => {
        return () => {
            if (imageUrl) {
                URL.revokeObjectURL(imageUrl);
            }
        };
    }, [imageUrl]);

    useEffect(() => {
        if (!show) {
            setCrop({ x: 0, y: 0 });
            setZoom(1);
            setCroppedAreaPixels(null);
            setLoading(false);
        }
    }, [show]);

    const handleCropComplete = useCallback((_, croppedPixels) => {
        setCroppedAreaPixels(croppedPixels);
    }, []);

    const handleConfirm = async () => {
        if (!imageUrl || !croppedAreaPixels || loading) return;

        setLoading(true);

        try {
            const croppedFile = await createCroppedFile(imageUrl, croppedAreaPixels);

            onConfirm?.(croppedFile);
        } finally {
            setLoading(false);
        }
    };

    return (
        <Modal show={show} onClose={onClose}>
            <div className="w-full bg-white rounded-sm">
                <div className="pb-4 border-b border-neutral-300">
                    <h2 className="text-xl font-semibold text-neutral-800">Ajustar banner</h2>

                    <p className="text-sm text-neutral-500 mt-1">
                        Arraste a imagem e utilize o zoom para definir o enquadramento do banner.
                    </p>
                </div>

                <div className="p-2">
                    <div className="relative w-full aspect-video bg-neutral-900 rounded-sm overflow-hidden">
                        {imageUrl && (
                            <Cropper
                                image={imageUrl}
                                crop={crop}
                                zoom={zoom}
                                aspect={16 / 9}
                                showGrid={true}
                                cropShape="rect"
                                objectFit="contain"
                                onCropChange={setCrop}
                                onZoomChange={setZoom}
                                onCropComplete={handleCropComplete}
                            />
                        )}
                    </div>

                    <div className="mt-6 space-y-2">
                        <div className="flex items-center justify-between text-sm text-neutral-600">
                            <span>Zoom</span>
                            <span>{zoom.toFixed(1)}x</span>
                        </div>

                        <input
                            type="range"
                            min={1}
                            max={4}
                            step={0.1}
                            value={zoom}
                            onChange={(e) => setZoom(Number(e.target.value))}
                            className="w-full"
                        />
                    </div>
                </div>

                <div className="flex items-center justify-start gap-4 pt-4 border-t border-neutral-300">
                    <PrimaryButton onClick={handleConfirm} disabled={loading}>
                        {loading ? "Processando..." : "Aplicar"}
                    </PrimaryButton>

                    <SecondaryButton onClick={onClose}>Cancelar</SecondaryButton>
                </div>
            </div>
        </Modal>
    );
}

async function createCroppedFile(imageSrc, crop) {
    const image = await loadImage(imageSrc);

    const canvas = document.createElement("canvas");
    const context = canvas.getContext("2d");

    canvas.width = crop.width;
    canvas.height = crop.height;

    context.drawImage(image, crop.x, crop.y, crop.width, crop.height, 0, 0, crop.width, crop.height);

    return new Promise((resolve, reject) => {
        canvas.toBlob(
            (blob) => {
                if (!blob) {
                    reject(new Error("Falha ao gerar imagem."));
                    return;
                }

                const file = new File([blob], `banner-${Date.now()}.jpg`, {
                    type: "image/jpeg",
                });

                resolve(file);
            },
            "image/jpeg",
            0.95
        );
    });
}

function loadImage(src) {
    return new Promise((resolve, reject) => {
        const image = new Image();

        image.onload = () => resolve(image);
        image.onerror = reject;
        image.src = src;
    });
}

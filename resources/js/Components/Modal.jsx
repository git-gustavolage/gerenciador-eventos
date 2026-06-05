import { Dialog, DialogPanel, Transition, TransitionChild } from "@headlessui/react";
import { XIcon } from "@phosphor-icons/react";

export default function Modal({
    children,
    show = false,
    maxWidth = "2xl",
    closeable = true,
    onClose = () => {},
    center = false,
}) {
    const close = () => {
        if (closeable) {
            onClose();
        }
    };

    const maxWidthClass = {
        sm: "max-w-sm",
        md: "max-w-md",
        lg: "max-w-lg",
        xl: "max-w-xl",
        "2xl": "max-w-2xl",
        "4xl": "max-w-4xl",
    }[maxWidth];

    return (
        <Transition show={show} leave="duration-200">
            <Dialog
                as="div"
                id="modal"
                className={
                    "fixed inset-0 z-50 flex transform overflow-y-auto px-4 py-6 transition-all justify-center " +
                    (center ? "items-center" : "items-start")
                }
                onClose={close}
            >
                <TransitionChild
                    enter="ease-out duration-300"
                    enterFrom="opacity-0"
                    enterTo="opacity-100"
                    leave="ease-in duration-200"
                    leaveFrom="opacity-100"
                    leaveTo="opacity-0"
                >
                    <div className="absolute inset-0 bg-black/50" />
                </TransitionChild>

                <TransitionChild
                    enter="ease-out duration-300"
                    enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
                    enterTo="opacity-100 translate-y-0 sm:scale-100"
                    leave="ease-in duration-200"
                    leaveFrom="opacity-100 translate-y-0 sm:scale-100"
                    leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
                >
                    <DialogPanel
                        className={`${center ? "" : "mt-12"} w-full mb-6 transform overflow-hidden rounded-sm bg-white shadow-xl transition-all sm:mx-auto relative ${maxWidthClass}`}
                    >
                        <button
                            onClick={onClose}
                            className="z-10 absolute top-3 right-3 transition-colors text-neutral-400 group-hover:opacity-100 hover:bg-neutral-100 hover:text-neutral-600 p-2 rounded-sm"
                        >
                            <XIcon size={20} />
                        </button>

                        {show && <div className="p-5">{children}</div>}
                    </DialogPanel>
                </TransitionChild>
            </Dialog>
        </Transition>
    );
}

export function Container({ children }) {
    return (
        <div className="w-full flex flex-col items-center justify-center gap-8">
            {children}
        </div>
    );
}

export default function LoadingSpinner({ size = 'md', fullScreen = false }) {
    const sizes = {
        sm: 'h-4 w-4',
        md: 'h-8 w-8',
        lg: 'h-12 w-12',
        xl: 'h-16 w-16'
    };

    const spinner = (
        <div className="flex items-center justify-center">
            <div className={`${sizes[size]} animate-spin rounded-full border-4 border-gray-200 border-t-primary-600`}></div>
        </div>
    );

    if (fullScreen) {
        return (
            <div className="fixed inset-0 bg-white/80 backdrop-blur-sm flex items-center justify-center z-50">
                {spinner}
            </div>
        );
    }

    return spinner;
}
import { DotLottieReact } from "@lottiefiles/dotlottie-react";

export default function Loading() {
    return (
        <div className="fixed inset-0 z-[9999] bg-slate-950 flex flex-col items-center justify-center overflow-hidden px-4">

            {/* Background glow */}
            <div className="absolute w-64 h-64 sm:w-72 sm:h-72 bg-cyan-500/20 blur-3xl rounded-full" />

            {/* Animation */}
            <div className="relative z-10 w-[260px] sm:w-80 md:w-96 max-w-[90vw]">
                <DotLottieReact
                    src="https://lottie.host/b6396662-20c1-473c-ad53-55cfddee6188/461ZHJ87pz.lottie"
                    loop
                    autoplay
                />
            </div>

        </div>
    );
}
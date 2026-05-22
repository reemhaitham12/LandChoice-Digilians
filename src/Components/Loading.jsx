import { DotLottieReact } from "@lottiefiles/dotlottie-react";

export default function Loading() {
    return (
        <div className="fixed inset-0 bg-slate-950 flex flex-col items-center justify-center overflow-hidden">

            {/* Background glow */}
            <div className="absolute w-72 h-72 bg-cyan-500/20 blur-3xl rounded-full" />

            {/* Animation */}
            <div className="relative z-10 w-72 sm:w-96">
                <DotLottieReact
                    src="https://lottie.host/b6396662-20c1-473c-ad53-55cfddee6188/461ZHJ87pz.lottie"
                    loop
                    autoplay
                />
            </div>

        </div>
    );
}
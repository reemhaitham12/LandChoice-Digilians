import { Link } from "react-router-dom";
import { DotLottieReact } from "@lottiefiles/dotlottie-react";

export default function NotFound() {
    return (
        <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center px-6 text-center overflow-hidden">

            {/* Background glow */}
            <div className="absolute w-96 h-96 bg-blue-500/20 blur-3xl rounded-full" />
            <div className="absolute bottom-10 right-10 w-72 h-72 bg-cyan-500/10 blur-3xl rounded-full" />

            {/* 404 */}
            <div className="relative z-10 flex items-center justify-center gap-0">
                <span className="text-[8rem] sm:text-[12rem] md:text-[15rem] font-black text-white leading-none">
                    4
                </span>

                <div className="w-40 sm:w-56 md:w-72 -mx-8 sm:-mx-12 md:-mx-16">
                    <DotLottieReact
                        src="https://lottie.host/b6396662-20c1-473c-ad53-55cfddee6188/461ZHJ87pz.lottie"
                        loop
                        autoplay
                    />
                </div>

                <span className="text-[8rem] sm:text-[12rem] md:text-[15rem] font-black text-white leading-none">
                    4
                </span>
            </div>

            <h1 className="relative z-10 mt-4 text-2xl sm:text-4xl font-bold text-white">
                Oops! You’re off the map
            </h1>

            <p className="relative z-10 mt-3 max-w-md text-slate-400">
                The destination you’re looking for doesn’t exist or may have changed route.
            </p>

            <Link
                to="/"
                className="relative z-10 mt-8 px-8 py-3 rounded-2xl bg-blue-500 text-white font-bold hover:bg-blue-400 hover:scale-105 transition-all shadow-[0_0_25px_rgba(59,130,246,0.35)]"
            >
                Back to Home
            </Link>
        </div>
    );
}
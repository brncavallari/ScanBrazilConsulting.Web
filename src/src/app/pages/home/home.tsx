import React, { useEffect, useState, useRef } from "react";
import Navbar from "@components/navbar/navbar";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa6";

const CAROUSEL_IMAGES = [
    { id: 1, url: "/images/foto1.jpeg", title: "Confraternização 2024" },
    { id: 2, url: "/images/foto2.jpeg", title: "Confraternização 2024" },
    { id: 3, url: "/images/foto3.jpeg", title: "Confraternização 2024" },
    { id: 4, url: "/images/foto4.jpeg", title: "Confraternização 2024" },
    { id: 5, url: "/images/foto5.jpeg", title: "Almoço" },
];

const AUTOPLAY_INTERVAL = 3000;

const Home: React.FC = () => {
    const [index, setIndex] = useState(1);
    const [transitionEnabled, setTransitionEnabled] = useState(true);

    const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

    const slides = [
        CAROUSEL_IMAGES[CAROUSEL_IMAGES.length - 1],
        ...CAROUSEL_IMAGES,
        CAROUSEL_IMAGES[0],
    ];

    const clearAutoplay = () => {
        if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };

    const startAutoplay = () => {
        clearAutoplay();
        timeoutRef.current = setTimeout(() => {
            setIndex((i) => i + 1);
        }, AUTOPLAY_INTERVAL);
    };

    const pauseAutoplay = () => {
        clearAutoplay();
    };

    useEffect(() => {
        if (!document.hidden) startAutoplay();
        return clearAutoplay;
    }, [index]);

    useEffect(() => {
        const onVisibilityChange = () => {
            if (document.hidden) {
                pauseAutoplay();
            } else {
                startAutoplay();
            }
        };

        document.addEventListener("visibilitychange", onVisibilityChange);

        return () =>
            document.removeEventListener("visibilitychange", onVisibilityChange);
    }, []);

    const handleTransitionEnd = () => {
        if (index === slides.length - 1) {
            setTransitionEnabled(false);
            setIndex(1);
        } else if (index === 0) {
            setTransitionEnabled(false);
            setIndex(slides.length - 2);
        }
    };

    useEffect(() => {
        if (!transitionEnabled) {
            const id = setTimeout(() => {
                setTransitionEnabled(true);
            }, 30);
            return () => clearTimeout(id);
        }
    }, [transitionEnabled]);

    const goToSlide = (slideIndex: number) => {
        setIndex(slideIndex + 1);
    };

    return (
        <div className="min-h-screen bg-gray-900 flex flex-col font-sans bg-gradient-to-br from-gray-700 via-gray-900 to-black">
            <Navbar />

            <div className="absolute inset-0 overflow-hidden">
                <div className="absolute -top-40 -right-40 w-80 h-80 bg-red-500/10 rounded-full blur-3xl"></div>
                <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-blue-400/10 rounded-full blur-3xl"></div>
            </div>

            <main className="flex-1 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 mt-16 w-full">
                <div className="bg-gray-800 rounded-xl shadow-2xl p-8 border border-gray-700">
                    <div className="relative w-full overflow-hidden rounded-xl shadow-xl group h-[600px]">

                        <div
                            style={{
                                display: "flex",
                                width: `${slides.length * 100}%`,
                                transform: `translateX(-${index * (100 / slides.length)}%)`,
                                transition: transitionEnabled ? "transform 0.7s ease-in-out" : "none",
                            }}
                            onTransitionEnd={handleTransitionEnd}
                        >
                            {slides.map((slide, i) => (
                                <div
                                    key={i}
                                    className="w-full h-[600px] flex-shrink-0 relative"
                                    style={{ width: `${100 / slides.length}%` }}
                                >
                                    <img
                                        src={slide.url}
                                        className="w-full h-full object-cover"
                                        alt={slide.title}
                                        onError={(e) => {
                                            (e.target as HTMLImageElement).src =
                                                "https://placehold.co/1200x400/94a3b8/0f172a?text=Imagem+Indisponível";
                                        }}
                                    />

                                    <div className="absolute bottom-0 left-0 right-0 bg-black/40 p-4">
                                        <h3 className="text-xl font-bold text-white">
                                            {slide.title}
                                        </h3>
                                    </div>
                                </div>
                            ))}
                        </div>

                        <button
                            onClick={() => setIndex((i) => i - 1)}
                            className="absolute top-1/2 left-4 -translate-y-1/2 p-3 bg-black/40 text-white rounded-full opacity-0 group-hover:opacity-100 transition"
                        >
                            <FaChevronLeft className="w-6 h-6" />
                        </button>

                        <button
                            onClick={() => setIndex((i) => i + 1)}
                            className="absolute top-1/2 right-4 -translate-y-1/2 p-3 bg-black/40 text-white rounded-full opacity-0 group-hover:opacity-100 transition"
                        >
                            <FaChevronRight className="w-6 h-6" />
                        </button>

                        <div className="absolute bottom-4 left-0 right-0 flex justify-center gap-2">
                            {CAROUSEL_IMAGES.map((_, i) => (
                                <button
                                    key={i}
                                    onClick={() => goToSlide(i)}
                                    className={`w-3 h-3 rounded-full transition ${i === (index - 1 + CAROUSEL_IMAGES.length) %
                                        CAROUSEL_IMAGES.length
                                        ? "bg-white scale-110"
                                        : "bg-gray-400 opacity-60"
                                        }`}
                                />
                            ))}
                        </div>
                    </div>

                </div>
            </main>
        </div>
    );
};

export default Home;

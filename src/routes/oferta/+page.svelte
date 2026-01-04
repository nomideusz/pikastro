<script lang="ts">
    import "../../app.css";

    // Import color extraction utilities
    import {
        extractColorsFromImage,
        assignColorRoles,
        type ColorPalette,
    } from "$lib/utils/colorExtractor";
    import colorsImg from "$lib/assets/images/colors.jpeg";
    import { t, localeStore, getLocale } from "$lib/i18n";
    import EditableText from "$lib/components/EditableText.svelte";

    // Color palette extracted from colors image - Eclectic Maximalism
    let colorPalette = $state<ColorPalette>({
        primary: "#27275B", // Deep Navy Blue
        accent: "#F32A61", // Hot Magenta
        secondary: "#1DA898", // Turquoise
        success: "#F2A23E", // Golden Orange
        tertiary: "#F5848E", // Coral Pink
    });

    // Reactive translation function
    let currentLocale = $state(getLocale());

    // Subscribe to locale changes
    $effect(() => {
        const unsubscribe = localeStore.subscribe(() => {
            currentLocale = getLocale();
        });
        return unsubscribe;
    });

    // Translate function that reacts to locale changes
    function translate(key: string): string {
        void currentLocale; // Access to create reactive dependency
        return t(key);
    }

    // Helper function to convert hex to RGB
    function hexToRgb(hex: string): string {
        const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
        return result
            ? `${parseInt(result[1], 16)}, ${parseInt(result[2], 16)}, ${parseInt(result[3], 16)}`
            : "39, 39, 91";
    }

    // Extract colors from the colors image on mount
    $effect(() => {
        extractColorsFromImage(colorsImg, 5)
            .then((colors) => {
                if (colors.length > 0) {
                    const roles = assignColorRoles(colors);
                    colorPalette = roles;

                    // Apply colors as CSS variables
                    const root = document.documentElement.style;
                    root.setProperty("--color-primary", colorPalette.primary);
                    root.setProperty("--color-accent", colorPalette.accent);
                    root.setProperty(
                        "--color-secondary",
                        colorPalette.secondary,
                    );
                    root.setProperty("--color-success", colorPalette.success);
                    root.setProperty("--color-tertiary", colorPalette.tertiary);

                    // Also set RGB values for opacity support
                    root.setProperty(
                        "--color-primary-rgb",
                        hexToRgb(colorPalette.primary),
                    );
                    root.setProperty(
                        "--color-accent-rgb",
                        hexToRgb(colorPalette.accent),
                    );
                    root.setProperty(
                        "--color-secondary-rgb",
                        hexToRgb(colorPalette.secondary),
                    );
                }
            })
            .catch((error) => {
                console.warn("Could not extract colors from image:", error);
            });
    });

    $effect(() => {
        // Add scroll animations
        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        entry.target.classList.add("animate-fade-in-up");
                    }
                });
            },
            { threshold: 0.1 },
        );

        document
            .querySelectorAll(".observe")
            .forEach((el) => observer.observe(el));

        return () => observer.disconnect();
    });
</script>

<svelte:head>
    <title>{translate("nav.offer")} - Pikastro</title>
    <meta name="description" content={translate("home.services.description")} />
</svelte:head>

<!-- Hero Section -->
<section
    class="relative min-h-[70vh] flex items-center gradient-bg text-white overflow-hidden"
>
    <!-- Animated AI Network Background -->
    <div class="absolute inset-0">
        <!-- AI Neural Network Lines -->
        <svg
            class="absolute inset-0 w-full h-full opacity-20"
            xmlns="http://www.w3.org/2000/svg"
        >
            <!-- Animated connecting lines -->
            <line
                x1="10%"
                y1="20%"
                x2="30%"
                y2="40%"
                stroke={colorPalette.accent}
                stroke-width="2"
                class="animate-pulse-slow"
            />
            <line
                x1="30%"
                y1="40%"
                x2="50%"
                y2="30%"
                stroke={colorPalette.secondary}
                stroke-width="2"
                class="animate-pulse-slow"
                style="animation-delay: 0.5s"
            />
            <line
                x1="50%"
                y1="30%"
                x2="70%"
                y2="50%"
                stroke={colorPalette.primary}
                stroke-width="2"
                class="animate-pulse-slow"
                style="animation-delay: 1s"
            />
            <line
                x1="70%"
                y1="50%"
                x2="90%"
                y2="35%"
                stroke={colorPalette.accent}
                stroke-width="2"
                class="animate-pulse-slow"
                style="animation-delay: 1.5s"
            />
        </svg>
    </div>

    <!-- Floating gradient blobs -->
    <div
        class="absolute top-20 right-20 w-72 h-72 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-pulse-slow"
        style="background-color: {colorPalette.accent}"
    ></div>
    <div
        class="absolute bottom-20 left-20 w-96 h-96 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-pulse-slow"
        style="background-color: {colorPalette.primary}; animation-delay: 1s;"
    ></div>

    <div class="section relative z-10">
        <div class="max-w-4xl">
            <div class="mb-8 observe">
                <p
                    class="font-bold tracking-[0.3em] uppercase text-sm mb-6 animate-pulse-slow neon-text"
                    style="color: {colorPalette.accent}"
                >
                    <EditableText key="home.services.label" tag="span" />
                </p>
                <h1
                    class="text-4xl md:text-6xl lg:text-7xl font-black mb-6 leading-tight"
                    style="font-family: 'Playfair Display', serif;"
                >
                    <EditableText key="home.services.heading" tag="span" /><br
                    />
                    <span style="color: #1DA898;"
                        ><EditableText
                            key="home.services.headingAccent"
                            tag="span"
                        /></span
                    >
                </h1>
                <p
                    class="text-xl md:text-2xl font-bold mb-4 text-white/90 leading-tight"
                >
                    <EditableText key="home.services.tagline" tag="span" />
                </p>
                <p
                    class="text-lg md:text-xl mb-8 max-w-2xl leading-relaxed text-gray-100"
                >
                    <EditableText key="home.services.description" tag="span" />
                </p>
            </div>
        </div>
    </div>
</section>

<!-- Services Section -->
<section class="w-full bg-white relative overflow-hidden">
    <div
        class="absolute top-10 left-5 w-32 h-32 md:top-20 md:left-20 md:w-64 md:h-64 rounded-full filter blur-3xl opacity-25 animate-pulse-slow"
        style="background-color: {colorPalette.secondary};"
    ></div>
    <div
        class="absolute bottom-10 right-5 w-36 h-36 md:bottom-20 md:right-20 md:w-72 md:h-72 rounded-full filter blur-3xl opacity-20 animate-pulse-slow"
        style="background-color: {colorPalette.success}; animation-delay: 1s;"
    ></div>

    <div class="section">
        <div
            class="grid md:grid-cols-2 gap-10 md:gap-8 lg:gap-12 relative z-10"
        >
            <!-- Interior Design Service -->
            <div
                role="article"
                class="bg-white p-10 lg:p-12 hover-lift observe group border-2 border-blue-100 rounded-2xl hover:shadow-2xl transition-all duration-500"
                style="animation-delay: 0ms; border-color: rgb(243, 244, 246);"
                onmouseenter={(e) => {
                    e.currentTarget.style.borderColor = colorPalette.accent;
                    e.currentTarget.style.boxShadow = `0 25px 50px -12px rgba(var(--color-accent-rgb, 251, 113, 133), 0.2)`;
                }}
                onmouseleave={(e) => {
                    e.currentTarget.style.borderColor = "rgb(243, 244, 246)";
                    e.currentTarget.style.boxShadow =
                        "0 20px 25px -5px rgba(0, 0, 0, 0.1)";
                }}
            >
                <div class="mb-8">
                    <div
                        class="text-6xl font-light transition-all duration-500 transform group-hover:scale-110 group-hover:rotate-12"
                        style="font-family: 'Playfair Display', serif; color: {colorPalette.primary}"
                    >
                        ■
                    </div>
                </div>
                <h3
                    class="text-3xl lg:text-4xl font-black mb-4 text-[#27275b] transition-colors"
                    style="font-family: 'Playfair Display', serif;"
                    onmouseenter={(e) =>
                        (e.currentTarget.style.color = colorPalette.primary)}
                    onmouseleave={(e) =>
                        (e.currentTarget.style.color = "#27275b")}
                >
                    <EditableText
                        key="services.interiorDesign.title"
                        tag="span"
                    />
                </h3>
                <p class="text-[#27275b]/80 mb-8 leading-relaxed">
                    <EditableText key="services.interiorDesign.description" />
                </p>
                <ul class="space-y-3">
                    <li class="flex items-start text-[#27275b]/90">
                        <span
                            class="w-1.5 h-1.5 bg-[#10B981] mt-2.5 mr-3 flex-shrink-0"
                        ></span>
                        <span class="text-sm"
                            ><EditableText
                                key="services.interiorDesign.feature1"
                                tag="span"
                            /></span
                        >
                    </li>
                    <li class="flex items-start text-[#27275b]/90">
                        <span
                            class="w-1.5 h-1.5 bg-[#10B981] mt-2.5 mr-3 flex-shrink-0"
                        ></span>
                        <span class="text-sm"
                            ><EditableText
                                key="services.interiorDesign.feature2"
                                tag="span"
                            /></span
                        >
                    </li>
                    <li class="flex items-start text-[#27275b]/90">
                        <span
                            class="w-1.5 h-1.5 bg-[#10B981] mt-2.5 mr-3 flex-shrink-0"
                        ></span>
                        <span class="text-sm"
                            ><EditableText
                                key="services.interiorDesign.feature3"
                                tag="span"
                            /></span
                        >
                    </li>
                    <li class="flex items-start text-[#27275b]/90">
                        <span
                            class="w-1.5 h-1.5 bg-[#10B981] mt-2.5 mr-3 flex-shrink-0"
                        ></span>
                        <span class="text-sm"
                            ><EditableText
                                key="services.interiorDesign.feature4"
                                tag="span"
                            /></span
                        >
                    </li>
                    <li class="flex items-start text-[#27275b]/90">
                        <span
                            class="w-1.5 h-1.5 bg-[#10B981] mt-2.5 mr-3 flex-shrink-0"
                        ></span>
                        <span class="text-sm"
                            ><EditableText
                                key="services.interiorDesign.feature5"
                                tag="span"
                            /></span
                        >
                    </li>
                </ul>
            </div>

            <!-- Graphic Design Service -->
            <div
                role="article"
                class="bg-white p-10 lg:p-12 hover-lift observe group border-2 border-blue-100 rounded-2xl hover:shadow-2xl transition-all duration-500"
                style="animation-delay: 100ms; border-color: rgb(243, 244, 246);"
                onmouseenter={(e) => {
                    e.currentTarget.style.borderColor = colorPalette.accent;
                    e.currentTarget.style.boxShadow = `0 25px 50px -12px rgba(var(--color-accent-rgb, 251, 113, 133), 0.2)`;
                }}
                onmouseleave={(e) => {
                    e.currentTarget.style.borderColor = "rgb(243, 244, 246)";
                    e.currentTarget.style.boxShadow =
                        "0 20px 25px -5px rgba(0, 0, 0, 0.1)";
                }}
            >
                <div class="mb-8">
                    <div
                        class="text-6xl font-light transition-all duration-500 transform group-hover:scale-110 group-hover:rotate-12"
                        style="font-family: 'Playfair Display', serif; color: {colorPalette.primary}"
                    >
                        ○
                    </div>
                </div>
                <h3
                    class="text-3xl lg:text-4xl font-black mb-4 text-[#27275b] transition-colors"
                    style="font-family: 'Playfair Display', serif;"
                    onmouseenter={(e) =>
                        (e.currentTarget.style.color = colorPalette.primary)}
                    onmouseleave={(e) =>
                        (e.currentTarget.style.color = "#27275b")}
                >
                    <EditableText
                        key="services.graphicDesign.title"
                        tag="span"
                    />
                </h3>
                <p class="text-[#27275b]/80 mb-8 leading-relaxed">
                    <EditableText key="services.graphicDesign.description" />
                </p>
                <ul class="space-y-3">
                    <li class="flex items-start text-[#27275b]/90">
                        <span
                            class="w-1.5 h-1.5 bg-[#10B981] mt-2.5 mr-3 flex-shrink-0"
                        ></span>
                        <span class="text-sm"
                            ><EditableText
                                key="services.graphicDesign.feature1"
                                tag="span"
                            /></span
                        >
                    </li>
                    <li class="flex items-start text-[#27275b]/90">
                        <span
                            class="w-1.5 h-1.5 bg-[#10B981] mt-2.5 mr-3 flex-shrink-0"
                        ></span>
                        <span class="text-sm"
                            ><EditableText
                                key="services.graphicDesign.feature2"
                                tag="span"
                            /></span
                        >
                    </li>
                    <li class="flex items-start text-[#27275b]/90">
                        <span
                            class="w-1.5 h-1.5 bg-[#10B981] mt-2.5 mr-3 flex-shrink-0"
                        ></span>
                        <span class="text-sm"
                            ><EditableText
                                key="services.graphicDesign.feature3"
                                tag="span"
                            /></span
                        >
                    </li>
                    <li class="flex items-start text-[#27275b]/90">
                        <span
                            class="w-1.5 h-1.5 bg-[#10B981] mt-2.5 mr-3 flex-shrink-0"
                        ></span>
                        <span class="text-sm"
                            ><EditableText
                                key="services.graphicDesign.feature4"
                                tag="span"
                            /></span
                        >
                    </li>
                </ul>
            </div>

            <!-- AI Technology Service -->
            <div
                role="article"
                class="bg-white p-10 lg:p-12 hover-lift observe group border-2 border-blue-100 rounded-2xl hover:shadow-2xl transition-all duration-500"
                style="animation-delay: 200ms; border-color: rgb(243, 244, 246);"
                onmouseenter={(e) => {
                    e.currentTarget.style.borderColor = colorPalette.accent;
                    e.currentTarget.style.boxShadow = `0 25px 50px -12px rgba(var(--color-accent-rgb, 251, 113, 133), 0.2)`;
                }}
                onmouseleave={(e) => {
                    e.currentTarget.style.borderColor = "rgb(243, 244, 246)";
                    e.currentTarget.style.boxShadow =
                        "0 20px 25px -5px rgba(0, 0, 0, 0.1)";
                }}
            >
                <div class="mb-8">
                    <div
                        class="text-6xl font-light transition-all duration-500 transform group-hover:scale-110 group-hover:rotate-12"
                        style="font-family: 'Playfair Display', serif; color: {colorPalette.primary}"
                    >
                        △
                    </div>
                </div>
                <h3
                    class="text-3xl lg:text-4xl font-black mb-4 text-[#27275b] transition-colors"
                    style="font-family: 'Playfair Display', serif;"
                    onmouseenter={(e) =>
                        (e.currentTarget.style.color = colorPalette.primary)}
                    onmouseleave={(e) =>
                        (e.currentTarget.style.color = "#27275b")}
                >
                    <EditableText
                        key="services.aiTechnology.title"
                        tag="span"
                    />
                </h3>
                <p class="text-[#27275b]/80 mb-8 leading-relaxed">
                    <EditableText key="services.aiTechnology.description" />
                </p>
                <ul class="space-y-3">
                    <li class="flex items-start text-[#27275b]/90">
                        <span
                            class="w-1.5 h-1.5 bg-[#10B981] mt-2.5 mr-3 flex-shrink-0"
                        ></span>
                        <span class="text-sm"
                            ><EditableText
                                key="services.aiTechnology.feature1"
                                tag="span"
                            /></span
                        >
                    </li>
                    <li class="flex items-start text-[#27275b]/90">
                        <span
                            class="w-1.5 h-1.5 bg-[#10B981] mt-2.5 mr-3 flex-shrink-0"
                        ></span>
                        <span class="text-sm"
                            ><EditableText
                                key="services.aiTechnology.feature2"
                                tag="span"
                            /></span
                        >
                    </li>
                    <li class="flex items-start text-[#27275b]/90">
                        <span
                            class="w-1.5 h-1.5 bg-[#10B981] mt-2.5 mr-3 flex-shrink-0"
                        ></span>
                        <span class="text-sm"
                            ><EditableText
                                key="services.aiTechnology.feature3"
                                tag="span"
                            /></span
                        >
                    </li>
                    <li class="flex items-start text-[#27275b]/90">
                        <span
                            class="w-1.5 h-1.5 bg-[#10B981] mt-2.5 mr-3 flex-shrink-0"
                        ></span>
                        <span class="text-sm"
                            ><EditableText
                                key="services.aiTechnology.feature4"
                                tag="span"
                            /></span
                        >
                    </li>
                </ul>
            </div>

            <!-- Developers/Real Estate Service -->
            <div
                role="article"
                class="bg-white p-10 lg:p-12 hover-lift observe group border-2 border-blue-100 rounded-2xl hover:shadow-2xl transition-all duration-500"
                style="animation-delay: 300ms; border-color: rgb(243, 244, 246);"
                onmouseenter={(e) => {
                    e.currentTarget.style.borderColor = colorPalette.accent;
                    e.currentTarget.style.boxShadow = `0 25px 50px -12px rgba(var(--color-accent-rgb, 251, 113, 133), 0.2)`;
                }}
                onmouseleave={(e) => {
                    e.currentTarget.style.borderColor = "rgb(243, 244, 246)";
                    e.currentTarget.style.boxShadow =
                        "0 20px 25px -5px rgba(0, 0, 0, 0.1)";
                }}
            >
                <div class="mb-8">
                    <div
                        class="text-6xl font-light transition-all duration-500 transform group-hover:scale-110 group-hover:rotate-12"
                        style="font-family: 'Playfair Display', serif; color: {colorPalette.primary}"
                    >
                        ◆
                    </div>
                </div>
                <h3
                    class="text-3xl lg:text-4xl font-black mb-4 text-[#27275b] transition-colors"
                    style="font-family: 'Playfair Display', serif;"
                    onmouseenter={(e) =>
                        (e.currentTarget.style.color = colorPalette.primary)}
                    onmouseleave={(e) =>
                        (e.currentTarget.style.color = "#27275b")}
                >
                    <EditableText
                        key="services.developersRealEstate.title"
                        tag="span"
                    />
                </h3>
                <p class="text-[#27275b]/80 mb-8 leading-relaxed">
                    <EditableText
                        key="services.developersRealEstate.description"
                    />
                </p>
                <ul class="space-y-3">
                    <li class="flex items-start text-[#27275b]/90">
                        <span
                            class="w-1.5 h-1.5 bg-[#10B981] mt-2.5 mr-3 flex-shrink-0"
                        ></span>
                        <span class="text-sm"
                            ><EditableText
                                key="services.developersRealEstate.feature1"
                                tag="span"
                            /></span
                        >
                    </li>
                    <li class="flex items-start text-[#27275b]/90">
                        <span
                            class="w-1.5 h-1.5 bg-[#10B981] mt-2.5 mr-3 flex-shrink-0"
                        ></span>
                        <span class="text-sm"
                            ><EditableText
                                key="services.developersRealEstate.feature2"
                                tag="span"
                            /></span
                        >
                    </li>
                    <li class="flex items-start text-[#27275b]/90">
                        <span
                            class="w-1.5 h-1.5 bg-[#10B981] mt-2.5 mr-3 flex-shrink-0"
                        ></span>
                        <span class="text-sm"
                            ><EditableText
                                key="services.developersRealEstate.feature3"
                                tag="span"
                            /></span
                        >
                    </li>
                    <li class="flex items-start text-[#27275b]/90">
                        <span
                            class="w-1.5 h-1.5 bg-[#10B981] mt-2.5 mr-3 flex-shrink-0"
                        ></span>
                        <span class="text-sm"
                            ><EditableText
                                key="services.developersRealEstate.feature4"
                                tag="span"
                            /></span
                        >
                    </li>
                </ul>
            </div>
        </div>

        <!-- CTA Section -->
        <div class="mt-16 text-center observe">
            <a
                href="/#kontakt"
                class="inline-flex items-center gap-3 px-8 py-4 rounded-xl border-2 text-white transition-all duration-300 font-bold text-sm transform hover:scale-110"
                style="background: linear-gradient(135deg, {colorPalette.secondary} 0%, {colorPalette.primary} 100%); border-color: {colorPalette.accent}; box-shadow: 0 10px 30px rgba(29, 168, 152, 0.5);"
            >
                <EditableText key="home.ctaBanner.button" tag="span" />
                <svg
                    class="w-4 h-4 transform group-hover:translate-x-1 transition-transform"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                >
                    <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        stroke-width="2"
                        d="M13 7l5 5m0 0l-5 5m5-5H6"
                    />
                </svg>
            </a>
        </div>
    </div>
</section>

import { useState } from "react";

function ResultPanel({
    result,
    error,
}) {

    const [copied, setCopied] =
        useState(false);


    // =========================================
    // WORD COUNT
    // =========================================

    const words =
        result?.trim()
            ? result
                .trim()
                .split(/\s+/)
                .filter(Boolean)
                .length
            : 0;


    const characters =
        result?.length || 0;


    // =========================================
    // COPY RESULT
    // =========================================

    const handleCopy = async () => {

        if (!result) {
            return;
        }


        try {

            await navigator.clipboard
                .writeText(result);


            setCopied(true);


            setTimeout(() => {

                setCopied(false);

            }, 1800);


        } catch (error) {

            console.error(
                "Unable to copy text:",
                error
            );

        }

    };


    // =========================================
    // DOWNLOAD RESULT
    // =========================================

    const handleDownload = () => {

        if (!result) {
            return;
        }


        const blob =
            new Blob(
                [result],
                {
                    type: "text/plain",
                }
            );


        const url =
            URL.createObjectURL(
                blob
            );


        const link =
            document.createElement(
                "a"
            );


        link.href = url;

        link.download =
            "humanized-text.txt";


        document.body.appendChild(
            link
        );


        link.click();


        document.body.removeChild(
            link
        );


        URL.revokeObjectURL(
            url
        );

    };


    return (

        <section className="result-panel">


            {/* =========================================
                PANEL HEADER
            ========================================= */}

            <div className="panel-header">

                <div className="panel-title">

                    <span className="panel-number">
                        02
                    </span>

                    <span>
                        HUMANIZED
                    </span>

                </div>


                <span className="panel-status">
                    OUTPUT
                </span>

            </div>


            {/* =========================================
                RESULT BODY
            ========================================= */}

            <div className="result-body">


                <div className="result-heading">

                    <span className="result-label">
                        HUMANIZED DOCUMENT
                    </span>

                    <span className="result-format">
                        OUTPUT / TEXT
                    </span>

                </div>


                {/* =====================================
                    RESULT PREVIEW
                ===================================== */}

                <div className="result-content">


                    {error ? (

                        <div className="result-error">

                            <div className="result-empty-mark">
                                !
                            </div>

                            <h3>
                                HUMANIZATION FAILED
                            </h3>

                            <p>
                                {error}
                            </p>

                        </div>

                    ) : result ? (

                        <div className="result-text">
                            {result}
                        </div>

                    ) : (

                        <div className="result-empty">

                            <div className="result-empty-mark">
                                +
                            </div>


                            <h3>
                                NO RESULT YET
                            </h3>


                            <p>
                                Your humanized text
                                will appear here.
                            </p>


                            <span className="result-hint">
                                PASTE TEXT →
                                HUMANIZE →
                                RESULT
                            </span>

                        </div>

                    )}

                </div>


                {/* =====================================
                    RESULT META
                ===================================== */}

                <div className="result-meta">

                    <div className="result-count">

                        <span>
                            {words} WORDS
                        </span>


                        <span className="meta-divider">
                            |
                        </span>


                        <span>
                            {characters}
                            {" "}
                            CHARACTERS
                        </span>

                    </div>


                    <span className="result-format-small">
                        UTF-8
                    </span>

                </div>


                {/* =====================================
                    ACTION BAR
                ===================================== */}

                <div className="result-footer">


                    <div className="result-actions">

                        <button
                            type="button"
                            className="result-button"
                            onClick={
                                handleCopy
                            }
                            disabled={
                                !result
                            }
                        >
                            {copied
                                ? "COPIED"
                                : "COPY"}
                        </button>


                        <button
                            type="button"
                            className="result-button"
                            onClick={
                                handleDownload
                            }
                            disabled={
                                !result
                            }
                        >
                            DOWNLOAD
                        </button>

                    </div>


                    {/* =================================
                        SYSTEM STATUS
                    ================================= */}

                    <div className="result-system">

                        <span className="system-dot"></span>


                        <span>

                            {error
                                ? "ERROR"
                                : result
                                    ? "OUTPUT READY"
                                    : "WAITING FOR INPUT"}

                        </span>


                        <span className="system-code">
                            OUTPUT_02
                        </span>

                    </div>


                </div>

            </div>

        </section>

    );

}

export default ResultPanel;

import { useMemo, useState } from "react";

function HumanizerEditor({
    onHumanize,
    isProcessing,
}) {

    const [text, setText] = useState("");

    const [style, setStyle] =
        useState("Natural");


    const maxCharacters = 5000;


    // =========================================
    // WORD COUNT
    // =========================================

    const words = useMemo(() => {

        if (!text.trim()) {
            return 0;
        }

        return text
            .trim()
            .split(/\s+/)
            .filter(Boolean)
            .length;

    }, [text]);


    const characters =
        text.length;


    // =========================================
    // HUMANIZE
    // =========================================

    const handleHumanize = () => {

        if (
            !text.trim() ||
            isProcessing
        ) {
            return;
        }


        onHumanize(
            text,
            style
        );
    };


    // =========================================
    // TEXT CHANGE
    // =========================================

    const handleTextChange = (
        event
    ) => {

        const value =
            event.target.value;


        if (
            value.length <=
            maxCharacters
        ) {

            setText(value);

        }

    };


    // =========================================
    // STYLES
    // =========================================

    const styles = [

        "Natural",

        "Balanced",

        "Academic",

        "Casual",

    ];


    return (

        <section className="humanizer-editor">


            {/* =========================================
                PANEL HEADER
            ========================================= */}

            <div className="panel-header">

                <div className="panel-title">

                    <span className="panel-number">
                        01
                    </span>

                    <span>
                        YOUR TEXT
                    </span>

                </div>


                <span className="panel-status">
                    INPUT
                </span>

            </div>


            {/* =========================================
                EDITOR BODY
            ========================================= */}

            <div className="editor-body">


                <div className="editor-heading">

                    <span className="editor-label">
                        ORIGINAL DOCUMENT
                    </span>

                    <span className="editor-format">
                        TEXT / UTF-8
                    </span>

                </div>


                {/* =====================================
                    TEXT INPUT
                ===================================== */}

                <div className="editor-paper">

                    <textarea
                        className="editor-textarea"
                        value={text}
                        onChange={
                            handleTextChange
                        }
                        placeholder="Paste your AI-generated text here..."
                        spellCheck="true"
                        maxLength={
                            maxCharacters
                        }
                        aria-label="Text to humanize"
                    />


                    <div className="paper-corner">
                        +
                    </div>

                </div>


                {/* =====================================
                    COUNTER
                ===================================== */}

                <div className="editor-meta">

                    <div className="character-count">

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


                    <span className="character-limit">
                        MAX {maxCharacters}
                    </span>

                </div>


                {/* =====================================
                    WRITING STYLE
                ===================================== */}

                <div className="style-section">

                    <div className="style-heading">

                        <span>
                            WRITING STYLE
                        </span>

                        <span>
                            {style.toUpperCase()}
                        </span>

                    </div>


                    <div className="style-options">

                        {styles.map(
                            (item) => (

                                <button
                                    key={item}
                                    type="button"
                                    className={
                                        `style-pill ${
                                            style === item
                                                ? "active"
                                                : ""
                                        }`
                                    }
                                    onClick={() =>
                                        setStyle(
                                            item
                                        )
                                    }
                                    disabled={
                                        isProcessing
                                    }
                                >
                                    {item}
                                </button>

                            )
                        )}

                    </div>

                </div>


                {/* =====================================
                    ACTION AREA
                ===================================== */}

                <div className="editor-action">


                    <div className="engine-status">

                        <span className="engine-dot"></span>


                        <div>

                            <span className="engine-label">

                                {isProcessing
                                    ? "ENGINE WORKING"
                                    : "ENGINE READY"}

                            </span>


                            <span className="engine-model">
                                LLAMA 3.2 · 3B
                            </span>

                        </div>

                    </div>


                    <button
                        type="button"
                        className="humanize-button"
                        onClick={
                            handleHumanize
                        }
                        disabled={
                            !text.trim() ||
                            isProcessing
                        }
                    >

                        {isProcessing
                            ? "PROCESSING..."
                            : "HUMANIZE"}

                        <span>
                            →
                        </span>

                    </button>


                </div>


            </div>

        </section>

    );
}

export default HumanizerEditor;

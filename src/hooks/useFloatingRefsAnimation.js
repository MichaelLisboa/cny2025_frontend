import React, { useEffect, useRef } from "react";

const useFloatingRefs = (count) => {
    const refs = useRef([]);

    // Ensure refs array matches the number of items
    useEffect(() => {
        if (refs.current.length !== count) {
            refs.current = Array(count)
                .fill()
                .map((_, i) => refs.current[i] || React.createRef());
        }
    }, [count]);

    return refs;
};

export default useFloatingRefs;
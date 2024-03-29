import { useCallback, useEffect, useMemo, useState } from 'react';
import { Breakpoint, useDimensionsContext } from './context'
import { findLastIndex, takeIf, isEqualJSON, isBrowser } from "../../utils/functions";

interface DimensionProps {
    breakpoints?: Array<Breakpoint>,
    watchWindowSize?: boolean;
}

interface Dimensions {
    width: number,
    height: number,
    size: Breakpoint
}

interface DimensionResponse extends Dimensions {
    isSizeEqualOrLargerThan: (size: Breakpoint) => boolean,
    isSizeLargerThan: (size: Breakpoint) => boolean,
    isSizeEqualTo: (size: Breakpoint) => boolean,
    isSizeSmallerThan: (size: Breakpoint) => boolean,
    isSizeEqualOrSmallerThan: (size: Breakpoint) => boolean
}
const defaultBreakPoints: Array<Breakpoint> = ["xs", "sm", "md", "lg", "xl", "xxl"]
const defaultPayload: DimensionProps = { breakpoints: defaultBreakPoints, watchWindowSize: false }


const useDimensions: (payload?: DimensionProps) => DimensionResponse = (payload: DimensionProps = defaultPayload) => {

    const breakpoints = useMemo(() => payload.breakpoints || defaultBreakPoints, [payload.breakpoints])
    const watchWindowSize = useMemo(() => payload.watchWindowSize, [payload.watchWindowSize])

    const { sizes, widths } = useDimensionsContext()

    const getSizeOfWindowWidth = useCallback((width) => {
        const indexOfWidth = findLastIndex(widths, (c: number) => width >= c);
        return sizes[takeIf(indexOfWidth > -1, indexOfWidth, 0)]
    }, [findLastIndex, widths, sizes, takeIf])

    const initialSize = useMemo(() => getSizeOfWindowWidth(isBrowser() ? window.innerWidth : 0), [getSizeOfWindowWidth])

    const [dimensions, setDimensions] = useState<Dimensions>(isBrowser() ? {
        width: window.innerWidth,
        height: window.innerHeight,
        size: initialSize
    } : {
        width: 0, height: 0, size: 'xxl'
    });
    const { size } = dimensions;

    const updateDimensions = useCallback((width, height) => {
        const newSize = getSizeOfWindowWidth(width)
        if (!breakpoints.length || breakpoints.indexOf(newSize) > -1) {
            setDimensions(oldDimensions => {
                const newDimensions = { ...oldDimensions };
                if (watchWindowSize) {
                    newDimensions.width = width
                    newDimensions.height = height
                }
                newDimensions.size = newSize;
                if (isEqualJSON(oldDimensions, newDimensions)) {
                    return oldDimensions
                }
                return newDimensions;
            })
        }
    }, [breakpoints, getSizeOfWindowWidth, watchWindowSize, isEqualJSON])

    const getCurrentAndRequestedSizeIndex = useCallback((_size: Breakpoint) => {
        const indexOfCurrentSize = sizes.indexOf(size);
        const indexOfSize = sizes.indexOf(_size);
        return [indexOfCurrentSize, indexOfSize];
    }, [sizes, size])

    const isSizeEqualOrLargerThan = useCallback((_size) => {
        const [indexOfCurrentSize, indexOfSize] = getCurrentAndRequestedSizeIndex(_size);
        return indexOfCurrentSize >= indexOfSize;
    }, [getCurrentAndRequestedSizeIndex])

    const isSizeLargerThan = useCallback((_size) => {
        const [indexOfCurrentSize, indexOfSize] = getCurrentAndRequestedSizeIndex(_size);
        return indexOfCurrentSize > indexOfSize;
    }, [getCurrentAndRequestedSizeIndex])

    const isSizeEqualTo = useCallback((_size) => {
        const [indexOfCurrentSize, indexOfSize] = getCurrentAndRequestedSizeIndex(_size);
        return indexOfCurrentSize === indexOfSize;
    }, [getCurrentAndRequestedSizeIndex])

    const isSizeSmallerThan = useCallback((_size) => {
        const [indexOfCurrentSize, indexOfSize] = getCurrentAndRequestedSizeIndex(_size);
        return indexOfCurrentSize < indexOfSize;
    }, [getCurrentAndRequestedSizeIndex])

    const isSizeEqualOrSmallerThan = useCallback((_size) => {
        const [indexOfCurrentSize, indexOfSize] = getCurrentAndRequestedSizeIndex(_size);
        return indexOfCurrentSize <= indexOfSize;
    }, [getCurrentAndRequestedSizeIndex])

    const onResize = useCallback(({ target }) => {
        const { innerWidth, innerHeight } = target
        updateDimensions(innerWidth, innerHeight)
    }, [updateDimensions])

    useEffect(() => {
        window.addEventListener("resize", onResize)
        return () => {
            window.removeEventListener('resize', onResize)
        }
    }, [onResize])

    return {
        ...dimensions,
        isSizeEqualOrLargerThan,
        isSizeLargerThan,
        isSizeEqualTo,
        isSizeSmallerThan,
        isSizeEqualOrSmallerThan
    };
}

export default useDimensions

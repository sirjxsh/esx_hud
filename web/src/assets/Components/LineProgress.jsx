import { createEffect, createSignal, onCleanup } from 'solid-js'
export const LineProgress = (props) => {
    return (
        <svg
            width={props.progressLevel}
            height='0.5rem'
            style='transition: width 0.5s ease-in-out'
        >
            <rect
                width='100%'
                height='100%'
                fill={props.color}
            />
        </svg>
    )
}

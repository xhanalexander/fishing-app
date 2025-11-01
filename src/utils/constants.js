import { Vector3 } from "three"

export const waterHeight = 0.6


export const fishCaughtPosition = new Vector3(0, 3, 0)

export const fishCaughtAnimationDuration = 2.

export const EVENTS = {
    PARTICLES: {
        BUBBLE: {
            EMIT: "PARTICLES_BUBBLE_EMIT",
        },
        WAVE: {
            EMIT: "PARTICLES_WAVE_EMIT",
        },
        
    },
    FISH:{
        HOOKED: "FISH_HOOKED",
        CAUGHT: "FISH_CAUGHT"
    },
    CANNE:{
        LIFTED: "CANNE_LIFTED"
    }
}
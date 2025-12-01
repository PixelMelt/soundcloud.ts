import type {SoundcloudTrack} from "./TrackTypes"

export interface SoundcloudWidget {
    bind<Value extends SoundcloudEventValue>(
        event: Value,
        callback: SoundcloudEventCallback<Value>,
    ): void
    unbind(event: SoundcloudEventValue): void
    load(url: string, options?: SoundcloudLoadOptions): void

    play(): void
    pause(): void
    toggle(): void
    seekTo(ms: number): void
    setVolume(volume: number): void
    next(): void
    prev(): void
    skip(index: number): void

    getVolume(callback: (volume: number) => void): void
    getDuration(callback: (duration: number) => void): void
    getPosition(callback: (position: number) => void): void
    getSounds(callback: (sounds: SoundcloudTrack[]) => void): void
    getCurrentSound(callback: (sound: SoundcloudTrack) => void): void
    getCurrentSoundIndex(callback: (index: number) => void): void
    isPaused(callback: (paused: boolean) => void): void
}

export interface SoundcloudLoadOptions {
    callback?(): void
    [param: string]: unknown
}

export interface SoundcloudAudioEvents {
    LOAD_PROGRESS: "loadProgress"
    PLAY_PROGRESS: "playProgress"
    PLAY: "play"
    PAUSE: "pause"
    FINISH: "finish"
    SEEK: "seek"
}
export type SoundcloudAudioEventKey = keyof SoundcloudAudioEvents

export type SoundcloudAudioEventValue =
    SoundcloudAudioEvents[SoundcloudAudioEventKey]

export type SoundcloudAudioEventCallback = (data: SoundcloudAudioData) => void

export interface SoundcloudAudioData {
    relativePosition: number
    loadProgress: number
    currentPosition: number
}

export interface SoundcloudUIEvents {
    READY: "ready"
    CLICK_DOWNLOAD: "downloadClicked"
    CLICK_BUY: "buyClicked"
    OPEN_SHARE_PANEL: "sharePanelOpened"
    ERROR: "error"
}

export type SoundcloudUIEventKey = keyof SoundcloudUIEvents
export type SoundcloudUIEventValue = SoundcloudUIEvents[SoundcloudUIEventKey]
export type SoundcloudUIEventCallback = () => void

export type SoundcloudEventKey = SoundcloudAudioEventKey | SoundcloudUIEventKey

export type SoundcloudEventValue =
    | SoundcloudAudioEventValue
    | SoundcloudUIEventValue

export type SoundcloudEvents = SoundcloudAudioEvents & SoundcloudUIEvents

export type SoundcloudEventCallback<Value extends SoundcloudEventValue> =
    Value extends SoundcloudAudioEventValue
        ? SoundcloudAudioEventCallback
        : SoundcloudUIEventCallback

declare global {
    interface Window {
        SC?: {
            Widget: {
                (element: string | HTMLIFrameElement): SoundcloudWidget
                Events: SoundcloudEvents
            }
        }
    }
}

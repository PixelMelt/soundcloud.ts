import { SoundcloudSearch } from "./APITypes"
import type { SoundcloudUser } from "./UserTypes"

export interface SoundcloudComment {
    kind: "comment"
    id: number
    created_at: string
    user_id: number
    track_id: number
    timestamp: number
    body: string
    user: SoundcloudUser
    self: {
        urn: string
    }
}

export interface SoundcloudCommentSearch extends SoundcloudSearch {
    collection: SoundcloudComment[]
}
import { _Event } from "@/types/schedule.types"

export type EventItemProps = {
    event: _Event
    eventsLength: number
    i: number
    setSelectedEventID: (id: string | undefined) => void
    selectedEventID: string | undefined
    setEventToDeleteID: (id: string | undefined) => void
}
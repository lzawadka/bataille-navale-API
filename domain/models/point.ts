/**
 * Location
 */
 export type Location = {
	x: number,
	y: number,
}

/**
 * Points
 */
export interface IPoint {
	location: Location
	status: PointStatus
	updateStatus(status: PointStatus): void
}

// Union (enum) for point statuses
export type PointStatus = 'Sunk' | 'Hit' | 'Miss' | 'Ship' | 'Empty'
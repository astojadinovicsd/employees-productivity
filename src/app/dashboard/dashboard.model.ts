export interface Employee {
    id: string
    name: string
    email: string
    hourlyRate: number
    overtimeHourlyRate: number
}

export interface ShiftInfo {
    employeeId: string
    clockInDate: string
    clockOutDate: string
}
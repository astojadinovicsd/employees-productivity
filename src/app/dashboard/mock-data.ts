import { addDays, getDateWithoutTimezone } from '../core/utils';
import { Employee, ShiftInfo } from './dashboard.model';

export const employeesMock: Employee[] = [
  {
    id: 'asdf1',
    name: 'Bogdan Bogdanovic',
    email: 'a@f.com',
    hourlyRate: 100,
    overtimeHourlyRate: 200,
  },
  {
    id: 'asdf2',
    name: 'Aleksa Avramovic',
    email: 's@f.com',
    hourlyRate: 100,
    overtimeHourlyRate: 200,
  },
  {
    id: 'asdf3',
    name: 'Dejan Davidovac',
    email: 'd@f.com',
    hourlyRate: 100,
    overtimeHourlyRate: 200,
  },
  {
    id: 'asdf4',
    name: 'Ognjen Dobric',
    email: 'f@f.com',
    hourlyRate: 100,
    overtimeHourlyRate: 200,
  },
  {
    id: 'asdf5',
    name: 'Marko Guduric',
    email: 'g@f.com',
    hourlyRate: 100,
    overtimeHourlyRate: 200,
  },
  {
    id: 'asdf6',
    name: 'Nikola Jovic',
    email: 'h@f.com',
    hourlyRate: 100,
    overtimeHourlyRate: 200,
  },
  {
    id: 'asdf7',
    name: 'Stefan Jovic',
    email: 'j@f.com',
    hourlyRate: 100,
    overtimeHourlyRate: 200,
  },
  {
    id: 'asdf8',
    name: 'Vanja Marinkovic',
    email: 'k@f.com',
    hourlyRate: 100,
    overtimeHourlyRate: 200,
  },
  {
    id: 'asdf9',
    name: 'Nikola Milutinov',
    email: 'l@f.com',
    hourlyRate: 100,
    overtimeHourlyRate: 200,
  },
  {
    id: 'asdf10',
    name: 'Filip Petrusev',
    email: 'q@f.com',
    hourlyRate: 100,
    overtimeHourlyRate: 200,
  },
  {
    id: 'asdf11',
    name: 'Dusan Ristic',
    email: 'w@f.com',
    hourlyRate: 100,
    overtimeHourlyRate: 200,
  },
  {
    id: 'asdf12',
    name: 'Borisa Simanic',
    email: 'e@f.com',
    hourlyRate: 100,
    overtimeHourlyRate: 200,
  },
];

const specificShifts: ShiftInfo[] = [
  {
    employeeId: 'asdf1',
    clockInDate: '2022-09-08T14:00:00',
    clockOutDate: '2022-09-08T17:00:00',
  },
  {
    employeeId: 'asdf1',
    clockInDate: '2022-09-08T18:00:00',
    clockOutDate: '2022-09-08T20:00:00',
  },
  {
    employeeId: 'asdf1',
    clockInDate: '2022-09-08T18:00:00',
    clockOutDate: '2022-09-09T03:00:00',
  },
  {
    employeeId: 'asdf2',
    clockInDate: '2022-09-08T14:00:00',
    clockOutDate: '2022-09-08T17:00:00',
  },
  {
    employeeId: 'asdf2',
    clockInDate: '2022-09-08T18:00:00',
    clockOutDate: '2022-09-08T20:00:00',
  },
];

function getGeneratedShifts(): ShiftInfo[] {
  const generatedShifts: ShiftInfo[] = [];
  const clockInDate = new Date();
  clockInDate.setHours(8, 0, 0, 0);
  const clockOutDate = new Date();
  clockOutDate.setHours(16, 0, 0, 0);

  employeesMock.forEach(employee => {
    for (let i = 0; i < 80; i++) {
      const shiftExample = {
        employeeId: employee.id,
        clockInDate: getDateWithoutTimezone(addDays(clockInDate, -i)),
        clockOutDate: getDateWithoutTimezone(addDays(clockOutDate, -i)),
      };
      generatedShifts.push(shiftExample);
    }
  });
  return generatedShifts;
}

export const shiftsMock = [...specificShifts, ...getGeneratedShifts()];

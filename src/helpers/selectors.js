export function getAppointmentsForDay(state, day) {
  return state.days.reduce((appointments, aDay) => {
    if (aDay.name === day) {
      aDay.appointments.forEach((appt) => {
        appointments.push(state.appointments[appt]);
      });
    }
    return appointments;
  }, []);
}

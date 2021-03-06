export function getAppointmentsForDay(state, day) {
  return state.days.reduce((appointments, aDay) => {
    if (aDay.name === day) {
      aDay.appointments.forEach(appt => {
        appointments.push(state.appointments[appt]);
      });
    }
    return appointments;
  }, []);
}

export function getInterviewersForDay(state, day) {
  return state.days.reduce((interviewers, aDay) => {
    if (aDay.name === day) {
      aDay.interviewers.forEach(interviewer => {
        interviewers.push(state.interviewers[interviewer]);
      });
    }
    return interviewers;
  }, []);
}

export function getInterview(state, interview) {
  if (interview) {
    const id = interview.interviewer;
    const student = interview.student;

    return { student, interviewer: state.interviewers[id] };
  }

  return null;
}

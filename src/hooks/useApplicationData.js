import { useReducer, useEffect } from "react";
import axios from "axios";

const SET_DAY = "setDay";
const API_UPDATE = "apiUpdate";
const UPDATE_APPOINTMENT = "updateAppointment";

export default function useApplicationData() {
  const [state, dispatch] = useReducer((state, action) => {
    switch (action.function) {
    case SET_DAY:
      return {...state, day: action.day}
    case API_UPDATE:
      return {
        ...state,
        days: action.days,
        appointments: action.appointments,
        interviewers: action.interviewers
      }
    case UPDATE_APPOINTMENT:
      const appointment = {
        ...state.appointments[action.id],
        interview: { ...action.interview }
      };

      const appointments = {
        ...state.appointments,
        [action.id]: appointment
      };

      return {...state, appointments}
    default:
      throw new Error();
    }
  }, {
    day: "Monday",
    days: [],
    appointments: {},
    interviews: {}
  });

  useEffect(() => {
    Promise.all([
      axios.get('/api/days'),
      axios.get('/api/appointments'),
      axios.get('/api/interviewers')
    ])
      .then(all => all.map(x => x.data))
      .then(([days, appointments, interviewers]) => {
        dispatch({ function: API_UPDATE, days, appointments, interviewers });
      });
  }, []);

  function bookInterview(id, interview) {
    return axios.put(`/api/appointments/${id}`, {interview})
      .then(() => {
        dispatch({function: UPDATE_APPOINTMENT, id, interview});
      });
  }

  function cancelInterview(id) {
    return axios.delete(`/api/appointments/${id}`)
      .then(() => {
        dispatch({function: UPDATE_APPOINTMENT, id, interview: null});
      });
  }

  const setDay = day => dispatch({function: SET_DAY, day});

  return { state, setDay, bookInterview, cancelInterview }
}

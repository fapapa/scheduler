import { useReducer, useEffect } from "react";
import axios from "axios";

const SET_DAY = "setDay";
const API_UPDATE = "apiUpdate";
const UPDATE_APPOINTMENT = "updateAppointment";
const DECREMENT_SPOTS = "decrementSpots";
const INCREMENT_SPOTS = "incrementSpots";

const stateActions = {
  setDay: (state, day) => {
    return {...state, ...day}
  },
  apiUpdate: (state, data) => {
    return { ...state, ...data }
  },
  updateAppointment: (state, { id, interview }) => {
    const appointment = {
      ...state.appointments[id],
      interview: { ...interview }
    };

    const appointments = {
      ...state.appointments,
      [id]: appointment
    };

    return { ...state, appointments }
  },
  decrementSpots: (state, {day}) => {
    const days = state.days.map(aDay => {
      if (aDay.name !== day) {
        return aDay
      }

      return {
        ...aDay,
        spots: aDay.spots - 1
      }
    });

    return { ...state, days };
  },
  incrementSpots: (state, {day}) => {
    const days = state.days.map(aDay => {
      if (aDay.name !== day) {
        return aDay
      }

      return {
        ...aDay,
        spots: aDay.spots + 1
      }
    });

    return { ...state, days };
  }
};

export default function useApplicationData() {
  const [state, dispatch] = useReducer((state, action) => {
    const { functionName, ...params } = action;
    return stateActions[functionName](state, params);
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
        dispatch({ functionName: API_UPDATE, days, appointments, interviewers });
      });
  }, []);

  function bookInterview(id, interview) {
    return axios.put(`/api/appointments/${id}`, {interview})
      .then(() => {
        dispatch({functionName: UPDATE_APPOINTMENT, id, interview});
        dispatch({functionName: DECREMENT_SPOTS, state, day: state.day});
      });
  }

  function cancelInterview(id) {
    return axios.delete(`/api/appointments/${id}`)
      .then(() => {
        dispatch({functionName: UPDATE_APPOINTMENT, id, interview: null});
        dispatch({functionName: INCREMENT_SPOTS, state, day: state.day});
      });
  }

  const setDay = day => dispatch({functionName: SET_DAY, day});

  return { state, setDay, bookInterview, cancelInterview }
}

const stateActions = {
  setDay: (state, day) => {
    return { ...state, ...day };
  },
  apiUpdate: (state, data) => {
    return { ...state, ...data };
  },
  updateAppointment: (state, { id, interview }) => {
    const appointment = {
      ...state.appointments[id],
      interview: interview ? { ...interview } : null
    };

    const appointments = {
      ...state.appointments,
      [id]: appointment
    };

    return { ...state, appointments };
  },
  decrementSpots: (state, { day }) => {
    const days = state.days.map(aDay => {
      if (aDay.name !== day) {
        return aDay;
      }

      return {
        ...aDay,
        spots: aDay.spots - 1
      };
    });

    return { ...state, days };
  },
  incrementSpots: (state, { day }) => {
    const days = state.days.map(aDay => {
      if (aDay.name !== day) {
        return aDay;
      }

      return {
        ...aDay,
        spots: aDay.spots + 1
      };
    });

    return { ...state, days };
  }
};

export const SET_DAY = "setDay";
export const API_UPDATE = "apiUpdate";
export const UPDATE_APPOINTMENT = "updateAppointment";
export const DECREMENT_SPOTS = "decrementSpots";
export const INCREMENT_SPOTS = "incrementSpots";

export default function reducer(state, action) {
  const { functionName, ...params } = action;
  return stateActions[functionName](state, params);
}

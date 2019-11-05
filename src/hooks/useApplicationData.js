import { useReducer, useEffect } from "react";
import axios from "axios";

import reducer, {
  SET_DAY,
  API_UPDATE,
  UPDATE_APPOINTMENT,
  DECREMENT_SPOTS,
  INCREMENT_SPOTS
} from "reducers/application";

export default function useApplicationData() {
  const [state, dispatch] = useReducer(reducer, {
    day: "Monday",
    days: [],
    appointments: {},
    interviews: {}
  });

  useEffect(() => {
    Promise.all([
      axios.get("/api/days"),
      axios.get("/api/appointments"),
      axios.get("/api/interviewers")
    ])
      .then(all => all.map(x => x.data))
      .then(([days, appointments, interviewers]) => {
        dispatch({
          functionName: API_UPDATE,
          days,
          appointments,
          interviewers
        });
      })
      .then(() => {
        const ws = new WebSocket(process.env.REACT_APP_WEBSOCKET_URL);

        ws.onmessage = event => {
          const message = JSON.parse(event.data);

          if (message.type === "SET_INTERVIEW") {
            dispatch({
              functionName: UPDATE_APPOINTMENT,
              id: message.id,
              interview: message.interview
            });
          }
        };
      })
      .catch(err => {});
  }, []);

  function bookInterview(id, interview, isExisting) {
    return axios.put(`/api/appointments/${id}`, { interview }).then(() => {
      dispatch({ functionName: UPDATE_APPOINTMENT, id, interview });
      if (!isExisting) {
        dispatch({ functionName: DECREMENT_SPOTS, day: state.day });
      }
    });
  }

  function cancelInterview(id) {
    return axios.delete(`/api/appointments/${id}`).then(() => {
      dispatch({ functionName: UPDATE_APPOINTMENT, id, interview: null });
      dispatch({ functionName: INCREMENT_SPOTS, day: state.day });
    });
  }

  const setDay = day => dispatch({ functionName: SET_DAY, day });

  return { state, setDay, bookInterview, cancelInterview };
}

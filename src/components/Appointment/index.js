import React from "react";

import Header from "components/Appointment/Header";
import Show from "components/Appointment/Show";
import Empty from "components/Appointment/Empty";
import Form from "components/Appointment/Form";
import Status from "components/Appointment/Status"
import Confirm from "components/Appointment/Confirm"

import useVisualMode from "hooks/useVisualMode";

import "components/Appointment/styles.scss";

const EMPTY = "EMPTY";
const SHOW = "SHOW";
const CREATE = "CREATE";
const SAVE = "SAVE";
const DELETE = "DELETE";
const CONFIRM = "CONFIRM";

export default function Appointment(props) {
  const initial = props.interview ? SHOW : EMPTY;
  const { mode, transition, back } = useVisualMode(initial);

  function save(name, interviewer) {
    const interview = {
      student: name,
      interviewer
    };
    transition(SAVE);
    props.bookInterview(props.id, interview)
      .then(() => {
        transition(SHOW);
      });
  }

  function confirmCancel() {
    transition(CONFIRM);
  }

  function cancel() {
    transition(DELETE);
    props.cancelInterview(props.id)
      .then(() => {
        transition(EMPTY);
      });
  }

  return (
    <article className="appointment">
      <Header time={props.time} />
      {mode === EMPTY && <Empty onAdd={() => transition(CREATE)} />}
      {mode === SHOW && (
        <Show
          student={props.interview.student}
          interviewer={props.interview.interviewer}
          onDelete={confirmCancel}
        />
      )}
      {mode === CREATE && (
        <Form
          interviewers={props.interviewers}
          onCancel={back}
          onSave={save}
        />
      )}
      {mode === SAVE && <Status message="Saving" />}
      {mode === DELETE && <Status message="Deleting" />}
      {mode === CONFIRM && (
        <Confirm
          onCancel={back}
          onConfirm={cancel}
        />
      )}
    </article>
  )
}

import React from "react";
import axios from "axios";
import {
  getByText,
  getAllByTestId,
  getByAltText,
  getByPlaceholderText,
  queryByText,
  queryByAltText
} from "@testing-library/react";

import {
  render,
  cleanup,
  waitForElement,
  fireEvent
} from "@testing-library/react";

import Application from "components/Application";

afterEach(cleanup);

describe("Application", () => {
  it("defaults to Monday and changes the schedule when a new day is selected", async () => {
    const { getByText } = render(<Application />);

    await waitForElement(() => getByText("Monday"));

    fireEvent.click(getByText("Tuesday"));
    expect(getByText(/leopold silvers/i)).toBeInTheDocument();
  });

  it("loads data, books an interview and reduces the spots remaining for the first day by 1", async () => {
    const { container } = render(<Application />);

    await waitForElement(() => {
      return getByText(container, /archie cohen/i);
    });

    const appointment = getAllByTestId(container, "appointment")[0];

    fireEvent.click(getByAltText(appointment, "Add"));

    fireEvent.change(getByPlaceholderText(appointment, /enter student name/i), {
      target: { value: "Lydia Miller-Jones" }
    });
    fireEvent.click(getByAltText(appointment, "Sylvia Palmer"));

    fireEvent.click(getByText(appointment, "Save"));

    expect(getByText(appointment, /saving/i)).toBeInTheDocument();

    await waitForElement(() => getByText(appointment, "Lydia Miller-Jones"));

    const day = getAllByTestId(container, "day").find(day =>
      queryByText(day, "Monday")
    );

    expect(getByText(day, /no spots remaining/i)).toBeInTheDocument();
  });

  it("loads data, cancels an interview and increases the spots remaining for Monday by 1", async () => {
    const { container } = render(<Application />);
    await waitForElement(() => getByText(container, "Archie Cohen"));

    const appointments = getAllByTestId(container, "appointment");
    const appointment = appointments.find(appt =>
      queryByAltText(appt, /delete/i)
    );
    fireEvent.click(queryByAltText(appointment, /delete/i));

    await waitForElement(() =>
      getByText(appointment, /delete the appointment\?/i)
    );
    fireEvent.click(queryByText(appointment, /confirm/i));

    expect(getByText(appointment, /deleting/i)).toBeInTheDocument();

    await waitForElement(() => getByAltText(appointment, /add/i));

    const day = getAllByTestId(container, "day").find(day =>
      queryByText(day, "Monday")
    );

    expect(getByText(day, /2 spots remaining/i)).toBeInTheDocument();
  });

  it("loads data, edits an interview and keeps the spots remaining for Monday the same", async () => {
    const { container } = render(<Application />);
    await waitForElement(() => getByText(container, "Archie Cohen"));

    const appointments = getAllByTestId(container, "appointment");
    const appointment = appointments.find(appt =>
      queryByAltText(appt, /edit/i)
    );
    fireEvent.click(queryByAltText(appointment, /edit/i));

    await waitForElement(() => getByText(appointment, /save/i));
    fireEvent.change(getByPlaceholderText(appointment, /enter student name/i), {
      target: { value: "Joe Blow" }
    });
    fireEvent.click(queryByText(appointment, /save/i));

    expect(getByText(appointment, /saving/i)).toBeInTheDocument();

    await waitForElement(() => getByText(appointment, /joe blow/i));

    const day = getAllByTestId(container, "day").find(day =>
      queryByText(day, "Monday")
    );

    expect(getByText(day, /1 spot remaining/i)).toBeInTheDocument();
  });

  it("shows the save error when failing to save an appointment", async () => {
    axios.put.mockRejectedValueOnce();

    const { container } = render(<Application />);

    await waitForElement(() => {
      return getByText(container, /archie cohen/i);
    });

    const appointment = getAllByTestId(container, "appointment")[0];

    fireEvent.click(getByAltText(appointment, "Add"));

    fireEvent.change(getByPlaceholderText(appointment, /enter student name/i), {
      target: { value: "Lydia Miller-Jones" }
    });
    fireEvent.click(getByAltText(appointment, "Sylvia Palmer"));

    fireEvent.click(getByText(appointment, "Save"));

    expect(getByText(appointment, /saving/i)).toBeInTheDocument();

    await waitForElement(() => getByText(appointment, /could not save/i));
  });

  it("shows the delete error when failing to delete an existing appointment", async () => {
    axios.delete.mockRejectedValueOnce();

    const { container } = render(<Application />);

    await waitForElement(() => {
      return getByText(container, /archie cohen/i);
    });

    const appointments = getAllByTestId(container, "appointment");
    const appointment = appointments.find(appt =>
      queryByAltText(appt, /delete/i)
    );
    fireEvent.click(getByAltText(appointment, "Delete"));

    await waitForElement(() =>
      getByText(appointment, /delete the appointment\?/i)
    );
    fireEvent.click(queryByText(appointment, /confirm/i));

    expect(getByText(appointment, /deleting/i)).toBeInTheDocument();

    await waitForElement(() => getByText(appointment, /could not delete/i));
  });
});

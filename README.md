# Interview Scheduler

## Description

Scheduler is a *single-page application* built with React. It allows a user to
manage interviews on a schedule, and showcases the use of React best practices,
such as pure functions, hooks and custom hooks, and reducers. I also implemented
a set of features that use web-sockets to live-update one user's view when
another user modifies the schedule.

## Setup

Install dependencies with `npm install`.

### Additional dependencies

Please note that, in addition to the NPM dependencies installed above, you also
need to install and run the
[scheduler-api](https://github.com/fapapa/scheduler-api) companion app that
provides the API for this app to connect to for data.

## Running Webpack Development Server

```sh
npm start
```

## Running Jest Test Framework

```sh
npm test
```

## Running Storybook Visual Testbed

```sh
npm run storybook
```

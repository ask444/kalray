import _ from "lodash";

export async function getToDoList() {
  const randomValue = Math.random();

  if (randomValue < 0.1)
    throw new Error("Could not retrieve the todo list.");

  const numberOfTasks = Math.round(20 + Math.random() * 80);

  return Promise.resolve({
    data: 
      _.range(1, numberOfTasks + 1).map(task_id => {
        const randomDone = Math.random() > 0.5 ? true : false;
        const randomHour = Math.round(10 + Math.random() * 10);
        const randomMin = Math.round(10 + Math.random() * 49);
        const randomDoneTime = !!randomDone ? `2024-07-25T${randomHour}:${randomMin}:00` : null;

        return {
          id: task_id,
          content: `todo list item #${task_id}`,
          done: randomDone,
          done_time: randomDoneTime
        };
      })
  });
}

const service = {
    getToDoList,
};

export default service;

Instructions:
   
   - Create a PRIVATE git repository
   - Create a commit such as ‘test start’
   - Undertake the exercise
   - At the end of development, ensure to create a final ‘test end’ commit.
   - Share the git repository read-only or deliver a bundle of the git repo and code to the same email address
     - if github:jeztucker  (jtucker@pixitmedia.com)
     - else use: jtucker@kalrayinc.com


Starting out:

    - Unpack the project
    - Perform "yarn install" & "yarn start" to run


Guidance:

    - Display a list of 'todo' items to be achieved in a table.  Implement add, update, and delete operations on the list of items.
    - Use appService for retrieving the 'todo' list from the server. The implementation of getToDoList function must not be modified.
    - Typescript usage: Define TypeScript interfaces whenever necessary. All applicable functions and arguments must be typed.
   

Outcomes to achieve:

    1- Display: Ensure todo items are visible in the table.

    2- Sorting by column: Provide a method to click a button on the table header and order the rows in ascending or descending order of a particular column.

    3- Pagination: A maximum of 10 records must be visible on the table.
                   Assuming an exceptionally large dataset, paginate the results and provide a method to view all 'pages'. 

    4- Filtering: Provide filtering table rows via an input box in a case-insensitive manner.

    5- Adding a New task: Provide a method to add a new task.
                          Initially, the task must define done_time = null. 
                          Each task must have a distinct ID.

    6- Marking a task as Done: Provide a method to mark tasks as Done.
                               When a task is marked as done, change the text styling to strikethrough. 
                               Set the current time as done_time for that task.

    7- Marking a task as Undone: Provide a method to mark the task as undone. 
                                 When a task is undone, change the text styling back to normal and set done_time = null.

    8- Updating the task content: Provide a method to update task content

    9- Deleting a task: Provide a method to delete a task

    10- Styling: Style the table, buttons, and controls as you wish to ensure the outcome is usable.
                 Responsiveness is not a concern.  As guidance, a screen sizes of 1920x1080 and 1920x1200 are common resolutions at Kalray.


Bonus tasks:

    B1- Adding/updating a new item: Provide these methods via a modal dialog.
    B2- Implement infinite scroll as a 'sliding window' as an alternative for pagination.
        The entire dataset must not be loaded to provide ease of scrolling.
        Provide a toggle to switch between both modes.


# EOF


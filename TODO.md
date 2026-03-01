TODO:

- move more logic from the svg inside chunk functions
- make the "hover over something" and it highlighting in the graph and the table work again
- implement typescript
- add global css variables for fontsize and fontweight
- start scaling headings to be smaller on smaller screens
- take care of the issue with the button bar that now falls outside the screen on small devices causing overflow issues.
- also trigger the table clamp if a user resizes the window (e.g. they move their browser to another screen. Reallly be careful with this to resize tracking is very expensive i believe unless react has something cheap for it we might have to throttle this or something)

- Age is calculated wrong AGAIN. Snoozy is 77, but table says 75.
- and we have some kittens without a birthday?
- iguess we should just make their age 0.
- Joe is age1, but he has no birthday, so table says -
- King Kong is actually Age2, but shows in the table as age 0.

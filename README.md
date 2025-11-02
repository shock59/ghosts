# Haunted Website

This website has some elements you can interact with, but the twist is that everyone who previously visited has their actions recorded and will come back as "ghosts" for all future visitors. Ghosts will move around the page, and can even click on the interactive parts of the site. The combination of all the ghosts actions combining can create some interesting results to look at. Ghosts can also set themselves a name so future visitors can see who else was using the website.

You can try it out at [ghosts.samv.me](https://ghosts.samv.me)!

## How it works

Internally the site is split up into two parts - a frontend written in Svelte and a backend server using Express and socket.io. Mouse movements are constantly recorded on the frontend site and are periodically sent to the server using websockets.

There are multiple Svelte components that the user can interact with - currently the Counter, Canvas, and Sliders. All of these elements add another value into the recording of the session when clicked, with additional details depending on the component (such as which button was clicked on the counter).

After the user disconnects, the server writes the session's data to a SQLite database. Whenever a new visitor arrives, all of the ghost replay data is loaded from the database and sent to the client over websockets. A "GhostReplay" component is created for each stored session, which goes through the actions that were saved and triggers functions inside components to simulate clicks.
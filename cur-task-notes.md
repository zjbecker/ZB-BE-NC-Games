<<<<<<< HEAD
9. GET /api/users
=======
8. PATCH /api/reviews/:review_id

   Request body accepts:

an object in the form { inc_votes: newVote }

newVote will indicate how much the votes property in the database should be updated by
e.g.

{ inc_votes : 1 } would increment the current review's vote property by 1

{ inc_votes : -100} would decrement the current review's vote property by 100
>>>>>>> main

Responds with:
<<<<<<< HEAD
an array of objects, each object should have the following property:
username
name
avatar_url
=======

the updated review
Errors to Consider - add errors to handle as items to the checklist
Deents should be served with the most recent comments first
>>>>>>> main

1. Checkout to main (git checkout main)
2. pull in from GitHubs main (git pull origin main)
3. Create you new task branch (git checkout -B (name of branch»)
4. Do the work on that branch (commit regularly)
5. ensure all work is added and committed
6. Pull in from the main branch (git pull origin main)
7. Push to remote feature branch (git push origin <name of branch»)
8. Create pull request
9. Send pull request slack message

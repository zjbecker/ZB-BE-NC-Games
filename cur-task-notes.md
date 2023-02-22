7. POST /api/reviews/:review_id/comments

Request body accepts:

an object with the following properties:
username
body
Responds with:

the posted comment
Note: the status code should be 201 which signifies that something was created

Errors to Consider - add errors to handle as items to the checklist

comment_id | body | review_id | author | votes | created_at

1. Checkout to main (git checkout main)
2. pull in from GitHubs main (git pull origin main)
3. Create you new task branch (git checkout -B (name of branch»)
4. Do the work on that branch (commit regularly)
5. ensure all work is added and committed
6. Pull in from the main branch (git pull origin main)
7. Push to remote feature branch (git push origin <name of branch»)
8. Create pull request
9. Send pull request slack message

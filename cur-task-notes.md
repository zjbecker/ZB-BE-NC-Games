6. GET /api/reviews/:review_id/comments

Responds with:

an array of comments for the given review_id of which each comment should have the following properties:

- comment_id
- votes
- created_at
- author
- body
- review_id
  comments should be served with the most recent comments first

1. Checkout to main (git checkout main)
2. pull in from GitHubs main (git pull origin main)
3. Create you new task branch (git checkout -B (name of branch»)
4. Do the work on that branch (commit regularly)
5. ensure all work is added and committed
6. Pull in from the main branch (git pull origin main)
7. Push to remote feature branch (git push origin <name of branch»)
8. Create pull request
9. Send pull request slack message

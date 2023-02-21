comment_count which is the total count of all the comments with this

review_id - you should make use of queries to the database in order to achieve this.

the reviews should be sorted by date in descending order.

select review_id, owner, count(review_id) AS review_count from reviews join comments using (review_id) GROUP BY REVIEW_ID

1. Checkout to main (git checkout main)
2. pull in from GitHubs main (git pull origin main)
3. Create you new task branch (git checkout -B (name of branch»)
4. Do the work on that branch (commit regularly)
5. ensure all work is added and committed
6. Pull in from the main branch (git pull origin main)
7. Push to remote feature branch (git push origin <name of branch»)
8. Create pull request
9. Send pull request slack message

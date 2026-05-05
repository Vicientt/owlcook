DB_USER = nguyen15
DB_PASS = S224239
DB_NAME = db_nguyen15
MYSQL   = mysql -h localhost -u $(DB_USER) -p$(DB_PASS) $(DB_NAME)

RUNNER = ~/sd/owlcook/actions-runner

.PHONY: db-show-users db-show-foods db-clear db-reset runner-start runner-status

db-show-users:
	@$(MYSQL) -e "SELECT id, email, name, created_at FROM users;"

db-show-foods:
	@$(MYSQL) -e "SELECT id, name, difficulty, user_id, created_at FROM foods;"

db-clear:
	@$(MYSQL) -e "DELETE FROM foods; DELETE FROM users;"
	@echo "All data deleted"

db-reset:
	@$(MYSQL) -e "DROP TABLE IF EXISTS foods; DROP TABLE IF EXISTS users;"
	@$(MYSQL) < docs/schema.sql
	@echo "Tables recreated"

runner-start:
	@screen -S runner $(RUNNER)/run.sh
	@echo "Runner started — detach with Ctrl+A then D"

runner-status:
	@screen -list | grep runner && echo "Runner is UP" || echo "Runner is DOWN"

import VKAPI from "./api";
import config from "./config";
import Logger from "./logger";
import { delay } from "./utils";

class CheatFriends extends VKAPI {
    constructor(config = {}) {
        super(config);
        this.config = {
            accessToken: "",
            versionAPI: 5.92,
            textWhenAdding: "",
            delayBeforeIteration: 5000,
            ...config
        };
    }

    getSuggestionsFriends(offset) {
        return this.callMethod("friends.getSuggestions", {
            offset,
            count: 10,
            filter: "mutual",
            fields: "online"
        });
    }

    addFriend(userId) {
        return this.callMethod("friends.add", {
            user_id: userId,
            text: this.config.textWhenAdding
        })
    }

    async iteration(offset = 0) {
        try {
            Logger.log(`Получаем список рекомендованных друзей. Итерация #${(offset / 10) + 1}`);

            const { count: countUsers, items: userList } = await this.getSuggestionsFriends(offset);

            const filterUserList = userList.filter(data => data.online);

            for (let { first_name: firstName, last_name: lastName, id } of filterUserList) {
                Logger.log(`Добавляем пользователя: ${firstName} ${lastName}`);
                await this.addFriend(id);
                Logger.log(`Добавили пользователя: ${firstName} ${lastName}`)
            }

            await delay(this.config.delayBeforeIteration);
            await this.iteration(offset + 10);
        } catch (error) { throw error }
    }

    async startCheating() {
        try {
            const [currentUserInfo] = await this.callMethod("users.get");

            Logger.log(`Начинаем накрутку друзей на страницу: ${currentUserInfo.first_name} ${currentUserInfo.last_name} (vk.com/id${currentUserInfo.id})`);

            await this.iteration(0);

        } catch (error) {
            if (error.code === 5) {
                Logger.error("Вы не ввели токен доступа в config.json");
            } else
                Logger.error(error)
        }
    }

    handlerExitProcess() {
        Logger.log("Завершаем работу скрипта...");
    }
}

const cheatFriends = new CheatFriends(config);

cheatFriends.startCheating();


process.on("exit", cheatFriends.handlerExitProcess.bind(cheatFriends));
module.exports = {
	config: {
		name: "boxlist",
		aliases: ["box", "groups"],
		version: "3.0",
		author: "MUKUL",
		countDown: 5,
		role: 2,
		shortDescription: "Box management",
		longDescription: "Group list, bot leave and member information.",
		category: "admin",
		guide:
			"{pn}\n" +
			"{pn} out\n" +
			"{pn} add\n" +
			"{pn} adduser @user"
	},

	onStart: async function ({ message, args, event }) {
		const action = (args[0] || "").toLowerCase();

		// =========================
		// HELP
		// =========================
		if (action === "help") {
			return message.reply(
`👑 𝗠𝗨𝗞𝗨𝗟 𝗚𝗢𝗔𝗧 𝗕𝗢𝗧 👑

『 BOXLIST 』

* boxlist
* boxlist out
* boxlist add
* boxlist adduser @user

━━━━━━━━━━━━━━━━━━`
			);
		}

		// =========================
		// OUT
		// =========================
		if (action === "out" || action === "leave") {
			try {
				await message.reply(
					"🚪 MUKUL GOAT BOT এই group থেকে বের হচ্ছে..."
				);

				const api = global.GoatBot?.fcaApi;
				const botID = global.GoatBot?.botID;

				if (
					!api ||
					typeof api.removeUserFromGroup !== "function"
				) {
					return message.reply(
						"❌ তোমার bot-এর leave API পাওয়া যায়নি।"
					);
				}

				await api.removeUserFromGroup(
					botID,
					event.threadID
				);

			} catch (error) {
				console.error("BOXLIST OUT ERROR:", error);

				return message.reply(
					"❌ Bot group থেকে leave নিতে পারেনি।"
				);
			}

			return;
		}

		// =========================
		// ADD
		// =========================
		if (action === "add") {
			return message.reply(
`👑 𝗠𝗨𝗞𝗨𝗟 𝗚𝗢𝗔𝗧 𝗕𝗢𝗧 👑

『 ADD SYSTEM 』

* Admin: MUKUL
* Bot: MUKUL GOAT BOT
* Status: Online

📌 কাউকে group-এ যোগ করতে হলে
তার অনুমতি এবং group-এর
Messenger permission প্রয়োজন।

━━━━━━━━━━━━━━━━━━`
			);
		}

		// =========================
		// ADDUSER
		// =========================
		if (
			action === "adduser" ||
			action === "addmember"
		) {
			const mentions = event.mentions || {};
			const ids = Object.keys(mentions);

			if (!ids.length) {
				return message.reply(
`❌ একজন user-কে mention করো।

Example:
.boxlist adduser @User`
				);
			}

			const uid = ids[0];
			const name = mentions[uid] || "User";

			return message.reply(
`👤 𝗨𝗦𝗘𝗥 𝗜𝗡𝗙𝗢

* Name: ${name}
* UID: ${uid}

⚠️ User-কে group-এ যোগ করার জন্য
তার অনুমতি ও Messenger group
permission প্রয়োজন।

👑 MUKUL GOAT BOT`
			);
		}

		// =========================
		// GROUP LIST
		// =========================
		try {
			const db = global.db;
			const threads = db?.allThreadData || [];

			if (!threads.length) {
				return message.reply(
					"❌ কোনো group data পাওয়া যায়নি।"
				);
			}

			let msg =
`👑 𝗠𝗨𝗞𝗨𝗟 𝗚𝗢𝗔𝗧 𝗕𝗢𝗧 👑

『 GROUP LIST 』

`;

			let count = 0;

			for (const thread of threads) {
				count++;

				const threadID =
					thread.threadID || "Unknown";

				const threadName =
					thread.threadName ||
					thread.data?.threadName ||
					"Unnamed Group";

				msg +=
`* ${count}. ${threadName}
  └ ID: ${threadID}

`;

				if (msg.length >= 4500) {
					await message.reply(msg);

					msg =
`『 GROUP LIST CONTINUED 』

`;
				}
			}

			msg +=
`━━━━━━━━━━━━━━━━━━
📊 Total Groups: ${count}

* boxlist out
* boxlist add
* boxlist adduser @user

👑 MUKUL GOAT BOT`;

			return message.reply(msg);

		} catch (error) {
			console.error("BOXLIST ERROR:", error);

			return message.reply(
				"❌ Group list load করতে সমস্যা হয়েছে।"
			);
		}
	}
};

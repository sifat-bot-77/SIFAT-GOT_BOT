module.exports = {
	config: {
		name: "help",
		aliases: ["menu", "commands"],
		version: "5.2",
		author: "MUKUL",
		countDown: 3,
		role: 0,
		shortDescription: "Show all available commands",
		longDescription: "Display all commands in categorized format.",
		category: "system",
		guide: "{pn}help [command name]"
	},

	onStart: async function ({
		message,
		args,
		prefix,
		event
	}) {

		const allCommands = global.GoatBot.commands;
		const categories = {};

		// ==============================
		// AUTO DELETE USER COMMAND
		// 15 SECONDS
		// ==============================

		if (event?.messageID) {
			setTimeout(() => {
				try {
					if (
						global.GoatBot?.fcaApi &&
						typeof global.GoatBot.fcaApi.unsendMessage === "function"
					) {
						global.GoatBot.fcaApi.unsendMessage(
							event.messageID
						);
					}
				} catch (error) {
					console.log(
						"USER MESSAGE DELETE ERROR:",
						error.message
					);
				}
			}, 15000);
		}

		// ==============================
		// CLEAN CATEGORY
		// ==============================

		const cleanCategoryName = (text) => {
			if (!text)
				return "others";

			return String(text)
				.normalize("NFKD")
				.replace(/[^\w\s-]/g, "")
				.replace(/\s+/g, " ")
				.trim()
				.toLowerCase();
		};

		// ==============================
		// COMMAND DETAILS
		// .help command
		// ==============================

		if (args[0]) {

			const query =
				String(args[0]).toLowerCase();

			const cmd =
				allCommands.get(query) ||
				[...allCommands.values()].find(
					(c) =>
						(c.config.aliases || [])
							.map((a) =>
								String(a).toLowerCase()
							)
							.includes(query)
				);

			if (!cmd) {

				const sent =
					await message.reply(
						`❌ Command "${query}" not found.`
					);

				autoDeleteReply(sent);

				return;
			}

			const {
				name,
				version,
				author,
				guide,
				category,
				shortDescription,
				longDescription,
				aliases
			} = cmd.config;

			const description =
				typeof longDescription === "string"
					? longDescription
					: longDescription?.en ||
					  shortDescription?.en ||
					  shortDescription ||
					  "No description";

			const usage =
				typeof guide === "string"
					? guide.replace(
						/{pn}/g,
						prefix
					)
					: guide?.en
						?.replace(
							/{pn}/g,
							prefix
						) ||
					  `${prefix}${name}`;

			const role =
				cmd.config.role !== undefined
					? cmd.config.role
					: 0;

			const permission =
				role === 0
					? "Everyone"
					: role === 1
						? "Group Admin"
						: "Bot Admin";

			const msg =
`👑 SIFAT GOAT BOT 👑

『 COMMAND INFO 』

* Name: ${name}
* Category: ${category || "others"}
* Description: ${description}
* Aliases: ${
	aliases?.length
		? aliases.join(", ")
		: "None"
}
* Usage: ${usage}
* Permission: ${permission}
* Author: ${author || "MUKUL"}
* Version: ${version || "1.0"}

━━━━━━━━━━━━━━━━━━
👑 SIFAT GOAT BOT
━━━━━━━━━━━━━━━━━━`;

			const sent =
				await message.reply(msg);

			autoDeleteReply(sent);

			return;
		}

		// ==============================
		// CREATE CATEGORY LIST
		// ==============================

		for (const [name, cmd] of allCommands) {

			if (!cmd || !cmd.config)
				continue;

			const category =
				cleanCategoryName(
					cmd.config.category
				);

			if (!categories[category]) {
				categories[category] = [];
			}

			if (
				cmd.config.name &&
				!categories[category].includes(
					cmd.config.name
				)
			) {
				categories[category].push(
					cmd.config.name
				);
			}
		}

		// ==============================
		// SORT CATEGORIES
		// ==============================

		const sortedCategories =
			Object.keys(categories).sort();

		// ==============================
		// HEADER
		// ==============================

		let msg =
`👑 SIFAT GOAT BOT 👑

`;

		// ==============================
		// COMMAND LIST
		// ==============================

		for (const category of sortedCategories) {

			msg +=
				`『 ${category.toUpperCase()} 』\n`;

			const commands =
				categories[category].sort(
					(a, b) =>
						a.localeCompare(b)
				);

			for (const command of commands) {
				msg += `* ${command}\n`;
			}

			msg += "\n";
		}

		// ==============================
		// FOOTER
		// ==============================

		msg +=
`━━━━━━━━━━━━━━━━━━
📊 Total Commands: ${allCommands.size}

➥ ${prefix}help [command]
➥ ${prefix}help joke

👑 SIFAT GOAT BOT
━━━━━━━━━━━━━━━━━━`;

		// ==============================
		// SEND HELP
		// ==============================

		const sent =
			await message.reply(msg);

		// ==============================
		// BOT REPLY AUTO UNSEND
		// 15 SECONDS
		// ==============================

		autoDeleteReply(sent);
	}
};


// ======================================
// AUTO DELETE BOT MESSAGE
// 15 SECONDS
// ======================================

function autoDeleteReply(sent) {

	if (!sent)
		return;

	const messageID =
		sent.messageID ||
		sent.id;

	if (!messageID)
		return;

	setTimeout(() => {

		try {

			if (
				global.GoatBot?.fcaApi &&
				typeof global.GoatBot.fcaApi.unsendMessage === "function"
			) {

				global.GoatBot.fcaApi.unsendMessage(
					messageID
				);

			}

		} catch (error) {

			console.log(
				"BOT MESSAGE UNSEND ERROR:",
				error.message
			);

		}

	}, 15000);
						}

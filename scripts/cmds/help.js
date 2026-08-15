const fs = require("fs-extra");
const path = require("path");

module.exports = {
	config: {
		name: "help",
		aliases: ["menu", "commands"],
		version: "5.0",
		author: "MUKUL",
		shortDescription: "Show all commands",
		longDescription: "Display categorized commands",
		category: "system",
		guide: "{pn}help [command]"
	},

	onStart: async function ({ message, args, prefix }) {
		const allCommands = global.GoatBot.commands;
		const categories = {};

		const cleanCategoryName = (text) => {
			if (!text) return "others";

			return text
				.normalize("NFKD")
				.replace(/[^\w\s-]/g, "")
				.replace(/\s+/g, " ")
				.trim()
				.toLowerCase();
		};

		// Command Details
		if (args[0]) {
			const query = args[0].toLowerCase();

			const cmd =
				allCommands.get(query) ||
				[...allCommands.values()].find(
					(c) =>
						(c.config.aliases || [])
							.map((a) => a.toLowerCase())
							.includes(query)
				);

			if (!cmd)
				return message.reply(
					`❌ Command "${query}" not found`
				);

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

			const desc =
				typeof longDescription === "string"
					? longDescription
					: longDescription?.en ||
					  shortDescription?.en ||
					  shortDescription ||
					  "No description";

			const usage =
				typeof guide === "string"
					? guide.replace(/{pn}/g, prefix)
					: guide?.en?.replace(/{pn}/g, prefix) ||
					  `${prefix}${name}`;

			const requiredRole =
				cmd.config.role !== undefined
					? cmd.config.role
					: 0;

			return message.reply(
`👑 𝗠𝗨𝗞𝗨𝗟 𝗚𝗢𝗔𝗧 𝗕𝗢𝗧 👑

☠️ COMMAND INFO ☠️

➥ Name: ${name}
➥ Category: ${category || "Others"}
➥ Description: ${desc}
➥ Aliases: ${aliases?.join(", ") || "None"}
➥ Usage: ${usage}
➥ Permission: ${requiredRole}
➥ Author: ${author || "MUKUL"}
➥ Version: ${version || "1.0"}`
			);
		}

		// Category Sort
		for (const [name, cmd] of allCommands) {
			const cat = cleanCategoryName(
				cmd.config.category
			);

			if (!categories[cat])
				categories[cat] = [];

			categories[cat].push(
				cmd.config.name
			);
		}

		const sortedCategories =
			Object.keys(categories).sort();

		let msg =
`👑 𝗠𝗨𝗞𝗨𝗟 𝗚𝗢𝗔𝗧 𝗕𝗢𝗧 👑

`;

		for (const cat of sortedCategories) {
			msg += `『 ${cat.toUpperCase()} 』\n`;

			const cmds = categories[cat]
				.sort()
				.map((cmd) => `* ${cmd}`)
				.join("\n");

			msg += `${cmds}\n\n`;
		}

		msg +=
`━━━━━━━━━━━━━━━━━━
📌 Total Commands: ${allCommands.size}

➥ ${prefix}help [command]
➥ MUKUL GOAT BOT
━━━━━━━━━━━━━━━━━━`;

		return message.reply(msg);
	}
};

const axios = require("axios");
const fs = require("fs-extra");
const path = require("path");

const API = "https://api.mail.tm";
const DATA_DIR = path.join(__dirname, "tepmail-data");

fs.ensureDirSync(DATA_DIR);

function getFile(uid) {
	return path.join(DATA_DIR, `${uid}.json`);
}

function randomName() {
	return (
		"mukul" +
		Math.random().toString(36).substring(2, 10)
	).toLowerCase();
}

function randomPassword() {
	return (
		"Mukul@" +
		Math.random().toString(36).substring(2, 10) +
		"9!"
	);
}

async function getDomain() {
	const { data } = await axios.get(`${API}/domains`, {
		timeout: 15000
	});

	const domains = data["hydra:member"] || [];

	if (!domains.length)
		throw new Error("No email domain available");

	return domains[0].domain;
}

async function createMail() {
	const domain = await getDomain();

	const address =
		`${randomName()}@${domain}`;

	const password = randomPassword();

	await axios.post(
		`${API}/accounts`,
		{
			address,
			password
		},
		{
			headers: {
				"Content-Type": "application/json"
			},
			timeout: 15000
		}
	);

	const { data: tokenData } =
		await axios.post(
			`${API}/token`,
			{
				address,
				password
			},
			{
				headers: {
					"Content-Type": "application/json"
				},
				timeout: 15000
			}
		);

	return {
		address,
		password,
		token: tokenData.token,
		createdAt: Date.now()
	};
}

module.exports = {
	config: {
		name: "tepmail",
		aliases: ["tempmail", "tmpmail", "tm"],
		version: "2.0",
		author: "MUKUL",
		countDown: 5,
		role: 0,
		shortDescription: "Temporary email",
		longDescription:
			"Create and manage a temporary email inbox.",
		category: "utility",
		guide:
			"{pn} create\n" +
			"{pn} inbox\n" +
			"{pn} read <message-id>\n" +
			"{pn} delete"
	},

	onStart: async function ({
		message,
		args,
		event
	}) {
		const uid = event.senderID;
		const file = getFile(uid);
		const action =
			(args[0] || "create").toLowerCase();

		try {

			// CREATE
			if (
				action === "create" ||
				action === "new"
			) {
				const account =
					await createMail();

				await fs.writeJson(
					file,
					account,
					{ spaces: 2 }
				);

				return message.reply(
`👑 𝗠𝗨𝗞𝗨𝗟 𝗧𝗘𝗠𝗣 𝗠𝗔𝗜𝗟 👑

📧 Email:
${account.address}

🔐 Password:
${account.password}

📥 Inbox:
${this.config.name} inbox

📖 Read:
${this.config.name} read <ID>

🗑️ Delete:
${this.config.name} delete

━━━━━━━━━━━━━━━━━━
⚡ Mail.tm Temp Mail
👑 MUKUL GOAT BOT`
				);
			}

			// CHECK ACCOUNT
			if (!await fs.pathExists(file)) {
				return message.reply(
					"❌ আগে `.tepmail create` দিয়ে email তৈরি করো।"
				);
			}

			const account =
				await fs.readJson(file);

			const headers = {
				Authorization:
					`Bearer ${account.token}`
			};

			// INBOX
			if (
				action === "inbox" ||
				action === "mail" ||
				action === "messages"
			) {
				const { data } =
					await axios.get(
						`${API}/messages`,
						{
							headers,
							timeout: 15000
						}
					);

				const mails =
					data["hydra:member"] || [];

				if (!mails.length) {
					return message.reply(
`📧 ${account.address}

📭 Inbox empty.

কেউ email পাঠালে এখানে দেখা যাবে।`
					);
				}

				let text =
`📧 𝗧𝗘𝗠𝗣 𝗠𝗔𝗜𝗟 𝗜𝗡𝗕𝗢𝗫

📩 ${account.address}

`;

				mails
					.slice(0, 10)
					.forEach((mail, i) => {
						text +=
`${i + 1}. ${mail.subject || "No subject"}
👤 ${mail.from?.address || "Unknown"}
🆔 ${mail.id}
📅 ${mail.createdAt}

`;
					});

				text +=
`Use:
.tepmail read <ID>`;

				return message.reply(text);
			}

			// READ MESSAGE
			if (action === "read") {
				const id = args[1];

				if (!id) {
					return message.reply(
						"❌ Message ID দাও।\n\nExample:\n.tepmail read MESSAGE_ID"
					);
				}

				const { data } =
					await axios.get(
						`${API}/messages/${encodeURIComponent(id)}`,
						{
							headers,
							timeout: 15000
						}
					);

				return message.reply(
`📩 𝗧𝗘𝗠𝗣 𝗠𝗔𝗜𝗟

👤 From:
${data.from?.address || "Unknown"}

📨 To:
${data.to?.[0]?.address || account.address}

📌 Subject:
${data.subject || "No subject"}

━━━━━━━━━━━━━━━━━━

${data.text || "No text available"}

━━━━━━━━━━━━━━━━━━
👑 MUKUL GOAT BOT`
				);
			}

			// DELETE
			if (
				action === "delete" ||
				action === "remove"
			) {
				const me =
					await axios.get(
						`${API}/me`,
						{
							headers,
							timeout: 15000
						}
					);

				await axios.delete(
					`${API}/accounts/${me.data.id}`,
					{
						headers,
						timeout: 15000
					}
				);

				await fs.remove(file);

				return message.reply(
`🗑️ Temporary email deleted.

📧 ${account.address}

👑 MUKUL GOAT BOT`
				);
			}

			return message.reply(
`📧 𝗧𝗘𝗠𝗣 𝗠𝗔𝗜𝗟

.tepmail create
.tepmail inbox
.tepmail read <ID>
.tepmail delete`
			);

		} catch (error) {
			console.error(
				"TEMP MAIL ERROR:",
				error.response?.data || error.message
			);

			return message.reply(
				"❌ Temp Mail service এখন কাজ করছে না। একটু পরে আবার চেষ্টা করো।"
			);
		}
	}
};

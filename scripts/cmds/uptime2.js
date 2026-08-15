const { createCanvas } = require("canvas");
const fs = require("fs-extra");
const path = require("path");
const os = require("os");
const si = require("systeminformation");

module.exports = {
	config: {
		name: "uptime2",
		aliases: ["system", "monitor", "sysinfo"],
		version: "1.0",
		author: "MUKUL",
		countDown: 5,
		role: 0,
		shortDescription: "Premium system monitor",
		longDescription: "Show bot server information in a laptop-style dashboard.",
		category: "system",
		guide: "{pn}"
	},

	onStart: async function ({ message }) {
		try {
			const [
				cpu,
				mem,
				fsSize,
				osInfo,
				system
			] = await Promise.all([
				si.cpu(),
				si.mem(),
				si.fsSize(),
				si.osInfo(),
				si.system()
			]);

			// =========================
			// SERVER INFORMATION
			// =========================

			const totalMem = mem.total;
			const usedMem = totalMem - mem.available;

			const memoryPercent =
				(usedMem / totalMem) * 100;

			const load =
				os.loadavg()[0];

			const cpuCores =
				os.cpus().length;

			const uptime =
				process.uptime();

			const days =
				Math.floor(uptime / 86400);

			const hours =
				Math.floor(
					(uptime % 86400) / 3600
				);

			const minutes =
				Math.floor(
					(uptime % 3600) / 60
				);

			const seconds =
				Math.floor(uptime % 60);

			const uptimeText =
				`${days}d ${hours}h ${minutes}m ${seconds}s`;

			const disk =
				fsSize.length
					? fsSize[0]
					: null;

			const diskPercent =
				disk
					? disk.use
					: 0;

			// =========================
			// CANVAS
			// =========================

			const width = 1536;
			const height = 1024;

			const canvas =
				createCanvas(width, height);

			const ctx =
				canvas.getContext("2d");

			// Background
			const bg =
				ctx.createLinearGradient(
					0,
					0,
					width,
					height
				);

			bg.addColorStop(
				0,
				"#07101d"
			);

			bg.addColorStop(
				0.5,
				"#101827"
			);

			bg.addColorStop(
				1,
				"#06111d"
			);

			ctx.fillStyle = bg;

			ctx.fillRect(
				0,
				0,
				width,
				height
			);

			// =========================
			// HELPER FUNCTIONS
			// =========================

			function roundRect(
				x,
				y,
				w,
				h,
				r,
				fill,
				stroke
			) {
				ctx.beginPath();

				ctx.roundRect(
					x,
					y,
					w,
					h,
					r
				);

				if (fill) {
					ctx.fillStyle = fill;
					ctx.fill();
				}

				if (stroke) {
					ctx.strokeStyle = stroke;
					ctx.lineWidth = 2;
					ctx.stroke();
				}
			}

			function text(
				value,
				x,
				y,
				size,
				color,
				align = "left",
				weight = "normal"
			) {
				ctx.font =
					`${weight} ${size}px Arial`;

				ctx.fillStyle = color;

				ctx.textAlign = align;

				ctx.fillText(
					value,
					x,
					y
				);
			}

			function gauge(
				cx,
				cy,
				radius,
				percent,
				color,
				label
			) {
				const start =
					-Math.PI * 0.75;

				const end =
					Math.PI * 0.75;

				// Outer ring
				ctx.beginPath();

				ctx.arc(
					cx,
					cy,
					radius,
					start,
					end
				);

				ctx.strokeStyle =
					"#1d2635";

				ctx.lineWidth = 28;

				ctx.stroke();

				// Progress
				ctx.beginPath();

				ctx.arc(
					cx,
					cy,
					radius,
					start,
					start +
						(end - start) *
							Math.min(
								percent / 100,
								1
							)
				);

				ctx.strokeStyle =
					color;

				ctx.lineWidth = 28;

				ctx.lineCap =
					"round";

				ctx.shadowBlur = 20;

				ctx.shadowColor =
					color;

				ctx.stroke();

				ctx.shadowBlur = 0;

				text(
					`${Math.round(percent)}%`,
					cx,
					cy + 15,
					42,
					"#ffffff",
					"center",
					"bold"
				);

				text(
					label,
					cx,
					cy - radius - 35,
					23,
					"#dce6f2",
					"center",
					"bold"
				);
			}

			// =========================
			// HEADER
			// =========================

			roundRect(
				50,
				35,
				1436,
				95,
				25,
				"#101d2c",
				"#173d57"
			);

			text(
				"⚡ MUKUL-GOAT-BOT",
				90,
				92,
				35,
				"#00aaff",
				"left",
				"bold"
			);

			text(
				"v5.1",
				390,
				90,
				20,
				"#00ff9d",
				"left",
				"bold"
			);

			text(
				"● ONLINE",
				1400,
				90,
				22,
				"#00ff9d",
				"right",
				"bold"
			);

			// =========================
			// TOP INFO CARDS
			// =========================

			const cardY = 155;
			const cardW = 325;
			const cardH = 145;

			const cards = [
				{
					x: 55,
					title: "HOSTNAME",
					value:
						os.hostname()
							.substring(0, 20)
				},
				{
					x: 405,
					title: "OS",
					value:
						`${osInfo.distro || "Linux"}`
				},
				{
					x: 755,
					title: "PROCESSOR",
					value:
						cpu.brand
							.substring(0, 23)
				},
				{
					x: 1105,
					title: "UPTIME",
					value:
						uptimeText
				}
			];

			for (const card of cards) {
				roundRect(
					card.x,
					cardY,
					cardW,
					cardH,
					20,
					"#101722",
					"#26384c"
				);

				text(
					card.title,
					card.x + 25,
					cardY + 40,
					18,
					"#7c8b9d",
					"left",
					"bold"
				);

				text(
					card.value,
					card.x + 25,
					cardY + 92,
					21,
					"#e8f2ff",
					"left",
					"bold"
				);
			}

			// =========================
			// GAUGE PANEL
			// =========================

			roundRect(
				55,
				330,
				1030,
				450,
				25,
				"#0d1623",
				"#1e3042"
			);

			gauge(
				270,
				555,
				130,
				Math.min(
					load * 25,
					100
				),
				"#ff405d",
				"CPU"
			);

			gauge(
				570,
				555,
				130,
				memoryPercent,
				"#ffd52e",
				"MEMORY"
			);

			gauge(
				870,
				555,
				130,
				diskPercent,
				"#00aaff",
				"DISK"
			);

			// =========================
			// SYSTEM DETAILS
			// =========================

			roundRect(
				1110,
				330,
				375,
				450,
				25,
				"#101722",
				"#26384c"
			);

			text(
				"SYSTEM DETAILS",
				1140,
				375,
				22,
				"#8d9bad",
				"left",
				"bold"
			);

			const details = [
				[
					"Node.js",
					process.version
				],
				[
					"CPU Cores",
					`${cpuCores} Core`
				],
				[
					"Load Avg",
					load.toFixed(2)
				],
				[
					"Memory",
					`${(usedMem / 1073741824).toFixed(1)} / ${(totalMem / 1073741824).toFixed(1)} GB`
				],
				[
					"Process",
					`${process.pid}`
				],
				[
					"Platform",
					os.platform()
				]
			];

			let detailY = 425;

			for (const [key, value] of details) {
				text(
					key,
					1140,
					detailY,
					18,
					"#647386"
				);

				text(
					value,
					1455,
					detailY,
					18,
					"#00c8ff",
					"right",
					"bold"
				);

				detailY += 48;
			}

			// =========================
			// NETWORK BAR
			// =========================

			roundRect(
				55,
				810,
				1430,
				100,
				22,
				"#0e1825",
				"#1e3042"
			);

			text(
				"NETWORK",
				85,
				850,
				18,
				"#7b8a9b",
				"left",
				"bold"
			);

			text(
				"↓ DOWNLOAD",
				330,
				850,
				18,
				"#4bffb0",
				"left",
				"bold"
			);

			text(
				"0.0 KB/s",
				610,
				850,
				18,
				"#dce8f4",
				"right"
			);

			text(
				"↑ UPLOAD",
				760,
				850,
				18,
				"#ffe04a",
				"left",
				"bold"
			);

			text(
				"0.0 KB/s",
				1030,
				850,
				18,
				"#dce8f4",
				"right"
			);

			// =========================
			// FOOTER
			// =========================

			text(
				"✦ MUKUL GOAT BOT • PREMIUM SYSTEM MONITOR ✦",
				width / 2,
				970,
				24,
				"#00aaff",
				"center",
				"bold"
			);

			// =========================
			// SAVE IMAGE
			// =========================

			const cacheDir =
				path.join(
					__dirname,
					"cache"
				);

			await fs.ensureDir(
				cacheDir
			);

			const filePath =
				path.join(
					cacheDir,
					`uptime3_${Date.now()}.png`
				);

			await fs.writeFile(
				filePath,
				canvas.toBuffer("image/png")
			);

			return message.reply({
				body:
`👑 𝗠𝗨𝗞𝗨𝗟 𝗚𝗢𝗔𝗧 𝗕𝗢𝗧
🟢 SYSTEM ONLINE
⏱️ Uptime: ${uptimeText}`,
				attachment:
					fs.createReadStream(
						filePath
					)
			});

		} catch (error) {
			console.error(
				"UPTIME3 ERROR:",
				error
			);

			return message.reply(
				"❌ System monitor তৈরি করতে সমস্যা হয়েছে।"
			);
		}
	}
};

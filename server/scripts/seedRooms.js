const mongoose = require("mongoose");
const dotenv = require("dotenv");
const Room = require("../models/roomModel");

dotenv.config({ path: "./.env" });

const DB = process.env.DATABASE.replace(
	"<PASSWORD>",
	process.env.DATABASE_PASSWORD
);

const officialRooms = [
	{
		name: "Safe Space",
		description:
			"A judgment-free zone for sharing struggles and supporting each other",
		category: "Support",
		resetInterval: 24,
		maxParticipants: 100,
		roomType: "official",
		nextResetAt: new Date(Date.now() + 24 * 60 * 60 * 1000),
		expiresAt: null,
	},
	{
		name: "Career Advice",
		description:
			"Get anonymous career guidance and professional development tips",
		category: "Professional",
		resetInterval: 72,
		maxParticipants: 150,
		roomType: "official",
		nextResetAt: new Date(Date.now() + 72 * 60 * 60 * 1000),
		expiresAt: null,
	},
	{
		name: "Creative Corner",
		description: "Share your art, writing, and creative projects anonymously",
		category: "Creative",
		resetInterval: 168,
		maxParticipants: 200,
		roomType: "official",
		nextResetAt: new Date(Date.now() + 168 * 60 * 60 * 1000),
		expiresAt: null,
	},
	{
		name: "Relationship Talk",
		description: "Discuss relationships, dating, and connections anonymously",
		category: "Relationships",
		resetInterval: 24,
		maxParticipants: 100,
		roomType: "official",
		nextResetAt: new Date(Date.now() + 24 * 60 * 60 * 1000),
		expiresAt: null,
	},
	{
		name: "Tech Hub",
		description: "Discuss technology, programming, and digital innovation",
		category: "Technology",
		resetInterval: 72,
		maxParticipants: 150,
		roomType: "official",
		nextResetAt: new Date(Date.now() + 72 * 60 * 60 * 1000),
		expiresAt: null,
	},
	{
		name: "Random Thoughts",
		description: "Share your random thoughts and have casual conversations",
		category: "Discussion",
		resetInterval: 24,
		maxParticipants: 200,
		roomType: "official",
		nextResetAt: new Date(Date.now() + 24 * 60 * 60 * 1000),
		expiresAt: null,
	},
	{
		name: "Mental Health",
		description:
			"A supportive space for mental health discussions and peer support",
		category: "Support",
		resetInterval: 24,
		maxParticipants: 100,
		roomType: "official",
		nextResetAt: new Date(Date.now() + 24 * 60 * 60 * 1000),
		expiresAt: null,
	},
	{
		name: "Study Group",
		description: "Anonymous study sessions and academic support",
		category: "Professional",
		resetInterval: 72,
		maxParticipants: 150,
		roomType: "official",
		nextResetAt: new Date(Date.now() + 72 * 60 * 60 * 1000),
		expiresAt: null,
	},
];

const seedRooms = async () => {
	try {
		await mongoose.connect(DB);
		console.log("Connected to database");

		await Room.deleteMany({ roomType: "official" });
		console.log("Deleted existing official rooms");

		await Room.insertMany(officialRooms);
		console.log(`${officialRooms.length} official rooms seeded successfully!`);

		process.exit(0);
	} catch (error) {
		console.error("Error seeding rooms:", error);
		process.exit(1);
	}
};

seedRooms();

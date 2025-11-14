require("dotenv").config();
const mongoose = require("mongoose");
const { faker } = require("@faker-js/faker");

const User = require("../models/userModel");
const Post = require("../models/postModel");
const Follower = require("../models/followerModel");

// Constants
const NUM_USERS = 200;
const MIN_FRIENDS = 15;
const MAX_FRIENDS = 60;
const MIN_POSTS_PER_USER = 1;
const MAX_POSTS_PER_USER = 5;
const MIN_COMMENTS_PER_POST = 5;
const MAX_COMMENTS_PER_POST = 20;
const USERS_WITH_WORK_EDUCATION = 50;

// Cities with timezone offsets
const CITIES = [
	// Western
	{ name: "New York", timezone: -5, region: "Americas" },
	{ name: "Los Angeles", timezone: -8, region: "Americas" },
	{ name: "London", timezone: 0, region: "Europe" },
	{ name: "Paris", timezone: 1, region: "Europe" },
	{ name: "Berlin", timezone: 1, region: "Europe" },
	{ name: "Amsterdam", timezone: 1, region: "Europe" },
	{ name: "Toronto", timezone: -5, region: "Americas" },
	{ name: "San Francisco", timezone: -8, region: "Americas" },
	{ name: "Chicago", timezone: -6, region: "Americas" },
	{ name: "Miami", timezone: -5, region: "Americas" },
	// Asian
	{ name: "Tokyo", timezone: 9, region: "Asia" },
	{ name: "Singapore", timezone: 8, region: "Asia" },
	{ name: "Seoul", timezone: 9, region: "Asia" },
	{ name: "Hong Kong", timezone: 8, region: "Asia" },
	{ name: "Mumbai", timezone: 5.5, region: "Asia" },
	{ name: "Bangkok", timezone: 7, region: "Asia" },
	{ name: "Manila", timezone: 8, region: "Asia" },
	{ name: "Shanghai", timezone: 8, region: "Asia" },
	// Middle Eastern
	{ name: "Dubai", timezone: 4, region: "Middle East" },
	{ name: "Tel Aviv", timezone: 2, region: "Middle East" },
	{ name: "Istanbul", timezone: 3, region: "Middle East" },
	{ name: "Riyadh", timezone: 3, region: "Middle East" },
	{ name: "Cairo", timezone: 2, region: "Middle East" },
];

const INTERESTS = [
	"sports",
	"music",
	"technology",
	"art",
	"travel",
	"gaming",
	"fitness",
	"photography",
	"cooking",
	"fashion",
	"movies",
	"books",
	"entrepreneurship",
	"yoga",
	"hiking",
	"crypto",
	"AI",
	"sneakers",
	"coffee",
	"design",
];

const PROFESSIONS = [
	"Software Engineer",
	"Product Manager",
	"Data Scientist",
	"UX Designer",
	"Marketing Manager",
	"Financial Analyst",
	"Content Creator",
	"Graphic Designer",
	"Teacher",
	"Consultant",
	"Entrepreneur",
	"Sales Manager",
	"HR Manager",
	"Photographer",
	"Writer",
	"Architect",
	"Engineer",
	"Chef",
	"Artist",
	"Fitness Coach",
	"Social Media Manager",
	"Project Manager",
	"Business Analyst",
	"Developer",
	"Designer",
];

const COMPANIES = [
	"Google",
	"Meta",
	"Apple",
	"Amazon",
	"Microsoft",
	"Netflix",
	"Tesla",
	"Spotify",
	"Airbnb",
	"Uber",
	"Stripe",
	"OpenAI",
	"Adobe",
	"Salesforce",
	"Twitter",
	"LinkedIn",
	"Shopify",
	"Dropbox",
	"Zoom",
	"Slack",
	"TikTok",
	"Pinterest",
	"Reddit",
	"Discord",
	"Figma",
];

const UNIVERSITIES = [
	"Stanford University",
	"MIT",
	"Harvard University",
	"UC Berkeley",
	"Oxford University",
	"Cambridge University",
	"Yale University",
	"Princeton University",
	"Columbia University",
	"NYU",
	"UCLA",
	"University of Toronto",
	"Imperial College London",
	"ETH Zurich",
	"National University of Singapore",
	"University of Tokyo",
	"Seoul National University",
	"Tsinghua University",
	"IIT Delhi",
	"Tel Aviv University",
];

// Post content templates with modern slang and events
const POST_TEMPLATES = {
	2016: [
		"Pokemon Go got me walking more than ever lol",
		"Can't stop playing Overwatch, anyone wanna squad up?",
		"RIP Prince, your music meant everything",
		"Leicester winning the Premier League is insane!",
		"Just finished Stranger Things, absolutely hooked",
		"Hamilton tickets are impossible to get smh",
		"Cubs won the World Series after 108 years! Historic!",
		"This election season is wild",
		"Dabbing is so 2015 but here we are",
		"Rio Olympics were fire",
	],
	2017: [
		"Just got my iPhone X, Face ID is crazy",
		"Despacito is literally everywhere",
		"Bitcoin is going nuts, should I invest?",
		"Fidget spinners are taking over",
		"Get Out was absolutely brilliant",
		"Watching the solar eclipse was surreal",
		"PUBG has me addicted fr",
		"Rick and Morty S3 did not disappoint",
		"LA LA Land deserved that Oscar tbh",
		"Stranger Things 2 hype!",
	],
	2018: [
		"Black Panther was everything",
		"Fortnite dances are taking over",
		"World Cup in Russia was insane",
		"Infinity War ending had me shook",
		"Just deleted my Facebook lol",
		"AirPods looking kinda fresh ngl",
		"Drake's In My Feelings challenge everywhere",
		"Bird Box memes are out of control",
		"RDR2 is a masterpiece",
		"Ariana Grande's Thank U Next is on repeat",
	],
	2019: [
		"Endgame was worth the 11 year wait",
		"Area 51 raid memes are wild",
		"Game of Thrones finale... we don't talk about it",
		"Old Town Road is still #1 somehow",
		"Disney+ just dropped, canceling Netflix",
		"Baby Yoda is the best thing this year",
		"OK boomer is my new favorite phrase",
		"Billie Eilish deserved those Grammys",
		"VSCO girls and sksksk everywhere",
		"Hong Kong protests are serious",
	],
	2020: [
		"2020 hitting different, stay safe everyone",
		"Working from home is the new normal",
		"Among Us is so addicting",
		"Tiger King was an experience",
		"Sourdough bread phase unlocked",
		"RIP Kobe, legend forever",
		"Animal Crossing keeping me sane",
		"TikTok dances are my new hobby",
		"Zoom meetings all day every day",
		"The Last Dance documentary is incredible",
	],
	2021: [
		"GME to the moon, Diamond hands",
		"Squid Game had me binge watching all night",
		"NFTs are everywhere now",
		"Finally got vaccinated, feels good",
		"Dune was visually stunning",
		"Wordle is my new daily ritual",
		"Spider-Man No Way Home broke me",
		"Succession S3 is peak television",
		"Crypto winter hitting hard",
		"Going back to the office feels weird",
	],
	2022: [
		"Wordle 234 3/6, getting better at this",
		"Everything Everywhere All At Once is a masterpiece",
		"Can't believe Twitter got bought out",
		"Top Gun Maverick exceeded expectations",
		"World Cup in Qatar was controversial but exciting",
		"House of the Dragon actually delivered",
		"Elden Ring GOTY for sure",
		"ChatGPT is lowkey scary but amazing",
		"Wednesday Addams dance went viral",
		"The Bear is the best new show",
	],
	2023: [
		"Barbenheimer was the event of the summer",
		"Trying to get Taylor Swift Eras tour tickets is impossible",
		"AI is taking over everything",
		"Threads vs Twitter drama is entertaining",
		"The Last of Us adaptation was perfect",
		"Succession finale hit different",
		"Baldur's Gate 3 is consuming my life",
		"TOTK might be better than BOTW",
		"Poor Things is wild and brilliant",
		"Beyonce's Renaissance tour was unreal",
	],
	2024: [
		"Dune Part 2 was absolutely epic",
		"AI tools making my work so much easier",
		"Shogun is incredible television",
		"Wicked movie exceeded expectations",
		"Inside Out 2 had me crying",
		"Kendrick vs Drake beef is crazy",
		"The Bear S3 maintaining quality",
		"Olympics in Paris were beautiful",
		"True Detective Night Country was dark",
		"Deadpool and Wolverine didn't disappoint",
	],
	2025: [
		"GTA 6 hype is real",
		"Can't believe it's already 2025",
		"AI agents are getting wild",
		"Marvel seems to be back on track",
		"New music releases hitting different this year",
		"The Batman Part II trailer looks sick",
		"Avatar 3 is gonna be insane",
		"VR is finally getting mainstream",
		"Excited for what this year brings",
		"New year new me but for real this time",
	],
};

const COMMENT_TEMPLATES = [
	"this is fire",
	"no cap",
	"facts",
	"so true",
	"felt that",
	"mood",
	"same energy",
	"this hits different",
	"absolutely",
	"couldn't agree more",
	"big fan of this",
	"love this for you",
	"living for this",
	"this ain't it chief",
	"not gonna lie this slaps",
	"sending good vibes",
	"rooting for you",
	"proud of you",
	"you got this",
	"let's gooo",
	"yesss",
	"obsessed",
	"iconic",
	"legend",
	"king/queen",
	"manifesting this",
	"here for it",
	"what a vibe",
	"immaculate",
	"goated",
];

// Helper functions
function getRandomInt(min, max) {
	return Math.floor(Math.random() * (max - min + 1)) + min;
}

function getRandomElement(array) {
	return array[Math.floor(Math.random() * array.length)];
}

function getRandomElements(array, count) {
	const shuffled = [...array].sort(() => 0.5 - Math.random());
	return shuffled.slice(0, count);
}

function generateUsername(fullName, birthYear) {
	// Remove any characters that aren't letters, numbers, or spaces, then split
	const sanitized = fullName.toLowerCase().replace(/[^a-z0-9\s]/g, "");
	const nameParts = sanitized.split(" ").filter((part) => part.length > 0);

	const firstName = nameParts[0] || "user";
	const lastName = nameParts[1] || nameParts[0];

	const variations = [
		`${firstName}.${lastName}`,
		`${firstName}_${lastName}`,
		`${firstName}${lastName}`,
		`${firstName}.${lastName}${birthYear % 100}`,
		`${firstName}_${getRandomInt(10, 999)}`,
		`${lastName}.${firstName}`,
		`${firstName}${getRandomInt(10, 99)}`,
	];
	return getRandomElement(variations);
}

function generateBio(interests, occupation, city) {
	const bioTemplates = [
		`${occupation} based in ${city} | ${interests[0]} enthusiast | living life one day at a time`,
		`passionate about ${interests[0]} & ${interests[1] || "life"} | ${city} local | ${occupation}`,
		`${occupation} | ${interests[0]} lover | ${city} vibes | always learning`,
		`just a ${occupation.toLowerCase()} who loves ${interests[0]} | ${city} born and raised`,
		`${interests[0]} addict | ${occupation} by day | ${city} is home`,
		`${city} native | ${occupation} | obsessed with ${interests[0]} and ${
			interests[1] || "coffee"
		}`,
		`living in ${city} | ${occupation} | ${interests[0]} is my therapy`,
		`${occupation} who can't stop talking about ${interests[0]} | ${city} life`,
		`${interests[0]} ${interests[1] ? "and " + interests[1] : ""} | ${occupation} | ${city}`,
		`making it work in ${city} | ${occupation} | ${interests[0]} on repeat`,
		`${city} | ${occupation} | probably at a ${interests[0]} event right now`,
		`${occupation} in ${city} | ${interests[0]} enthusiast | DMs open`,
		`${interests[0]} is life | ${occupation} | ${city} forever`,
		`your local ${occupation} | ${interests[0]} fanatic | ${city} represent`,
	];
	return getRandomElement(bioTemplates);
}

function generateRandomDate(start, end, timezoneOffset = 0) {
	const date = new Date(
		start.getTime() + Math.random() * (end.getTime() - start.getTime())
	);
	// Adjust for timezone
	date.setHours(date.getHours() + timezoneOffset);
	return date;
}

function generatePostContent(year, interests) {
	const yearTemplates = POST_TEMPLATES[year] || POST_TEMPLATES[2024];
	const templates = [
		...yearTemplates,
		`just had the best ${getRandomElement(interests)} session`,
		`${getRandomElement(interests)} hits different when you're passionate about it`,
		`another day, another ${getRandomElement(interests)} achievement`,
		`can't get enough of ${getRandomElement(interests)}`,
		`${getRandomElement(interests)} community is the best`,
		`obsessed with ${getRandomElement(interests)} lately`,
		`${getRandomElement(interests)} vibes today`,
		`who else is into ${getRandomElement(interests)}?`,
		`${getRandomElement(interests)} season is here`,
		`living for these ${getRandomElement(interests)} moments`,
	];
	return getRandomElement(templates);
}

function generateComment(postContent, commenterName, isReply = false) {
	const shortResponses = COMMENT_TEMPLATES;
	const questionResponses = [
		"thoughts on this?",
		"what do you think?",
		"how did you manage that?",
		"where was this?",
		"when did this happen?",
		"tell me more!",
		"need the details",
		"spill the tea",
		"wait what??",
		"explain pls",
	];

	const congratsResponses = [
		"congrats!",
		"so happy for you!",
		"you deserved this",
		"proud of you!",
		"that's amazing!",
		"incredible news!",
		"well done!",
		"yasss!",
		"let's goooo!",
	];

	const teasingResponses = [
		`${commenterName.split(" ")[0]} always with the hot takes`,
		"here we go again lol",
		"classic move",
		"you would say that",
		"of course you did",
		"naturally",
		"this is so you",
		"no surprises here",
	];

	const responses = [
		...shortResponses,
		...questionResponses,
		...congratsResponses,
		...teasingResponses,
	];

	return getRandomElement(responses);
}

// Database connection
const connectDB = async () => {
	try {
		const DB = process.env.DATABASE.replace(
			"<PASSWORD>",
			process.env.DATABASE_PASSWORD
		);
		await mongoose.connect(DB);
		console.log("MongoDB connected successfully!");
	} catch (err) {
		console.error("Failed to connect to MongoDB", err);
		process.exit(1);
	}
};

// Clear database
const clearDatabase = async () => {
	try {
		await User.deleteMany({});
		await Post.deleteMany({});
		await Follower.deleteMany({});
		console.log("Database cleared!");
	} catch (err) {
		console.error("Error clearing database:", err);
		throw err;
	}
};

// Generate users
const generateUsers = async () => {
	console.log("Generating users...");
	const users = [];

	for (let i = 0; i < NUM_USERS; i++) {
		const gender = getRandomElement(["male", "female"]);
		const firstName = faker.person.firstName(gender);
		const lastName = faker.person.lastName();
		const fullName = `${firstName} ${lastName}`;
		const birthYear = getRandomInt(1971, 2007); // Ages 18-54 in 2025
		const city = getRandomElement(CITIES);
		const interests = getRandomElements(INTERESTS, getRandomInt(1, 2));
		const occupation = getRandomElement(PROFESSIONS);
		const username = generateUsername(fullName, birthYear);
		const email = `${username.replace(/[._]/g, "")}@${getRandomElement([
			"gmail.com",
			"yahoo.com",
			"outlook.com",
			"icloud.com",
			"proton.me",
			"hey.com",
		])}`;
		const bio = generateBio(interests, occupation, city.name);

		// Generate signup date between 2016 and 2025
		const signupDate = generateRandomDate(
			new Date(2016, 0, 1),
			new Date(2025, 11, 31),
			city.timezone
		);

		// Use generated/artificial avatars instead of real photos
		// Mix of different avatar generation services
		const avatarType = getRandomInt(1, 7);
		let profilePicture;

		switch (avatarType) {
			case 1:
				profilePicture = `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(
					username
				)}`;
				break;
			case 2:
				profilePicture = `https://api.dicebear.com/7.x/bottts/svg?seed=${encodeURIComponent(
					username
				)}`;
				break;
			case 3:
				profilePicture = `https://api.dicebear.com/7.x/personas/svg?seed=${encodeURIComponent(
					username
				)}`;
				break;
			case 4:
				profilePicture = `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(
					fullName
				)}`;
				break;
			case 5:
				profilePicture = `https://ui-avatars.com/api/?name=${encodeURIComponent(
					fullName
				)}&background=random&size=200`;
				break;
			case 6:
				profilePicture = `https://source.boringavatars.com/beam/120/${encodeURIComponent(
					username
				)}`;
				break;
			case 7:
				profilePicture = `https://source.boringavatars.com/marble/120/${encodeURIComponent(
					username
				)}`;
				break;
			default:
				profilePicture = `https://ui-avatars.com/api/?name=${encodeURIComponent(
					fullName
				)}&size=200`;
		}

		const privacySetting = Math.random() > 0.7 ? "private" : "public";

		const userData = {
			username,
			email,
			password: "password123",
			passwordConfirm: "password123",
			fullName,
			bio,
			location: city.name,
			birthday: new Date(birthYear, getRandomInt(0, 11), getRandomInt(1, 28)),
			occupation,
			isVerified: Math.random() > 0.9,
			createdAt: signupDate,
			updatedAt: signupDate,
		};

		// Add profile picture for 90% of users (some users don't have profile pics)
		if (Math.random() > 0.1) {
			userData.profilePicture = profilePicture;
		}

		// Add work and university for 50 random users
		if (i < USERS_WITH_WORK_EDUCATION) {
			userData.website = `https://${getRandomElement(COMPANIES)
				.toLowerCase()
				.replace(/\s+/g, "")}.com`;
		}

		const user = await User.create(userData);

		users.push({
			_id: user._id,
			username: user.username,
			fullName: user.fullName,
			interests,
			city,
			occupation,
			birthYear,
			signupDate,
			company: i < USERS_WITH_WORK_EDUCATION ? getRandomElement(COMPANIES) : null,
			university:
				i < USERS_WITH_WORK_EDUCATION ? getRandomElement(UNIVERSITIES) : null,
			privacySetting,
		});

		if ((i + 1) % 20 === 0) {
			console.log(`Created ${i + 1}/${NUM_USERS} users`);
		}
	}

	console.log(`Successfully created ${users.length} users!`);
	return users;
};

// Generate friend networks
const generateFriendNetworks = async (users) => {
	console.log("Generating friend networks...");
	const followers = [];

	// Calculate similarity score between two users
	const getSimilarityScore = (user1, user2) => {
		let score = 0;

		// Same city
		if (user1.city.name === user2.city.name) score += 5;

		// Same region
		if (user1.city.region === user2.city.region) score += 2;

		// Shared interests
		const sharedInterests = user1.interests.filter((i) =>
			user2.interests.includes(i)
		);
		score += sharedInterests.length * 3;

		// Similar age (within 5 years)
		if (Math.abs(user1.birthYear - user2.birthYear) <= 5) score += 2;

		// Same occupation
		if (user1.occupation === user2.occupation) score += 3;

		// Both have work/education info
		if (user1.company && user2.company) score += 1;

		// Same company
		if (user1.company === user2.company) score += 4;

		// Same university
		if (user1.university === user2.university) score += 4;

		return score;
	};

	// Create friend connections for each user
	for (let i = 0; i < users.length; i++) {
		const user = users[i];
		const numFriends = getRandomInt(MIN_FRIENDS, MAX_FRIENDS);

		// Calculate similarity scores with all other users
		const candidates = users
			.filter((u) => u._id.toString() !== user._id.toString())
			.map((u) => ({
				user: u,
				score: getSimilarityScore(user, u),
			}));

		// Sort by similarity score and add some randomness
		candidates.sort((a, b) => {
			const scoreDiff = b.score - a.score;
			const randomFactor = (Math.random() - 0.5) * 3;
			return scoreDiff + randomFactor;
		});

		// Select top candidates with some randomness
		const selectedFriends = candidates.slice(0, numFriends);

		// Add a few "bridge" connections (random users from different clusters)
		const bridgeCount = Math.min(3, Math.floor(numFriends * 0.1));
		const bridgeFriends = getRandomElements(
			candidates.slice(numFriends),
			bridgeCount
		);
		selectedFriends.push(...bridgeFriends);

		// Create follower relationships
		for (const friend of selectedFriends) {
			// Bidirectional friendship
			followers.push({
				follower: user._id,
				following: friend.user._id,
				createdAt: generateRandomDate(
					new Date(
						Math.max(user.signupDate.getTime(), friend.user.signupDate.getTime())
					),
					new Date(),
					user.city.timezone
				),
			});

			// Most friendships are reciprocal
			if (Math.random() > 0.2) {
				followers.push({
					follower: friend.user._id,
					following: user._id,
					createdAt: generateRandomDate(
						new Date(
							Math.max(
								user.signupDate.getTime(),
								friend.user.signupDate.getTime()
							)
						),
						new Date(),
						user.city.timezone
					),
				});
			}
		}

		if ((i + 1) % 20 === 0) {
			console.log(`Generated friend network for ${i + 1}/${users.length} users`);
		}
	}

	// Remove duplicates
	const uniqueFollowers = [];
	const followerSet = new Set();

	for (const follower of followers) {
		const key = `${follower.follower}-${follower.following}`;
		if (!followerSet.has(key)) {
			followerSet.add(key);
			uniqueFollowers.push(follower);
		}
	}

	console.log(`Creating ${uniqueFollowers.length} follower relationships...`);
	await Follower.insertMany(uniqueFollowers);
	console.log("Friend networks created!");

	return uniqueFollowers;
};

// Generate posts
const generatePosts = async (users) => {
	console.log("Generating posts...");
	const posts = [];
	const now = new Date();

	// We want most posts to be recent and visible
	// 70% of posts from last 7 days, 20% from last 30 days, 10% older
	const recentThreshold = 0.7;
	const mediumThreshold = 0.9;

	for (let i = 0; i < users.length; i++) {
		const user = users[i];
		const numPosts = getRandomInt(MIN_POSTS_PER_USER, MAX_POSTS_PER_USER);

		for (let j = 0; j < numPosts; j++) {
			let postDate;
			const rand = Math.random();

			if (rand < recentThreshold) {
				// Recent posts (last 7 days) - these will mostly be active
				postDate = generateRandomDate(
					new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000),
					now,
					user.city.timezone
				);
			} else if (rand < mediumThreshold) {
				// Medium age posts (7-30 days ago)
				postDate = generateRandomDate(
					new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000),
					new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000),
					user.city.timezone
				);
			} else {
				// Older posts (more historical data)
				postDate = generateRandomDate(
					user.signupDate,
					new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000),
					user.city.timezone
				);
			}

			const year = postDate.getFullYear();
			const content = generatePostContent(year, user.interests);

			// Calculate how long ago the post was created
			const ageInHours = (now - postDate) / (1000 * 60 * 60);

			let expiresAt;
			let renewalCount = 0;
			let renewedAt = null;

			// Posts less than 24 hours old - still in first lifecycle
			if (ageInHours < 24) {
				expiresAt = new Date(postDate.getTime() + 24 * 60 * 60 * 1000);
			}
			// Posts 24-72 hours old - might have been renewed once or twice
			else if (ageInHours < 72) {
				renewalCount = Math.min(getRandomInt(1, 2), 3);
				// Last renewal was recent enough to keep it alive
				const lastRenewalHoursAgo = getRandomInt(1, 20);
				renewedAt = new Date(now.getTime() - lastRenewalHoursAgo * 60 * 60 * 1000);
				expiresAt = new Date(renewedAt.getTime() + 24 * 60 * 60 * 1000);
			}
			// Posts 3-7 days old - might have been renewed multiple times or expired
			else if (ageInHours < 168) {
				// 60% chance it was renewed and is still active
				if (Math.random() < 0.6) {
					renewalCount = Math.min(getRandomInt(2, 3), 3);
					const lastRenewalHoursAgo = getRandomInt(1, 22);
					renewedAt = new Date(now.getTime() - lastRenewalHoursAgo * 60 * 60 * 1000);
					expiresAt = new Date(renewedAt.getTime() + 24 * 60 * 60 * 1000);
				} else {
					// Expired - hit the renewal limit or wasn't renewed
					renewalCount = 3; // Hit max renewals
					renewedAt = new Date(postDate.getTime() + 72 * 60 * 60 * 1000);
					expiresAt = new Date(renewedAt.getTime() + 24 * 60 * 60 * 1000);
				}
			}
			// Older posts - these are expired (historical data)
			else {
				// These posts have expired
				expiresAt = new Date(postDate.getTime() + 24 * 60 * 60 * 1000);
				// Some might have been renewed before expiring
				if (Math.random() < 0.3) {
					renewalCount = getRandomInt(1, 3);
					renewedAt = new Date(postDate.getTime() + getRandomInt(24, 72) * 60 * 60 * 1000);
					expiresAt = new Date(renewedAt.getTime() + 24 * 60 * 60 * 1000);
				}
			}

			const post = {
				user: user._id,
				content,
				media: [],
				views: getRandomInt(0, 1000),
				comments: [],
				expiresAt,
				renewalCount,
				renewedAt,
				createdAt: postDate,
				updatedAt: renewedAt || postDate,
			};

			posts.push(post);
		}

		if ((i + 1) % 20 === 0) {
			console.log(`Generated posts for ${i + 1}/${users.length} users`);
		}
	}

	console.log(`Creating ${posts.length} posts...`);
	const createdPosts = await Post.insertMany(posts);

	const activePosts = createdPosts.filter(p => p.expiresAt > now).length;
	const expiredPosts = createdPosts.length - activePosts;

	console.log(`Posts created! (${activePosts} active, ${expiredPosts} expired)`);

	return createdPosts;
};

// Generate comments
const generateComments = async (posts, users) => {
	console.log("Generating comments...");

	// Create a map of user friends for realistic commenting
	const userFriendsMap = new Map();
	const followers = await Follower.find({});

	followers.forEach((f) => {
		if (!userFriendsMap.has(f.follower.toString())) {
			userFriendsMap.set(f.follower.toString(), []);
		}
		userFriendsMap.get(f.follower.toString()).push(f.following.toString());
	});

	for (let i = 0; i < posts.length; i++) {
		const post = posts[i];
		const numComments = getRandomInt(
			MIN_COMMENTS_PER_POST,
			MAX_COMMENTS_PER_POST
		);

		const postUser = users.find((u) => u._id.toString() === post.user.toString());
		const postCity = postUser.city;

		// Get friends of the post author
		const friendIds = userFriendsMap.get(post.user.toString()) || [];
		const friends = users.filter((u) => friendIds.includes(u._id.toString()));

		// 80% comments from friends, 20% from random users
		const commenters = [];
		const numFriendComments = Math.floor(numComments * 0.8);
		const numRandomComments = numComments - numFriendComments;

		if (friends.length > 0) {
			commenters.push(...getRandomElements(friends, numFriendComments));
		}
		commenters.push(
			...getRandomElements(
				users.filter(
					(u) => u._id.toString() !== post.user.toString() && !friendIds.includes(u._id.toString())
				),
				numRandomComments
			)
		);

		const comments = [];

		for (let j = 0; j < commenters.length; j++) {
			const commenter = commenters[j] || getRandomElement(users);

			// Comment timestamp: between post creation and a few days later
			const commentDate = generateRandomDate(
				new Date(post.createdAt),
				new Date(post.createdAt.getTime() + 3 * 24 * 60 * 60 * 1000),
				postCity.timezone
			);

			const comment = {
				user: commenter._id,
				content: generateComment(post.content, commenter.fullName),
				createdAt: commentDate,
				replies: [],
			};

			// 30% chance of having replies
			if (Math.random() > 0.7) {
				const numReplies = getRandomInt(1, 3);
				const replyUsers = getRandomElements(
					[postUser, commenter, ...commenters.filter((c) => c._id !== commenter._id)],
					numReplies
				);

				for (const replyUser of replyUsers) {
					const replyDate = generateRandomDate(
						commentDate,
						new Date(commentDate.getTime() + 2 * 24 * 60 * 60 * 1000),
						postCity.timezone
					);

					comment.replies.push({
						user: replyUser._id,
						content: generateComment(comment.content, replyUser.fullName, true),
						createdAt: replyDate,
						replyToUser: commenter._id,
					});
				}
			}

			comments.push(comment);
		}

		// Sort comments by date
		comments.sort((a, b) => a.createdAt - b.createdAt);

		// Update post with comments
		await Post.findByIdAndUpdate(post._id, { comments });

		if ((i + 1) % 50 === 0) {
			console.log(`Generated comments for ${i + 1}/${posts.length} posts`);
		}
	}

	console.log("Comments generated!");
};

// Main seed function
const seedDatabase = async () => {
	try {
		console.log("Starting database seeding...");
		console.log("=".repeat(50));

		await connectDB();
		await clearDatabase();

		const users = await generateUsers();
		await generateFriendNetworks(users);
		const posts = await generatePosts(users);
		await generateComments(posts, users);

		console.log("=".repeat(50));
		console.log("Database seeding completed successfully!");
		console.log(`Total users: ${users.length}`);
		console.log(`Total posts: ${posts.length}`);
		console.log(
			`Users with work/education: ${
				users.filter((u) => u.company || u.university).length
			}`
		);
		console.log("=".repeat(50));
	} catch (err) {
		console.error("Error seeding database:", err);
		process.exit(1);
	} finally {
		await mongoose.connection.close();
		console.log("MongoDB connection closed.");
		process.exit(0);
	}
};

seedDatabase();

module.exports = seedDatabase;

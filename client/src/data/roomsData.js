export const categoryColors = {
	Support: "bg-green-600/20 text-green-400 border-green-600/30",
	Professional: "bg-blue-600/20 text-blue-400 border-blue-600/30",
	Creative: "bg-purple-600/20 text-purple-400 border-purple-600/30",
	Relationships: "bg-pink-600/20 text-pink-400 border-pink-600/30",
	Technology: "bg-cyan-600/20 text-cyan-400 border-cyan-600/30",
	Discussion: "bg-orange-600/20 text-orange-400 border-orange-600/30",
};

export const anonymousColors = [
	"bg-purple-600/20 text-purple-400",
	"bg-blue-600/20 text-blue-400",
	"bg-green-600/20 text-green-400",
	"bg-pink-600/20 text-pink-400",
	"bg-orange-600/20 text-orange-400",
	"bg-cyan-600/20 text-cyan-400",
	"bg-red-600/20 text-red-400",
	"bg-yellow-600/20 text-yellow-400",
];

export const categories = [
	"All",
	"Support",
	"Professional",
	"Creative",
	"Relationships",
	"Technology",
	"Discussion",
];

export const filterRoomsByCategory = (rooms, category) => {
	if (category === "All") return rooms;
	return rooms.filter((room) => room.category === category);
};

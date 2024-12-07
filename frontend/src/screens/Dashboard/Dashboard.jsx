import React from "react";
import { Trophy, Users, Coins } from "lucide-react";

// Mock Data
const players = [
  {
    id: "1",
    walletAddress: "0x742d35Cc6634C0532925a3b844Bc454e4438f44e",
    avatarUrl:
      "https://images.unsplash.com/photo-1614853316476-de00d14cb1fc?w=800&auto=format&fit=crop&q=60",
    coinsCollected: 15420,
    coinValue: 45260.8,
    rank: 1,
  },
  {
    id: "2",
    walletAddress: "0x1234567890123456789012345678901234567890",
    avatarUrl:
      "https://images.unsplash.com/photo-1628260412297-a3377e45006f?w=800&auto=format&fit=crop&q=60",
    coinsCollected: 12350,
    coinValue: 36185.5,
    rank: 2,
  },
  {
    id: "3",
    walletAddress: "0x9876543210987654321098765432109876543210",
    avatarUrl:
      "https://images.unsplash.com/photo-1635468872214-8d36c5ff7b5c?w=800&auto=format&fit=crop&q=60",
    coinsCollected: 9870,
    coinValue: 28917.3,
    rank: 3,
  },
  {
    id: "4",
    walletAddress: "0xabcdef0123456789abcdef0123456789abcdef01",
    avatarUrl:
      "https://images.unsplash.com/photo-1622547748225-3fc4abd2cca0?w=800&auto=format&fit=crop&q=60",
    coinsCollected: 7650,
    coinValue: 22395.5,
    rank: 4,
  },
  {
    id: "5",
    walletAddress: "0xfedcba9876543210fedcba9876543210fedcba98",
    avatarUrl:
      "https://images.unsplash.com/photo-1639762681485-074b7f938ba0?w=800&auto=format&fit=crop&q=60",
    coinsCollected: 6340,
    coinValue: 18575.2,
    rank: 5,
  },
];

const stats = {
  totalPlayers: 2547,
  totalCoins: 1250000,
  totalValue: 3662500,
};

function LeaderboardStats({ stats }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
      <div className="bg-white rounded-xl p-6 shadow-md">
        <div className="flex items-center space-x-3">
          <Users className="w-8 h-8 text-purple-500" />
          <div>
            <p className="text-gray-500 text-sm">Total Players</p>
            <p className="text-2xl font-bold">
              {stats.totalPlayers.toLocaleString()}
            </p>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl p-6 shadow-md">
        <div className="flex items-center space-x-3">
          <Coins className="w-8 h-8 text-yellow-500" />
          <div>
            <p className="text-gray-500 text-sm">Total Coins</p>
            <p className="text-2xl font-bold">
              {stats.totalCoins.toLocaleString()}
            </p>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl p-6 shadow-md">
        <div className="flex items-center space-x-3">
          <Trophy className="w-8 h-8 text-green-500" />
          <div>
            <p className="text-gray-500 text-sm">Total Value</p>
            <p className="text-2xl font-bold">
              ${stats.totalValue.toLocaleString()}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

function LeaderboardRow({ player }) {
  const getRankColor = (rank) => {
    switch (rank) {
      case 1:
        return "bg-yellow-500";
      case 2:
        return "bg-gray-300";
      case 3:
        return "bg-amber-600";
      default:
        return "bg-purple-500";
    }
  };

  return (
    <div className="bg-white rounded-lg p-4 shadow-md mb-4 transition-transform hover:scale-[1.01]">
      <div className="flex items-center space-x-4">
        <div
          className={`${getRankColor(
            player.rank
          )} w-8 h-8 rounded-full flex items-center justify-center text-white font-bold`}
        >
          {player.rank}
        </div>

        <div className="h-12 w-12 rounded-full overflow-hidden">
          <img
            src={player.avatarUrl}
            alt={`Player ${player.rank}`}
            className="w-full h-full object-cover"
          />
        </div>

        <div className="flex-1">
          <p className="font-mono text-sm text-gray-600">
            {player.walletAddress.slice(0, 6)}...
            {player.walletAddress.slice(-4)}
          </p>
          <div className="flex space-x-4 mt-1">
            <p className="text-sm text-gray-500">
              <span className="font-semibold text-purple-600">
                {player.coinsCollected.toLocaleString()}
              </span>{" "}
              coins
            </p>
            <p className="text-sm text-gray-500">
              <span className="font-semibold text-green-600">
                ${player.coinValue.toLocaleString()}
              </span>{" "}
              value
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

function Leaderboard() {
  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold text-gray-800 mb-2">Coin Hunters</h1>
        <p className="text-gray-600">Top collectors in the P2E universe</p>
      </div>

      <LeaderboardStats stats={stats} />

      <div className="space-y-4">
        {players.map((player) => (
          <LeaderboardRow key={player.id} player={player} />
        ))}
      </div>
    </div>
  );
}

function Dashboard() {
  return (
    <div className="min-h-screen bg-gray-100">
      <Leaderboard />
    </div>
  );
}

export default Dashboard;

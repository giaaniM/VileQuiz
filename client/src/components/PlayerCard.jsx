function PlayerCard({ player }) {
    return (
        <div className="bg-white/5 border border-white/10 rounded-duo p-4 text-center hover:bg-white/10 transition-colors">
            {/* Avatar */}
            <div className="text-5xl mb-2">
                {player.avatar}
            </div>

            {/* Nickname */}
            <div className="text-white font-bold text-base truncate font-nunito">
                {player.nickname}
            </div>

            {/* Status Dot */}
            <div className="mt-2 flex items-center justify-center gap-2">
                <div className={`w-2 h-2 rounded-full ${player.connected !== false ? 'bg-duo-green' : 'bg-gray-500'}`} />
                <span className="text-xs text-white/40 font-nunito">
                    {player.connected !== false ? 'Online' : 'Offline'}
                </span>
            </div>
        </div>
    );
}

export default PlayerCard;

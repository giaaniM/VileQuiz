function CategoryCard({ category, onSelect }) {
    return (
        <div
            onClick={() => onSelect(category)}
            className="relative aspect-video cursor-pointer overflow-hidden rounded-duo group transition-all duration-300 hover:scale-[1.03] hover:shadow-duo-card border-2 border-white/5 hover:border-duo-green/30"
        >
            {/* Background Image */}
            <img
                src={category.icon_url}
                alt={category.name}
                className="absolute inset-0 w-full h-full object-cover"
            />

            {/* Gradient Overlay — darker for dark theme */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/50 to-black/20" />

            {/* Content */}
            <div className="absolute inset-0 p-5 flex flex-col justify-end">
                <h3 className="text-xl font-extrabold text-white mb-1 font-nunito transform transition-transform group-hover:translate-y-[-2px]">
                    {category.name}
                </h3>
                <p className="text-xs text-white/60 line-clamp-2">
                    {category.description}
                </p>
            </div>
        </div>
    );
}

export default CategoryCard;

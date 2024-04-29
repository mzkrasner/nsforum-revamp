import Dropdown from "./Dropdown";

const PostsQueryOptions = (props = {}) => {
	const { sortOptions = [], sortOption, setSortOption = () => null } = props;

	const options = sortOptions.map((s) => {
		const { name, key } = s;
		return { name, value: key };
	});

	const selectedOption = sortOption && {
		name: sortOption.name,
		value: sortOption.key,
	};

	const onSelect = (key) => {
		setSortOption(sortOptions.find((s) => s.key === key));
	};

	return (
		<div className="w-fit flex items-center gap-3 ml-auto">
			<span className="text-secondary text-sm">Sort by</span>
			<Dropdown
				label="Sort by"
				options={options}
				selectedOption={selectedOption}
				onSelect={onSelect}
			/>
		</div>
	);
};
export default PostsQueryOptions;

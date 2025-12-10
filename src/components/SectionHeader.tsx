interface SectionHeaderProps {
  title: string;
  description?: string;
}

const SectionHeader: React.FC<SectionHeaderProps> = ({
  title,
  description,
}) => {
  return (
    <div className="text-left">
      <h1 className="text-[28px] font-bold md:text-[32px] lg:text-4xl">
        {title}
      </h1>
      {description && (
        <p className="text-body text-sm md:text-xl">{description}</p>
      )}
    </div>
  );
};

export default SectionHeader;

interface SectionHeaderProps {
  title: string;
  description?: string;
  titleClassName?: string;
  descriptionClassName?: string;
}

const SectionHeader: React.FC<SectionHeaderProps> = ({
  title,
  description,
  titleClassName = '',
  descriptionClassName = '',
}) => {
  return (
    <div className="text-left">
      <h1
        className={`text-[28px] font-bold md:text-[32px] lg:text-4xl ${titleClassName}`}
      >
        {title}
      </h1>
      {description && (
        <p className={`text-body text-sm md:text-xl ${descriptionClassName}`}>
          {description}
        </p>
      )}
    </div>
  );
};

export default SectionHeader;

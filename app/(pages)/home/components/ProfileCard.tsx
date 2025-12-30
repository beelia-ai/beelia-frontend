import Image from "next/image";

interface ProfileCardProps {
  name: string;
  role: string;
  image: string;
  description: string;
}

export function ProfileCard({
  name,
  role,
  image,
  description,
}: ProfileCardProps) {
  return (
    <div
      className="w-full flex items-start gap-4"
      style={{ height: "fit-content", padding: "40px 40px" }}
    >
      {/* Profile Image */}
      <div
        className="w-16 h-16 bg-gray-700 overflow-hidden flex-shrink-0"
        style={{ borderRadius: "16px" }}
      >
        <Image
          src={image}
          alt={name}
          width={64}
          height={64}
          className="w-full h-full object-cover"
        />
      </div>
      {/* Profile Info */}
      <div className="flex flex-col flex-1">
        <h3
          className="text-white"
          style={{
            fontFamily: "var(--font-outfit), Outfit, sans-serif",
            fontWeight: 600,
            fontSize: "22px",
          }}
        >
          {name}
        </h3>
        <p
          className="text-[#FEDA24] mb-2"
          style={{
            fontFamily: "var(--font-outfit), Outfit, sans-serif",
            fontWeight: 400,
            fontSize: "18px",
          }}
        >
          {role}
        </p>
        <p
          className="text-white"
          style={{
            fontFamily: "var(--font-outfit), Outfit, sans-serif",
            fontWeight: 300,
            fontSize: "16px",
            lineHeight: "160%",
            opacity: 0.7,
          }}
        >
          {description}
        </p>
      </div>
    </div>
  );
}

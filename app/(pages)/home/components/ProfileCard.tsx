import Image from "next/image";

interface ProfileCardProps {
  name: string;
  role: string;
  image: string;
  description: string;
}

export function ProfileCard({ name, role, image, description }: ProfileCardProps) {
  return (
    <div className="w-full flex items-start gap-4 p-6" style={{ height: "fit-content" }}>
      {/* Profile Image */}
      <div className="w-16 h-16 rounded-lg bg-gray-700 overflow-hidden flex-shrink-0">
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
          className="text-white mb-1"
          style={{
            fontFamily: "var(--font-outfit), Outfit, sans-serif",
            fontWeight: 700,
            fontSize: "18px",
          }}
        >
          {name}
        </h3>
        <p
          className="text-[#FEDA24] mb-2"
          style={{
            fontFamily: "var(--font-outfit), Outfit, sans-serif",
            fontWeight: 400,
            fontSize: "14px",
          }}
        >
          {role}
        </p>
        <p
          className="text-white"
          style={{
            fontFamily: "var(--font-outfit), Outfit, sans-serif",
            fontWeight: 400,
            fontSize: "14px",
            lineHeight: "160%",
          }}
        >
          {description}
        </p>
      </div>
    </div>
  );
}


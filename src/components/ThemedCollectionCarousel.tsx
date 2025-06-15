
import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useNavigate } from "react-router-dom";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";

type Collection = {
  id: string;
  title: string;
  description: string | null;
  image_url: string | null;
  color: string;
  type: string;
  collection_id: string | null;
};

type ThemedCollectionCarouselProps = {
  title: string;
  collections: Collection[];
  accentColorClass: string;      // e.g. "border-green-600"
  badgeLabel: string;
  badgeClass: string;            // e.g. "bg-green-600"
};

const ThemedCollectionCarousel: React.FC<ThemedCollectionCarouselProps> = ({
  title,
  collections,
  accentColorClass,
  badgeLabel,
  badgeClass,
}) => {
  const navigate = useNavigate();

  if (collections.length === 0) {
    return null;
  }

  return (
    <div className="mb-14">
      <div className="mb-6 flex items-center gap-3">
        <h2 className="text-2xl font-bold">{title}</h2>
        <Badge className={badgeClass}>{badgeLabel}</Badge>
      </div>
      <Carousel>
        <CarouselContent>
          {collections.map((col) => (
            <CarouselItem
              key={col.id}
              className="basis-11/12 sm:basis-1/3 md:basis-1/4"
            >
              <Card
                className={`
                  relative cursor-pointer overflow-hidden border-0
                  transition-all duration-300
                  rounded-3xl shadow
                  ${accentColorClass}
                  group
                  hover:scale-[1.03] hover:shadow-2xl
                `}
                style={{
                  boxShadow: "0 6px 32px 0 rgb(16 42 67 / 8%)",
                  borderColor: col.color || undefined,
                  background: "#fff",
                }}
                onClick={() =>
                  col.collection_id
                    ? navigate(`/collections/${col.collection_id}`)
                    : undefined
                }
              >
                {/* Card Image with Overlay */}
                <div className="relative">
                  {col.image_url ? (
                    <img
                      src={col.image_url}
                      alt={col.title}
                      className="rounded-t-3xl w-full h-48 object-cover object-center"
                      style={{
                        backgroundColor: col.color || undefined,
                        minHeight: 160,
                      }}
                    />
                  ) : (
                    <div className="w-full h-48 bg-gray-200 rounded-t-3xl flex items-center justify-center text-gray-400 text-2xl">
                      No Image
                    </div>
                  )}
                  <div className="absolute inset-0 rounded-t-3xl bg-gradient-to-t from-black/60 via-black/10 to-transparent" />
                  <Badge
                    className={`absolute left-4 bottom-4 px-3 py-1 text-xs font-bold shadow ${badgeClass} z-10`}
                    style={{
                      backgroundColor: col.color || undefined,
                      color: "#fff",
                      border: "none",
                    }}
                  >
                    {badgeLabel}
                  </Badge>
                </div>
                <CardContent className="p-5 pt-6 flex flex-col">
                  <h3
                    className="font-extrabold text-xl mb-1 overflow-hidden truncate leading-7"
                    style={{
                      color: col.color || undefined,
                      textShadow: "0 2px 2px rgba(0,0,0,0.03)",
                    }}
                    title={col.title}
                  >
                    {col.title}
                  </h3>
                  <p className="text-gray-700 text-base leading-snug mb-1 line-clamp-3 min-h-[56px]">
                    {col.description}
                  </p>
                </CardContent>
              </Card>
            </CarouselItem>
          ))}
        </CarouselContent>
        <CarouselPrevious />
        <CarouselNext />
      </Carousel>
    </div>
  );
};

export default ThemedCollectionCarousel;

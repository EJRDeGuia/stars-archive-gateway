
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
    <div className="mb-12">
      <div className="mb-5 flex items-center gap-2">
        <h2 className="text-xl font-bold">{title}</h2>
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
                  transition-all duration-200
                  rounded-2xl shadow
                  ${accentColorClass}
                  group
                  hover:scale-[1.01] hover:shadow-lg
                  min-h-[220px]
                `}
                style={{
                  boxShadow: "0 2px 12px 0 rgb(16 42 67 / 7%)",
                  borderColor: col.color || undefined,
                  background: "#fff",
                }}
                onClick={() =>
                  col.collection_id
                    ? navigate(`/collections/${col.collection_id}`)
                    : undefined
                }
              >
                {/* Smaller Card Image with Overlay */}
                <div className="relative">
                  {col.image_url ? (
                    <img
                      src={col.image_url}
                      alt={col.title}
                      className="rounded-t-2xl w-full h-32 object-cover object-center"
                      style={{
                        backgroundColor: col.color || undefined,
                        minHeight: 90,
                      }}
                    />
                  ) : (
                    <div className="w-full h-32 bg-gray-200 rounded-t-2xl flex items-center justify-center text-gray-400 text-lg">
                      No Image
                    </div>
                  )}
                  <div className="absolute inset-0 rounded-t-2xl bg-gradient-to-t from-black/40 via-transparent to-transparent pointer-events-none transition-all duration-200" />
                  <Badge
                    className={`absolute right-3 top-3 px-2.5 py-0.5 text-[11px] font-bold shadow ${badgeClass} z-10`}
                    style={{
                      backgroundColor: col.color || undefined,
                      color: "#fff",
                      border: "none",
                    }}
                  >
                    {badgeLabel}
                  </Badge>
                </div>
                <CardContent className="p-4 flex flex-col">
                  <h3
                    className="font-bold text-base mb-0.5 truncate leading-6"
                    style={{
                      color: col.color || undefined,
                      textShadow: "0 1px 2px rgba(0,0,0,0.03)",
                    }}
                    title={col.title}
                  >
                    {col.title}
                  </h3>
                  <p className="text-gray-700 text-sm leading-snug line-clamp-2 min-h-[38px]">
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

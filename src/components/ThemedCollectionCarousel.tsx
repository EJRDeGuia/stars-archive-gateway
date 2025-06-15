
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
  accentColorClass: string;      // e.g. "bg-green-600"
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
        <h2 className="text-2xl font-bold" style={{ color: undefined }}>
          {title}
        </h2>
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
                className={`relative cursor-pointer hover:shadow-lg transition min-h-[340px] border-2 ${accentColorClass}/40`}
                style={{
                  borderColor: col.color || undefined,
                }}
                onClick={() =>
                  col.collection_id
                    ? navigate(`/collections/${col.collection_id}`)
                    : undefined
                }
              >
                {col.image_url && (
                  <img
                    src={col.image_url}
                    alt={col.title}
                    className="rounded-t-lg w-full h-36 object-cover"
                    style={{
                      backgroundColor: col.color || undefined,
                    }}
                  />
                )}
                <CardContent className="p-4">
                  <h3
                    className="font-semibold text-lg mb-2"
                    style={{
                      color: col.color || undefined,
                    }}
                  >
                    {col.title}
                  </h3>
                  <div className="text-sm text-gray-600 mb-2">
                    {col.description}
                  </div>
                  <Badge
                    className={`absolute top-3 right-3 ${badgeClass}`}
                    style={{ color: "#fff", backgroundColor: col.color || undefined }}
                  >
                    {badgeLabel}
                  </Badge>
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


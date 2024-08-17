import React from "react";
import { Card, CardFooter } from "@/components/ui/card";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Download } from "lucide-react";

const ImageMessageComponent = ({ images }: { images: string[] }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-4">
      {images.map((imageUrl) => (
        <Card key={imageUrl} className="rounded-lg overflow-hidden">
          <div className="relative aspect-square">
            <Image
              fill
              src={imageUrl}
              alt="Uploaded Image"
              className="object-cover"
              priority
              sizes="(max-width: 767px) 100vw, (min-width: 768px) and (max-width: 1023px) 50vw, (min-width: 1024px) and (max-width: 1279px) 33.33vw, (min-width: 1280px) and (max-width: 1535px) 25vw, (min-width: 1536px) 20vw"
            />
          </div>
          <CardFooter className="p-2">
            <Button
              onClick={() => window.open(imageUrl)}
              variant="secondary"
              className="w-full"
            >
              <Download className="h-4 w-4 mr-2" />
              Download
            </Button>
          </CardFooter>
        </Card>
      ))}
    </div>
  );
};

export default ImageMessageComponent;


import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { ArrowUpRight } from "lucide-react";

const resources = [
  {
    title: "World Health Organization (WHO)",
    description: "Global public health information, research, and data from the United Nations' specialized agency.",
    link: "https://www.who.int",
    dataAiHint: "medical research",
  },
  {
    title: "Mayo Clinic",
    description: "Comprehensive guides on diseases, conditions, symptoms, tests, and procedures.",
    link: "https://www.mayoclinic.org",
    dataAiHint: "hospital building",
  },
  {
    title: "MedlinePlus",
    description: "Health information from the U.S. National Library of Medicine, the world's largest medical library.",
    link: "https://medlineplus.gov",
    dataAiHint: "library books",
  },
  {
    title: "Centers for Disease Control and Prevention (CDC)",
    description: "U.S. public health information on diseases, conditions, and wellness.",
    link: "https://www.cdc.gov",
    dataAiHint: "science laboratory",
  },
  {
    title: "NHS (National Health Service)",
    description: "The UK's largest health website, providing comprehensive information on conditions and treatments.",
    link: "https://www.nhs.uk",
    dataAiHint: "uk flag",
  },
  {
    title: "WebMD",
    description: "A popular source for medical news, information, and wellness support.",
    link: "https://www.webmd.com",
    dataAiHint: "health wellness",
  },
];

export default function HealthResources() {
  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
      {resources.map((resource) => (
        <Card key={resource.title} className="flex flex-col">
            <a href={resource.link} target="_blank" rel="noopener noreferrer" className="flex flex-col flex-grow group">
                <CardHeader>
                    <div className="flex items-start justify-between">
                        <CardTitle className="font-headline text-lg">{resource.title}</CardTitle>
                        <ArrowUpRight className="h-5 w-5 text-muted-foreground transition-transform group-hover:translate-x-1 group-hover:-translate-y-1" />
                    </div>
                </CardHeader>
                <CardContent className="flex-grow">
                    <CardDescription>{resource.description}</CardDescription>
                </CardContent>
            </a>
        </Card>
      ))}
    </div>
  );
}

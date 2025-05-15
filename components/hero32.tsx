import { Button } from "@/components/ui/button";

interface Integration {
  id: string;
  icon: React.ReactNode;
}

interface Hero32Props {
  heading?: string;
  description?: string;
  button?: {
    text: string;
    url: string;
  };
  integrations?: Integration[][];
}

const Hero32 = ({
  heading = "ENIC-KAZAKHSTAN",
  description = "ЖОҒАРЫ БІЛІМ БЕРУДІ ДАМЫТУ ҰЛТТЫҚ ОРТАЛЫҒЫ",
  button = {
    text: "",
    url: "",
  },
  integrations = [
    [
      {
        id: "integration-1",
        icon: (
          <img
            alt="Integration"
            src="logo.png"
          />
        ),
      },
      {
        id: "integration-2",
        icon: (
          <img
            alt="Integration"
            src="logo.png"
          />
        ),
      },
      {
        id: "integration-3",
        icon: (
          <img
            alt="Integration"
            src="logo.png"
          />
        ),
      },
      {
        id: "integration-4",
        icon: (
          <img
            alt="Integration"
            src="logo.png"
          />
        ),
      },
      {
        id: "integration-5",
        icon: (
          <img
            alt="Integration"
            src="logo.png"
          />
        ),
      },
    ],
    [
      {
        id: "integration-6",
        icon: (
          <img
            alt="Integration"
            src="logo.png"
          />
        ),
      },
      {
        id: "integration-7",
        icon: (
          <img
            alt="Integration"
            src="logo.png"
          />
        ),
      },
      {
        id: "integration-8",
        icon: (
          <img
            alt="Integration"
            src="logo.png"
          />
        ),
      },
      {
        id: "integration-9",
        icon: (
          <img
            alt="Integration"
            src="logo.png"
          />
        ),
      },
      {
        id: "integration-10",
        icon: (
          <img
            alt="Integration"
            src="logo.png"
          />
        ),
      },
    ],
    [
      {
        id: "integration-11",
        icon: (
          <img
            alt="Integration"
            src="logo.png"
          />
        ),
      },
      {
        id: "integration-12",
        icon: (
          <img
            alt="Integration"
            src="logo.png"
          />
        ),
      },
      {
        id: "integration-13",
        icon: (
          <img
            alt="Integration"
            src="logo.png"
          />
        ),
      },
      {
        id: "integration-14",
        icon: (
          <img
            alt="Integration"
            src="logo.png"
          />
        ),
      },
      {
        id: "integration-15",
        icon: (
          <img
            alt="Integration"
            src="logo.png"
          />
        ),
      },
    ],
  ],
}: Hero32Props) => {
  return (
    <section className="relative overflow-hidden">
      <div className="absolute inset-x-0 top-0 flex h-full w-full items-center justify-center opacity-100">
        <img
          alt="background"
          src="https://shadcnblocks.com/images/block/patterns/square-alt-grid.svg"
          className="opacity-90 [mask-image:radial-gradient(75%_75%_at_center,white,transparent)]"
        />
      </div>
      <div className="relative">
        <div className="relative container flex flex-col items-start md:flex-row md:items-center md:-space-x-26 ml-32">
          <div className="z-20 -mx-4 w-full shrink-0 bg-background px-4 pt-32 md:w-1/2 md:bg-transparent md:pb-32">
            <div className="flex flex-col items-start text-left">
              <div className="max-w-sm">
                <h1 className="my-6 text-4xl font-bold text-pretty lg:text-6xl">
                  {heading}
                </h1>
                <p className="text-muted-foreground">{description}</p>
                <Button asChild size="lg" className="mt-10">
                  <a href={button.url}>{button.text}</a>
                </Button>
              </div>
            </div>
          </div>
          <div>
            <div className="flex flex-col gap-16 pt-12 pb-8 md:py-32">
              {integrations.map((line, lineIndex) => (
                <div key={`line-${lineIndex + 1}`} className="flex gap-x-22 odd:-translate-x-22 translate-x-32">
                  {line.map((integration) => (
                    <div
                      key={integration.id}
                      className="size-22 rounded-xl border border-background bg-background shadow-xl"
                    >
                      <div className="h-full w-full bg-muted/20 p-4">
                        {integration.icon}
                      </div>
                    </div>
                  ))}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export { Hero32 };

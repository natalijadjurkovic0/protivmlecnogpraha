import ScrollSection from "./ScrollSection";
import { ArrowDoodle, HeartDoodle, ScribbleCircle, StarDoodle } from "./DoodleOverlays";
import farmerImg from "@/assets/farmer.jpg";
import milkImg from "@/assets/milk-pour.jpg";
import landscapeImg from "@/assets/rural-landscape.jpg";

const StorySection = () => {
  return (
    <div className="relative">
      {/* Section 1 — Our Story */}
      <ScrollSection id="story" direction="left" className="bg-background">
        <div className="container mx-auto px-6">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div className="relative">
              <img
                src={farmerImg}
                alt="Srpski farmer"
                className="rounded-2xl shadow-2xl w-full"
                loading="lazy"
                width={800}
                height={1080}
              />
              <HeartDoodle className="absolute -top-4 -right-4 scale-125" />
              <StarDoodle className="absolute -bottom-3 -left-3" />
            </div>
            <div>
              <span className="font-handwritten text-2xl text-primary">Naša priča</span>
              <h2 className="font-display text-4xl md:text-5xl font-black text-foreground mt-2 mb-6">
                <span className="marker-underline">[NASLOV PRIČE]</span>
              </h2>
              <p className="font-body text-lg text-muted-foreground leading-relaxed mb-6">
                [DETALJAN OPIS — Ovde unesite priču o tome kako je Mlečni put nastao.
                Opišite misiju, viziju i strast prema pravom, svežem mleku direktno sa
                srpskih farmi. Napišite o tradiciji, kvalitetu i zajednici mlekara.]
              </p>
              <p className="font-handwritten text-xl text-earth-green">
                ✦ Od farme do vašeg stola — bez posrednika ✦
              </p>
            </div>
          </div>
        </div>
      </ScrollSection>

      {/* Section 2 — How It Works */}
      <ScrollSection direction="right" className="bg-muted">
        <div className="container mx-auto px-6">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div className="order-2 md:order-1">
              <span className="font-handwritten text-2xl text-primary">Kako funkcioniše?</span>
              <h2 className="font-display text-4xl md:text-5xl font-black text-foreground mt-2 mb-6">
                [NASLOV PROCESA]
              </h2>
              <div className="space-y-6">
                {["Farmer muze kravu u zoru", "Mleko se preuzima istog dana", "Vozač dostavlja do vaših vrata", "Vi uživate u svežem mleku"].map((step, i) => (
                  <div key={i} className="flex items-start gap-4">
                    <div className="flex-shrink-0 w-10 h-10 rounded-full bg-primary flex items-center justify-center font-display font-bold text-primary-foreground text-lg">
                      {i + 1}
                    </div>
                    <div>
                      <p className="font-body font-semibold text-foreground text-lg">{step}</p>
                      <p className="font-body text-muted-foreground text-sm mt-1">
                        [Detaljan opis koraka {i + 1}]
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div className="order-1 md:order-2 relative">
              <img
                src={landscapeImg}
                alt="Srpsko selo — put dostave"
                className="rounded-2xl shadow-2xl w-full"
                loading="lazy"
                width={1920}
                height={1080}
              />
              <ScribbleCircle className="absolute -top-6 -left-6 opacity-60" />
              <ArrowDoodle className="absolute -bottom-8 right-8" />
            </div>
          </div>
        </div>
      </ScrollSection>

      {/* Section 3 — Quality */}
      <ScrollSection direction="left" className="bg-background">
        <div className="container mx-auto px-6">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div className="relative">
              <img
                src={milkImg}
                alt="Sveže mleko"
                className="rounded-2xl shadow-2xl w-full"
                loading="lazy"
                width={800}
                height={1080}
              />
              <StarDoodle className="absolute -top-4 right-8 scale-150" />
              <HeartDoodle className="absolute bottom-4 -left-4" />
            </div>
            <div>
              <span className="font-handwritten text-2xl text-primary">Kvalitet bez kompromisa</span>
              <h2 className="font-display text-4xl md:text-5xl font-black text-foreground mt-2 mb-6">
                <span className="marker-underline">[NASLOV O KVALITETU]</span>
              </h2>
              <p className="font-body text-lg text-muted-foreground leading-relaxed mb-6">
                [DETALJAN OPIS — Opišite zašto je vaše mleko posebno. Govorite o kontroli
                kvaliteta, zdravlju životinja, prirodnoj ishrani krava, odsustvu hormona
                i antibiotika. Objasnite razliku između pravog mleka i mlečnog praha.]
              </p>
              <div className="flex flex-wrap gap-3 mt-6">
                {["100% Prirodno", "Bez hormona", "Sveže svaki dan", "Lokalno"].map((tag) => (
                  <span
                    key={tag}
                    className="px-4 py-2 bg-primary/20 text-foreground font-body text-sm font-medium rounded-full border border-primary/30"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </ScrollSection>

      {/* Section 4 — Community */}
      <ScrollSection direction="right" className="bg-accent text-accent-foreground">
        <div className="container mx-auto px-6 text-center">
          <StarDoodle className="mx-auto mb-4 scale-150" />
          <span className="font-handwritten text-2xl text-primary">Zajednica</span>
          <h2 className="font-display text-4xl md:text-6xl font-black mt-2 mb-8">
            [NASLOV O ZAJEDNICI]
          </h2>
          <p className="font-body text-lg text-accent-foreground/80 leading-relaxed max-w-3xl mx-auto mb-12">
            [DETALJAN OPIS — Opišite zajednicu mlekara, kupaca i vozača koji čine Mlečni put.
            Koliko farmi je uključeno? Koliko porodica uživa u svežem mleku? Kakve su povratne
            informacije kupaca?]
          </p>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {[
              { num: "[XXX]", label: "Farmera" },
              { num: "[XXX]", label: "Kupaca" },
              { num: "[XXX]", label: "Litara dnevno" },
              { num: "[XXX]", label: "Sela" },
            ].map((stat) => (
              <div key={stat.label}>
                <p className="font-display text-4xl md:text-5xl font-black text-primary">{stat.num}</p>
                <p className="font-handwritten text-xl mt-1">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </ScrollSection>
    </div>
  );
};

export default StorySection;

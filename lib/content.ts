export type SeoPageContent = {
  slug: string;
  title: string;
  description: string;
  h1: string;
  intro: string;
  sections: Array<{
    heading: string;
    body: string;
  }>;
  related: string[];
};

const SEO_PAGE_DATA = {
  "movable-do-ear-training": {
    slug: "movable-do-ear-training",
    title: "Movable Do Ear Training Online",
    description:
      "Practice movable-do ear training online. Hear the key, identify Do, Re, Mi, Fa, Sol, La, or Ti, and build relative pitch.",
    h1: "Movable Do Ear Training Online",
    intro:
      "Movable do ear training helps you hear each note by its role inside the current key. Start with a short cadence, listen for the target note, then choose the solfege syllable you hear.",
    sections: [
      {
        heading: "Why movable do works",
        body:
          "Instead of memorizing isolated pitches, movable do gives every key the same set of relationships. Do feels like home, Sol feels stable and bright, and Ti wants to resolve upward."
      },
      {
        heading: "A simple first drill",
        body:
          "Begin with Do, Mi, and Sol. These three notes outline the tonic chord, so they are easier to recognize before you add Re, Fa, La, and Ti."
      }
    ],
    related: ["solfege-ear-training", "scale-degree-ear-training", "relative-pitch-solfege"]
  },
  "solfege-ear-training": {
    slug: "solfege-ear-training",
    title: "Solfege Ear Training Online - Practice Do Re Mi",
    description:
      "Train solfege online with instant feedback. Practice hearing Do, Re, Mi, Fa, Sol, La, and Ti in major keys.",
    h1: "Solfege Ear Training Online",
    intro:
      "This solfege ear training tool plays a key context and one target note. Your job is to hear whether the note is Do, Re, Mi, Fa, Sol, La, or Ti.",
    sections: [
      {
        heading: "Listen for function",
        body:
          "Good solfege practice is not only about pitch height. Try to hear whether the note feels settled, leaning, open, or tense inside the key."
      },
      {
        heading: "Practice in short sessions",
        body:
          "Ten focused questions can be more useful than a long unfocused session. Replay the key when your ear loses the tonal center."
      }
    ],
    related: ["movable-do-ear-training", "how-to-practice-solfege", "relative-pitch-solfege"]
  },
  "scale-degree-ear-training": {
    slug: "scale-degree-ear-training",
    title: "Scale Degree Ear Training - Hear Notes in Context",
    description:
      "Practice scale degree ear training with movable-do solfege. Hear a key, identify the note's role, and improve relative pitch.",
    h1: "Scale Degree Ear Training",
    intro:
      "Scale degree ear training teaches you to recognize notes by their place in the major scale. In this tool, those scale degrees are labeled with movable-do solfege.",
    sections: [
      {
        heading: "Solfege and scale degrees",
        body:
          "Do is scale degree 1, Re is 2, Mi is 3, Fa is 4, Sol is 5, La is 6, and Ti is 7. The names move with the key."
      },
      {
        heading: "Hear the key first",
        body:
          "The cadence at the start of each question is there to establish the tonal center. Use it as your reference before judging the target note."
      }
    ],
    related: ["movable-do-ear-training", "solfege-ear-training", "how-to-practice-solfege"]
  },
  "relative-pitch-solfege": {
    slug: "relative-pitch-solfege",
    title: "Relative Pitch Solfege Practice",
    description:
      "Build relative pitch with solfege. Practice identifying movable-do syllables after hearing a key and a target note.",
    h1: "Relative Pitch Solfege Practice",
    intro:
      "Relative pitch is the skill of hearing notes in relation to a tonal center. Movable-do solfege gives that relationship a singable name.",
    sections: [
      {
        heading: "Use the tonal center",
        body:
          "After the cadence, silently keep Do in mind. Compare the target note against that feeling before you choose an answer."
      },
      {
        heading: "Grow the note set",
        body:
          "Beginner mode keeps the first note set small. Practice mode opens all seven syllables and changes keys so the relationships stay movable."
      }
    ],
    related: ["movable-do-ear-training", "solfege-ear-training", "scale-degree-ear-training"]
  },
  "how-to-practice-solfege": {
    slug: "how-to-practice-solfege",
    title: "How to Practice Solfege Ear Training",
    description:
      "Learn a simple way to practice solfege ear training online with movable do, short sessions, and instant feedback.",
    h1: "How to Practice Solfege Ear Training",
    intro:
      "The fastest way to start solfege ear training is to hear a key, identify one note, check your answer, and repeat. Keep the exercise narrow until the sound of each syllable becomes familiar.",
    sections: [
      {
        heading: "Start with stable notes",
        body:
          "Do, Mi, and Sol are the easiest first targets because they form the tonic chord. Once they feel clear, add the remaining major-scale syllables."
      },
      {
        heading: "Review mistakes immediately",
        body:
          "When an answer is wrong, replay the key and the target note. The goal is to connect the sound with the correct syllable while the memory is fresh."
      }
    ],
    related: ["solfege-ear-training", "movable-do-ear-training", "relative-pitch-solfege"]
  }
} satisfies Record<string, SeoPageContent>;

export const SEO_PAGES: Record<string, SeoPageContent> = SEO_PAGE_DATA;
export const SEO_SLUGS = Object.keys(SEO_PAGE_DATA);

export function getSeoPage(slug: string): SeoPageContent | null {
  return SEO_PAGES[slug] ?? null;
}

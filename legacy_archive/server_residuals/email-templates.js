import { jsx, jsxs } from "react/jsx-runtime";
import {
  Html,
  Head,
  Body,
  Container,
  Section,
  Text,
  Button,
  Hr,
  Link,
  Preview
} from "@react-email/components";
import { render } from "@react-email/render";
const baseStyles = {
  body: {
    backgroundColor: "#1a1a1a",
    fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
    margin: 0,
    padding: 0
  },
  container: {
    backgroundColor: "#2d2d2d",
    borderRadius: "12px",
    margin: "40px auto",
    padding: "32px",
    maxWidth: "580px",
    border: "2px solid #3B1E3D"
  },
  header: {
    textAlign: "center",
    marginBottom: "24px"
  },
  logo: {
    fontSize: "32px",
    color: "#FFBF00",
    fontWeight: "bold",
    margin: 0
  },
  tagline: {
    fontSize: "14px",
    color: "#8B7355",
    margin: "4px 0 0 0"
  },
  heading: {
    color: "#FFBF00",
    fontSize: "24px",
    fontWeight: "bold",
    margin: "0 0 16px 0"
  },
  paragraph: {
    color: "#E8DCC8",
    fontSize: "16px",
    lineHeight: "1.6",
    margin: "0 0 16px 0"
  },
  highlight: {
    color: "#FFBF00",
    fontWeight: "bold"
  },
  button: {
    backgroundColor: "#FFBF00",
    borderRadius: "8px",
    color: "#1a1a1a",
    display: "inline-block",
    fontSize: "16px",
    fontWeight: "bold",
    padding: "14px 28px",
    textDecoration: "none",
    textAlign: "center",
    marginTop: "16px"
  },
  divider: {
    borderColor: "#3B1E3D",
    margin: "24px 0"
  },
  footer: {
    color: "#8B7355",
    fontSize: "12px",
    textAlign: "center",
    marginTop: "24px"
  },
  footerLink: {
    color: "#FFBF00",
    textDecoration: "none"
  },
  beaver: {
    fontSize: "48px",
    textAlign: "center",
    margin: "16px 0"
  },
  statsBox: {
    backgroundColor: "#3B1E3D",
    borderRadius: "8px",
    padding: "16px",
    margin: "16px 0"
  },
  statItem: {
    color: "#E8DCC8",
    fontSize: "14px",
    margin: "8px 0"
  },
  statValue: {
    color: "#FFBF00",
    fontWeight: "bold",
    fontSize: "18px"
  }
};
function WelcomeEmail({ username, previewText }) {
  return /* @__PURE__ */ jsxs(Html, { children: [
    /* @__PURE__ */ jsx(Head, {}),
    /* @__PURE__ */ jsx(Preview, { children: previewText || `Bienvenue sur Zyeut\xE9, ${username}! Ti-Guy t'accueille!` }),
    /* @__PURE__ */ jsx(Body, { style: baseStyles.body, children: /* @__PURE__ */ jsxs(Container, { style: baseStyles.container, children: [
      /* @__PURE__ */ jsxs(Section, { style: baseStyles.header, children: [
        /* @__PURE__ */ jsx(Text, { style: baseStyles.logo, children: "Zyeut\xE9" }),
        /* @__PURE__ */ jsx(Text, { style: baseStyles.tagline, children: "L'app sociale du Qu\xE9bec" })
      ] }),
      /* @__PURE__ */ jsx(Text, { style: baseStyles.beaver, children: "\u{1F9AB}" }),
      /* @__PURE__ */ jsxs(Text, { style: baseStyles.heading, children: [
        "Salut ",
        username,
        "! Bienvenue dans la gang!"
      ] }),
      /* @__PURE__ */ jsxs(Text, { style: baseStyles.paragraph, children: [
        "C'est Ti-Guy, ton castor pr\xE9f\xE9r\xE9! \u{1F9AB} J'suis tellement content que t'aies d\xE9cid\xE9 d'embarquer avec nous autres sur ",
        /* @__PURE__ */ jsx("span", { style: baseStyles.highlight, children: "Zyeut\xE9" }),
        "!"
      ] }),
      /* @__PURE__ */ jsx(Text, { style: baseStyles.paragraph, children: "Ici, c'est l'app sociale faite au Qu\xE9bec, pour le Qu\xE9bec. On c\xE9l\xE8bre notre belle province pis toute ce qui la rend unique - de la poutine aux baleines du Saint-Laurent, en passant par les couchers de soleil sur le Mont-Royal!" }),
      /* @__PURE__ */ jsx(Text, { style: baseStyles.paragraph, children: "Quelques affaires \xE0 savoir pour commencer:" }),
      /* @__PURE__ */ jsxs(Text, { style: baseStyles.paragraph, children: [
        "\u{1F525} ",
        /* @__PURE__ */ jsx("span", { style: baseStyles.highlight, children: "Les Feux" }),
        " - Chez nous, on donne des feux au lieu des likes. Quand quelque chose est hot, on dit que c'est en feu!"
      ] }),
      /* @__PURE__ */ jsxs(Text, { style: baseStyles.paragraph, children: [
        "\u{1F3A8} ",
        /* @__PURE__ */ jsx("span", { style: baseStyles.highlight, children: "Ti-Guy Studio" }),
        " - Cr\xE9e des images avec l'intelligence artificielle! J'peux t'aider \xE0 cr\xE9er du contenu malade."
      ] }),
      /* @__PURE__ */ jsxs(Text, { style: baseStyles.paragraph, children: [
        "\u{1F4CD} ",
        /* @__PURE__ */ jsx("span", { style: baseStyles.highlight, children: "Les r\xE9gions" }),
        " - Montre de quelle r\xE9gion tu viens! Montr\xE9al, Qu\xE9bec, Gasp\xE9sie, Gatineau... on est fiers de nos racines!"
      ] }),
      /* @__PURE__ */ jsx(Section, { style: { textAlign: "center" }, children: /* @__PURE__ */ jsx(Button, { style: baseStyles.button, href: "https://zyeute.com/feed", children: "D\xE9couvrir Zyeut\xE9" }) }),
      /* @__PURE__ */ jsx(Hr, { style: baseStyles.divider }),
      /* @__PURE__ */ jsx(Text, { style: baseStyles.paragraph, children: "Si t'as des questions, g\xEAne-toi pas! J'suis toujours l\xE0 pour t'aider. On se voit sur le feed! \u{1F341}" }),
      /* @__PURE__ */ jsxs(Text, { style: baseStyles.paragraph, children: [
        "\xC0 bient\xF4t!",
        /* @__PURE__ */ jsx("br", {}),
        /* @__PURE__ */ jsx("span", { style: baseStyles.highlight, children: "Ti-Guy" }),
        " \u{1F9AB}"
      ] }),
      /* @__PURE__ */ jsx(Hr, { style: baseStyles.divider }),
      /* @__PURE__ */ jsxs(Text, { style: baseStyles.footer, children: [
        "Zyeut\xE9 - L'app sociale du Qu\xE9bec",
        /* @__PURE__ */ jsx("br", {}),
        /* @__PURE__ */ jsx(Link, { href: "https://zyeute.com", style: baseStyles.footerLink, children: "zyeute.com" })
      ] })
    ] }) })
  ] });
}
function OnboardingDay1Email({ username, previewText }) {
  return /* @__PURE__ */ jsxs(Html, { children: [
    /* @__PURE__ */ jsx(Head, {}),
    /* @__PURE__ */ jsx(Preview, { children: previewText || `${username}, d\xE9couvre Ti-Guy Studio!` }),
    /* @__PURE__ */ jsx(Body, { style: baseStyles.body, children: /* @__PURE__ */ jsxs(Container, { style: baseStyles.container, children: [
      /* @__PURE__ */ jsxs(Section, { style: baseStyles.header, children: [
        /* @__PURE__ */ jsx(Text, { style: baseStyles.logo, children: "Zyeut\xE9" }),
        /* @__PURE__ */ jsx(Text, { style: baseStyles.tagline, children: "L'app sociale du Qu\xE9bec" })
      ] }),
      /* @__PURE__ */ jsx(Text, { style: baseStyles.beaver, children: "\u{1F3A8}" }),
      /* @__PURE__ */ jsxs(Text, { style: baseStyles.heading, children: [
        "Hey ",
        username,
        "! As-tu essay\xE9 mon Studio?"
      ] }),
      /* @__PURE__ */ jsxs(Text, { style: baseStyles.paragraph, children: [
        "C'est Ti-Guy! J'esp\xE8re que tu t'amuses ben sur Zyeut\xE9! Aujourd'hui, j'voulais te parler d'une affaire vraiment cool: ",
        /* @__PURE__ */ jsx("span", { style: baseStyles.highlight, children: "Ti-Guy Studio" }),
        "!"
      ] }),
      /* @__PURE__ */ jsx(Text, { style: baseStyles.paragraph, children: "C'est mon atelier de cr\xE9ation d'images avec l'intelligence artificielle. Tu d\xE9cris ce que tu veux, pis PAF! \u{1FA84} Je te g\xE9n\xE8re une image unique!" }),
      /* @__PURE__ */ jsx(Text, { style: baseStyles.paragraph, children: "Comment \xE7a marche? C'est simple comme bonjour:" }),
      /* @__PURE__ */ jsxs(Section, { style: baseStyles.statsBox, children: [
        /* @__PURE__ */ jsxs(Text, { style: baseStyles.statItem, children: [
          /* @__PURE__ */ jsx("span", { style: baseStyles.statValue, children: "1." }),
          " Va sur Ti-Guy Studio dans l'app"
        ] }),
        /* @__PURE__ */ jsxs(Text, { style: baseStyles.statItem, children: [
          /* @__PURE__ */ jsx("span", { style: baseStyles.statValue, children: "2." }),
          " D\xE9cris ton image (en fran\xE7ais ou anglais)"
        ] }),
        /* @__PURE__ */ jsxs(Text, { style: baseStyles.statItem, children: [
          /* @__PURE__ */ jsx("span", { style: baseStyles.statValue, children: "3." }),
          " Choisis ton format (carr\xE9, portrait, paysage)"
        ] }),
        /* @__PURE__ */ jsxs(Text, { style: baseStyles.statItem, children: [
          /* @__PURE__ */ jsx("span", { style: baseStyles.statValue, children: "4." }),
          " Clique sur G\xE9n\xE9rer! \u{1F3A8}"
        ] })
      ] }),
      /* @__PURE__ */ jsx(Text, { style: baseStyles.paragraph, children: `Essaye avec des trucs qu\xE9b\xE9cois! "Un castor qui mange de la poutine au coucher du soleil sur le Mont-Royal" - j'adore \xE7a! \u{1F35F}\u{1F9C0}` }),
      /* @__PURE__ */ jsx(Section, { style: { textAlign: "center" }, children: /* @__PURE__ */ jsx(Button, { style: baseStyles.button, href: "https://zyeute.com/ai-studio", children: "Essayer Ti-Guy Studio" }) }),
      /* @__PURE__ */ jsx(Hr, { style: baseStyles.divider }),
      /* @__PURE__ */ jsxs(Text, { style: baseStyles.paragraph, children: [
        "\xC0 demain pour d'autres trucs cool!",
        /* @__PURE__ */ jsx("br", {}),
        /* @__PURE__ */ jsx("span", { style: baseStyles.highlight, children: "Ti-Guy" }),
        " \u{1F9AB}"
      ] }),
      /* @__PURE__ */ jsx(Text, { style: baseStyles.footer, children: /* @__PURE__ */ jsx(Link, { href: "https://zyeute.com", style: baseStyles.footerLink, children: "zyeute.com" }) })
    ] }) })
  ] });
}
function OnboardingDay3Email({ username, previewText }) {
  return /* @__PURE__ */ jsxs(Html, { children: [
    /* @__PURE__ */ jsx(Head, {}),
    /* @__PURE__ */ jsx(Preview, { children: previewText || `${username}, c'est quoi les Feux? \u{1F525}` }),
    /* @__PURE__ */ jsx(Body, { style: baseStyles.body, children: /* @__PURE__ */ jsxs(Container, { style: baseStyles.container, children: [
      /* @__PURE__ */ jsxs(Section, { style: baseStyles.header, children: [
        /* @__PURE__ */ jsx(Text, { style: baseStyles.logo, children: "Zyeut\xE9" }),
        /* @__PURE__ */ jsx(Text, { style: baseStyles.tagline, children: "L'app sociale du Qu\xE9bec" })
      ] }),
      /* @__PURE__ */ jsx(Text, { style: baseStyles.beaver, children: "\u{1F525}" }),
      /* @__PURE__ */ jsxs(Text, { style: baseStyles.heading, children: [
        username,
        ", parlons des Feux!"
      ] }),
      /* @__PURE__ */ jsxs(Text, { style: baseStyles.paragraph, children: [
        "Yo ",
        username,
        `! C'est Ti-Guy! T'as s\xFBrement remarqu\xE9 qu'on n'a pas de "likes" sur Zyeut\xE9. Nous autres, on donne des `,
        /* @__PURE__ */ jsx("span", { style: baseStyles.highlight, children: "FEUX" }),
        "! \u{1F525}"
      ] }),
      /* @__PURE__ */ jsx(Text, { style: baseStyles.paragraph, children: `Pourquoi? Ben, au Qu\xE9bec, quand quelque chose est vraiment bon, on dit "c'est en FEU!" ou "c'est hot en tabarnouche!". Faque c'\xE9tait naturel de remplacer les likes par des feux!` }),
      /* @__PURE__ */ jsx(Text, { style: baseStyles.paragraph, children: "Quand tu donnes un feu \xE0 quelqu'un:" }),
      /* @__PURE__ */ jsxs(Section, { style: baseStyles.statsBox, children: [
        /* @__PURE__ */ jsx(Text, { style: baseStyles.statItem, children: "\u{1F525} Tu montres que tu trouves \xE7a hot!" }),
        /* @__PURE__ */ jsx(Text, { style: baseStyles.statItem, children: "\u{1F525} Tu encourages les cr\xE9ateurs qu\xE9b\xE9cois" }),
        /* @__PURE__ */ jsx(Text, { style: baseStyles.statItem, children: "\u{1F525} Tu b\xE2tis ta communaut\xE9" }),
        /* @__PURE__ */ jsx(Text, { style: baseStyles.statItem, children: "\u{1F525} Tu accumules des Fire Points!" })
      ] }),
      /* @__PURE__ */ jsx(Text, { style: baseStyles.paragraph, children: "Plus tu donnes de feux, plus t'en re\xE7ois! C'est comme une grande famille qu\xE9b\xE9coise qui s'encourage mutuellement. Ben beau, non? \u{1F341}" }),
      /* @__PURE__ */ jsx(Section, { style: { textAlign: "center" }, children: /* @__PURE__ */ jsx(Button, { style: baseStyles.button, href: "https://zyeute.com/feed", children: "Donner mes premiers feux! \u{1F525}" }) }),
      /* @__PURE__ */ jsx(Hr, { style: baseStyles.divider }),
      /* @__PURE__ */ jsxs(Text, { style: baseStyles.paragraph, children: [
        "Continue comme \xE7a!",
        /* @__PURE__ */ jsx("br", {}),
        /* @__PURE__ */ jsx("span", { style: baseStyles.highlight, children: "Ti-Guy" }),
        " \u{1F9AB}"
      ] }),
      /* @__PURE__ */ jsx(Text, { style: baseStyles.footer, children: /* @__PURE__ */ jsx(Link, { href: "https://zyeute.com", style: baseStyles.footerLink, children: "zyeute.com" }) })
    ] }) })
  ] });
}
function OnboardingDay7Email({ username, previewText }) {
  return /* @__PURE__ */ jsxs(Html, { children: [
    /* @__PURE__ */ jsx(Head, {}),
    /* @__PURE__ */ jsx(Preview, { children: previewText || `${username}, une semaine avec nous! \u{1F389}` }),
    /* @__PURE__ */ jsx(Body, { style: baseStyles.body, children: /* @__PURE__ */ jsxs(Container, { style: baseStyles.container, children: [
      /* @__PURE__ */ jsxs(Section, { style: baseStyles.header, children: [
        /* @__PURE__ */ jsx(Text, { style: baseStyles.logo, children: "Zyeut\xE9" }),
        /* @__PURE__ */ jsx(Text, { style: baseStyles.tagline, children: "L'app sociale du Qu\xE9bec" })
      ] }),
      /* @__PURE__ */ jsx(Text, { style: baseStyles.beaver, children: "\u{1F389}" }),
      /* @__PURE__ */ jsxs(Text, { style: baseStyles.heading, children: [
        "Une semaine d\xE9j\xE0, ",
        username,
        "!"
      ] }),
      /* @__PURE__ */ jsxs(Text, { style: baseStyles.paragraph, children: [
        "Wow ",
        username,
        "! \xC7a fait d\xE9j\xE0 une semaine que t'es avec nous autres! J'suis vraiment content que tu fasses partie de la gang! \u{1F9AB}"
      ] }),
      /* @__PURE__ */ jsx(Text, { style: baseStyles.paragraph, children: "T'as explor\xE9 le feed, d\xE9couvert Ti-Guy Studio, donn\xE9 des feux... Tu commences vraiment \xE0 \xEAtre un pro de Zyeut\xE9!" }),
      /* @__PURE__ */ jsx(Text, { style: baseStyles.paragraph, children: "Si tu veux aller plus loin, j'ai des plans Premium qui pourraient t'int\xE9resser:" }),
      /* @__PURE__ */ jsxs(Section, { style: baseStyles.statsBox, children: [
        /* @__PURE__ */ jsxs(Text, { style: baseStyles.statItem, children: [
          /* @__PURE__ */ jsx("span", { style: baseStyles.statValue, children: "\u{1F949} Bronze - 4.99$/mois" }),
          /* @__PURE__ */ jsx("br", {}),
          "50 images AI, badge Bronze, z\xE9ro pub"
        ] }),
        /* @__PURE__ */ jsxs(Text, { style: baseStyles.statItem, children: [
          /* @__PURE__ */ jsx("span", { style: baseStyles.statValue, children: "\u{1F948} Argent - 9.99$/mois" }),
          /* @__PURE__ */ jsx("br", {}),
          "200 images AI, 10 vid\xE9os AI, badge v\xE9rifi\xE9"
        ] }),
        /* @__PURE__ */ jsxs(Text, { style: baseStyles.statItem, children: [
          /* @__PURE__ */ jsx("span", { style: baseStyles.statValue, children: "\u{1F947} Or - 19.99$/mois" }),
          /* @__PURE__ */ jsx("br", {}),
          "Images illimit\xE9es, 50 vid\xE9os AI, support prioritaire"
        ] })
      ] }),
      /* @__PURE__ */ jsx(Text, { style: baseStyles.paragraph, children: "Pas d'pression, hein! La version gratuite est d\xE9j\xE0 ben le fun. C'est juste si tu veux d\xE9bloquer plus de cr\xE9ativit\xE9! \u{1F3A8}" }),
      /* @__PURE__ */ jsx(Section, { style: { textAlign: "center" }, children: /* @__PURE__ */ jsx(Button, { style: baseStyles.button, href: "https://zyeute.com/premium", children: "Voir les plans Premium" }) }),
      /* @__PURE__ */ jsx(Hr, { style: baseStyles.divider }),
      /* @__PURE__ */ jsxs(Text, { style: baseStyles.paragraph, children: [
        "Merci d'\xEAtre l\xE0!",
        /* @__PURE__ */ jsx("br", {}),
        /* @__PURE__ */ jsx("span", { style: baseStyles.highlight, children: "Ti-Guy" }),
        " \u{1F9AB}"
      ] }),
      /* @__PURE__ */ jsx(Text, { style: baseStyles.footer, children: /* @__PURE__ */ jsx(Link, { href: "https://zyeute.com", style: baseStyles.footerLink, children: "zyeute.com" }) })
    ] }) })
  ] });
}
function WeeklyDigestEmail({ username, stats, previewText }) {
  const { firesReceived = 0, firesGiven = 0, newFollowers = 0, postsCreated = 0 } = stats || {};
  return /* @__PURE__ */ jsxs(Html, { children: [
    /* @__PURE__ */ jsx(Head, {}),
    /* @__PURE__ */ jsx(Preview, { children: previewText || `${username}, ta semaine sur Zyeut\xE9!` }),
    /* @__PURE__ */ jsx(Body, { style: baseStyles.body, children: /* @__PURE__ */ jsxs(Container, { style: baseStyles.container, children: [
      /* @__PURE__ */ jsxs(Section, { style: baseStyles.header, children: [
        /* @__PURE__ */ jsx(Text, { style: baseStyles.logo, children: "Zyeut\xE9" }),
        /* @__PURE__ */ jsx(Text, { style: baseStyles.tagline, children: "L'app sociale du Qu\xE9bec" })
      ] }),
      /* @__PURE__ */ jsx(Text, { style: baseStyles.beaver, children: "\u{1F4CA}" }),
      /* @__PURE__ */ jsxs(Text, { style: baseStyles.heading, children: [
        "Ta semaine en un coup d'\u0153il, ",
        username,
        "!"
      ] }),
      /* @__PURE__ */ jsxs(Text, { style: baseStyles.paragraph, children: [
        "Salut ",
        username,
        "! C'est Ti-Guy avec ton r\xE9sum\xE9 hebdomadaire! Voici ce qui s'est pass\xE9 pour toi cette semaine sur Zyeut\xE9:"
      ] }),
      /* @__PURE__ */ jsxs(Section, { style: baseStyles.statsBox, children: [
        /* @__PURE__ */ jsxs(Text, { style: baseStyles.statItem, children: [
          "\u{1F525} ",
          /* @__PURE__ */ jsx("span", { style: baseStyles.statValue, children: firesReceived }),
          " feux re\xE7us"
        ] }),
        /* @__PURE__ */ jsxs(Text, { style: baseStyles.statItem, children: [
          "\u{1F525} ",
          /* @__PURE__ */ jsx("span", { style: baseStyles.statValue, children: firesGiven }),
          " feux donn\xE9s"
        ] }),
        /* @__PURE__ */ jsxs(Text, { style: baseStyles.statItem, children: [
          "\u{1F465} ",
          /* @__PURE__ */ jsx("span", { style: baseStyles.statValue, children: newFollowers }),
          " nouveaux abonn\xE9s"
        ] }),
        /* @__PURE__ */ jsxs(Text, { style: baseStyles.statItem, children: [
          "\u{1F4F8} ",
          /* @__PURE__ */ jsx("span", { style: baseStyles.statValue, children: postsCreated }),
          " posts cr\xE9\xE9s"
        ] })
      ] }),
      firesReceived > 0 ? /* @__PURE__ */ jsx(Text, { style: baseStyles.paragraph, children: "Ben voyons, t'es en feu! \u{1F525} Ton contenu a vraiment pogn\xE9 cette semaine! Continue comme \xE7a, la gang adore ce que tu fais!" }) : /* @__PURE__ */ jsx(Text, { style: baseStyles.paragraph, children: "C'est tranquille cette semaine, mais c'est correct! Prends le temps d'explorer le feed, de donner des feux, pis d'interagir avec la communaut\xE9. \xC7a va venir! \u{1F341}" }),
      /* @__PURE__ */ jsx(Section, { style: { textAlign: "center" }, children: /* @__PURE__ */ jsx(Button, { style: baseStyles.button, href: "https://zyeute.com/feed", children: "Voir le feed" }) }),
      /* @__PURE__ */ jsx(Hr, { style: baseStyles.divider }),
      /* @__PURE__ */ jsxs(Text, { style: baseStyles.paragraph, children: [
        "Bonne semaine!",
        /* @__PURE__ */ jsx("br", {}),
        /* @__PURE__ */ jsx("span", { style: baseStyles.highlight, children: "Ti-Guy" }),
        " \u{1F9AB}"
      ] }),
      /* @__PURE__ */ jsx(Text, { style: baseStyles.footer, children: /* @__PURE__ */ jsx(Link, { href: "https://zyeute.com", style: baseStyles.footerLink, children: "zyeute.com" }) })
    ] }) })
  ] });
}
function ReengagementEmail({ username, daysSinceLastVisit = 7, previewText }) {
  return /* @__PURE__ */ jsxs(Html, { children: [
    /* @__PURE__ */ jsx(Head, {}),
    /* @__PURE__ */ jsx(Preview, { children: previewText || `${username}, on s'ennuie de toi!` }),
    /* @__PURE__ */ jsx(Body, { style: baseStyles.body, children: /* @__PURE__ */ jsxs(Container, { style: baseStyles.container, children: [
      /* @__PURE__ */ jsxs(Section, { style: baseStyles.header, children: [
        /* @__PURE__ */ jsx(Text, { style: baseStyles.logo, children: "Zyeut\xE9" }),
        /* @__PURE__ */ jsx(Text, { style: baseStyles.tagline, children: "L'app sociale du Qu\xE9bec" })
      ] }),
      /* @__PURE__ */ jsx(Text, { style: baseStyles.beaver, children: "\u{1F622}" }),
      /* @__PURE__ */ jsxs(Text, { style: baseStyles.heading, children: [
        username,
        ", tu nous manques!"
      ] }),
      /* @__PURE__ */ jsxs(Text, { style: baseStyles.paragraph, children: [
        "All\xF4 ",
        username,
        "! C'est Ti-Guy... \xC7a fait ",
        daysSinceLastVisit,
        " jours qu'on t'a pas vu sur Zyeut\xE9 pis j'm'ennuie de toi! \u{1F9AB}\u{1F494}"
      ] }),
      /* @__PURE__ */ jsx(Text, { style: baseStyles.paragraph, children: "Pendant que t'\xE9tais parti, y'a eu plein de belles affaires sur l'app! Du nouveau contenu de partout au Qu\xE9bec, des discussions le fun, pis la communaut\xE9 qui grandit!" }),
      /* @__PURE__ */ jsx(Text, { style: baseStyles.paragraph, children: "J'ai m\xEAme am\xE9lior\xE9 Ti-Guy Studio avec de nouveaux styles! Tu pourrais cr\xE9er:" }),
      /* @__PURE__ */ jsxs(Section, { style: baseStyles.statsBox, children: [
        /* @__PURE__ */ jsx(Text, { style: baseStyles.statItem, children: "\u{1F3D4}\uFE0F Des paysages qu\xE9b\xE9cois en style peinture" }),
        /* @__PURE__ */ jsx(Text, { style: baseStyles.statItem, children: "\u{1F3A8} Des portraits artistiques uniques" }),
        /* @__PURE__ */ jsx(Text, { style: baseStyles.statItem, children: "\u{1F9AB} Des castors dans toutes les situations imaginables" }),
        /* @__PURE__ */ jsx(Text, { style: baseStyles.statItem, children: "\u{1F341} Du contenu 100% qu\xE9b\xE9cois!" })
      ] }),
      /* @__PURE__ */ jsx(Text, { style: baseStyles.paragraph, children: "Reviens nous voir, on t'attend! La gang est pas pareille sans toi! \u{1F341}" }),
      /* @__PURE__ */ jsx(Section, { style: { textAlign: "center" }, children: /* @__PURE__ */ jsx(Button, { style: baseStyles.button, href: "https://zyeute.com/feed", children: "Revenir sur Zyeut\xE9" }) }),
      /* @__PURE__ */ jsx(Hr, { style: baseStyles.divider }),
      /* @__PURE__ */ jsxs(Text, { style: baseStyles.paragraph, children: [
        "J'esp\xE8re te revoir bient\xF4t!",
        /* @__PURE__ */ jsx("br", {}),
        /* @__PURE__ */ jsx("span", { style: baseStyles.highlight, children: "Ti-Guy" }),
        " \u{1F9AB}"
      ] }),
      /* @__PURE__ */ jsxs(Text, { style: baseStyles.footer, children: [
        /* @__PURE__ */ jsx(Link, { href: "https://zyeute.com", style: baseStyles.footerLink, children: "zyeute.com" }),
        " |",
        /* @__PURE__ */ jsx(Link, { href: "https://zyeute.com/settings/notifications", style: baseStyles.footerLink, children: " G\xE9rer mes courriels" })
      ] })
    ] }) })
  ] });
}
function UpgradePromptEmail({ username, aiGenerationsUsed = 0, maxFreeGenerations = 10, previewText }) {
  const percentUsed = Math.round(aiGenerationsUsed / maxFreeGenerations * 100);
  return /* @__PURE__ */ jsxs(Html, { children: [
    /* @__PURE__ */ jsx(Head, {}),
    /* @__PURE__ */ jsx(Preview, { children: previewText || `${username}, d\xE9bloque plus de cr\xE9ativit\xE9!` }),
    /* @__PURE__ */ jsx(Body, { style: baseStyles.body, children: /* @__PURE__ */ jsxs(Container, { style: baseStyles.container, children: [
      /* @__PURE__ */ jsxs(Section, { style: baseStyles.header, children: [
        /* @__PURE__ */ jsx(Text, { style: baseStyles.logo, children: "Zyeut\xE9" }),
        /* @__PURE__ */ jsx(Text, { style: baseStyles.tagline, children: "L'app sociale du Qu\xE9bec" })
      ] }),
      /* @__PURE__ */ jsx(Text, { style: baseStyles.beaver, children: "\u{1F680}" }),
      /* @__PURE__ */ jsxs(Text, { style: baseStyles.heading, children: [
        "T'aimes cr\xE9er, ",
        username,
        "!"
      ] }),
      /* @__PURE__ */ jsxs(Text, { style: baseStyles.paragraph, children: [
        "Hey ",
        username,
        "! C'est Ti-Guy! J'ai remarqu\xE9 que t'as utilis\xE9",
        /* @__PURE__ */ jsxs("span", { style: baseStyles.highlight, children: [
          " ",
          aiGenerationsUsed,
          " de tes ",
          maxFreeGenerations,
          " "
        ] }),
        "cr\xE9ations AI gratuites ce mois-ci! (",
        percentUsed,
        "%)"
      ] }),
      /* @__PURE__ */ jsx(Text, { style: baseStyles.paragraph, children: "C'est malade, \xE7a veut dire que t'aimes vraiment cr\xE9er avec moi! \u{1F3A8} Si tu veux continuer sans te soucier des limites, j'ai une id\xE9e pour toi:" }),
      /* @__PURE__ */ jsxs(Section, { style: baseStyles.statsBox, children: [
        /* @__PURE__ */ jsx(Text, { style: baseStyles.statItem, children: /* @__PURE__ */ jsx("span", { style: baseStyles.statValue, children: "\u{1F948} Creator Pro - 9.99$/mois" }) }),
        /* @__PURE__ */ jsx(Text, { style: baseStyles.statItem, children: "\u2705 200 images AI par mois (au lieu de 10)" }),
        /* @__PURE__ */ jsx(Text, { style: baseStyles.statItem, children: "\u2705 10 vid\xE9os AI par mois" }),
        /* @__PURE__ */ jsx(Text, { style: baseStyles.statItem, children: "\u2705 Badge v\xE9rifi\xE9 sur ton profil" }),
        /* @__PURE__ */ jsx(Text, { style: baseStyles.statItem, children: "\u2705 Z\xE9ro publicit\xE9" })
      ] }),
      /* @__PURE__ */ jsx(Text, { style: baseStyles.paragraph, children: "C'est pas mal, non? Pis tu supportes une app qu\xE9b\xE9coise en m\xEAme temps! Pas d'pression, hein - c'est juste une option si tu veux plus de fun! \u{1F9AB}" }),
      /* @__PURE__ */ jsx(Section, { style: { textAlign: "center" }, children: /* @__PURE__ */ jsx(Button, { style: baseStyles.button, href: "https://zyeute.com/premium", children: "Voir Creator Pro" }) }),
      /* @__PURE__ */ jsx(Hr, { style: baseStyles.divider }),
      /* @__PURE__ */ jsxs(Text, { style: baseStyles.paragraph, children: [
        "Continue de cr\xE9er!",
        /* @__PURE__ */ jsx("br", {}),
        /* @__PURE__ */ jsx("span", { style: baseStyles.highlight, children: "Ti-Guy" }),
        " \u{1F9AB}"
      ] }),
      /* @__PURE__ */ jsx(Text, { style: baseStyles.footer, children: /* @__PURE__ */ jsx(Link, { href: "https://zyeute.com", style: baseStyles.footerLink, children: "zyeute.com" }) })
    ] }) })
  ] });
}
const VALID_EMAIL_TYPES = [
  "welcome",
  "onboarding_day1",
  "onboarding_day3",
  "onboarding_day7",
  "weekly_digest",
  "reengagement",
  "upgrade_prompt"
];
function isValidEmailType(type) {
  return VALID_EMAIL_TYPES.includes(type);
}
async function renderEmail({ emailType, username, context }) {
  if (!isValidEmailType(emailType)) {
    console.error(`[Email] Invalid email type: ${emailType}, defaulting to welcome`);
    emailType = "welcome";
  }
  const safeUsername = username || "ami";
  let element;
  let subject;
  switch (emailType) {
    case "welcome":
      element = /* @__PURE__ */ jsx(WelcomeEmail, { username: safeUsername });
      subject = `Bienvenue sur Zyeut\xE9, ${safeUsername}! \u{1F9AB}`;
      break;
    case "onboarding_day1":
      element = /* @__PURE__ */ jsx(OnboardingDay1Email, { username: safeUsername });
      subject = `${safeUsername}, d\xE9couvre Ti-Guy Studio! \u{1F3A8}`;
      break;
    case "onboarding_day3":
      element = /* @__PURE__ */ jsx(OnboardingDay3Email, { username: safeUsername });
      subject = `${safeUsername}, c'est quoi les Feux? \u{1F525}`;
      break;
    case "onboarding_day7":
      element = /* @__PURE__ */ jsx(OnboardingDay7Email, { username: safeUsername });
      subject = `Une semaine avec nous, ${safeUsername}! \u{1F389}`;
      break;
    case "weekly_digest":
      element = /* @__PURE__ */ jsx(WeeklyDigestEmail, { username: safeUsername, stats: context?.stats });
      subject = `Ta semaine sur Zyeut\xE9, ${safeUsername}! \u{1F4CA}`;
      break;
    case "reengagement":
      element = /* @__PURE__ */ jsx(
        ReengagementEmail,
        {
          username: safeUsername,
          daysSinceLastVisit: context?.daysSinceLastVisit
        }
      );
      subject = `${safeUsername}, on s'ennuie de toi! \u{1F9AB}`;
      break;
    case "upgrade_prompt":
      element = /* @__PURE__ */ jsx(
        UpgradePromptEmail,
        {
          username: safeUsername,
          aiGenerationsUsed: context?.aiGenerationsUsed,
          maxFreeGenerations: context?.maxFreeGenerations
        }
      );
      subject = `${safeUsername}, d\xE9bloque plus de cr\xE9ativit\xE9! \u{1F680}`;
      break;
    default:
      element = /* @__PURE__ */ jsx(WelcomeEmail, { username: safeUsername });
      subject = `Bienvenue sur Zyeut\xE9, ${safeUsername}! \u{1F9AB}`;
  }
  const html = await render(element);
  return { subject, html };
}
export {
  OnboardingDay1Email,
  OnboardingDay3Email,
  OnboardingDay7Email,
  ReengagementEmail,
  UpgradePromptEmail,
  WeeklyDigestEmail,
  WelcomeEmail,
  isValidEmailType,
  renderEmail
};

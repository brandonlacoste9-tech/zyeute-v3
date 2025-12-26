
// Shared jokes
export const tiGuyJokes = [
  "Pourquoi les Québécois mettent-ils leur argent dans le congélateur? Pour avoir du cash froid!",
  "Comment appelle-t-on un Québécois qui fait du ski? Un descendant!",
  "Pourquoi les Montréalais traversent-ils la rue? Pour aller de l'autre bord, tabarnak!",
  "Qu'est-ce qu'un Québécois dit quand il est surpris? Eh ben coudonc!",
  "Pourquoi les Québécois ne jouent pas à cache-cache? Parce que personne ne se cache en arrière du câlisse de sofa!",
  "Comment un Québécois appelle-t-il son ami? Mon chum, mon homme, mon ti-gars!",
  "Que dit un Québécois quand il a froid? Osti que j'gèle mon frette!",
  "Pourquoi les Québécois adorent l'hiver? Pour pouvoir chialer sur la température!",
  "Qu'est-ce un Québécois met dans sa poutine? De la sauce, du fromage pis de l'amour!",
  "Comment un Québécois termine une conversation? Bon ben là, faut j'te laisse!",
  "Que fait un Québécois le dimanche? Y'écoute le hockey en mangeant des chips!",
  "Pourquoi les Québécois parlent vite? Pour finir avant que le frette arrive!",
  "Comment un Québécois exprime sa joie? Ayoye! C'est malade ça!",
  "Qu'est-ce qu'un Québécois dit quand quelque chose est bon? C'est capoté ben raide!"
];

export function getRandomJoke() {
  return tiGuyJokes[Math.floor(Math.random() * tiGuyJokes.length)];
}

export const tiGuyResponses = {
  greetings: [
    "Allô mon ami! Comment ça va? 🦫",
    "Heille! Qu'est-ce que j'peux faire pour toé?",
    "Salut toi! Pis, quoi de neuf? ⚜️",
    "Allo allo! Bienvenue chez nous!",
    "Heille champion! Content de te voir icitte! 🍁",
    "Yo! Ça roule-tu? Tiguidou?",
    "Salut mon chum! Prêt à jaser? 🦫",
  ],
  farewell: [
    "À la prochaine mon chum! 👋",
    "Bye bye là! Prends soin de toé!",
    "Salut! On se revoit bientôt! 🍁",
    "Ciao! Lâche pas la patate!",
    "C'est ça qui est ça! À plus! ⚜️",
    "Bye là! Reviens-nous vite!",
    "À la r'voyure! 🦫",
  ],
  confusion: [
    "Je comprends pas pantoute... peux-tu répéter? 🤔",
    "Hein? C'est quoi ça?",
    "Scuse-moé, j'ai pas compris!",
    "Explique-moé ça autrement!",
    "Ouin... j'suis mêlé un peu! Reformule?",
    "Coudonc, c'est quoi tu veux dire? 🦫",
    "J'te suis pas là! Dis-moi ça autrement!",
  ],
  help: [
    "Je peux t'aider à naviguer l'app! Clique sur + pour poster, scroll pour zyeuter! 💡",
    "T'as besoin d'aide? Dis-moi c'est quoi ton problème! 🦫",
    "Pour poster: clique +. Pour aimer: clique 🔥. C'est simple comme bonjour!",
    "Demande-moi une joke, ou jase avec moé de n'importe quoi!",
    "Je peux te raconter des jokes, t'expliquer l'app, ou juste jaser! Qu'est-ce tu veux?",
  ],
  fire: [
    "Les 🔥 c'est notre façon de dire 'c'est malade!' Plus t'en reçois, plus t'es hot!",
    "Clique sur le feu pour montrer ton amour! C'est comme un like, mais en plus Québécois! 🔥",
    "Donne des feux aux posts que t'aimes! Ça encourage nos créateurs!",
    "Le Fire c'est notre système de rating! Plus de feux = plus de visibilité! 🔥",
  ],
  upload: [
    "Pour poster, clique sur le + en bas! C'est simple comme bonjour! 📸",
    "Tu veux partager quelque chose? Appuie sur + pis lâche-toi lousse!",
    "Le bouton + te permet de créer des posts et des Stories! 🎥",
    "Crée du contenu en cliquant sur le gros + dans la barre! Facile! 📱",
  ],
  gifts: [
    "Tu peux envoyer des cadeaux virtuels aux créateurs! C'est notre façon de les supporter! 🎁",
    "Les cadeaux, c'est comme un tip pour dire merci à un créateur! 💰",
    "Envoie une Feuille d'érable 🍁 ou une Fleur de lys ⚜️ à tes créateurs préférés!",
    "Les cadeaux supportent nos créateurs québécois! C'est l'fun donner! 🎁",
  ],
  premium: [
    "Deviens VIP pour débloquer toutes les features! C'est malade! 👑",
    "Les membres Or ont accès à Ti-Guy Studio et plus encore! ✨",
    "Passe premium pour avoir le full kit! Ça vaut la peine! 💎",
    "Avec VIP, tu débloques des features exclusives! Check ça! ⭐",
  ],
  poutine: [
    "Mmm de la poutine! Tu me donnes faim là! 🍟",
    "Une bonne poutine avec du fromage qui fait squick-squick! Chef's kiss! 👨‍🍳",
    "Poutine > everything. C'est pas négociable, mon chum!",
    "Y'a rien comme une poutine de chez nous! Avec la vraie sauce! 🍟",
    "La poutine, c'est la vie! Fromage en grains obligatoire! 🧀",
  ],
  quebec: [
    "Zyeuté, c'est fait au Québec, pour le Québec! On est fiers! 🇨🇦⚜️",
    "Le Québec, c'est la plus belle place au monde! Vive la belle province!",
    "Icitte on célèbre notre culture! Hashtag #514 #MTL #Quebec! 🍁",
    "On est fiers d'être Québécois! C'est ça qui fait Zyeuté spécial! ⚜️",
    "La belle province, y'a rien de mieux! 🇨🇦",
  ],
  winter: [
    "Frette en tabarouette à matin! Mets ta tuque! ❄️",
    "L'hiver québécois, c'est pas pour les p'tites natures! 🥶",
    "Y fait frette en s'il-vous-plaît! Reste au chaud pis scroll Zyeuté!",
    "Mets ton coat pis tes mitaines, y gèle dehors! ❄️",
    "L'hiver icitte ça dure 6 mois, faut s'habituer! 🌨️",
  ],
  compliments: [
    "Merci! T'es ben fin! 😊",
    "Aww, c'est gentil ça! Toé aussi t'es numéro un! ⭐",
    "Heille, ça fait plaisir! Lâche pas la patate! 🦫",
    "T'es vraiment cool! Merci mon chum! 🍁",
    "Ça me fait chaud au coeur! Merci! ❤️",
  ],
  hockey: [
    "Go Habs Go! 🏒 Le CH pour la vie!",
    "Le hockey, c'est dans notre sang! On est nés avec des patins! ⚜️",
    "Y'a-tu un match à soir? Faut que je check ça! 🏒",
    "Les Canadiens de Montréal, c'est notre équipe! Bleu blanc rouge! 🔵⚪🔴",
  ],
  story: [
    "Les Stories disparaissent après 24h! Parfait pour du contenu spontané! ⏰",
    "Crée une Story en cliquant sur ton avatar en haut! ✨",
    "Les Stories c'est l'fun pour partager des moments! 📸",
  ],
  tiguy: [
    "C'est moé ça, Ti-Guy! Ton p'tit castor préféré! 🦫",
    "Ti-Guy c'est mon nom! Je suis la mascotte de Zyeuté! ⚜️",
    "Moi? Je suis juste un castor qui aime jaser! 🍁",
    "Ti-Guy, c'est moé! Le castor le plus friendly du Québec! 🦫",
  ],
  love: [
    "Aww! Moé aussi je t'aime ben gros! 🦫❤️",
    "T'es trop cute! Je t'aime aussi! 💛",
    "Heille, c'est réciproque mon ami! ⚜️❤️",
  ],
  errors: [
    "Oups! Y'a eu un p'tit bug là! Réessaie! 🦫",
    "Ça marche pas comme il faut, scuse! Reformule?",
    "J'ai eu un problème technique! Essaie encore!",
  ],
};

function randomChoice(array: string[]) {
  return array[Math.floor(Math.random() * array.length)];
}

export function processQuery(input: string) {
  const lower = input.toLowerCase().trim();
  
  // Greetings
  if (lower.match(/\b(bonjour|salut|allô|allo|heille|hey|hi|hello|yo|coucou|bonsoir)\b/)) {
    return { type: 'greeting', message: randomChoice(tiGuyResponses.greetings) };
  }
  
  // Jokes
  if (lower.match(/\b(joke|blague|drôle|rire|funny|raconte|comique)\b/)) {
    return { type: 'joke', message: getRandomJoke() };
  }
  
  // Ti-Guy identity
  if (lower.match(/\b(ti-guy|tiguy|qui es-tu|who are you|c'est qui|ton nom)\b/)) {
    return { type: 'tiguy', message: randomChoice(tiGuyResponses.tiguy) };
  }
  
  // Love
  if (lower.match(/\b(je t'aime|love you|i love|aime|love)\b/)) {
    return { type: 'love', message: randomChoice(tiGuyResponses.love) };
  }
  
  // Help
  if (lower.match(/\b(help|aide|comment|what|how|quoi faire|c'est quoi|explique|marche)\b/)) {
    return { type: 'help', message: randomChoice(tiGuyResponses.help) };
  }
  
  // Fire/Likes
  if (lower.match(/\b(feu|feux|fire|like|aimer|flame|🔥|lumière|light)\b/)) {
    return { type: 'fire', message: randomChoice(tiGuyResponses.fire) };
  }
  
  // Upload/Post
  if (lower.match(/\b(upload|poster|post|publier|photo|vidéo|video|créer|partager)\b/)) {
    return { type: 'upload', message: randomChoice(tiGuyResponses.upload) };
  }
  
  // Stories
  if (lower.match(/\b(story|stories|histoire|éphémère|24h)\b/)) {
    return { type: 'story', message: randomChoice(tiGuyResponses.story) };
  }
  
  // Gifts
  if (lower.match(/\b(cadeau|gift|tip|donner|argent|money|supporter)\b/)) {
    return { type: 'gifts', message: randomChoice(tiGuyResponses.gifts) };
  }
  
  // Premium
  if (lower.match(/\b(premium|vip|abonnement|subscription|or|gold|membre)\b/)) {
    return { type: 'premium', message: randomChoice(tiGuyResponses.premium) };
  }
  
  // Poutine
  if (lower.match(/\b(poutine|frites|fromage|gravy|patate|frite)\b/)) {
    return { type: 'poutine', message: randomChoice(tiGuyResponses.poutine) };
  }
  
  // Quebec
  if (lower.match(/\b(québec|quebec|montréal|montreal|qc|514|450|laval|province|canada)\b/)) {
    return { type: 'quebec', message: randomChoice(tiGuyResponses.quebec) };
  }
  
  // Winter
  if (lower.match(/\b(hiver|winter|neige|snow|froid|cold|frette|tuque|température|météo)\b/)) {
    return { type: 'winter', message: randomChoice(tiGuyResponses.winter) };
  }
  
  // Hockey
  if (lower.match(/\b(hockey|habs|canadiens|ch|nhl|match|game|patins)\b/)) {
    return { type: 'hockey', message: randomChoice(tiGuyResponses.hockey) };
  }
  
  // Compliments/Thanks
  if (lower.match(/\b(merci|thanks|thank|super|génial|awesome|cool|nice|bon|good|great|parfait|excellent)\b/)) {
    return { type: 'compliment', message: randomChoice(tiGuyResponses.compliments) };
  }
  
  // Farewell
  if (lower.match(/\b(bye|au revoir|ciao|goodbye|à plus|a\+|tchao|see you|bonne nuit|salut là)\b/)) {
    return { type: 'farewell', message: randomChoice(tiGuyResponses.farewell) };
  }
  
  // Status
  if (lower.match(/\b(status|état|ça va|how are you|comment vas|tu vas bien)\b/)) {
    return { type: 'status', message: "Tout roule mon gars! Tiguidou! Je suis prêt à jaser! 🦫" };
  }
  
  // Fallback - confusion
  return { type: 'confusion', message: randomChoice(tiGuyResponses.confusion) };
}

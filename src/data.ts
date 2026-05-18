
export interface EurovisionSong {
  year: number;
  final_place: number;
  country: string;
  artist: string;
  song: string;
  total_points: number;
  genre: string;
  language: string;
  performer_type: string;
  running_order: number;
  running_order_half: string;
  jury_points: number;
  televote_points: number;
  stronger_support: string;
  region: string;
  result_category: string;
  description?: string;
}

export const translations: Record<string, string> = {
  // Types
  song: "Pjesma",
  country: "Država",
  region: "Regija",
  genre: "Žanr",
  language: "Jezik",
  performer_type: "Tip izvođača",
  half: "Polovica nastupa",
  support: "Podrška",
  
  // Halves
  "first half": "prva polovica",
  "second half": "druga polovica",
  
  // Languages
  "English": "engleski",
  "native language": "nacionalni jezik",
  "mixed": "miješano",
  
  // Performer types
  "solo": "solo izvođač",
  "duo": "duet",
  "group": "grupa",
  
  // Support
  "jury": "žiri",
  "televote": "publika",
  "balanced": "uravnoteženo",
  
  // Genres
  "pop": "pop",
  "ballad": "balada",
  "rock": "rock",
  "dance": "dance",
  "electronic": "elektronička glazba",
  "folk_ethno": "etno/folk",
  "rap_hip_hop": "rap/hip-hop",
  "opera_classical": "opera/klasična glazba",
  "novelty": "novelty/zabavna izvedba",
  "alternative": "alternativa",
  "rock/pop": "rock/pop",
  "dance/pop": "dance/pop",
  "pop/ballad": "pop/balada",
  "pop/folk_ethno": "pop/etno/folk",
  "alternative/pop": "alternativa/pop",
  "pop/electronic": "pop/elektronička glazba",
  "opera_classical/electronic": "opera/elektronička glazba",
  "folk_ethno/pop": "etno/folk/pop",
  "folk_ethno/rap_hip_hop": "etno/folk/rap/hip-hop",
  "pop/dance": "pop/dance",
  "pop/novelty": "pop/novelty",
  "pop/rap_hip_hop": "pop/rap/hip-hop",
  "pop/rock": "pop/rock",
  "electronic/rap_hip_hop": "elektronička glazba/rap/hip-hop",
  "novelty/pop": "novelty/pop",
  "rap_hip_hop/pop": "rap/hip-hop/pop",
  "pop/opera_classical": "pop/opera/klasična glazba"
};

export const songsData: EurovisionSong[] = [
  {
    year: 2010, final_place: 1, country: "Germany", artist: "Lena", song: "Satellite", total_points: 246, genre: "pop", language: "English", performer_type: "solo", running_order: 22, running_order_half: "second half", jury_points: 187, televote_points: 243, stronger_support: "televote", region: "Central Europe", result_category: "winner",
    description: "Lenin 'Satellite' bio je moderan, osvježavajući pop hit koji je prekinuo dugogodišnji post Njemačke. Njezina opuštena izvedba i specifičan šarm osvojili su i žiri i publiku, označivši početak nove ere suvremenih nastupa."
  },
  {
    year: 2010, final_place: 2, country: "Turkey", artist: "maNga", song: "We Could Be the Same", total_points: 170, genre: "rock/pop", language: "English", performer_type: "group", running_order: 14, running_order_half: "second half", jury_points: 119, televote_points: 177, stronger_support: "televote", region: "Other", result_category: "top 3",
    description: "Visokoenergetski rock nastup s robotskim vizualnim efektima. Pokazao je da alternativni zvuk i dalje može briljirati na Euroviziji, zamalo pobijedivši nakon dominantnog rezultata kod publike."
  },
  {
    year: 2010, final_place: 3, country: "Romania", artist: "Paula Seling & Ovi", song: "Playing with Fire", total_points: 162, genre: "dance/pop", language: "English", performer_type: "duo", running_order: 19, running_order_half: "second half", jury_points: 167, televote_points: 155, stronger_support: "jury", region: "Balkan", result_category: "top 3",
    description: "Poznat po 'dvostrukom klaviru' i snažnim vokalnim harmonijama. Bila je to sofisticirana pop produkcija koja je naišla na odličan odaziv kod stručnog žirija."
  },
  {
    year: 2011, final_place: 1, country: "Azerbaijan", artist: "Ell/Nikki", song: "Running Scared", total_points: 221, genre: "pop/ballad", language: "English", performer_type: "duo", running_order: 19, running_order_half: "second half", jury_points: 182, televote_points: 223, stronger_support: "televote", region: "Caucasus", result_category: "winner",
    description: "Romantična, srednje brza balada. Iako nije pobjednik s rekordnim brojem bodova, zlatna scenografija i univerzalna privlačnost osigurali su Azerbajdžanu prvu pobjedu."
  },
  {
    year: 2011, final_place: 2, country: "Italy", artist: "Raphael Gualazzi", song: "Madness of Love", total_points: 189, genre: "pop", language: "mixed", performer_type: "solo", running_order: 12, running_order_half: "first half", jury_points: 251, televote_points: 99, stronger_support: "jury", region: "Mediterranean", result_category: "top 3",
    description: "Trijumfalni povratak Italije nakon 13 godina izbivanja. Ovaj jazzy, sofisticirani nastup bio je favorit žirija, dokazujući da tradicija i vrhunska muzikalnost imaju svoje mjesto."
  },
  {
    year: 2011, final_place: 3, country: "Sweden", artist: "Eric Saade", song: "Popular", total_points: 185, genre: "dance/pop", language: "English", performer_type: "solo", running_order: 7, running_order_half: "first half", jury_points: 106, televote_points: 221, stronger_support: "televote", region: "Scandinavia", result_category: "top 3",
    description: "Nastup s 'razbijanjem stakla' vratio je Švedsku u sami vrh i postavio temelje za njihovu dominaciju tijekom 2010-ih."
  },
  {
    year: 2012, final_place: 1, country: "Sweden", artist: "Loreen", song: "Euphoria", total_points: 372, genre: "dance/electronic", language: "English", performer_type: "solo", running_order: 17, running_order_half: "second half", jury_points: 296, televote_points: 343, stronger_support: "televote", region: "Scandinavia", result_category: "winner",
    description: "Smatra se jednim od najboljih nastupa u povijesti natjecanja. Minimalistička, atmosferska koreografija i dance-pop briljantnost stvorili su 'euforiju' koja je pomela kontinent."
  },
  {
    year: 2012, final_place: 2, country: "Russia", artist: "Buranovskiye Babushki", song: "Party for Everybody", total_points: 259, genre: "folk_ethno/pop", language: "mixed", performer_type: "group", running_order: 6, running_order_half: "first half", jury_points: 94, televote_points: 332, stronger_support: "televote", region: "Eastern Europe", result_category: "top 3",
    description: "Bake iz Buranova donijele su radost i tradicionalne motive na pozornicu. Ogroman favorit publike, naglašavajući ljubav Eurovizije prema autentičnim i zabavnim nastupima."
  },
  {
    year: 2012, final_place: 3, country: "Serbia", artist: "Željko Joksimović", song: "Nije ljubav stvar", total_points: 214, genre: "ballad", language: "native language", performer_type: "solo", running_order: 24, running_order_half: "second half", jury_points: 173, televote_points: 211, stronger_support: "televote", region: "Balkan", result_category: "top 3",
    description: "Klasična balkanska balada majstora žanra. Njezina emotivna dubina i tradicionalna orkestracija visoko su ocijenjeni u svim glasačkim blokovima."
  },
  {
    year: 2013, final_place: 1, country: "Denmark", artist: "Emmelie de Forest", song: "Only Teardrops", total_points: 281, genre: "pop/folk_ethno", language: "English", performer_type: "solo", running_order: 18, running_order_half: "second half", jury_points: 6.23, televote_points: 4.97, stronger_support: "televote", region: "Scandinavia", result_category: "winner",
    description: "Ritmična pop pjesma s keltskim utjecajima i bosonogom izvedbom. Bila je favorit od samog početka, utjelovljujući poliranu nordijsku produkciju."
  },
  {
    year: 2013, final_place: 2, country: "Azerbaijan", artist: "Farid Mammadov", song: "Hold Me", total_points: 234, genre: "pop/ballad", language: "English", performer_type: "solo", running_order: 20, running_order_half: "second half", jury_points: 7.77, televote_points: 5.86, stronger_support: "televote", region: "Caucasus", result_category: "top 3",
    description: "Zapamćen po plesaču u staklenoj kutiji koji je oponašao sjenu. Vizualno inovativan nastup koji je pokazao ambicije Azerbajdžana."
  },
  {
    year: 2013, final_place: 3, country: "Ukraine", artist: "Zlata Ognevich", song: "Gravity", total_points: 214, genre: "pop/ballad", language: "English", performer_type: "solo", running_order: 22, running_order_half: "second half", jury_points: 8.74, televote_points: 5.66, stronger_support: "televote", region: "Eastern Europe", result_category: "top 3",
    description: "Fantastična tematika nastupa uz prisutnost 'diva' na pozornici. Nastavljen niz ukrajinskih visokobudžetnih i konceptualno snažnih nastupa."
  },
  {
    year: 2014, final_place: 1, country: "Austria", artist: "Conchita Wurst", song: "Rise Like a Phoenix", total_points: 290, genre: "ballad", language: "English", performer_type: "solo", running_order: 11, running_order_half: "first half", jury_points: 224, televote_points: 311, stronger_support: "televote", region: "Central Europe", result_category: "winner",
    description: "Moćna balada s prizvukom James Bond glazbe. Više od same glazbe, pobjeda Conchite bila je značajan trenutak za raznolikost i prihvaćanje u povijesti Eurovizije."
  },
  {
    year: 2014, final_place: 2, country: "Netherlands", artist: "The Common Linnets", song: "Calm After the Storm", total_points: 238, genre: "alternative/pop", language: "English", performer_type: "duo", running_order: 24, running_order_half: "second half", jury_points: 200, televote_points: 222, stronger_support: "televote", region: "Western Europe", result_category: "top 3",
    description: "Jednostavna, autentična produkcija s naglaskom na country zvuk. Istaknula se intimnim kadriranjem i izostankom uobičajenog natjecateljskog blještavila."
  },
  {
    year: 2014, final_place: 3, country: "Sweden", artist: "Sanna Nielsen", song: "Undo", total_points: 218, genre: "pop/ballad", language: "English", performer_type: "solo", running_order: 13, running_order_half: "first half", jury_points: 201, televote_points: 190, stronger_support: "jury", region: "Scandinavia", result_category: "top 3",
    description: "Klasična, vrhunski izvedena švedska balada. Sannina vokalna preciznost i efekti disko-kugle osigurali su visoke bodove kod žirija."
  },
  {
    year: 2015, final_place: 1, country: "Sweden", artist: "Måns Zelmerlöw", song: "Heroes", total_points: 365, genre: "pop/electronic", language: "English", performer_type: "solo", running_order: 10, running_order_half: "first half", jury_points: 363, televote_points: 279, stronger_support: "jury", region: "Scandinavia", result_category: "winner",
    description: "Revolucionarno korištenje interaktivnih projekcija. Iako je Italija osvojila publiku, Månsova uvjerljiva pobjeda kod žirija donijela je trofej Švedskoj."
  },
  {
    year: 2015, final_place: 2, country: "Russia", artist: "Polina Gagarina", song: "A Million Voices", total_points: 303, genre: "pop/ballad", language: "English", performer_type: "solo", running_order: 25, running_order_half: "second half", jury_points: 247, televote_points: 286, stronger_support: "televote", region: "Eastern Europe", result_category: "top 3",
    description: "Grandiozna mirovna balada u politički napetom vremenu. Polinin moćan vokal i efekt 'svijetleće haljine' postigli su snažan utjecaj na gledatelje."
  },
  {
    year: 2015, final_place: 3, country: "Italy", artist: "Il Volo", song: "Grande amore", total_points: 292, genre: "opera_classical", language: "native language", performer_type: "group", running_order: 27, running_order_half: "second half", jury_points: 184, televote_points: 366, stronger_support: "televote", region: "Mediterranean", result_category: "top 3",
    description: "Trio koji je osvojio srca europske javnosti. Pobijedili su kod publike s velikom razlikom, ali su ih tehnički kriteriji žirija zadržali na trećem mjestu."
  },
  {
    year: 2016, final_place: 1, country: "Ukraine", artist: "Jamala", song: "1944", total_points: 534, genre: "folk_ethno", language: "mixed", performer_type: "solo", running_order: 21, running_order_half: "second half", jury_points: 211, televote_points: 323, stronger_support: "televote", region: "Eastern Europe", result_category: "winner",
    description: "Duboko osobna i potresna priča o deportaciji krimskih Tatara. Pobijedila je pod novim sustavom bodovanja, uz postojanu podršku i žirija i javnosti."
  },
  {
    year: 2016, final_place: 2, country: "Australia", artist: "Dami Im", song: "Sound of Silence", total_points: 511, genre: "pop/ballad", language: "English", performer_type: "solo", running_order: 13, running_order_half: "first half", jury_points: 320, televote_points: 191, stronger_support: "jury", region: "Other", result_category: "top 3",
    description: "Najbolji rezultat Australije do danas. Fenomenalan vokalni raspon Dami Im i visokotehnološka scenografija osigurali su apsolutnu pobjedu kod žirija."
  },
  {
    year: 2016, final_place: 3, country: "Russia", artist: "Sergey Lazarev", song: "You Are the Only One", total_points: 491, genre: "pop/dance", language: "English", performer_type: "solo", running_order: 18, running_order_half: "second half", jury_points: 130, televote_points: 361, stronger_support: "televote", region: "Eastern Europe", result_category: "top 3",
    description: "Nastup s revolucionarnim 3D zidom. Bio je miljenik publike, pokazujući predanost Rusije velikim scenskim spektaklima."
  },
  {
    year: 2017, final_place: 1, country: "Portugal", artist: "Salvador Sobral", song: "Amar pelos dois", total_points: 758, genre: "ballad", language: "native language", performer_type: "solo", running_order: 11, running_order_half: "first half", jury_points: 382, televote_points: 376, stronger_support: "balanced", region: "Mediterranean", result_category: "winner",
    description: "Bezvremenska balada s dozom jazza koja je dala prednost glazbi nad spektaklom. Oborila je rekorde u bodovima i donijela Portugalu prvu pobjedu ikada."
  },
  {
    year: 2017, final_place: 2, country: "Bulgaria", artist: "Kristian Kostov", song: "Beautiful Mess", total_points: 615, genre: "pop/ballad", language: "English", performer_type: "solo", running_order: 25, running_order_half: "second half", jury_points: 278, televote_points: 337, stronger_support: "televote", region: "Balkan", result_category: "top 3",
    description: "Suvremena i zrela produkcija kojom je Bugarska ostvarila svoj povijesno najbolji plasman."
  },
  {
    year: 2017, final_place: 3, country: "Moldova", artist: "SunStroke Project", song: "Hey Mamma", total_points: 374, genre: "dance/pop", language: "English", performer_type: "group", running_order: 7, running_order_half: "first half", jury_points: 110, televote_points: 264, stronger_support: "televote", region: "Eastern Europe", result_category: "top 3",
    description: "Povratak 'Epic Sax Guya'. Zabavan, svadbeni nastup koji je Moldaviji donio radost i ogroman broj bodova od publike."
  },
  {
    year: 2018, final_place: 1, country: "Israel", artist: "Netta", song: "Toy", total_points: 529, genre: "pop/novelty", language: "English", performer_type: "solo", running_order: 22, running_order_half: "second half", jury_points: 212, televote_points: 317, stronger_support: "televote", region: "Other", result_category: "winner",
    description: "Osnažujuća pop himna prožeta zvukovima 'loop' stanice. Nettini jedinstveni vokalni zvukovi i specifična koreografija postali su viralna senzacija."
  },
  {
    year: 2018, final_place: 2, country: "Cyprus", artist: "Eleni Foureira", song: "Fuego", total_points: 436, genre: "dance/pop", language: "English", performer_type: "solo", running_order: 25, running_order_half: "second half", jury_points: 183, televote_points: 253, stronger_support: "televote", region: "Mediterranean", result_category: "top 3",
    description: "Visokoenergetski plesni nastup koji je dominirao u predviđanjima. Elenina profesionalnost učinila je 'Fuego' modernim eurovizijskim klasikom."
  },
  {
    year: 2018, final_place: 3, country: "Austria", artist: "Cesár Sampson", song: "Nobody But You", total_points: 342, genre: "pop", language: "English", performer_type: "solo", running_order: 5, running_order_half: "first half", jury_points: 271, televote_points: 71, stronger_support: "jury", region: "Central Europe", result_category: "top 3",
    description: "Soul-pop pjesma s elementima gospela koja je iznenadila pobjedom kod žirija. Pokazala je snagu jednostavne, ali vokalno besprijekorne izvedbe."
  },
  {
    year: 2019, final_place: 1, country: "Netherlands", artist: "Duncan Laurence", song: "Arcade", total_points: 498, genre: "pop/ballad", language: "English", performer_type: "solo", running_order: 12, running_order_half: "first half", jury_points: 237, televote_points: 261, stronger_support: "balanced", region: "Western Europe", result_category: "winner",
    description: "Emotivna i sirova balada o gubitku. 'Arcade' je postao globalni hit na platformama poput TikToka, dokazujući da Eurovizija može lansirati svjetske zvijezde."
  },
  {
    year: 2019, final_place: 2, country: "Italy", artist: "Mahmood", song: "Soldi", total_points: 472, genre: "pop/rap_hip_hop", language: "native language", performer_type: "solo", running_order: 22, running_order_half: "second half", jury_points: 219, televote_points: 253, stronger_support: "televote", region: "Mediterranean", result_category: "top 3",
    description: "Dosad neviđen spoj popa i rapa s arapskim motivima i prepoznatljivim pljeskom. Pomaknuo je granice moderne glazbe na natjecanju."
  },
  {
    year: 2019, final_place: 3, country: "Russia", artist: "Sergey Lazarev", song: "Scream", total_points: 370, genre: "pop/ballad", language: "English", performer_type: "solo", running_order: 5, running_order_half: "first half", jury_points: 126, televote_points: 244, stronger_support: "televote", region: "Eastern Europe", result_category: "top 3",
    description: "Lazarevljev drugi top 3 plasman. Scena je koristila staklene kutije i 'klonove' u složenom tehničkom prikazu."
  },
  {
    year: 2021, final_place: 1, country: "Italy", artist: "Måneskin", song: "Zitti e buoni", total_points: 524, genre: "rock", language: "native language", performer_type: "group", running_order: 24, running_order_half: "second half", jury_points: 206, televote_points: 318, stronger_support: "televote", region: "Mediterranean", result_category: "winner",
    description: "Sirova energija glam-rocka koja je značajno promijenila eurovizijski krajolik. Måneskin je pobjedu iskoristio za lansiranje goleme međunarodne karijere."
  },
  {
    year: 2021, final_place: 2, country: "France", artist: "Barbara Pravi", song: "Voilà", total_points: 499, genre: "ballad", language: "native language", performer_type: "solo", running_order: 20, running_order_half: "second half", jury_points: 248, televote_points: 251, stronger_support: "balanced", region: "Western Europe", result_category: "top 3",
    description: "Klasična francuska šansona. Barbarina intenzivna izvedba i snažna emocija donijeli su Francuskoj najbolji rezultat u posljednjim desetljećima."
  },
  {
    year: 2021, final_place: 3, country: "Switzerland", artist: "Gjon's Tears", song: "Tout l'univers", total_points: 432, genre: "ballad", language: "native language", performer_type: "solo", running_order: 11, running_order_half: "first half", jury_points: 267, televote_points: 165, stronger_support: "jury", region: "Central Europe", result_category: "top 3",
    description: "Eterična balada s nevjerojatnim falsetom. Gjonova umjetnička vizija i apstraktna bijela scenografija bili su remek-djelo modernog dizajna."
  },
  {
    year: 2022, final_place: 1, country: "Ukraine", artist: "Kalush Orchestra", song: "Stefania", total_points: 631, genre: "folk_ethno/rap_hip_hop", language: "native language", performer_type: "group", running_order: 12, running_order_half: "first half", jury_points: 192, televote_points: 439, stronger_support: "televote", region: "Eastern Europe", result_category: "winner",
    description: "Posveta majci pjevača, spoj tradicionalnog folklora i modernog rapa. Dobila je nezapamćenu podršku javnosti nakon invazije na Ukrajinu."
  },
  {
    year: 2022, final_place: 2, country: "United Kingdom", artist: "Sam Ryder", song: "SPACE MAN", total_points: 466, genre: "pop/rock", language: "English", performer_type: "solo", running_order: 22, running_order_half: "second half", jury_points: 283, televote_points: 183, stronger_support: "jury", region: "Western Europe", result_category: "top 3",
    description: "Svojim 'zlatnim' glasom i zaraznom pozitivnošću, Sam Ryder prekinuo je godine loših rezultata Ujedinjenog Kraljevstva pobjedom kod žirija."
  },
  {
    year: 2022, final_place: 3, country: "Spain", artist: "Chanel", song: "SloMo", total_points: 459, genre: "dance/pop", language: "mixed", performer_type: "solo", running_order: 10, running_order_half: "first half", jury_points: 231, televote_points: 228, stronger_support: "balanced", region: "Mediterranean", result_category: "top 3",
    description: "Vrhunska koreografija i nastup koji je redefinirao španjolski pristup natjecanju. Energija i preciznost postali su novi standard za plesne nastupe."
  },
  {
    year: 2023, final_place: 1, country: "Sweden", artist: "Loreen", song: "Tattoo", total_points: 583, genre: "pop/electronic", language: "English", performer_type: "solo", running_order: 9, running_order_half: "first half", jury_points: 340, televote_points: 243, stronger_support: "jury", region: "Scandinavia", result_category: "winner",
    description: "Povijesna druga pobjeda za Loreen. Intenzivna scenografija s pješčanom temom i golemim LED ekranima stvorila je kinematografski doživljaj."
  },
  {
    year: 2023, final_place: 2, country: "Finland", artist: "Käärijä", song: "Cha Cha Cha", total_points: 526, genre: "electronic/rap_hip_hop", language: "native language", performer_type: "solo", running_order: 13, running_order_half: "first half", jury_points: 150, televote_points: 376, stronger_support: "televote", region: "Scandinavia", result_category: "top 3",
    description: "Neonsko-zelena zabavna himna koja je postala apsolutni favorit publike. Dominirao je u televotingu, ali je završio kao drugi zbog glasova žirija."
  },
  {
    year: 2023, final_place: 3, country: "Israel", artist: "Noa Kirel", song: "Unicorn", total_points: 362, genre: "pop/dance", language: "English", performer_type: "solo", running_order: 23, running_order_half: "second half", jury_points: 177, televote_points: 185, stronger_support: "balanced", region: "Other", result_category: "top 3",
    description: "Prepoznatljiva po 'fenomenalnom' plesnom brejku. Atletizam i profesionalnost Noe Kirel potvrdili su Izrael kao predvodnika u modernoj pop produkciji."
  },
  {
    year: 2024, final_place: 1, country: "Switzerland", artist: "Nemo", song: "The Code", total_points: 591, genre: "pop/opera_classical", language: "English", performer_type: "solo", running_order: 21, running_order_half: "second half", jury_points: 365, televote_points: 226, stronger_support: "jury", region: "Central Europe", result_category: "winner",
    description: "Vrtoglavi spoj 'drum and bassa', opere i popa. Nemo je na rotirajućem disku predstavio putovanje prema vlastitom identitetu uz nevjerojatnu kontrolu vokala."
  },
  {
    year: 2024, final_place: 2, country: "Croatia", artist: "Baby Lasagna", song: "Rim Tim Tagi Dim", total_points: 547, genre: "rock/pop", language: "English", performer_type: "solo", running_order: 23, running_order_half: "second half", jury_points: 210, televote_points: 337, stronger_support: "televote", region: "Balkan", result_category: "top 3",
    description: "Zarazna industrijska pop pjesma o iseljavanju sa sela. Najbolji rezultat Hrvatske u povijesti, pobjednik publike uz golemu podršku diljem Europe."
  },
  {
    year: 2024, final_place: 3, country: "Ukraine", artist: "alyona alyona & Jerry Heil", song: "Teresa & Maria", total_points: 453, genre: "rap_hip_hop/pop", language: "mixed", performer_type: "duo", running_order: 2, running_order_half: "first half", jury_points: 146, televote_points: 307, stronger_support: "televote", region: "Eastern Europe", result_category: "top 3",
    description: "Moćna fuzija rapa i eteričnih vokala. Scenografija Tanu Muino koristila je vizualnu metaforu uspona kao simbol otpornosti."
  },
  {
    year: 2025, final_place: 1, country: "Austria", artist: "JJ", song: "Wasted Love", total_points: 436, genre: "opera_classical/electronic", language: "English", performer_type: "solo", running_order: 9, running_order_half: "first half", jury_points: 258, televote_points: 178, stronger_support: "jury", region: "Central Europe", result_category: "winner",
    description: "Mračan i sofisticiran spoj opernih vokala i modernih elektroničkih ritmova. Estetika i atmosfera osigurali su Austriji tijesnu pobjedu."
  },
  {
    year: 2025, final_place: 2, country: "Israel", artist: "Yuval Raphael", song: "New Day Will Rise", total_points: 357, genre: "ballad", language: "mixed", performer_type: "solo", running_order: 4, running_order_half: "first half", jury_points: 60, televote_points: 297, stronger_support: "televote", region: "Other", result_category: "top 3",
    description: "Grandiozna balada nade koja je duboko odjeknula kod publike zahvaljujući emotivnoj srži i snažnom refrenu."
  },
  {
    year: 2025, final_place: 3, country: "Estonia", artist: "Tommy Cash", song: "Espresso Macchiato", total_points: 356, genre: "novelty/pop", language: "mixed", performer_type: "solo", running_order: 3, running_order_half: "first half", jury_points: 98, televote_points: 258, stronger_support: "televote", region: "Baltic", result_category: "top 3",
    description: "Avanvgardni vizualni spektakl koji je prkosio eurovizijskim konvencijama. Tommy Cash je dokazao da 'čudno' i dalje može ostvariti vrhunski plasman."
  }
];

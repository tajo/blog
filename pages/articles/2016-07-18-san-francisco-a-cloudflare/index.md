---
title: San Francisco a Cloudflare
path: /san-francisco-a-cloudflare/
layout: post
readNext: /letni-semester-na-techu/
date: 2016-07-18
description: Dnes to jsou téměř dva měsíce od mého příletu do San Francisca. Není to sice moje první návštěva, ale přeci jen je dost jiné být někde pár dní na výletě nebo tam několik měsíců žít a chodit do práce.
---

**Dnes to jsou téměř dva měsíce od mého příletu do San Francisca**. Není to sice moje první návštěva, ale přeci jen je dost jiné být někde pár dní na výletě nebo tam několik měsíců žít a chodit do práce. Když jsem na jaře hledal práci na léto, nehledal jsem nikde jinde než právě v San Franciscu (tedy až na společnost Mailchimp v Atlantě). Proč právě sem?

San Francisco (a Silicon Valley) jsou pro vývojáře tím čím je Wall Street pro bankéře či Paříž pro módní návrháře. V jednom místě se koncentruje obrovské množství těch nejúspěšnějších počítačových a internetových firem, všelijakých startupů, investorů a talentovaných lidí (tech people or techies). Jelikož je tohle moje poslední "studentské léto", je to také jedinečná příležitost pro networking a získání první full-time práce. Dneska chci popsat, co tu vlastně dělám (takže to bude techničtější).

## Na čem pracuji

**Práce pro Cloudflare je jedním slovem super.** Jsem součástí WWW týmu, který má na starosti vše kolem [cloudflare.com](https://cloudflare.com) a API. Původně jsem měl pomáhat s přechodem na nový JavaScriptový stack (React, Redux...), ale nakonec jsem dostal úplně vlastní projekt - [https://api.cloudflare.com](https://api.cloudflare.com). Jediným zadáním bylo: "Udělej to lepším". Pro specifikaci našeho API používáme formát [JSON HyperSchema](http://json-schema.org). Máme vlastní open source nástroj [JSDC](https://github.com/cloudflare/json-schema-docs-generator) (kompletně napsaný v JavaScriptu), který z těchto schémat a handlebars šablon umí vygenerovat celý [https://api.cloudflare.com](https://api.cloudflare.com) web.

První tři týdny jsem strávil tím, že jsem dotáhl jeho novou verzi (opravil spoustu bugů) a nasadil ho pro generování naší dokumentace. Dalším úkolem bylo, aby ho začali používat i další týmy v Cloudflare a aby se daly jednodušeji vytvářet nové vzhledy. Nakonec padlo rozhodnutí, že celá věc by měla být ještě více obecná a modulární, tak aby jí začali používat i další organizace (na CF je super, že hodně investuje do open source).

**A tak jsem navrhl úplně novou architekturu** a začal na ní několik týdnů pracovat. Potíž JSDC byla v tom, že dělá moc věcí naráz. Musí umět prolinkovat odkazy v schématech (podobný systém odkazů jako na webu), následně schémata transformovat do něčeho, co můžeme prezentovat na webu (vytvořit příklady API volání...), zkombinovat šablony s daty a ještě vše vyrendrovat. Vývojaři chtěji typicky upravit nějakou hodnotu ve schématu a podívat se na výslednou stránku. To ovšem znamená, že se musí vše znovu přegenerovat, což trvá...

Rozhodl jsem se tedy JSDC rozbít na menší části a vytvořit **pár webpack loaderů**, které mají několik ideálních vlastností. Transformují data z jednoho stavu do druhého. Umí vytvářet mapu závislostí (změnil se soubor A na který odkazuje soubor B, je potřeba znovu načíst i soubor B...). Cacheuje jednotlivé moduly - není potřeba vždy přegenerovat všechna schémata.  Jeden webpack loader řeší odkazy v schématech. Druhý webpack loader pak upravuje jejich strukturu (vytváří příklady, odstraní nepoužívané klíče...).

Další problém nástroje, který všechno naráz generuje, je ten, že je dost problematické, pokud chcete výslednou dokumentaci nějak více upravovat. Například jí rozdelit do více sekcí či stránek. Druhým opakem je pak stav, kdy žádný takový nástroj nemáte a všechno si "napíšete ručně", což však také není ideální. **Kompromisem je další knihovna na které pracuji (nazvaná doca)**. Otevřete adresář, kde máte uložená schémata, zavoláte "doca init" a ona vám vytvoří kompletní webovou aplikaci (dokumentaci). Stačí už jen následně zavolat "npm run build" a je hotovo. Pro interaktivní vývojářský mód pak "npm start". Díky webpacku a hot reloadu můžete každou změnu v schématech okamžitě vidět v prohlížeči. Žádné zdlouhavé přegenerovávání, refreshování prohlížeče či debugování v terminálu. Nicméně nic vám nebrání v tom, začít výslednou aplikaci jakkoliv upravovat.

Posledním dílkem skládačky jsou šablony. **Volba nepřekvapivě padla na React.** Největší výhoda oproti Handlebars je ta, že do React komponent mohou vývojáři implementovat i různé dynamické události (rozkrývání jednotlivých sekcí, atp) aniž by bylo potřeba mít někde odděleně ještě další jQuery skripty. React se pak bez problémů dá zkompilovat i na serveru a webpack tak může vygenerovat 100% statickou verzi webu. Můžeme se pak rozhodnout, zda k výsledku přibalíme i JS bundle a stránka tak bude interaktivní. Jednotlivé vzhledy jsou samostatné NPM balíčky. Je to v podstatě jen set React komponent. Máme svůj vlastní privátní vzhled pro Cloudflare, ale vytvořil jsem také další založený na Twitter Bootstrapu, který bude open sourcnutý. Chcete svůj vlastní? Stačí si ho forknout.

Když to shrnu.** Máme teď balíček nástrojů, kde vám stačí 2 příkazy na vegenerování kompletní HTML dokumentace.** Chcete upravit její vzhled? Použijte 3rd party theme nebo si vytvořte svůj vlastní. Chcete jí rozdělit do více stránek, sekcí či kompletně jiného uspořádání? Upravte si onu vygenerovanou web aplikaci. Chcete použít Angular, Ember či úplně jiný soubor knihoven? Vyházejte z aplikace vše krom webpack loaderů a have fun.

Momentálně pracuji na tom, abychom to vše mohli v přístím týdnu open sourcnout (píšu dokumentaci, testy...). Zároveň s tím zveřejním i příspěvek na [https://blog.cloudflare.com](https://blog.cloudflare.com) a budu mít i krátkou přednášku na firemním all-hands meetingu. Fakt, že v podstatě vše na čem jsem v létě pracoval skončí na GitHubu, je to nejlepší, co se mi mohlo stát. Je to super reference.

## Cloudflare kultura

Cloudflare je středně velká společnost. **V současnosti má kolem 300 zaměstnanců a agresivně nabírá nové lidi** (každý rok se zdvojnásobuje). Do dvou let by měla být veřejná s celkovou hodnotou kolem 6 až 10 miliard dolarů. Vlastní jednu z největších sítí na světě (co do počtu datacenter i přenosové kapacity) a přes její infrastrukturu teče už 10% internetu. Hostuje milióny webů a spousta z nich je kontroverzní. Je tak obrovským terčem všech možných útoků - kybernetických (skupiny jako Anonymous), právních (spousta žalob, žádosti úřadů) i fyzických (dopisy s výhružkami či bílým práškem, to takhle jedno odpoledne přijelo do firmy několik jednotek hasičů a policistů).

I přes typickou uvolněnou atmosféru, **je cítit velká zodpovědnost, kterou firma má vůči svým zákazníkům**. Jakýkoliv výpadek infrastruktury by znamenal ohromné finanční škody a ještě větší problém by byla ztráta důvěry. Ta je přitom klíčová, protože naše služba funguje jako "man in the middle" a má tak přístup k těm nejcitlivějším datům. Vše se tak pečlivě testuje. Pokud by nám někdo dokázal ukradnout privátní klíče zákazníků, byla by to až existenciální rána. Občas se tak stane, že za váma přijde někdo z InfoSec týmu a požádá vás, abyste si laskavě zavřeli určité porty. :)

Co mě překvapilo je, jak velká fluktuace lidí tu panuje. Prakticky nikdo nezůstává v jedné firmě více než 2 roky (což je typicky doba, kdy se vám odemkne velký balík zaměstnaneckých akcií) a odchody tak nikdo nebere moc osobně. Každou středu je tak s někým rozlučka v nedalekém baru a každý druhý pátek zas welcome party pro 5-10 nových zaměstnanců. Z firem do kterých lidé odcházejí zároveň další lidé přicházejí.

**Firma sídlí v nejslunnější části San Francisca a má pobočky v Londýně a Singapuru.** Hned přes ulici jsou firmy jako Docker, AirBnb, Dropbox, Pinterest či Mozilla a všude v okolí desítky (možná stovky) dalších startupů. Každé ráno můžete vidět davy techies, který se na kolech, elektrických koloběžkách, longboardech či jiných šílenostech typu airwheel valí do práce.

Poslední tři týdny v Cloudflare bych měl pak pracovat i na hlavním webu. Náš frontend subtým měl totiž 5 lidí včetně mě a dva vývojáři z něj minulý měsíc odešli (do Facebooku a Twitche). Jsem teď jediným FE vývojářem v San Franciscu a tak se mě občas choděj lidi na něco ptát a samozřejmě vůbec netuším :-)  **V přístím článku napíšu něco i o samotném San Franciscu.**

**Aktualizace: Knihovna na které jsem pracoval je už venku! Přečtěte si můj článek [Cloudflare's JSON-powered Documentation Generator](https://blog.cloudflare.com/cloudflares-json-powered-documentation-generator/).**